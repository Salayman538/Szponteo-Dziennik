import { SafeAreaView } from 'react-native-safe-area-context'
import TasksList from '@/components/TasksList'

const ExamsView = () => {
  return (
    <SafeAreaView>
      <TasksList taskType="exam" />
    </SafeAreaView>
  )
}

export default ExamsView
