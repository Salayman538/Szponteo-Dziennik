import React from 'react'
import { View, Text } from 'react-native'
import { AttendanceDay } from '../types/common'
import AntDesign from '@expo/vector-icons/AntDesign'
import Entypo from '@expo/vector-icons/Entypo'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import { MaterialIcons } from '@expo/vector-icons'
import { FontAwesome } from '@expo/vector-icons'

interface AttendaceCardProps {
  attendance: AttendanceDay
}

const AttendaceCard = ({ attendance }: AttendaceCardProps) => {
  const statusConfig = {
    obecność: {
      icon: <FontAwesome5 name="smile-beam" size={24} color="#16a34a" />,
      bg: 'bg-green-100/80',
      border: 'border-green-200'
    },
    nieobecność: {
      icon: <Entypo name="emoji-sad" size={24} color="#dc2626" />,
      bg: 'bg-red-100/80',
      border: 'border-red-200'
    },
    'nieob. uspraw.': {
      icon: <Entypo name="emoji-neutral" size={24} color="#2563eb" />,
      bg: 'bg-blue-100/80',
      border: 'border-blue-200'
    },
    spóźnienie: {
      icon: <FontAwesome5 name="clock" size={24} color='#f4701eff'/>,
      bg: 'bg-orange-100/80',
      border: 'border-orange-200'
    },
    'spóźn. uspr.': {
      icon: <FontAwesome5 name="clock" size={24} color='#971ef4ff'/>,
      bg: 'bg-purple-100/80',
      border: 'border-purple-200'
    },
    default: {
      icon: <AntDesign name="questioncircle" size={24} color="#4b5563" />,
      bg: 'bg-gray-100/80',
      border: 'border-gray-200'
    }
  }

  //@ts-ignore
  const { icon, bg, border } = statusConfig[attendance.value] || statusConfig.default

  return (
    <View className={`${bg} ${border} rounded-xl p-4 mb-3 mx-4 border-l-8 shadow-sm`}>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <View className={`w-12 h-12 rounded-full bg-white items-center justify-center mr-4`}>
            {icon}
          </View>

          <View className="flex-1">
            <Text className="text-lg font-semibold text-gray-800 mb-1">{attendance.name}</Text>
            <View className="flex-row items-center">
              <MaterialIcons name="schedule" size={16} color="#6b7280" />
              <Text className="text-sm text-gray-600 ml-1.5">
                {attendance.position}. {attendance.time}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

export default AttendaceCard
