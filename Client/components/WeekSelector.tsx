import { useState, useEffect } from 'react'
import { Text, View, Pressable } from 'react-native'
import dayjs from 'dayjs'
import { getStartAndEndOfWeek } from '@/utils/common'
import ArrowLeft from '../assets/icons/Arrow_left.svg'
import ArrowRight from '../assets/icons/Arrow_right.svg'

const WeekSelector = ({ setCurrentWeek }: { setCurrentWeek: (value: dayjs.Dayjs) => void }) => {
  const [baseDate] = useState(dayjs())
  const [weekOffset, setWeekOffset] = useState(0)

  const currentWeek = baseDate.add(weekOffset, 'week')

  useEffect(() => {
    setCurrentWeek(currentWeek)
  }, [currentWeek])

  const formatted = currentWeek.format('YYYY-MM-DD')
  const { startOfWeek, endOfWeek } = getStartAndEndOfWeek(formatted)

  return (
    <View className="flex flex-row items-center justify-between px-4 mb-4">
      <Pressable className="px-5" onPress={() => setWeekOffset(weekOffset - 1)}>
        <ArrowLeft width={28} height={28} color="#4B5563" />
      </Pressable>

      <Text className="bg-primary text-white font-bold px-14 py-2 text-xl rounded-full">
        {dayjs(startOfWeek).format('DD.MM')} — {dayjs(endOfWeek).format('DD.MM')}
      </Text>

      <Pressable className="px-5" onPress={() => setWeekOffset(weekOffset + 1)}>
        <ArrowRight width={28} height={28} color="#4B5563" />
      </Pressable>
    </View>
  )
}

export default WeekSelector
