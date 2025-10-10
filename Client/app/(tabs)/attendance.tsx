// app/(tabs)/attendance.tsx
import { SafeAreaView } from 'react-native-safe-area-context'
import AttendanceList from '../../components/AttendanceList' // Zaktualizowana ścieżka do komponentu

const AttendanceView = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AttendanceList />
    </SafeAreaView>
  )
}

export default AttendanceView