import { useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Modal, FlatList } from 'react-native';
import Constants from 'expo-constants';

const HOST_IP = Constants.expoConfig?.hostUri?.split(':')[0] || 'localhost';
const API_URL = `http://${HOST_IP}:8000/api/frekwencja`;
interface FrekwencjaData {
  subject: string;
  period_number: number;
  attendance_percentage: number;
  period_start: string;
  period_end: string;
  available_subjects?: string[];
}

const AttendanceSummary = () => {
  const [data, setData] = useState<FrekwencjaData | null>(null);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const navigation = useNavigation();

  useEffect(() => {
    navigation?.setOptions({
      title: 'Frekwencja ucznia ',
    });
  }, [navigation]);

  const fetchData = async (subject: string = 'all') => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}?subject=${encodeURIComponent(subject)}`);
      if (!response.ok) throw new Error(`Błąd serwera: ${response.status}`);
      const json: FrekwencjaData = await response.json();
      setData(json);
    } catch (e) {
      setError(`Nie udało się pobrać danych: ${(e as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(selectedSubject);
  }, [selectedSubject]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.text}>Pobieranie danych...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Błąd</Text>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.subjectSelectButton}
        onPress={() => setModalVisible(true)}
      >
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
              data={['all', ...(data?.available_subjects || [])]}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalItem,
                    item === selectedSubject && styles.modalItemSelected,
                  ]}
                  onPress={() => {
                    setSelectedSubject(item);
                    setModalVisible(false);
                  }}
                >
                  <Text
                    style={[
                      styles.modalItemText,
                      item === selectedSubject && styles.modalItemTextSelected,
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
        Przedmiot: {data?.subject} (Semestr {data?.period_number})
      </Text>
      <Text style={styles.percentage}>{data?.attendance_percentage}%</Text>
      <Text style={styles.detailSmall}>
        Okres: {data?.period_start} – {data?.period_end}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  subjectSelectButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginBottom: 20,
  },
  subjectSelectText: {
    color: '#fff',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '80%',
    padding: 20,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalItemSelected: {
    backgroundColor: '#007bff22',
  },
  modalItemText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  modalItemTextSelected: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  modalCloseButton: {
    backgroundColor: '#007bff',
    borderRadius: 15,
    marginTop: 15,
    padding: 10,
  },
  modalCloseText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 10,
  },
  percentage: {
    fontSize: 60,
    fontWeight: '900',
    color: '#007bff',
    marginVertical: 20,
  },
  detail: {
    fontSize: 16,
    color: '#555',
  },
  detailSmall: {
    fontSize: 12,
    color: '#777',
  },
  errorText: {
    fontSize: 14,
    color: 'red',
  },
  text: {
    marginTop: 10,
  },
});

export default AttendanceSummary;
