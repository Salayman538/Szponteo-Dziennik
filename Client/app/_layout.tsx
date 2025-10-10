// app/_layout.tsx
import React from 'react'
import { Stack } from 'expo-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import '../global.css'

const queryClient = new QueryClient()

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack>
        {/* Grupa (tabs) zostanie załadowana jako pierwszy ekran w stosie. 
          Wszystkie jej trasy będą miały dolny pasek nawigacyjny.
        */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        
        {/*
          Trasa 'modal' zostanie załadowana jako modal nad zakładkami.
          Wymaga stworzenia pliku app/modal.tsx
        */}
        <Stack.Screen name="modal" options={{ presentation: 'modal', headerShown: false }} />
      </Stack>
    </QueryClientProvider>
  )
}