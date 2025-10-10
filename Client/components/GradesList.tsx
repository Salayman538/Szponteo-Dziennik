import { useState, useEffect } from 'react'
import { ScrollView, Text, View, Pressable, BackHandler } from 'react-native'
import dayjs from 'dayjs'
import { Ionicons } from '@expo/vector-icons'
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated'
import { useGrades } from '../hooks/useGrades'
import LoadingScreen from './LoadingScreen'
import ErrorMessage from './ErrorMessage'

const GradesList = () => {
  const [isDetailsShow, setIsDetailsShow] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState('')

  const { grades, avgGrade, isLoading, isError } = useGrades()

  const opacity = useSharedValue(1)
  const translateY = useSharedValue(0)

  useEffect(() => {
    const backAction = () => {
      if (isDetailsShow) {
        toggleIsShow()
        return true
      }
      return false
    }

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction)

    return () => backHandler.remove()
  }, [isDetailsShow])

  const handleSubjectClick = (subjectName: string) => {
    setSelectedSubject(subjectName)
    toggleIsShow()
  }

  const toggleIsShow = () => {
    if (isDetailsShow) {
      setIsDetailsShow(false)
      opacity.value = withTiming(0, { duration: 200 })
      translateY.value = withTiming(20, { duration: 300 }, () => {
        opacity.value = 1
        translateY.value = 0
      })
    } else {
      setIsDetailsShow(true)
      opacity.value = 0
      translateY.value = 20
      opacity.value = withTiming(1, { duration: 300 })
      translateY.value = withTiming(0, { duration: 300 })
    }
  }

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }]
  }))

  if (isError) return <ErrorMessage />

  if (isLoading)
    return (
      <ScrollView className="flex m-10">
        <LoadingScreen />
      </ScrollView>
    )

  return (
    <ScrollView className="bg-gray-100">
      {!isDetailsShow ? (
        <Animated.View style={animatedStyle} className="py-6">
          <View className="flex justify-center mx-4 mb-5">
            <View className="bg-blue-600 flex py-4 px-6 rounded-2xl shadow-lg">
              <Text className="text-lg text-white mb-1">Przewidywana średnia z okresu</Text>
              <Text className="text-4xl font-bold text-white">{avgGrade}</Text>
            </View>
          </View>
          {grades?.map((subject, index) => (
            <Pressable key={index} onPress={() => handleSubjectClick(subject.name)}>
              <View className="bg-white mx-4 my-2 p-5 rounded-xl shadow-md">
                <Text className="text-xl font-semibold text-gray-800 mb-2">{subject.name}</Text>
                <View className="flex flex-row flex-wrap">
                  {subject.grades.map((grade, gradeIndex) => (
                    <View
                      key={gradeIndex}
                      className="bg-blue-100 rounded-full min-w-10 max-w-10 items-center justify-center px-3 py-1 mr-2 mb-2"
                    >
                      <Text className="text-blue-600 font-medium">
                        {grade.value || (
                          <Ionicons name="ribbon-outline" size={16} className="text-blue-600" />
                        )}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </Pressable>
          ))}
        </Animated.View>
      ) : (
        <Animated.View style={animatedStyle} className="bg-white min-h-screen">
          {grades?.map(
            (subject, index) =>
              selectedSubject === subject.name && (
                <ScrollView key={index}>
                  <View className="flex flex-row items-center bg-blue-600 p-4">
                    <Pressable onPress={toggleIsShow} className="mr-4">
                      <Ionicons name="chevron-back" size={28} color="white" />
                    </Pressable>
                    <Text className="text-xl font-bold text-white">{subject.name}</Text>
                  </View>
                  {subject.grades.map((grade, index) => (
                    <View
                      key={index}
                      className="flex flex-row items-center p-4 border-b border-gray-200"
                    >
                      <View className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mr-4">
                        <Text className="text-3xl font-bold text-blue-600">
                          {grade.value || (
                            <Ionicons name="ribbon-outline" size={28} className="text-blue-600" />
                          )}
                        </Text>
                      </View>
                      <View>
                        <Text className="text-lg font-semibold text-gray-800">{grade.name}</Text>
                        <Text className="text-sm text-gray-500">{`${dayjs(grade.date).format('DD.MM.YYYY')} • Waga: ${grade.weight}.0`}</Text>
                        <Text className="text-sm text-gray-500">{`Kategoria: ${grade.category}`}</Text>
                      </View>
                    </View>
                  ))}
                  <View className="m-4 bg-blue-50 rounded-xl p-4">
                    <Text className="text-lg font-semibold text-blue-600">{`Średnia z okresu: ${subject.averageGrade}`}</Text>
                  </View>
                </ScrollView>
              )
          )}
        </Animated.View>
      )}
    </ScrollView>
  )
}

export default GradesList
