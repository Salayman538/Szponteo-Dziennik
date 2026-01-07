import { useState } from 'react'
import { ScrollView, View, Text } from 'react-native'
import dayjs from 'dayjs'
import 'dayjs/locale/pl'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { useLessons } from '../hooks/useLessons'
import LessonCard from './LessonCard'
import WeekNavigator from './WeekNavigator'
import LoadingScreen from './LoadingScreen'
import ErrorMessage from './ErrorMessage'
import Header from './Header'
import { Lesson } from '@/types/common'

// Konfiguracja dayjs
dayjs.locale('pl')
dayjs.extend(customParseFormat)

const LessonList = () => {
  const [selectedDay, setSelectedDay] = useState(dayjs().format('YYYY-MM-DD'))
  const [scrollEnabled, setScrollEnabled] = useState(true)

  const { lessons, isPending, isError } = useLessons(selectedDay)

  // Dynamiczne pobieranie danych do nagłówka (z dzisiejszej daty)
  const today = dayjs()
  const todayDay = today.format('D') // np. "7"
  const todayMonth = today.format('MMMM') // np. "styczeń" (zależne od locale)
  const todayYear = today.format('YYYY') // np. "2026"

  // Logika sprawdzania lekcji
  const lessonsForToday = lessons?.flat().filter((l: Lesson) => l.date === selectedDay) || []

  const hasNoLessons = !isPending && lessonsForToday.length === 0

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
          box: {
            number: parseInt(todayDay),
            title: todayMonth.charAt(0).toUpperCase() + todayMonth.slice(1),
            subtitle: todayYear
          }
        }}
      />

      <WeekNavigator
        selectedDay={selectedDay}
        setSelectedDay={setSelectedDay}
        onGestureStart={() => setScrollEnabled(false)}
        onGestureEnd={() => setScrollEnabled(true)}
      />

      {isPending ? (
        <LoadingScreen text="Ładowanie..." />
      ) : (
        <ScrollView scrollEnabled={scrollEnabled} className="px-[26px] mt-[12px]">
          {hasNoLessons ? (
            <View className="m-auto bg-blueGray rounded-2xl px-6 py-4 mt-[20px] items-center">
              <Text className="font-poppins text-[16px] text-black">Dzień wolny od zajęć</Text>
            </View>
          ) : (
            <>
              <View className="flex-row mb-2">
                <Text className="font-poppinsLight text-[12px] text-gray w-[25%]">Godzina</Text>
                <Text className="font-poppinsLight text-[12px] text-gray w-[75%]">Lekcja</Text>
              </View>
              <View className="border-b-[1px] border-whiteGray" />

              <View className="w-full py-[12px]">
                {lessonsForToday.map((lesson: Lesson, index: number) => (
                  <View key={`${lesson.date}-${index}`} className="flex-col">
                    <LessonCard lesson={lesson} />
                    {index < lessonsForToday.length - 1 && (
                      <View className="border-b-[1px] border-whiteGray my-[12px]" />
                    )}
                  </View>
                ))}
              </View>
            </>
          )}
        </ScrollView>
      )}
    </View>
  )
}

export default LessonList
