// app/(tabs)/attendance.tsx
import { SafeAreaView } from 'react-native-safe-area-context'
import AttendanceList from '../../components/AttendanceList' // Zaktualizowana ścieżka do komponentu

const AttendanceView = () => {
  return (
    <AttendanceList />
    
    // <SafeAreaView style={{ flex: 1 }}>
    //   <AttendanceList />
    // </SafeAreaView>
  )
}
AttendanceView.options = {
  headerShown: false
};
export default AttendanceView