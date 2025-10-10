import { useQuery } from '@tanstack/react-query'
import { getStartAndEndOfWeek } from '../utils/common'

export const useLessons = (todayDate: string) => {
  const { startOfWeek, endOfWeek } = getStartAndEndOfWeek(todayDate)

  const apiHost = process.env.EXPO_PUBLIC_API_HOST

  const { data, isPending, isError } = useQuery({
    queryKey: ['lessons', startOfWeek, endOfWeek],
    queryFn: async () => {
      const response = await fetch(
        `http://${apiHost}/api/get-lessons?date_from=${startOfWeek}&date_to=${endOfWeek}`
      ).then((res) => res.json())
      return response
    }
  })

  return { lessons: data, isPending, isError }
}
