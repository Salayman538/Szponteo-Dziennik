import { useState } from 'react'
import { ScrollView, View } from 'react-native'
import dayjs from 'dayjs'
import 'dayjs/locale/pl'
import isBetween from 'dayjs/plugin/isBetween'
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

dayjs.extend(isBetween)

const TasksList = ({ taskType }: { taskType: 'exam' | 'homework' }) => {
  const [currentWeek, setCurrentWeek] = useState(dayjs())
  const todayDate = dayjs().format('YYYY-MM-DD').split('-')

  const month = dayjs().locale('pl').format('MMMM')
  const currentMonth = month.charAt(0).toUpperCase() + month.slice(1)

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

  if (examsError || homeworkError) return <ErrorMessage />
  if (examsLoading || homeworkLoading) return <LoadingScreen />

  return (
    <ScrollView>
      <Header
        headerData={{
          title: taskType === 'exam' ? 'Sprawdziany' : 'Prace domowe',
          subtitle: '',
          box: { number: parseInt(todayDate[2]), title: currentMonth, subtitle: todayDate[0] }
        }}
      />

      <WeekSelector setCurrentWeek={setCurrentWeek} />

      {groupedTasks.map((groupOfTasks: Exam[] | Homework[], index) => {
        const currentDay = dayjs().isSame(dayjs(groupOfTasks[0].deadline), 'day')
          ? 'dzisiaj'
          : dayjs(groupOfTasks[0].deadline).format('dddd')

        return (
          <View key={index} className="px-[20px]">
            <DividerWithText text={currentDay} />
            {groupOfTasks.map((task: Exam | Homework, index) => (
              <TaskCard
                key={index}
                task={task}
                className={groupOfTasks.length >= 2 ? 'mb-4' : ''}
              />
            ))}
          </View>
        )
      })}
    </ScrollView>
  )
}

export default TasksList
