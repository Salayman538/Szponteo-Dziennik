import React from 'react'
import { View, Text } from 'react-native'
import { AttendanceDay } from '../types/common'
import Sad from '../assets/icons/Sad.svg'
import Neutral from '../assets/icons/neutral.svg'
import Happy from '../assets/icons/happy.svg'
import Clock from '../assets/icons/Clock.svg'

interface AttendaceCardProps {
  attendance: AttendanceDay
}

const AttendaceCard = ({ attendance }: AttendaceCardProps) => {
  const statusConfig = {
    obecność: {
      icon: <Happy width={36} height={36} strokeWidth={1.5} color="#1FA93A" />,
    },
    nieobecność: {
      icon: <Sad width={36} height={36} strokeWidth={1.5} color="#dc2626" />,
    },
    'nieob. uspraw.': {
      icon: <Neutral width={36} height={36} strokeWidth={1.5} color="#2563eb" />,
    },
    spóźnienie: {
      icon: <Clock width={36} height={36} strokeWidth={1.5} color='#FF8000'/>,
    },
    'spóźn. uspr.': {
      icon: <Clock width={36} height={36} strokeWidth={1.5} color='#971ef4ff'/>,
    },
    default: {
      icon: <Neutral width={36} height={36} strokeWidth={1.5} color="#4b5563" />,
    }
  }

  //@ts-ignore
  const { icon } = statusConfig[attendance.value] || statusConfig.default

  return (
    <View className={`p-[12px] rounded-[16px] bg-blueGray flex-row gap-[8px] items-center justify-center`}>
          {icon}
          <View className="flex-1">
            <Text className="text-[16px] font-poppinsBold text-black">{attendance.name}</Text>
            <View className="flex-row items-center">
              <Text className="text-[12px] text-black">
                {attendance.position}. {attendance.time}
              </Text>
            </View>
          </View>
    </View>
  )
}

export default AttendaceCard
