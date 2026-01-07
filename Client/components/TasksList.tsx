import { useState, useEffect } from 'react'
import { ScrollView, View, Pressable, BackHandler, Text } from 'react-native'
import dayjs from 'dayjs'
import 'dayjs/locale/pl'
import isBetween from 'dayjs/plugin/isBetween'
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import { useExams } from '@/hooks/useExams'
import { useHomework } from '@/hooks/useHomework'
import WeekSelector from '@/components/WeekSelector'
import TaskCard from './TaskCard'
import ErrorMessage from './ErrorMessage'
import LoadingScreen from './LoadingScreen'
import { getStartAndEndOfWeek } from '@/utils/common'
import DividerWithText from './DividerWithText'
import { Exam, Homework } from '@/types/common'
import Header from './Header'
import Note from './Note'

dayjs.extend(isBetween)

const TasksList = ({ taskType }: { taskType: 'exam' | 'homework' }) => {
  const [currentWeek, setCurrentWeek] = useState(dayjs())
  const todayDate = dayjs().format('YYYY-MM-DD').split('-')
  const month = dayjs().locale('pl').format('MMMM')
  const currentMonth = month.charAt(0).toUpperCase() + month.slice(1)

  const [isDetailsShow, setIsDetailsShow] = useState(false)
  const [isNoteShow, setIsNoteShow] = useState(false) // Stan decydujący czy pokazać sekcję z notatką
  const [selectedTask, setSelectedTask] = useState<Exam | Homework | null>(null)

  const opacity = useSharedValue(1)
  const translateY = useSharedValue(0)

  const { exams, isLoading: examsLoading, isError: examsError } = useExams()
  const { homework, isLoading: homeworkLoading, isError: homeworkError } = useHomework()

  const tasksData = taskType === 'exam' ? exams : homework

  const formatted = currentWeek.format('YYYY-MM-DD')
  const { startOfWeek, endOfWeek } = getStartAndEndOfWeek(formatted)

  const filteredTasks = tasksData?.filter((task: Exam | Homework) =>
    dayjs(task.deadline).isBetween(startOfWeek, endOfWeek, 'day', '[]')
  )

  const groupedTasks: (Exam | Homework)[][] = []
  const datesOfTasks = new Map()

  filteredTasks?.forEach((task, index) => {
    if (![...datesOfTasks.values()].includes(task.deadline)) {
      groupedTasks.push([task])
      datesOfTasks.set(index, task.deadline)
    } else {
      for (const [key, value] of datesOfTasks) {
        if (value === task.deadline) groupedTasks[key].push(task)
      }
    }
  })

  // Obsługa przycisku wstecz
  useEffect(() => {
    const backAction = () => {
      // Jeśli jesteśmy w szczegółach (niezależnie czy notatka jest widoczna czy nie), zamykamy szczegóły
      if (isDetailsShow) {
        toggleIsShow()
        return true
      }
      return false
    }

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction)

    return () => backHandler.remove()
  }, [isDetailsShow])

  const handleTaskClick = (task: Exam | Homework) => {
    setSelectedTask(task)
    toggleIsShow()
  }

  const handleHeaderClick = () => {
    if (isDetailsShow) {
      toggleIsShow()
    }
  }

  const toggleIsShow = () => {
    if (isDetailsShow) {
      // Zamykanie widoku szczegółów
      setIsDetailsShow(false)
      // Resetujemy notatkę przy wyjściu, żeby przy następnym wejściu nie była od razu widoczna (opcjonalne)
      setIsNoteShow(false)

      opacity.value = withTiming(0, { duration: 200 })
      translateY.value = withTiming(20, { duration: 300 }, () => {
        opacity.value = 1
        translateY.value = 0
      })
    } else {
      // Otwieranie widoku szczegółów
      setIsDetailsShow(true)
      opacity.value = 0
      translateY.value = 20
      opacity.value = withTiming(1, { duration: 300 })
      translateY.value = withTiming(0, { duration: 300 })
    }
  }

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }]
  }))

  if (examsError || homeworkError) return <ErrorMessage />
  if (examsLoading || homeworkLoading)
    return (
      <View className="flex-row min-h-[100vh] items-center justify-center">
        <LoadingScreen text="Ładowanie..." />
      </View>
    )

  return (
    <ScrollView>
      <Pressable onPress={() => handleHeaderClick()}>
        <Header
          headerData={{
            title: taskType === 'exam' ? 'Sprawdziany' : 'Prace domowe',
            subtitle: '',
            box: { number: parseInt(todayDate[2]), title: currentMonth, subtitle: todayDate[0] }
          }}
        />
      </Pressable>

      {!isDetailsShow ? (
        // --- LISTA ZADAŃ ---
        <Animated.View style={animatedStyle}>
          <WeekSelector setCurrentWeek={setCurrentWeek} />

          {groupedTasks.length === 0 && (
            <View className="flex-1 items-center justify-center py-12 px-8">
              <Ionicons name="checkmark-circle-outline" size={64} color="#9CA3AF" />
              <Text className="font-poppinsSemiBold text-[20px] text-gray-500 text-center mt-4 mb-2">
                {taskType === 'exam'
                  ? 'Brak sprawdzianów w tym tygodniu'
                  : 'Brak zadań domowych w tym tygodniu'}
              </Text>
            </View>
          )}

          {groupedTasks.map((groupOfTasks: Exam[] | Homework[], index) => {
            const currentDay = dayjs().isSame(dayjs(groupOfTasks[0].deadline), 'day')
              ? 'dzisiaj'
              : dayjs(groupOfTasks[0].deadline).format('dddd')

            return (
              <View key={index} className="px-[20px]">
                <DividerWithText text={currentDay} />
                {groupOfTasks.map((task: Exam | Homework, taskIndex) => (
                  <Pressable
                    key={taskIndex}
                    onPress={() => handleTaskClick(task)}
                    className={groupOfTasks.length >= 2 ? 'mb-4' : ''}
                  >
                    <TaskCard task={task} className={groupOfTasks.length >= 2 ? 'mb-4' : ''} />
                  </Pressable>
                ))}
              </View>
            )
          })}
        </Animated.View>
      ) : (
        // --- SZCZEGÓŁY ZADANIA ---
        <Animated.View style={animatedStyle} className="bg-white min-h-screen pb-10">
          {selectedTask && (
            <View>
              <View className="flex-row items-center mx-[20px] justify-center bg-primary h-[80px] rounded-[16px] mb-4">
                <Text
                  className="font-poppinsBold text-white text-[24px] text-center px-4"
                  numberOfLines={2}
                >
                  {selectedTask.subject}
                </Text>
              </View>

              <View className="mx-[20px] gap-[12px]">
                <View className="flex-row justify-between gap-[12px]">
                  <View className="bg-blueGray p-4 rounded-[16px] flex-1 justify-center items-start">
                    <View className="flex-row items-center gap-2 mb-1">
                      <Text className="font-poppinsSemiBold text-[14px] text-gray-600">Termin</Text>
                    </View>
                    <Text className="font-poppinsBold text-[16px]">
                      {dayjs(selectedTask.deadline).format('DD.MM.YYYY')}
                    </Text>
                    <Text className="font-poppins text-[12px] text-gray-500">
                      {dayjs(selectedTask.deadline).format('dddd')}
                    </Text>
                  </View>

                  <View className="bg-blueGray p-4 rounded-[16px] flex-1 justify-center items-start">
                    <View className="flex-row items-center gap-2 mb-1">
                      <Text className="font-poppinsSemiBold text-[14px] text-gray-600">Typ</Text>
                    </View>
                    <Text className="font-poppinsBold text-[16px]" numberOfLines={2}>
                      {selectedTask.type}
                    </Text>
                  </View>
                </View>

                {/* Treść zadania */}
                <View className="bg-blueGray p-5 rounded-[16px] min-h-[150px]">
                  <View className="flex-row items-center gap-2 mb-3 border-b border-gray-300 pb-2">
                    <Text className="font-poppinsSemiBold text-[16px]">Temat</Text>
                  </View>
                  <Text className="font-poppins text-[15px] leading-6 text-black">
                    {selectedTask.content}
                  </Text>
                </View>

                {/* --- LOGIKA WYŚWIETLANIA: PRZYCISK LUB NOTATKA --- */}
                {!isNoteShow ? (
                  <Pressable
                    onPress={() => setIsNoteShow(true)}
                    className="bg-black flex-row items-center justify-center p-4 rounded-[16px] mt-2 active:opacity-80"
                  >
                    <Ionicons name="sparkles" size={20} color="white" style={{ marginRight: 8 }} />
                    <Text className="text-white font-poppinsBold text-[16px]">
                      Generuj notatkę AI
                    </Text>
                  </Pressable>
                ) : (
                  <Animated.View>
                    <Note topic={selectedTask.content} />
                  </Animated.View>
                )}
              </View>
            </View>
          )}
        </Animated.View>
      )}
    </ScrollView>
  )
}

export default TasksList
