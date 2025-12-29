import { useState, useEffect } from 'react'
import { ScrollView, Text, View, Pressable, BackHandler } from 'react-native'
import dayjs from 'dayjs'
import { Ionicons } from '@expo/vector-icons'
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated'
import { useGrades } from '../hooks/useGrades'
import LoadingScreen from './LoadingScreen'
import ErrorMessage from './ErrorMessage'
import Header from './Header'

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

  const handleHeaderClick = () => {
    setSelectedSubject('')
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

  const subtitle = `Średnia ocen — ${new Intl.NumberFormat('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(avgGrade)}`

  return (
    <ScrollView>
      <Pressable onPress={() => handleHeaderClick()}>
        <Header
          headerData={{
            title: 'Oceny',
            subtitle: subtitle,
            box: { number: 1, title: 'Semestr', subtitle: '2025' }
          }}
        />
      </Pressable>
      {!isDetailsShow ? (
        <Animated.View style={animatedStyle}>
          {grades?.map((subject, index) => (
            <Pressable key={index} onPress={() => handleSubjectClick(subject.name)}>
              <View className="bg-blueGray mx-4 my-2 p-[12px] rounded-[12px]">
                <Text className="text-[16px] font-poppinsBold text-black mb-1">{subject.name}</Text>
                <Text className="font-poppins text-[12px]">
                  Średnia ocen —{' '}
                  {new Intl.NumberFormat('pl-PL', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  }).format(subject.averageGrade)}
                </Text>
                <View className="flex flex-row flex-wrap mt-[8px] gap-[8px]">
                  {subject.grades.map((grade, gradeIndex) => (
                    <View
                      key={gradeIndex}
                      className="bg-primary rounded-full items-center justify-center w-[24px] h-[24px]"
                    >
                      <Text className="text-white font-poppinsBold text-[15px]">
                        {grade.value || (
                          <Ionicons name="ribbon-outline" size={15} className="text-white" />
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
                  <View className="flex-row items-center mx-[20px] justify-center bg-primary h-[60px] rounded-[16px]">
                    <Text className="font-poppinsBold text-white text-[24px]">{subject.name}</Text>
                  </View>
                  <View className="flex-row justify-between mx-[20px] mt-2 gap-[8px]">
                    <View className="bg-blueGray p-2 rounded-[16px] flex-row w-[49%] justify-center gap-[8px] items-center">
                      <View>
                        <Text className="font-poppins text-[16px] leading-tight">
                          Średnia{'\n'}z okresu
                        </Text>
                      </View>
                      <View>
                        <Text className="font-poppinsBold text-[34px] ml-[10px]">
                          {new Intl.NumberFormat('pl-PL', {
                            minimumFractionDigits: 1,
                            maximumFractionDigits: 1
                          }).format(subject.averageGrade)}
                        </Text>
                      </View>
                    </View>

                    <View className="bg-blueGray p-2 rounded-[16px] flex-row w-[49%] justify-center gap-[8px] items-center">
                      <View>
                        <Text className="font-poppins text-[16px] leading-tight">
                          Średnia{'\n'}roczna
                        </Text>
                      </View>
                      <View>
                        <Text className="font-poppinsBold text-[34px] ml-[10px]">
                          {new Intl.NumberFormat('pl-PL', {
                            minimumFractionDigits: 1,
                            maximumFractionDigits: 1
                          }).format(subject.averageGrade)}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View>
                    <Text className="font-poppinsBold text-[24px] mx-[20px] my-[12px]">Oceny</Text>
                  </View>
                  {subject.grades.map((grade, index) => (
                    <View key={index} className="p-4 bg-blueGray rounded-2xl mx-[20px] mb-[8px]">
                      <View className="flex-row items-center">
                        <View className="bg-primary rounded-full w-[36px] h-[36px] flex items-center justify-center mr-2">
                          <Text className="text-[23px] font-poppinsBold text-white">
                            {grade.value || (
                              <Ionicons name="ribbon-outline" size={28} className="text-primary" />
                            )}
                          </Text>
                        </View>
                        <Text className="text-[16px] font-poppinsSemiBold text-black mt-">
                          {grade.name}
                        </Text>
                      </View>
                      <View className="flex-row w-full justify-between mt-[10px] gap-x-1">
                        <View className="flex-none bg-primary rounded-2xl p-1 flex-row justify-center min-w-[85px]">
                          <Text
                            numberOfLines={1}
                            className="text-[11px] font-poppinsBold text-white px-2"
                          >
                            {`${dayjs(grade.date).format('DD.MM.YYYY')}`}
                          </Text>
                        </View>

                        <View className="flex-1 bg-primary rounded-2xl p-1 flex-row justify-center mx-1">
                          <Text
                            numberOfLines={1}
                            className="text-[11px] font-poppinsBold text-white"
                          >
                            {`${grade.category}`}
                          </Text>
                        </View>

                        <View className="flex-none bg-primary rounded-2xl p-1 flex-row justify-center">
                          <Text
                            numberOfLines={1}
                            className="text-[11px] font-poppinsBold text-white px-2"
                          >
                            {`Waga — ${grade.weight}`}
                          </Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </ScrollView>
              )
          )}
        </Animated.View>
      )}
    </ScrollView>
  )
}

export default GradesList
