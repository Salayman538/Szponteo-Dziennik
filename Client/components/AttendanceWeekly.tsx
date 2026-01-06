import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { View, Text } from 'react-native'
import dayjs from 'dayjs'
import 'dayjs/locale/pl'
import { useAttendance } from '../hooks/useAttendance'
import AttendaceCard from './AttendanceCard'
import WeekNavigator from './WeekNavigator'
import LoadingScreen from './LoadingScreen'
import ErrorMessage from './ErrorMessage'
import { AttendanceDay } from '../types/common'

import Sad from '../assets/icons/Sad.svg'
import Neutral from '../assets/icons/neutral.svg'
import Happy from '../assets/icons/happy.svg'
import Clock from '../assets/icons/Clock.svg'

dayjs.locale('pl')

const AttendanceWeekly = ({
  setScrollEnabled
}: {
  setScrollEnabled: Dispatch<SetStateAction<boolean>>
}) => {
  const [selectedDay, setSelectedDay] = useState(dayjs().format('YYYY-MM-DD'))

  const formattedDate = selectedDay
  const { attendance, isLoading, isError } = useAttendance(formattedDate)

  if (isError) return <ErrorMessage />

  return (
    <View className="font-poppins flex-col gap-[12px] mt-[18px]">
      <WeekNavigator
        selectedDay={selectedDay}
        setSelectedDay={setSelectedDay}
        onGestureStart={() => setScrollEnabled(false)}
        onGestureEnd={() => setScrollEnabled(true)}
      />
      <View className="px-[20px] mt-[12px]">
        {isLoading ? (
          <LoadingScreen text="Ładowanie..." />
        ) : (
          <View className="flex-col gap-[12px]">
            {attendance?.map((day: AttendanceDay[]) =>
              day.map((attendance, index) =>
                attendance.date === formattedDate ? (
                  <AttendaceCard key={index} attendance={attendance} />
                ) : null
              )
            )}
          </View>
        )}
        <View className="flex-col mt-[20px] gap-y-2">
          <Text className="font-[500] text-[18px] font-poppinsBold">Legenda</Text>

          <View className="flex justify-around flex-row flex-wrap">
            <View className="flex flex-row items-center gap-[7px]">
              <Sad width={24} height={24} color="#dc2626" strokeWidth={1.5} />
              <Text className="text-[16px]">Nieobecność</Text>
            </View>

            <View className="flex flex-row items-center gap-[7px]">
              <Neutral width={24} height={24} color="#2563eb" strokeWidth={1.5} />
              <Text className="text-[16px]">Nieobecność{'\n'}Usprawiedliwiona</Text>
            </View>
          </View>

          <View className="flex justify-around flex-row">
            <View className="flex flex-row items-center gap-[7px]">
              <Clock width={24} height={24} color="#f4701eff" strokeWidth={1.5} />
              <Text className="text-[16px]">Spóźnienie</Text>
            </View>

            <View className="flex flex-row items-center gap-[7px]">
              <Clock width={24} height={24} color="#971ef4ff" strokeWidth={1.5} />
              <Text className="text-[16px]">Spóźnienie{'\n'}Usprawiedliwione</Text>
            </View>
          </View>

          <View className="flex justify-around flex-row">
            <View className="flex flex-row items-center gap-[7px]">
              <Happy width={24} height={24} color="#16a34a" strokeWidth={1.5} />
              <Text className="text-[16px]">Obecność</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}
export default AttendanceWeekly
