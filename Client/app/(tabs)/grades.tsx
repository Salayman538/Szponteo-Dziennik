import { SafeAreaView } from 'react-native-safe-area-context'
import GradesList from '../../components/GradesList'

const GradesView = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <GradesList />
    </SafeAreaView>
  )
}

export default GradesView
