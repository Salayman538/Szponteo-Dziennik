// app/(tabs)/grades.tsx
import { SafeAreaView } from 'react-native-safe-area-context' // Użyj safe-area-context zamiast 'react-native' dla spójności
import GradesList from '../../components/GradesList' // Zaktualizowana ścieżka do komponentu

const GradesView = () => {
  return (
    <GradesList />
    // <SafeAreaView style={{ flex: 1 }}>
    //   <GradesList />
    // </SafeAreaView>
  )
}

export default GradesView