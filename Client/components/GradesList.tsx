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
    <ScrollView>
      {!isDetailsShow ? (
        <Animated.View style={animatedStyle}>
          <View className='flex-row justify-between items-center mb-[16px]'>
            <View className='mx-4'>
              <Text className='font-poppinsBold text-[24px]'>Oceny</Text>
              <Text className='font-poppins text-darkGray text-[14px]'>Średnia ocen 
                <Text className='font-poppinsBold'> — {
                new Intl.NumberFormat('pl-PL', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(avgGrade)}
                </Text>
              </Text>
            </View>
            <View className='rounded-2xl bg-primary flex-row h-[46px] w-[100px] justify-between items-center px-1 mr-4'>
              <Text className='text-white font-poppinsBold text-[34px] ml-[10px] mt-[-2px]'>1</Text>
              <Text className='text-white font-poppins text-[12px] m-[6px] mr-[10px]'>Semestr{"\n"}2025</Text>
            </View>
          </View>
          <View className='flex mb-[16px]'>
          <View className='mx-4'>
            <Text className='text-[24px] font-poppinsBold'>Nowe oceny</Text>
          </View>
          <View className='bg-primary mx-4 rounded-2xl p-2 flex-row items-center mt-2'>
            <View className='bg-white rounded-full w-[24px] h-[24px] items-center justify-center'>
            <Text className='text-[15px] font-poppinsBold text-black'>1</Text>
            </View>
            <View className='ml-2'>
              <Text className='text-white text-[14px] font-poppinsBold mt-[1]'>Wiedza o społeczeństwie</Text>
            </View>
          </View>
          </View>
          <View className="flex justify-center mx-4 mb-1">
              <Text className=" text-black font-poppinsBold text-[24px]">Wszystkie oceny</Text>
            </View>
          {grades?.map((subject, index) => (
            <Pressable key={index} onPress={() => handleSubjectClick(subject.name)}>
              <View className="bg-blueGray mx-4 my-2 p-4 rounded-3xl">
                <Text className="text-[16px] font-poppinsBold text-black mb-1">{subject.name}</Text>
                <Text className='font-poppins text-[12px]'>Średnia ocen — {
                    new Intl.NumberFormat('pl-PL', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    }).format(subject.averageGrade)
        }</Text>
                <View className="flex flex-row flex-wrap mt-2">
                  {subject.grades.map((grade, gradeIndex) => (
                    <View
                      key={gradeIndex}
                      className="bg-primary rounded-full items-center justify-center w-[24px] h-[24px] mr-2 mb-2"
                    >
                      <Text className="text-white font-poppinsBold text-[15px]">
                        {grade.value || (
                          <Ionicons name="ribbon-outline" size={15} className="text-white" />
                          // <Text className='text-[12px]'>br</Text>
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
                  <View className='flex-row justify-between items-center pb-4 mb-5'>
                  <View className='mx-4 px-2'>
                    <Text className='font-poppinsBold text-[24px]'>Oceny</Text>
                    <Text className='font-poppins text-darkGray'>Średnia ocen 
                      
                    <Text className='font-poppinsBold'> — {
                    new Intl.NumberFormat('pl-PL', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(avgGrade)}
                    </Text>
                    </Text>
                  </View>
                        <View className='rounded-2xl bg-primary flex-row h-[46px] w-[100px] justify-between items-center px-1 mr-4'>
                          <Text className='text-white font-poppinsBold text-[34px] ml-[10px] mt-[-2px]'>1</Text>
                          <Text className='text-white font-poppins text-[12px] m-[6px] mr-[10px]'>Semestr{"\n"}2025</Text>
                        </View>
                  </View>
                  <View className="flex-row items-center w-[335px] ml-4 justify-center bg-primary h-[60px] rounded-3xl">
                    {/* <Pressable onPress={toggleIsShow} className="mr-4">
                      <Ionicons name="chevron-back" size={28} color="white" />
                    </Pressable> */}
                    <Text className="font-poppinsBold text-white text-[24px]">{subject.name}</Text>
                  </View>
                  <View className='flex-row justify-between  ml-4 mr-4 mt-2'>
                    <View className='bg-blueGray p-2 rounded-2xl flex-row h-[56px] w-[163.5px] justify-center items-center'>
                      <View><Text className='font-poppins text-[16px]'>Średnia{"\n"}z okresu</Text></View>
                      <View><Text className='font-poppinsBold text-[34px] ml-[10px] mt-[-4px]'>{
                        new Intl.NumberFormat('pl-PL', {
                          minimumFractionDigits: 1,
                          maximumFractionDigits: 1
                        }).format(subject.averageGrade)
                      }</Text></View>
                    </View>
                    
                    <View className='bg-blueGray p-2 rounded-2xl flex-row h-[56px] w-[163.5px] justify-center items-center'>
                      <View><Text className='font-poppins text-[16px]'>Średnia{"\n"}roczna</Text></View>
                      <View><Text className='font-poppinsBold text-[34px] ml-[10px] mt-[-4px]'>{
                        new Intl.NumberFormat('pl-PL', {
                          minimumFractionDigits: 1,
                          maximumFractionDigits: 1
                        }).format(subject.averageGrade)
                      }</Text></View>
                    </View>
                  </View>
                  <View>
                    <Text className="font-poppinsBold text-[24px] mt-4 mb-2 ml-4">Oceny</Text>
                  </View>
                  {subject.grades.map((grade, index) => (
                    <View
                      key={index}
                      className="p-4 bg-blueGray rounded-2xl ml-4 mb-[8px] mr-4"
                    >
                      <View className='flex-row items-center'>
                      <View className="bg-primary rounded-full w-[36px] h-[36px] flex items-center justify-center mr-2">
                        <Text className="text-[23px] font-poppinsBold text-white">
                          {grade.value || (
                            <Ionicons name="ribbon-outline" size={28} className="text-primary" />
                          )}
                        </Text>
                      </View>
                        <Text className="text-[16px] font-poppinsSemiBold text-black mt-">{grade.name}</Text>
                        </View>
                      <View className='flex-row justify-between mt-[10px]'>
                        <View className='bg-primary rounded-2xl p-1'>
                        <Text className="text-[12px] font-poppinsBold text-white px-2 mt-[1]">{`${dayjs(grade.date).format('DD.MM.YYYY')}`}</Text>
                        </View>
                        <View className='bg-primary rounded-2xl p-1'>
                        <Text className="text-[12px] font-poppinsBold text-white px-2 mt-[1]">{`${grade.category}`}</Text>
                        </View>
                        <View className='bg-primary rounded-2xl p-1'>
                            <Text className='text-[12px] font-poppinsBold text-white px-2 mt-[1]'>{`Waga — ${grade.weight}`}</Text>
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
