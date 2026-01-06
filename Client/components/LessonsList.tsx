import { useState, useEffect } from 'react'
import { ScrollView, View, Text } from 'react-native'
import dayjs from 'dayjs'
import 'dayjs/locale/pl'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { useLessons } from '../hooks/useLessons'
import LessonCard from './LessonCard'
import WeekNavigator from './WeekNavigator'
import { Lesson } from '../types/common'
import LoadingScreen from './LoadingScreen'
import ErrorMessage from './ErrorMessage'
import Header from './Header'

dayjs.locale('pl')
dayjs.extend(customParseFormat)

const LessonList = () => {
  const [selectedDay, setSelectedDay] = useState(dayjs().format('YYYY-MM-DD'))
  const [scrollEnabled, setScrollEnabled] = useState(true)

  const formattedDate = dayjs(selectedDay, 'YYYY-MM-DD', true).format('DD.MM')
  const { lessons, isPending, isError } = useLessons(selectedDay)
  const monthsOfYear: { [key: string]: string } = {
    '1': 'Styczeń',
    '2': 'Luty',
    '3': 'Marzec',
    '4': 'Kwiecień',
    '5': 'Maj',
    '6': 'Czerwiec',
    '7': 'Lipiec',
    '8': 'Sierpień',
    '9': 'Wrzesień',
    '10': 'Październik',
    '11': 'Listopad',
    '12': 'Grudzień'
  }

  const todayDate = dayjs().format('YYYY-MM-DD').split('-')
  const todayMonth = monthsOfYear[String(Number(todayDate[1]))]
  let isWeekend = false
  if (
    dayjs(formattedDate, 'DD.MM', true).day() === 6 ||
    dayjs(formattedDate, 'DD.MM', true).day() === 0
  ) {
    isWeekend = true
  } else {
    isWeekend = false
  }
  if (isError) return <ErrorMessage />

  return (
    <View className="flex-1">
      <Header
        headerData={{
          title: 'Plan lekcji',
          subtitle: '',
          box: { number: parseInt(todayDate[2]), title: todayMonth, subtitle: todayDate[0] }
        }}
      />
      <WeekNavigator
        selectedDay={selectedDay}
        setSelectedDay={setSelectedDay}
        onGestureStart={() => setScrollEnabled(false)}
        onGestureEnd={() => setScrollEnabled(true)}
      />
      {isWeekend ? (
        <ScrollView scrollEnabled={scrollEnabled}>
          <View className="m-auto bg-blueGray rounded-2xl px-4 py-2 mt-[12px]">
            <Text className="font-poppinsBold text-[24px] text-black">Dzień wolny od zajęć</Text>
          </View>
        </ScrollView>
      ) : (
        <ScrollView scrollEnabled={scrollEnabled} className="px-[26px] mt-[12px] ">
          <View className="flex-row mb-2">
            <Text className="font-poppinsLight text-[12px] text-gray w-[25%]">Godzina</Text>
            <Text className="font-poppinsLight text-[12px] text-gray w-[75%]">Lekcja</Text>
          </View>
          <View className="border-b-[1px] border-whiteGray" />
          <View className="w-full py-[12px]">
            {isPending ? (
              <LoadingScreen text="Ładowanie..." />
            ) : (
              lessons.map((day: Lesson[]) =>
                day.map((lesson, index) => (
                  <View key={index} className="flex-col gap-[12px]">
                    {lesson.date === selectedDay ? (
                      <>
                        <LessonCard lesson={lesson} />
                        {index + 1 === day.length ? null : (
                          <View className="border-b-[1px] border-whiteGray mb-[12px]" />
                        )}
                      </>
                    ) : null}
                  </View>
                ))
              )
            )}
          </View>
        </ScrollView>
      )}
    </View>
  )
}

export default LessonList
