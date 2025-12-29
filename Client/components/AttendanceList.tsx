import { useState } from 'react'
import { Button, ScrollView, View } from 'react-native'
import dayjs from 'dayjs'
import 'dayjs/locale/pl'
import { useAttendance } from '../hooks/useAttendance'
import AttendaceCard from './AttendanceCard'
import WeekNavigator from './WeekNavigator'
import LoadingScreen from './LoadingScreen'
import ErrorMessage from './ErrorMessage'
import { AttendanceDay } from '../types/common'
import { Text } from 'react-native-gesture-handler'
import Entypo from '@expo/vector-icons/Entypo'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import { router } from 'expo-router'

import Sad from '../assets/icons/Sad.svg'
import Neutral from '../assets/icons/neutral.svg'
import Happy from '../assets/icons/happy.svg'
import Clock from '../assets/icons/Clock.svg'
import Calendar from '../assets/icons/Calendar.svg'

dayjs.locale('pl')

const AttendanceList = () => {
  const [selectedDay, setSelectedDay] = useState(dayjs().format('YYYY-MM-DD'))
  const [scrollEnabled, setScrollEnabled] = useState(true)

  const formattedDate = selectedDay
  const { attendance, isLoading, isError } = useAttendance(formattedDate)

  if (isError) return <ErrorMessage />

  return (
    <ScrollView scrollEnabled={scrollEnabled} className="font-poppins p-[20px]">
      <WeekNavigator
        selectedDay={selectedDay}
        setSelectedDay={setSelectedDay}
        onGestureStart={() => setScrollEnabled(false)}
        onGestureEnd={() => setScrollEnabled(true)}
      />
      {isLoading ? (
        <LoadingScreen />
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
      <View className="flex m-auto mb-5">
        <Button
          title="Statystyki Frekwencji"
          onPress={() => {
            router.push('/AttendanceSummary')
          }}
        />
      </View>
      <View className="flex-col justify-center bg-gray-200 opacity-80 w-96 m-auto pb-10 rounded-lg gap-y-2">
        <Text className="font-[500] text-[18px] p-5">Legenda</Text>

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
    </ScrollView>
  )
}
export default AttendanceList
