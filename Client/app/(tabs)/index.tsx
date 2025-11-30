// app/(tabs)/index.tsx
import { SafeAreaView } from 'react-native-safe-area-context'
import LessonsList from '../../components/LessonsList' // Zaktualizowana ścieżka do komponentu
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const TimeTableView = () => {
  return (
    <LessonsList />

    // <SafeAreaView style={{ flex: 1 }}>
    //   <LessonsList />
    // </SafeAreaView>
  )
}

export default TimeTableView