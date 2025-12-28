import { useQuery } from '@tanstack/react-query'
import { getStartAndEndOfWeek } from '../utils/common'

export const useAttendance = (todayDate: string) => {
  const { startOfWeek, endOfWeek } = getStartAndEndOfWeek(todayDate || '1939-01-09')

  const apiHost = process.env.EXPO_PUBLIC_API_HOST

  const { data, isLoading, isError } = useQuery({
    queryKey: ['Attendance', startOfWeek, endOfWeek],
    queryFn: async () => {
      const response = await fetch(
        `http://${apiHost}/api/get-attendance?date_from=${startOfWeek}&date_to=${endOfWeek}`
      ).then((res) => res.json())
      return response
    }
  })

  return { attendance: data, isLoading, isError }
}

export const useAttendanceRange = (dateFrom: string, dateTo: string) => {
  const apiHost = process.env.EXPO_PUBLIC_API_HOST

  const { data, isLoading, isError } = useQuery({
    queryKey: ['Attendance', dateFrom, dateTo],
    queryFn: async () => {
      const response = await fetch(
        `http://${apiHost}/api/get-attendance?date_from=${dateFrom}&date_to=${dateTo}`
      ).then((res) => res.json())
      return response
    }
  })

  return { attendance: data, isLoading, isError }
}
