import { SafeAreaView } from 'react-native-safe-area-context'
import TasksList from '@/components/TasksList'

const HomeworkView = () => {
  return (
    <SafeAreaView>
      <TasksList taskType="homework" />
    </SafeAreaView>
  )
}

export default HomeworkView
