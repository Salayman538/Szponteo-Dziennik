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
    <View className="flex-row items-center justify-between px-[20px] gap-[24px] mt-[12px]">
      <Pressable className="" onPress={() => setWeekOffset(weekOffset - 1)}>
        <ArrowLeft width={24} height={24} color="#4B5563" />
      </Pressable>

      <Text className="flex-1 flex-row justify-center text-center bg-primary text-white font-poppinsBold px-[12px] py-[10px] text-[16px] rounded-full">
        {dayjs(startOfWeek).format('DD.MM')} — {dayjs(endOfWeek).format('DD.MM')}
      </Text>

      <Pressable className="" onPress={() => setWeekOffset(weekOffset + 1)}>
        <ArrowRight width={24} height={24} color="#4B5563" />
      </Pressable>
    </View>
  )
}

export default WeekSelector
