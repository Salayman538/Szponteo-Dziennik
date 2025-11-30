// app/(tabs)/grades.tsx
import { SafeAreaView } from 'react-native-safe-area-context'
import { View, ScrollView, Text } from 'react-native'
import { useExams } from '@/hooks/useExams'

const ExamsView = () => {
  const { exams, isLoading, isError } = useExams()

  return (
      <ScrollView>
        {exams?.map((item, index) => (
          <View key={index} style={{ marginBottom: 12 }}>
            <Text>{item.subject}</Text>
            <Text>{item.type}</Text>
            <Text>{item.topic}</Text>
            <Text>Utworzono: {item.date_created}</Text>
            <Text>Dzień w który to jest: {item.deadline}</Text>
          </View>
        ))}
      </ScrollView>
      
    // <SafeAreaView style={{ flex: 1, padding: 16 }}>
    //   <ScrollView>
    //     {exams?.map((item, index) => (
    //       <View key={index} style={{ marginBottom: 12 }}>
    //         <Text>{item.subject}</Text>
    //         <Text>{item.type}</Text>
    //         <Text>{item.topic}</Text>
    //         <Text>Utworzono: {item.date_created}</Text>
    //         <Text>Dzień w który to jest: {item.deadline}</Text>
    //       </View>
    //     ))}
    //   </ScrollView>
    // </SafeAreaView>
  )
}

export default ExamsView
