import { SafeAreaView } from 'react-native-safe-area-context'
import TasksList from '@/components/TasksList'

const ExamsView = () => {
  return (
    <SafeAreaView className="bg-white" style={{ flex: 1, padding: 16 }}>
      <TasksList taskType="exam" />
    </SafeAreaView>
  )
}

export default ExamsView
