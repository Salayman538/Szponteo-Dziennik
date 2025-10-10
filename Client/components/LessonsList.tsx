import { useState } from 'react'
import { ScrollView, View } from 'react-native'
import dayjs from 'dayjs'
import 'dayjs/locale/pl'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { useLessons } from '../hooks/useLessons'
import LessonCard from './LessonCard'
import WeekNavigator from './WeekNavigator'
import { Lesson } from '../types/common'
import LoadingScreen from './LoadingScreen'
import ErrorMessage from './ErrorMessage'

dayjs.locale('pl')
dayjs.extend(customParseFormat)

const TimeTableView = () => {
  const [selectedDay, setSelectedDay] = useState(dayjs().format('DD.MM'))

  const formattedDate = dayjs(selectedDay, 'DD.MM', true).format('YYYY-MM-DD')
  const { lessons, isPending, isError } = useLessons(formattedDate)

  if (isError) return <ErrorMessage />

  return (
    <ScrollView>
      <WeekNavigator selectedDay={selectedDay} setSelectedDay={setSelectedDay} />
      <View className="px-2 mb-5">
        {isPending ? (
          <LoadingScreen />
        ) : (
          lessons?.map((day: Lesson[]) =>
            day.map((lesson, index) =>
              lesson.date === formattedDate ? <LessonCard key={index} lesson={lesson} /> : null
            )
          )
        )}
      </View>
    </ScrollView>
  )
}

export default TimeTableView
