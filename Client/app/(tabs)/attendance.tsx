import { SafeAreaView } from 'react-native-safe-area-context'
import { useState } from 'react'
import { ScrollView, Text } from 'react-native'
import AttendanceWeekly from '@/components/AttendanceWeekly'
import AttendanceMonthly from '@/components/AttendanceMonthly'
import AttendanceStatistics from '@/components/AttendanceStatistics'
import TabSwitch from '@/components/TabSwitch'
import Header from '@/components/Header'
import dayjs from 'dayjs'

type ViewMode = 'week' | 'month' | 'stats'

const AttendanceView = () => {
  const [currentView, setCurrentView] = useState<ViewMode>('week')
  const [scrollEnabled, setScrollEnabled] = useState(true)

  const todayDate = dayjs().format('YYYY-MM-DD').split('-')

  const month = dayjs().locale('pl').format('MMMM')
  const currentMonth = month.charAt(0).toUpperCase() + month.slice(1)

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
      <ScrollView scrollEnabled={scrollEnabled} contentContainerStyle={{ flexGrow: 1 }}>
        <Header
          headerData={{
            title: 'Frekwencja',
            subtitle: '',
            box: { number: parseInt(todayDate[2]), title: currentMonth, subtitle: todayDate[0] }
          }}
        />
        <TabSwitch currentView={currentView} onSwitch={setCurrentView} />
        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  )
}

export default AttendanceView
