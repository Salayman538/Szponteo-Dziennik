import { useNavigation } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, Modal, FlatList } from 'react-native'
import { useAttendanceSummary } from '@/hooks/useAttendanceSummary'
import LoadingScreen from '@/components/LoadingScreen'
import ErrorMessage from '@/components/ErrorMessage'

const AttendanceSummary = () => {
  const [selectedSubject, setSelectedSubject] = useState<string>('all')
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const navigation = useNavigation()

  const { attendanceSummary, isLoading, isError } = useAttendanceSummary(selectedSubject)

  useEffect(() => {
    navigation?.setOptions({
      title: 'Frekwencja ucznia'
    })
  }, [navigation])

  if (isError) return <ErrorMessage />
  if (isLoading) return <LoadingScreen text="Ładowanie..." />

  return (
    <View className="flex-1 bg-white p-[20px] font-poppins">
      {/* Przycisk wyboru przedmiotu */}
      <TouchableOpacity
        className="bg-blue-600 py-[12px] px-[20px] rounded-full mb-[24px] flex-row justify-center items-center "
        onPress={() => setModalVisible(true)}
      >
        <Text className="text-white font-poppinsBold font-[600] text-[16px]">
          {selectedSubject === 'all' ? 'Wszystkie przedmioty' : selectedSubject}
        </Text>
      </TouchableOpacity>

      {/* Modal wyboru */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 bg-black/30 justify-center items-center p-[20px]">
          <View className="bg-white rounded-[24px] w-full max-h-[70%] p-[20px] shadow-lg">
            <Text className="text-[20px] font-poppinsBold font-[700] mb-[16px] text-center">
              Wybierz przedmiot
            </Text>

            <FlatList
              data={['all', ...(attendanceSummary?.available_subjects || [])]}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className={`p-[16px] rounded-[12px] mb-[8px] ${
                    item === selectedSubject ? 'bg-blue-50' : 'bg-gray-50'
                  }`}
                  onPress={() => {
                    setSelectedSubject(item)
                    setModalVisible(false)
                  }}
                >
                  <Text
                    className={`text-center text-[16px] font-poppins ${
                      item === selectedSubject ? 'text-blue-600 font-bold' : 'text-gray-700'
                    }`}
                  >
                    {item === 'all' ? 'Wszystkie' : item}
                  </Text>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity
              className="bg-blue-600 rounded-[15px] mt-[16px] py-[12px]"
              onPress={() => setModalVisible(false)}
            >
              <Text className="text-white text-center font-poppinsBold font-[600]">Zamknij</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Główna sekcja podsumowania */}
      <View className="items-center justify-center py-[40px] px-[20px] bg-gray-50 rounded-[32px] bg-blueGray">
        <Text className="text-[18px] font-poppinsBold text-gray-500 mb-[8px]">
          Frekwencja Semestralna
        </Text>

        <Text className="text-[72px] font-poppinsBold font-[900] text-blue-600">
          {attendanceSummary?.attendance_percentage}%
        </Text>

        <View className="mt-[20px] items-center px-[20px]">
          <Text className="text-[16px] font-poppins text-gray-800 text-center">
            Przedmiot: <Text className="font-poppinsBold">{attendanceSummary?.subject}</Text>
          </Text>
          <Text className="text-[14px] font-poppins text-gray-600 mt-[4px]">
            Semestr {attendanceSummary?.period_number}
          </Text>

          <View className="mt-[16px] bg-primary px-[12px] py-[6px] rounded-full bg-primary">
            <Text className="text-[12px] font-poppins text-white">
              {attendanceSummary?.period_start} – {attendanceSummary?.period_end}
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default AttendanceSummary
