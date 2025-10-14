import { useState } from 'react'
import { ScrollView } from 'react-native'
import dayjs from 'dayjs'
import 'dayjs/locale/pl'
import { useAttendance } from '../hooks/useAttendance'
import AttendaceCard from './AttendanceCard'
import WeekNavigator from './WeekNavigator'
import LoadingScreen from './LoadingScreen'
import ErrorMessage from './ErrorMessage'
import { AttendanceDay } from '../types/common'

dayjs.locale('pl')

const AttendanceList = () => {
  const [selectedDay, setSelectedDay] = useState(dayjs().format('DD.MM'))
  const [scrollEnabled, setScrollEnabled] = useState(true)

  const formattedDate = dayjs(selectedDay, 'DD.MM', true).format('YYYY-MM-DD')
  const { attendance, isLoading, isError } = useAttendance(formattedDate)

  if (isError) return <ErrorMessage />

  return (
    <ScrollView scrollEnabled={scrollEnabled}>
      <WeekNavigator
        selectedDay={selectedDay}
        setSelectedDay={setSelectedDay}
        onGestureStart={() => setScrollEnabled(false)}
        onGestureEnd={() => setScrollEnabled(true)}
      />
      {isLoading ? (
        <LoadingScreen />
      ) : (
        attendance?.map((day: AttendanceDay[]) =>
          day.map((attendance, index) =>
            attendance.date === formattedDate ? (
              <AttendaceCard key={index} attendance={attendance} />
            ) : null
          )
        )
      )}
    </ScrollView>
  )
}
export default AttendanceList
