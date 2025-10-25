import { useQuery } from '@tanstack/react-query'
import { Exam } from '../types/common'

export const useExams = () => {
  const apiHost = process.env.EXPO_PUBLIC_API_HOST

  const { data, isLoading, isError } = useQuery<Exam[]>({
    queryKey: ['exams'],
    queryFn: async () => {
      const response = await fetch(`http://${apiHost}/api/get-exams`)
      return response.json()
    }
  })

  return {
    exams: data,
    isLoading,
    isError
  }
}
