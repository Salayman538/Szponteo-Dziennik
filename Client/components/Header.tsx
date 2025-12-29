import { View, Text } from 'react-native'

interface headerDataProps {
  title: string
  subtitle?: string
  box: {
    number: number
    title: string
    subtitle: string
  }
}

const Header = ({ headerData }: { headerData: headerDataProps }) => {
  return (
    <View className="flex-row justify-between items-center mb-[12px] px-[20px]">
      <View>
        <Text className="font-poppinsBold text-[24px]">{headerData.title}</Text>
        {headerData.subtitle ? (
          <Text className="font-poppins text-darkGray text-[14px]">{headerData.subtitle}</Text>
        ) : null}
      </View>
      <View className="rounded-2xl bg-primary flex-row justify-between items-center px-[12px] py-[6px] gap-[8px]">
        <Text className="text-white font-poppinsBold text-[34px] leading-tight">
          {headerData.box.number}
        </Text>
        <View className="flex-col gap-0">
          <Text className="text-white font-poppins text-[12px] leading-tight">
            {headerData.box.title}
          </Text>
          <Text className="text-lightGray font-poppins text-[12px] leading-tight">
            {headerData.box.subtitle}
          </Text>
        </View>
      </View>
    </View>
  )
}

export default Header
