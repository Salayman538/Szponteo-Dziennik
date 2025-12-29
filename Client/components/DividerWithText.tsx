import { View, Text } from 'react-native'

const DividerWithText = ({ text }: { text: string }) => {
  return (
    <View className="flex flex-row items-center my-[12px]">
      <View className="flex-1 h-[1px] bg-whiteGray" />
      <Text className="mx-[10px] text-gray font-poppins text-[12px] capitalize">{text}</Text>
      <View className="flex-1 h-[1px] bg-whiteGray" />
    </View>
  )
}

export default DividerWithText
