import React, { useMemo } from 'react'
import { View, Text, ScrollView, ActivityIndicator } from 'react-native'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import 'dayjs/locale/pl'
import AttendanceCalendar from './AttendanceCalendar'

dayjs.locale('pl')

interface AttendanceLesson {
  position: number
  date: string
  name: string
  time: string
  value: string
}

interface MonthConfig {
  label: string
  start: string
  end: string
}

const ACADEMIC_YEAR: MonthConfig[] = [
  { label: 'Wrzesień', start: '2025-09-01', end: '2025-09-30' },
  { label: 'Październik', start: '2025-10-01', end: '2025-10-31' },
  { label: 'Listopad', start: '2025-11-01', end: '2025-11-30' },
  { label: 'Grudzień', start: '2025-12-01', end: '2025-12-31' },
  { label: 'Styczeń', start: '2026-01-01', end: '2026-01-31' },
  { label: 'Luty', start: '2026-02-01', end: '2026-02-28' },
  { label: 'Marzec', start: '2026-03-01', end: '2026-03-31' },
  { label: 'Kwiecień', start: '2026-04-01', end: '2026-04-30' },
  { label: 'Maj', start: '2026-05-01', end: '2026-05-31' }
]

export const useAttendanceRange = (start: string, end: string) => {
  const apiHost = process.env.EXPO_PUBLIC_API_HOST

  return useQuery<AttendanceLesson[][]>({
    queryKey: ['Attendance', start, end],
    queryFn: async () => {
      const response = await fetch(
        `http://${apiHost}/api/get-attendance?date_from=${start}&date_to=${end}`
      )
      if (!response.ok) throw new Error('Network response was not ok')
      return response.json()
    }
  })
}

const MonthSection = ({ config }: { config: MonthConfig }) => {
  const { data, isLoading, isError } = useAttendanceRange(config.start, config.end)

  return (
    <View className="mb-10">
      <Text className="text-[24px] font-poppinsBold color-black mb-3">{config.label}</Text>
      {isLoading ? (
        <View className="h-40 justify-center items-center">
          <ActivityIndicator color="#2563eb" />
        </View>
      ) : isError ? (
        <Text className="text-red-500 text-center">Błąd pobierania danych</Text>
      ) : (
        <AttendanceCalendar attendanceData={data || []} monthDate={config.start} />
      )}
    </View>
  )
}

export default function AttendanceMonthly() {
  return (
    <View className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 50 }}
        showsVerticalScrollIndicator={false}
      >
        {ACADEMIC_YEAR.map((month) => (
          <MonthSection key={month.start} config={month} />
        ))}
      </ScrollView>
    </View>
  )
}
