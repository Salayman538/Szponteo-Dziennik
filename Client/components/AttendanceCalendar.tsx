import React, { useMemo } from 'react'
import { View, Text } from 'react-native'
import dayjs from 'dayjs'
import 'dayjs/locale/pl'

dayjs.locale('pl')

interface AttendanceLesson {
  position: number
  date: string
  value: string
}

interface AttendanceCalendarProps {
  attendanceData: AttendanceLesson[][]
  monthDate: string
}

const AttendanceCalendar: React.FC<AttendanceCalendarProps> = ({ attendanceData, monthDate }) => {
  const startOfMonth = dayjs(monthDate).startOf('month')
  const daysInMonth = startOfMonth.daysInMonth()
  const startDayOffset = (startOfMonth.day() + 6) % 7

  const dayStatusMap = useMemo(() => {
    const map: Record<string, string> = {}

    attendanceData.forEach((dayLessons) => {
      if (dayLessons.length === 0) return
      const dateKey = dayLessons[0].date

      const hasUnjustifiedAbsence = dayLessons.some((l) => l.value === 'nieobecność')
      const hasJustifiedAbsence = dayLessons.some((l) => l.value === 'nieob. uspraw.')
      const hasUnjustifiedLate = dayLessons.some((l) => l.value === 'spóźnienie')
      const hasJustifiedLate = dayLessons.some((l) => l.value === 'spóźn. uspr.')

      if (hasUnjustifiedAbsence) {
        map[dateKey] = 'bg-[#CD3538]'
      } else if (hasJustifiedAbsence) {
        map[dateKey] = 'bg-[#2B2B94]'
      } else if (hasUnjustifiedLate) {
        map[dateKey] = 'bg-[#FF8000]'
      } else if (hasJustifiedLate) {
        map[dateKey] = 'bg-[#AE66C7]'
      }
    })

    return map
  }, [attendanceData])

  const weekdays = ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Ndz']

  return (
    <View className="p-[12px] bg-blueGray rounded-[16px]">
      <View className="flex-row justify-between mb-4">
        {weekdays.map((day) => (
          <View
            key={day}
            className="w-[36px] h-[36px] items-center justify-center bg-primary rounded-full"
          >
            <Text className="text-white font-poppinsBold text-[12px]">{day}</Text>
          </View>
        ))}
      </View>

      <View className="flex-row flex-wrap">
        {Array.from({ length: startDayOffset }).map((_, i) => (
          <View key={`empty-${i}`} className="w-[14.28%] h-12" />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const dayNum = i + 1
          const fullDate = startOfMonth.date(dayNum).format('YYYY-MM-DD')
          const bgColor = dayStatusMap[fullDate]

          return (
            <View key={fullDate} className="w-[14.28%] h-12 items-center justify-center mb-1">
              <View
                className={`w-[36px] h-[36px] rounded-full items-center justify-center ${bgColor || 'bg-transparent'}`}
              >
                <Text
                  className={`text-[14px] ${bgColor ? 'text-white font-poppins' : 'text-black'}`}
                >
                  {dayNum}
                </Text>
              </View>
            </View>
          )
        })}
      </View>
    </View>
  )
}

export default AttendanceCalendar
