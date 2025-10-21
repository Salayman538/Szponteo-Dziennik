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


dayjs.locale('pl')

const AttendanceList = () => {
  const [selectedDay, setSelectedDay] = useState(dayjs().format('DD.MM'))
  const [scrollEnabled, setScrollEnabled] = useState(true)

  const formattedDate = dayjs(selectedDay, 'DD.MM', true).format('YYYY-MM-DD')
  const { attendance, isLoading, isError } = useAttendance(formattedDate)

  if (isError) return <ErrorMessage />

  return (
    <ScrollView scrollEnabled={scrollEnabled}>
      <WeekNavigator
        selectedDay={selectedDay}
        setSelectedDay={setSelectedDay}
        onGestureStart={() => setScrollEnabled(false)}
        onGestureEnd={() => setScrollEnabled(true)}
      />
      {isLoading ? (
        <LoadingScreen />
      ) : (
        attendance?.map((day: AttendanceDay[]) =>
          day.map((attendance, index) =>
            attendance.date === formattedDate ? (
              <AttendaceCard key={index} attendance={attendance} />
            ) : null
          )
        )
      )}
      <View className='flex m-auto mb-5'>
        <Button title='Statystyki Frekwencji' onPress={() => {router.push('/AttendanceSummary')}}/>
      </View>
      <View className='flex-col justify-center bg-gray-200 opacity-80 w-96 m-auto pb-10 rounded-lg gap-y-2'>
        <Text className='font-[500] text-[18px] p-5'>Legenda</Text>

          <View className='flex justify-around flex-row flex-wrap'>

            <View className='flex flex-row items-center gap-[7px]'>
              <Entypo name="emoji-sad" size={24} color="#dc2626" />
              <Text className='text-[16px]'>Nieobecność</Text>
            </View>

            <View className='flex flex-row items-center gap-[7px]'>
              <Entypo name="emoji-neutral" size={24} color="#2563eb" />
              <Text className='text-[16px]'>Nieobecność{'\n'}Usprawiedliwiona</Text>
            </View>

          </View>

          <View className='flex justify-around flex-row'>

            <View className='flex flex-row items-center gap-[7px]'>
              <FontAwesome5 name="clock" size={24} color='#f4701eff'/>
              <Text className='text-[16px]'>Spóźnienie</Text>
            </View>

            <View className='flex flex-row items-center gap-[7px]'>
              <FontAwesome5 name="clock" size={24} color='#971ef4ff'/>
              <Text className='text-[16px]'>Spóźnienie{'\n'}Usprawiedliwione</Text>
            </View>

          </View>

          <View className='flex justify-around flex-row'>

            <View className='flex flex-row items-center gap-[7px]'>
              <FontAwesome5 name="smile-beam" size={24} color="#16a34a" />
              <Text className='text-[16px]'>Obecność</Text>

            </View>
          </View>
      </View>
    </ScrollView>
  )
}
export default AttendanceList
