import { useQuery } from '@tanstack/react-query'
import { Homework } from '../types/common'

export const useHomework = () => {
  const apiHost = process.env.EXPO_PUBLIC_API_HOST

  const { data, isLoading, isError } = useQuery<Homework[]>({
    queryKey: ['homework'],
    queryFn: async () => {
      const response = await fetch(`http://${apiHost}/api/get-homework`)
      return response.json()
    }
  })

  return {
    homework: data,
    isLoading,
    isError
  }
}
