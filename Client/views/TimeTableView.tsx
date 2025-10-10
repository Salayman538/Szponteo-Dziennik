import { SafeAreaView } from 'react-native-safe-area-context'
import LessonsList from '../components/LessonsList'

const TimeTableView = () => {
  return (
    <SafeAreaView>
      <LessonsList />
    </SafeAreaView>
  )
}

export default TimeTableView
