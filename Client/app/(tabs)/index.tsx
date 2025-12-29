import { SafeAreaView } from 'react-native-safe-area-context'
import LessonsList from '../../components/LessonsList'

const TimeTableView = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LessonsList />
    </SafeAreaView>
  )
}

export default TimeTableView
