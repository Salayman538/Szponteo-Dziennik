import { useMutation } from '@tanstack/react-query'

export const useGenerateNote = () => {
  const apiHost = process.env.EXPO_PUBLIC_API_HOST

  return useMutation({
    mutationFn: async (topic: string) => {
      const response = await fetch(`http://${apiHost}/api/generate-note`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ topic })
      })

      if (!response.ok) {
        throw new Error('Błąd podczas generowania notatki')
      }

      return response.text()
    }
  })
}
