import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import GradesView from './views/GradesView'
import AttendanceView from 'views/AttendanceView'
import TimeTableView from 'views/TimeTableView'

import './global.css'

const queryClient = new QueryClient()
const Tab = createBottomTabNavigator()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              let iconName: keyof typeof Ionicons.glyphMap | undefined
              if (route.name === 'Plan Lekcji') {
                iconName = 'calendar'
              } else if (route.name === 'Oceny') {
                iconName = 'medal'
              } else if (route.name === 'Frekwencja') {
                iconName = 'stats-chart'
              }
              return <Ionicons name={iconName} size={size} color={color} />
            },
            tabBarActiveTintColor: '#155dfc',
            tabBarInactiveTintColor: 'gray'
          })}
        >
          <Tab.Screen name="Plan Lekcji" component={TimeTableView} />
          <Tab.Screen name="Oceny" component={GradesView} />
          <Tab.Screen name="Frekwencja" component={AttendanceView} />
        </Tab.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  )
}
