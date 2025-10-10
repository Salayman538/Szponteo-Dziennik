import { Text } from 'react-native'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'

const ErrorMessage = () => {
  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      className="flex items-center justify-center p-6 m-4"
    >
      <Ionicons name="alert-circle" size={50} color="red" />
      <Text className="text-lg font-semibold text-red-600 mt-2">{'Coś poszło nie tak'}</Text>
    </Animated.View>
  )
}

export default ErrorMessage
