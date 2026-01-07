import { useEffect, useState } from 'react'
import { View, Text, Pressable, Dimensions } from 'react-native'
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler'
import dayjs from 'dayjs'
import 'dayjs/locale/pl'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS
} from 'react-native-reanimated'

dayjs.locale('pl')

const screenWidth = Dimensions.get('window').width
const SWIPE_THRESHOLD = 20
const DAMPING_FACTOR = 0.8
const ANIMATION_DURATION = 150

const getWeekDays = (weekOffset: number) => {
  let startOfWeek = dayjs()
    .startOf('week')
    .add(weekOffset * 7, 'day')

  if (startOfWeek.day() !== 1) {
    startOfWeek = startOfWeek.day(1)
  }

  return Array.from({ length: 7 }, (_, i) => {
    const dateObj = startOfWeek.add(i, 'day')
    return {
      date: dateObj,
      fullDate: dateObj.format('YYYY-MM-DD'),
      formatted: dateObj.format('DD.MM'),
      dayName: dateObj.format('dd'),
      monthName: dateObj.format('MM')
    }
  })
}

interface WeekNavigatorProps {
  selectedDay: string
  setSelectedDay: (value: string) => void
  onGestureStart?: () => void
  onGestureEnd?: () => void
}

const WeekNavigator = ({
  selectedDay,
  setSelectedDay,
  onGestureStart,
  onGestureEnd
}: WeekNavigatorProps) => {
  const [weekOffset, setWeekOffset] = useState(0)
  const translateX = useSharedValue(0)

  const gesture = Gesture.Pan()
    .onBegin(() => {
      if (onGestureStart) runOnJS(onGestureStart)()
    })
    .onUpdate((event) => {
      translateX.value = event.translationX * DAMPING_FACTOR
    })
    .onEnd((event) => {
      if (event.translationX < -SWIPE_THRESHOLD) {
        translateX.value = withTiming(-screenWidth, { duration: ANIMATION_DURATION }, () => {
          runOnJS(setWeekOffset)(weekOffset + 1)
          translateX.value = screenWidth
          translateX.value = withTiming(0, { duration: ANIMATION_DURATION })
        })
      } else if (event.translationX > SWIPE_THRESHOLD) {
        translateX.value = withTiming(screenWidth, { duration: ANIMATION_DURATION }, () => {
          runOnJS(setWeekOffset)(weekOffset - 1)
          translateX.value = -screenWidth
          translateX.value = withTiming(0, { duration: ANIMATION_DURATION })
        })
      } else {
        translateX.value = withTiming(0)
      }
    })
    .onFinalize(() => {
      if (onGestureEnd) runOnJS(onGestureEnd)()
    })

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }]
  }))

  const weekDays = getWeekDays(weekOffset)

  return (
    <View className="flex-row justify-center items-center p-[12px] bg-blueGray rounded-[16px] mx-[20px] overflow-hidden">
      <GestureHandlerRootView style={{ flex: 1 }}>
        <GestureDetector gesture={gesture}>
          <Animated.View style={animatedStyle}>
            <View className="flex-row justify-center">
              {weekDays.map((item) => (
                <Pressable
                  key={item.fullDate}
                  onPress={() => setSelectedDay(item.fullDate)}
                  className="flex-1 h-full rounded-[16px] overflow-hidden"
                >
                  <View className="justify-center items-center rounded-xl">
                    <View
                      className={`flex justify-center items-center w-full py-[12px] rounded-[16px]
                    ${selectedDay === item.fullDate ? 'bg-primary ' : 'bg-transparent'}
                    `}
                    >
                      <Text
                        className={`text-[12px] font-poppinsLight text-black
                        ${selectedDay === item.fullDate ? 'text-white' : 'text-black'}
                        `}
                      >
                        {item.dayName}
                      </Text>
                      <Text
                        className={` text-[18px] font-bold
                        ${selectedDay === item.fullDate ? 'text-white' : 'text-black'}
                        `}
                      >
                        {item.fullDate.split('-')[0][0] === '0'
                          ? item.fullDate.split('-')[2][1]
                          : item.fullDate.split('-')[2]}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              ))}
            </View>
          </Animated.View>
        </GestureDetector>
      </GestureHandlerRootView>
    </View>
  )
}

export default WeekNavigator
