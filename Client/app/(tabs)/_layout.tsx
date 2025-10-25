// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#155dfc',
        tabBarInactiveTintColor: 'gray',
        headerShown: false // Opcjonalnie: ukryj nagłówki ekranów
      }}
    >
      <Tabs.Screen
        name="index" // Odpowiada plikowi app/(tabs)/index.tsx (Plan Lekcji)
        options={{
          title: 'Plan Lekcji',
          tabBarIcon: ({ color, size }) => <Ionicons name="calendar" size={size} color={color} />
        }}
      />
      <Tabs.Screen
        name="grades" // Odpowiada plikowi app/(tabs)/grades.tsx (Oceny)
        options={{
          title: 'Oceny',
          tabBarIcon: ({ color, size }) => <Ionicons name="medal" size={size} color={color} />
        }}
      />
      <Tabs.Screen
        name="attendance" // Odpowiada plikowi app/(tabs)/attendance.tsx (Frekwencja)
        options={{
          title: 'Frekwencja',
          tabBarIcon: ({ color, size }) => <Ionicons name="stats-chart" size={size} color={color} />
        }}
      />
      <Tabs.Screen
        name="exams"
        options={{
          title: 'Sprawdziany',
          tabBarIcon: ({ color, size }) => <Ionicons name="stats-chart" size={size} color={color} />
        }}
      />
      <Tabs.Screen
        name="homework"
        options={{
          title: 'Prace domowe',
          tabBarIcon: ({ color, size }) => <Ionicons name="stats-chart" size={size} color={color} />
        }}
      />
    </Tabs>
  )
}
