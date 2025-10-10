// app/modal.tsx
import { Text, View, Button } from 'react-native'
import { Stack, router } from 'expo-router'

export default function ModalScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Stack.Screen options={{ title: 'Mój Modal' }} />
      <Text style={{ fontSize: 20, marginBottom: 20 }}>To jest ekran modalny!</Text>
      <Button onPress={() => router.back()} title="Zamknij Modal" />
    </View>
  )
}