import { useNavigation } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native'
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
      title: 'Frekwencja ucznia '
    })
  }, [navigation])

  if (isError) return <ErrorMessage />

  if (isLoading) return <LoadingScreen />

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.subjectSelectButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.subjectSelectText}>
          {selectedSubject === 'all' ? 'Wszystkie przedmioty' : selectedSubject}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Wybierz przedmiot</Text>

            <FlatList
              data={['all', ...(attendanceSummary?.available_subjects || [])]}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.modalItem, item === selectedSubject && styles.modalItemSelected]}
                  onPress={() => {
                    setSelectedSubject(item)
                    setModalVisible(false)
                  }}
                >
                  <Text
                    style={[
                      styles.modalItemText,
                      item === selectedSubject && styles.modalItemTextSelected
                    ]}
                  >
                    {item === 'all' ? 'Wszystkie' : item}
                  </Text>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCloseText}>Zamknij</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Text style={styles.title}>Frekwencja Semestralna</Text>
      <Text style={styles.detail}>
        Przedmiot: {attendanceSummary?.subject} (Semestr {attendanceSummary?.period_number})
      </Text>
      <Text style={styles.percentage}>{attendanceSummary?.attendance_percentage}%</Text>
      <Text style={styles.detailSmall}>
        Okres: {attendanceSummary?.period_start} – {attendanceSummary?.period_end}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff'
  },
  subjectSelectButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginBottom: 20
  },
  subjectSelectText: {
    color: '#fff',
    fontWeight: '600'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '80%',
    padding: 20,
    maxHeight: '70%'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center'
  },
  modalItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  modalItemSelected: {
    backgroundColor: '#007bff22'
  },
  modalItemText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center'
  },
  modalItemTextSelected: {
    color: '#007bff',
    fontWeight: 'bold'
  },
  modalCloseButton: {
    backgroundColor: '#007bff',
    borderRadius: 15,
    marginTop: 15,
    padding: 10
  },
  modalCloseText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600'
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 10
  },
  percentage: {
    fontSize: 60,
    fontWeight: '900',
    color: '#007bff',
    marginVertical: 20
  },
  detail: {
    fontSize: 16,
    color: '#555'
  },
  detailSmall: {
    fontSize: 12,
    color: '#777'
  },
  errorText: {
    fontSize: 14,
    color: 'red'
  },
  text: {
    marginTop: 10
  }
})

export default AttendanceSummary
