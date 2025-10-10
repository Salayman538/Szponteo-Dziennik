import { useState } from 'react'
import { View, Text, FlatList, Pressable, Dimensions } from 'react-native'
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

const getWeekDays = (weekOffset: number) => {
  let startOfWeek = dayjs()
    .startOf('week')
    .add(weekOffset * 7, 'day')
  return Array.from({ length: 5 }, (_, i) => ({
    date: startOfWeek.add(i, 'day'),
    formatted: startOfWeek.add(i, 'day').format('DD.MM'),
    dayName: startOfWeek.add(i, 'day').format('dd')
  }))
}

interface weekNavigatorProps {
  selectedDay: string
  setSelectedDay: (value: string) => void
}

const WeekNavigator = ({ selectedDay, setSelectedDay }: weekNavigatorProps) => {
  const [weekOffset, setWeekOffset] = useState(0)

  const translateX = useSharedValue(0)

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      const damping = 0.4
      translateX.value = event.translationX * damping
    })
    .onEnd((event) => {
      if (event.translationX < -50) {
        translateX.value = withTiming(-screenWidth, { duration: 120 }, () => {
          runOnJS(setWeekOffset)(weekOffset + 1)
          translateX.value = screenWidth
          translateX.value = withTiming(0, { duration: 120 })
        })
      } else if (event.translationX > 50) {
        translateX.value = withTiming(screenWidth, { duration: 120 }, () => {
          runOnJS(setWeekOffset)(weekOffset - 1)
          translateX.value = -screenWidth
          translateX.value = withTiming(0, { duration: 120 })
        })
      } else {
        translateX.value = withTiming(0)
      }
    })

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }]
  }))

  const weekDays = getWeekDays(weekOffset)

  return (
    <Animated.View style={animatedStyle} className="flex items-center mb-5">
      <GestureHandlerRootView>
        <GestureDetector gesture={gesture}>
          <FlatList
            data={weekDays}
            horizontal
            keyExtractor={(item) => item.formatted}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => setSelectedDay(item.formatted)}
                className="active:opacity-70"
              >
                <View className="items-center mx-2 h-20">
                  <View
                    className={`
                  px-5 py-3 rounded-2xl
                  ${selectedDay === item.formatted ? 'bg-blue-600 border border-blue-600' : 'bg-gray-200 border border-blue-600'}
                `}
                  >
                    <Text
                      className={`
                    text-sm font-medium uppercase
                    ${selectedDay === item.formatted ? 'text-white' : 'text-gray-500'}
                  `}
                    >
                      {item.dayName}
                    </Text>
                    <Text
                      className={`
                    text-xl font-bold text-center
                    ${selectedDay === item.formatted ? 'text-white' : 'text-gray-800'}
                  `}
                    >
                      {item.formatted.split('.')[0]}
                    </Text>
                  </View>

                  {/* Selected indicator */}
                  {selectedDay === item.formatted && (
                    <View className="w-5 h-1 bg-blue-400 rounded-full mt-2" />
                  )}
                </View>
              </Pressable>
            )}
          />
        </GestureDetector>
      </GestureHandlerRootView>
    </Animated.View>
  )
}

export default WeekNavigator
