import { View, Text } from 'react-native'

const DividerWithText = ({ text }: { text: string }) => {
  return (
    <View className="flex flex-row items-center my-4">
      <View className="flex-1 h-[1px] bg-gray" />
      <Text className="mx-2 text-gray font-poppins capitalize">{text}</Text>
      <View className="flex-1 h-[1px] bg-gray" />
    </View>
  )
}

export default DividerWithText
