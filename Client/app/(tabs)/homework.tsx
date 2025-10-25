// app/(tabs)/grades.tsx
import { SafeAreaView } from 'react-native-safe-area-context'
import { View, ScrollView, Text } from 'react-native'
import { useHomework } from '@/hooks/useHomework'

const HomeworkView = () => {
  const { homework, isLoading, isError } = useHomework()

  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <ScrollView>
        {homework?.map((item, index) => (
          <View key={index} style={{ marginBottom: 12 }}>
            <Text>{item.subject}</Text>
            <Text>{item.content}</Text>
            <Text>Dzień w który to jest: {item.deadline}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}

export default HomeworkView
