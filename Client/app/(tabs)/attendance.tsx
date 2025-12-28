// app/(tabs)/attendance.tsx
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { useState } from 'react'
import { ScrollView, Text } from 'react-native'
import AttendanceWeekly from '@/components/AttendanceWeekly'
import AttendanceMonthly from '@/components/AttendanceMonthly'
import AttendanceStatistics from '@/components/AttendanceStatistics'
import TabSwitch from '@/components/TabSwitch'

type ViewMode = 'week' | 'month' | 'stats'

const AttendanceView = () => {
  const [currentView, setCurrentView] = useState<ViewMode>('week')
  const [scrollEnabled, setScrollEnabled] = useState(true)

  const renderContent = () => {
    switch (currentView) {
      case 'week':
        return <AttendanceWeekly setScrollEnabled={setScrollEnabled} />
      case 'month':
        return <AttendanceMonthly />
      case 'stats':
        return <AttendanceStatistics />
      default:
        return <Text>Wybierz widok</Text>
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView scrollEnabled={scrollEnabled}>
        <TabSwitch currentView={currentView} onSwitch={setCurrentView} />

        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  )
}

export default AttendanceView
