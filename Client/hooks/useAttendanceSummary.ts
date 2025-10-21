import { useQuery } from '@tanstack/react-query'
import { AttendanceSummary } from '@/types/common'

export const useAttendanceSummary = (subject: string) => {
  const apiHost = process.env.EXPO_PUBLIC_API_HOST

  const { data, isLoading, isError } = useQuery<AttendanceSummary>({
    queryKey: ['AttendanceSummary', subject],
    queryFn: async () => {
      const response = await fetch(
        `http://${apiHost}/api/get-attendance/summary?subject=${subject}`
      ).then((res) => res.json())
      return response
    }
  })

  return { attendanceSummary: data, isLoading, isError }
}
