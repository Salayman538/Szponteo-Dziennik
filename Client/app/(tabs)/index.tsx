// app/(tabs)/index.tsx
import { SafeAreaView } from 'react-native-safe-area-context'
import LessonsList from '../../components/LessonsList' // Zaktualizowana ścieżka do komponentu

const TimeTableView = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LessonsList />
    </SafeAreaView>
  )
}

export default TimeTableView