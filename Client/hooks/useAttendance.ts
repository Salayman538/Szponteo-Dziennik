import { useQuery } from '@tanstack/react-query'
import { getStartAndEndOfWeek } from '../utils/common'

export const useAttendance = (todayDate: string) => {
  const { startOfWeek, endOfWeek } = getStartAndEndOfWeek(todayDate)

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
