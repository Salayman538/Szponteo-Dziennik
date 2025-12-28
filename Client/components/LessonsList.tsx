import { useState } from 'react'
import { ScrollView, View } from 'react-native'
import dayjs from 'dayjs'
import 'dayjs/locale/pl'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { useLessons } from '../hooks/useLessons'
import LessonCard from './LessonCard'
import WeekNavigator from './WeekNavigator'
import { Lesson } from '../types/common'
import LoadingScreen from './LoadingScreen'
import ErrorMessage from './ErrorMessage'
import { Text } from 'react-native-gesture-handler'

dayjs.locale('pl')
dayjs.extend(customParseFormat)

const LessonList = () => {
  const [selectedDay, setSelectedDay] = useState(dayjs().format('DD.MM'))
  const [scrollEnabled, setScrollEnabled] = useState(true)

  const formattedDate = dayjs(selectedDay, 'DD.MM', true).format('YYYY-MM-DD')
  const { lessons, isPending, isError } = useLessons(formattedDate)
  const monthsOfYear: { [key: string]: string } = {
    '1': 'Styczeń',
    '2': 'Luty',
    '3': 'Marzec',
    '4': 'Kwiecień',
    '5': 'Maj',
    '6': 'Czerwiec',
    '7': 'Lipiec',
    '8': 'Sierpień',
    '9': 'Wrzesień',
    '10': 'Październik',
    '11': 'Listopad',
    '12': 'Grudzień'
  }
  const todayDate = dayjs().format('YYYY-MM-DD').split('-');
  const todayMonth = monthsOfYear[String(Number(todayDate[1]))];
  let isWeekend = false;
  if (dayjs(selectedDay, 'DD.MM', true).day() === 6 || dayjs(selectedDay, 'DD.MM', true).day() === 0) {
    isWeekend = true;
  }else{
    isWeekend = false;
  }
  if (isError) return <ErrorMessage />

  return (
    <View>
    {isWeekend? (
      <ScrollView scrollEnabled={scrollEnabled}>
        <View className='flex-row justify-between items-center mb-[16px]'>
          <View className='mx-4 px-2'>
            <Text className='font-poppinsBold text-[24px]'>Plan lekcji</Text>
            <Text className='font-poppins text-darkGray'>Zmiany 
            <Text className='font-poppinsBold'> — jakas data</Text>
            <Text></Text>
            </Text>
          </View>
                <View className='rounded-2xl bg-primary flex-row h-[46px] w-[116px] mr-4'>
                  <Text className='text-white font-poppinsBold text-[34px] ml-[10px] mt-[-2px]'>{todayDate[2]}</Text>
                  <Text className='text-white font-poppins text-[12px] m-[6px] mr-[10px]'>{todayMonth}{"\n"}{todayDate[0]}</Text>
                </View>
          </View>

      <WeekNavigator
        selectedDay={selectedDay}
        setSelectedDay={setSelectedDay}
        onGestureStart={() => setScrollEnabled(false)}
        onGestureEnd={() => setScrollEnabled(true)}
      />
      <View className='m-auto bg-blueGray rounded-2xl p-2'>
        <Text className='font-poppinsBold text-[24px] text-black'>Dzień wolny od zajęć</Text>
      </View>
    </ScrollView>
    ):(
        <ScrollView scrollEnabled={scrollEnabled}>
        <View className='flex-row justify-between items-center mb-[16px]'>
          <View className='mx-4 px-2'>
            <Text className='font-poppinsBold text-[24px]'>Plan lekcji</Text>
            <Text className='font-poppins text-darkGray'>Zmiany 
            <Text className='font-poppinsBold'> — jakas data</Text>
            <Text></Text>
            </Text>
          </View>
                <View className='rounded-2xl bg-primary flex-row h-[46px] w-[116px] mr-4'>
                  <Text className='text-white font-poppinsBold text-[34px] ml-[10px] mt-[-2px]'>{todayDate[2]}</Text>
                  <Text className='text-white font-poppins text-[12px] m-[6px] mr-[10px]'>{todayMonth}{"\n"}{todayDate[0]}</Text>
                </View>
          </View>

      <WeekNavigator
        selectedDay={selectedDay}
        setSelectedDay={setSelectedDay}
        onGestureStart={() => setScrollEnabled(false)}
        onGestureEnd={() => setScrollEnabled(true)}
      />
      <View className='flex-row w-[80%] m-auto mb-2'>
        <Text className='font-poppinsLight text-[12px] text-gray w-[25%]'>Godzina</Text>
        <Text className='font-poppinsLight text-[12px] text-gray'>Lekcja</Text>        
      </View>
      <View className='w-[85%] border-b-[1px] border-whiteGray m-auto'></View>
      <View className="px-2 mb-5 w-[89%] self-center">
        {isPending ? (
          <LoadingScreen />
        ) : (
          lessons?.map((day: Lesson[]) =>
            day.map((lesson, index) =>
              lesson.date === formattedDate ? <LessonCard key={index} lesson={lesson} /> : null
            )
          )
        )}
      </View>
    </ScrollView>
      )}
      
    </View>
  )
}

export default LessonList
