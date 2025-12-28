import { useEffect, useState } from 'react'
import { Text, TouchableOpacity, View, LayoutChangeEvent } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated'

type ViewMode = 'week' | 'month' | 'stats'

interface TabSwitchProps {
  currentView: ViewMode
  onSwitch: (view: ViewMode) => void
}

const TabSwitch = ({ currentView, onSwitch }: TabSwitchProps) => {
  const tabs: { label: string; value: ViewMode }[] = [
    { label: 'Tydzień', value: 'week' },
    { label: 'Miesiąc', value: 'month' },
    { label: 'Statystyki', value: 'stats' }
  ]

  const translateX = useSharedValue(0)
  const [tabWidth, setTabWidth] = useState(0)

  const handleLayout = (event: LayoutChangeEvent) => {
    const calculatedTabWidth = event.nativeEvent.layout.width / tabs.length
    setTabWidth(calculatedTabWidth)
  }

  useEffect(() => {
    const currentIndex = tabs.findIndex((tab) => tab.value === currentView)
    if (tabWidth > 0 && currentIndex !== -1) {
      translateX.value = withTiming(currentIndex * tabWidth, { duration: 300 })
    }
    // 👍️
    // eslint-disable-next-line
  }, [currentView, tabWidth])

  const indicatorAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
      width: tabWidth > 0 ? tabWidth : '33.333%' // Dynamiczna szerokość
    }
  })

  return (
    <View className="px-[20px]">
      <View
        className="flex-row bg-gray-200 rounded-[100px] h-[40px] justify-around items-center"
        onLayout={handleLayout} // Mierzenie szerokości
      >
        {tabWidth > 0 && (
          <Animated.View
            className="absolute h-[100%] bg-primary rounded-[100px] left-0"
            style={indicatorAnimatedStyle}
          />
        )}

        {tabs.map((tab) => {
          const isActive = currentView === tab.value
          return (
            <TouchableOpacity
              key={tab.value}
              onPress={() => onSwitch(tab.value)}
              // Użycie flex-1 jest kluczowe, aby przyciski zajmowały równą przestrzeń
              className="flex-1 h-full flex justify-center items-center z-10"
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={`Pokaż widok: ${tab.label}`}
            >
              <Text
                className={`font-poppinsBold text-[14px] ${isActive ? 'text-white' : 'text-gray-700'}`}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  )
}

export default TabSwitch
