import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Dimensions } from 'react-native'
import { WebView } from 'react-native-webview'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { useGenerateNote } from '@/hooks/useGenerateNote'
import LoadingScreen from './LoadingScreen'
import ErrorMessage from './ErrorMessage'

const Note = ({ topic }: { topic: string }) => {
  const { mutate, data: apiData, isPending, isError } = useGenerateNote()
  const [cachedData, setCachedData] = useState<string | null>(null)

  // 1. Logika pobierania z pamięci lub generowania
  useEffect(() => {
    const checkCacheAndFetch = async () => {
      try {
        const savedNote = await AsyncStorage.getItem(`note_${topic}`)
        if (savedNote) {
          setCachedData(savedNote)
        } else {
          mutate(topic)
        }
      } catch (e) {
        mutate(topic) // W razie błędu cache, generuj nową
      }
    }

    if (topic) checkCacheAndFetch()
  }, [topic])

  // 2. Zapisywanie do pamięci po udanym wygenerowaniu
  useEffect(() => {
    if (apiData) {
      AsyncStorage.setItem(`note_${topic}`, apiData)
    }
  }, [apiData, topic])

  const currentData = cachedData || apiData

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <script>
        // TA KONFIGURACJA JEST KLUCZOWA
        window.MathJax = {
          tex: {
            inlineMath: [['$', '$']], 
            displayMath: [['$$', '$$']]
          }
        };
      </script>
      <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
      <style>
        body { font-family: sans-serif; line-height: 1.6; color: #333; }
        h1 { font-size: 28px; color: #000; }
        h2 { font-size: 22px; color: #1a73e8; margin-top: 20px; }
        ul { padding-left: 10px; list-style: none }
        li { margin-bottom: 10px; }
      </style>
    </head>
    <body>
      ${
        currentData
          ? currentData
              .trim()
              .replace(/^"|"$/g, '')
              .replace(/\\n/g, '<br />') // Zamienia tekstowe \n na br
              .replace(/\\\\/g, '\\') // Naprawia podwójne backslashe z API
              .replace(/\\/g, '\\') // Zapewnia pojedyncze backslashe dla LaTeX
          : ''
      }
    </body>
    </html>
  `

  if (isPending && !cachedData) {
    return <LoadingScreen text="Generowanie..." />
  }

  if (isError && !cachedData) {
    return <ErrorMessage />
  }

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 1900
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent'
  }
})

export default Note
