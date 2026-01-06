import { View, ActivityIndicator, Text } from 'react-native'

const LoadingScreen = ({ text }: { text: string }) => {
  return (
    <View className="flex-1 h-100 justify-center items-center">
      <ActivityIndicator size="large" color="#3498db" />
      <Text className="mt-4 text-lg text-gray-500">{text}</Text>
    </View>
  )
}

export default LoadingScreen
