import { useState } from 'react'
import { View, Text, Pressable, Dimensions, StyleSheet } from 'react-native'
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

  return Array.from({ length: 5 }, (_, i) => {
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
  const months = [
    'Styczeń',
    'Luty',
    'Marzec',
    'Kwiecień',
    'Maj',
    'Czerwiec',
    'Lipiec',
    'Sierpień',
    'Wrzesień',
    'Październik',
    'Listopad',
    'Grudzień'
  ]

  return (
    <GestureHandlerRootView>
      <GestureDetector gesture={gesture}>
        <Animated.View style={[animatedStyle, styles.container]}>
          <View style={styles.daysWrapper}>
            {weekDays.map((item) => (
              <Pressable
                key={item.fullDate} // Użyj pełnej daty jako klucza
                onPress={() => setSelectedDay(item.fullDate)} // Przekazuj pełną datę do nadrzędnego komponentu
                style={({ pressed }) => [pressed && { opacity: 0.7 }]}
              >
                <View style={styles.dayInnerContainer}>
                  <View
                    style={[
                      styles.dayCircle,
                      selectedDay === item.fullDate // Porównuj pełne daty YYYY-MM-DD
                        ? styles.selectedDayCircle
                        : styles.unselectedDayCircle
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayNameText,
                        selectedDay === item.fullDate ? styles.selectedText : styles.unselectedText
                      ]}
                    >
                      {item.dayName}
                    </Text>
                    <Text
                      style={[
                        styles.dayNumberText,
                        selectedDay === item.fullDate
                          ? styles.selectedText
                          : styles.dayNumberUnselectedText
                      ]}
                    >
                      {item.formatted.split('.')[0]}
                    </Text>
                    <Text
                      className={`
          text-sm text-center text-primary font-poppins
          ${selectedDay === item.fullDate ? 'text-white' : 'text-gray-500'}
          `}
                    >
                      {months[parseInt(item.monthName) - 1].substring(0, 3)}
                    </Text>
                  </View>
                  {selectedDay === item.fullDate && <View style={styles.selectedIndicator} />}
                </View>
              </Pressable>
            ))}
          </View>
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 20,
    width: screenWidth
  },
  daysWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%'
  },
  dayInnerContainer: {
    alignItems: 'center',
    marginHorizontal: 8,
    height: 80
  },
  dayCircle: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center'
  },
  selectedDayCircle: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB'
  },
  unselectedDayCircle: {
    backgroundColor: '#E5E7EB',
    borderColor: '#2563EB'
  },
  dayNameText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase'
  },
  dayNumberText: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center'
  },
  selectedText: {
    color: 'white'
  },
  unselectedText: {
    color: '#6B7280'
  },
  dayNumberUnselectedText: {
    color: '#1F2937'
  },
  selectedIndicator: {
    width: 20,
    height: 4,
    backgroundColor: '#60A5FA',
    borderRadius: 9999,
    marginTop: 8
  }
})

export default WeekNavigator
