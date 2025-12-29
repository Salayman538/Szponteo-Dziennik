import { Tabs, useRouter } from 'expo-router'
import React, { useState, useEffect } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { View, Text, Modal, TouchableOpacity, Pressable } from 'react-native'
import * as NavigationBar from 'expo-navigation-bar'

// icons
import Roll from '../../assets/icons/Roll.svg'
import Calendar from '../../assets/icons/Calendar.svg'
import Home from '../../assets/icons/Home.svg'
import Exam from '../../assets/icons/Exam.svg'
import Menu from '../../assets/icons/Menu.svg'
import MenuAlt from '../../assets/icons/Menu alt.svg'
import Attendance from '../../assets/icons/Attendance.svg'
import Book from '../../assets/icons/Book.svg'

export default function TabLayout() {
  useEffect(() => {
    NavigationBar.setVisibilityAsync('hidden')
    NavigationBar.setBehaviorAsync('overlay-swipe')
  }, [])

  const insets = useSafeAreaInsets()
  const [menuVisible, setMenuVisible] = useState(false)
  const router = useRouter()

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <Tabs
        screenOptions={{
          tabBarInactiveTintColor: 'black',
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: '#EEF4FB',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            position: 'absolute',
            height: 56,
            borderTopWidth: 0,
            justifyContent: 'space-around',
            flexDirection: 'row',
            left: 0,
            right: 0,
            bottom: 0,
            elevation: 0,
            shadowOpacity: 0
          },
          tabBarItemStyle: {
            marginVertical: 8
          },
          sceneStyle: {
            backgroundColor: 'white',
            paddingTop: insets.top,
            paddingBottom: 64
          }
        }}
      >
        <Tabs.Screen
          name="grades" // app/(tabs)/grades.tsx (Oceny)
          options={{
            tabBarIcon: ({ color, focused }) => (
              <View
                style={{
                  backgroundColor: focused ? '#265FEF' : '#EEF4FB',
                  borderRadius: '50%',
                  width: 36,
                  height: 36,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Roll width={24} height={24} color={focused ? 'white' : color} />
              </View>
            )
          }}
        />
        <Tabs.Screen
          name="index" // app/(tabs)/index.tsx (Plan Lekcji)
          options={{
            tabBarIcon: ({ color, focused }) => (
              <View
                style={{
                  backgroundColor: focused ? '#265FEF' : '#EEF4FB',
                  borderRadius: '50%',
                  width: 36,
                  height: 36,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Calendar width={24} height={24} color={focused ? 'white' : color} />
              </View>
            )
          }}
        />
        <Tabs.Screen
          name="mainpage" // app/(tabs)/mainpage.tsx (Strona Główna)
          options={{
            tabBarIcon: ({ color, focused }) => (
              <View
                style={{
                  backgroundColor: focused ? '#265FEF' : '#EEF4FB',
                  borderRadius: '50%',
                  width: 36,
                  height: 36,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Home width={24} height={24} color={focused ? 'white' : color} />
              </View>
            )
          }}
        />
        <Tabs.Screen
          name="exams" // app/(tabs)/exams.tsx (Sprawdziany)
          options={{
            tabBarIcon: ({ color, focused }) => (
              <View
                style={{
                  backgroundColor: focused ? '#265FEF' : '#EEF4FB',
                  borderRadius: '50%',
                  width: 36,
                  height: 36,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Exam width={24} height={24} color={focused ? 'white' : color} />
              </View>
            )
          }}
        />
        <Tabs.Screen
          name="menu"
          options={{
            tabBarIcon: ({ color }) => <Menu color={color} width={24} height={24} />
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault()
              setMenuVisible(true)
            }
          }}
        />
        <Tabs.Screen
          name="homework" // app/(tabs)/homework.tsx (Prace domowe)
          options={{ href: null }}
        />
        <Tabs.Screen
          name="attendance" // app/(tabs)/attendance.tsx (Frekwencja)
          options={{ href: null }}
        />
      </Tabs>
      <Modal
        animationType="slide"
        transparent
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable className="flex-1 justify-end" onPress={() => setMenuVisible(false)}>
          <Pressable
            className="h-[40%] bg-blueGray rounded-t-3xl"
            onPress={(e) => e.stopPropagation()}
          >
            <View className="flex-row justify-start mb-[10] ml-[20] mr-[20] mt-[20]">
              <TouchableOpacity
                className="rounded-2xl bg-[#265FEF] h-[66] w-[40%] justify-center items-center"
                onPress={() => {
                  setMenuVisible(false)
                  router.push('/(tabs)/grades')
                }}
              >
                <Roll color={'white'} height={26} width={26} />
                <Text className="text-white font-poppinsBold">Oceny</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="rounded-2xl bg-[#265FEF] h-[66] w-[57.5%] justify-center items-center ml-[10]"
                onPress={() => {
                  setMenuVisible(false)
                  router.push('/(tabs)')
                }}
              >
                <Calendar color={'white'} height={26} width={26} />
                <Text className="text-white font-poppinsBold">Plan lekcji</Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row justify-start mb-[10] ml-[20] mr-[20]">
              <TouchableOpacity
                className="rounded-2xl bg-[#265FEF] h-[66] w-[55%] justify-center items-center"
                onPress={() => {
                  setMenuVisible(false)
                  router.push('/mainpage')
                }}
              >
                <Home color={'white'} height={26} width={26} />
                <Text className="text-white font-poppinsBold">Strona główna</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="rounded-2xl bg-[#265FEF] h-[66] w-[42.5%] justify-center items-center ml-[10]"
                onPress={() => {
                  setMenuVisible(false)
                  router.push('/(tabs)/exams')
                }}
              >
                <Exam color={'white'} height={26} width={26} />
                <Text className="text-white font-poppinsBold">Sprawdziany</Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row justify-start ml-[20] mr-[20]">
              <TouchableOpacity
                className="rounded-2xl bg-[#265FEF] h-[66] w-[57.5%] justify-center items-center"
                onPress={() => {
                  setMenuVisible(false)
                  router.push('/(tabs)/homework')
                }}
              >
                <Book color={'white'} height={26} width={26} />
                <Text className="text-white font-poppinsBold">Zadania domowe</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="rounded-2xl bg-[#265FEF] h-[66] w-[40%] justify-center items-center ml-[10]"
                onPress={() => {
                  setMenuVisible(false)
                  router.push('/(tabs)/attendance')
                }}
              >
                <Attendance color={'white'} height={26} width={26} />
                <Text className="text-white font-poppinsBold">Frekwencja</Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row justify-end gap-2 items-center h-[21%]">
              <TouchableOpacity
                className="rounded-3xl bg-[#265FEF] h-[36] w-[36] justify-center items-center mr-[20]"
                onPress={() => setMenuVisible(false)}
              >
                <MenuAlt color={'white'} height={24} width={24} />
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  )
}
