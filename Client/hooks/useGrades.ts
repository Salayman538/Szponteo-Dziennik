import { useQuery } from '@tanstack/react-query'
import { Subject } from '../types/common'

export const useGrades = () => {
  const apiHost = process.env.EXPO_PUBLIC_API_HOST

  const { data, isLoading, isError } = useQuery<[Subject[], number]>({
    queryKey: ['grades'],
    queryFn: async () => {
      const response = await fetch(`http://${apiHost}/api/get-grades`)
      return response.json()
    }
  })

  return {
    grades: data ? data[0] : [],
    avgGrade: data ? data[1] : 0,
    isLoading: isLoading,
    isError
  }
}
