import { useState } from 'react'
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
  const daysOfWeek = ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Niedz']

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
    <GestureHandlerRootView>
      <GestureDetector gesture={gesture}>
        <Animated.View
          className={
            'w-[90%] flex-row justify-between self-center rounded-2xl bg-blueGray h-[80px] mb-[16px]'
          }
          style={animatedStyle}
        >
          <View className="flex-row justify-center w-[100%] items-center">
            {weekDays.map((item) => (
              <Pressable
                key={item.fullDate} // Użyj pełnej daty jako klucza
                onPress={() => setSelectedDay(item.fullDate)} // Przekazuj pełną datę do nadrzędnego komponentu
                style={({ pressed }) => [pressed && { opacity: 0.7 }]}
              >
                <View className="justify-center items-center h-[80px] m-[1.5px] rounded-xl">
                  <View
                    className={`flex justify-center items-center w-12 rounded-[18px] h-[55px]
                    ${selectedDay === item.fullDate ? 'bg-primary' : 'bg-blueGray'}
                    `}
                  >
                    <Text
                      className={`text-[12px] font-poppinsLight
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
                      {item.fullDate.split('.')[0][0] === '0'
                        ? item.fullDate.split('.')[0][1]
                        : item.fullDate.split('.')[0]}
                    </Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  )
}

export default WeekNavigator
