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

  // const currentData =
  //   '### Funkcja kwadratowa\n\nFunkcja kwadratowa to podstawowa funkcja matematyczna drugiego stopnia, której wykresem jest parabola.[1][2] Jest definiowana wzorem \\( f(x) = ax^2 + bx + c \\), gdzie \\( a \\neq 0 \\), a \\( a, b, c \\in \\mathbb{R} \\).[1][2][3] Występuje w wielu zastosowaniach, np. w fizyce do opisu trajektorii ruchu.\n\n**Kluczowe pojęcia i definicje**\n- **Postać ogólna**: \\( f(x) = ax^2 + bx + c \\), gdzie \\( a \\neq 0 \\) (współczynnik kierunkowy paraboli), \\( b \\) i \\( c \\) to współczynniki liniowy i wolny.[1][2][4]\n- **Postać wierzchołkowa (kanoniczna)**: \\( f(x) = a(x - p)^2 + q \\), gdzie punkt \\( W(p, q) \\) to wierzchołek paraboli; \\( p = -\\frac{b}{2a} \\), \\( q = f(p) = -\\frac{\\Delta}{4a} \\).[1][5][7]\n- **Wyróżnik (delta)**: \\( \\Delta = b^2 - 4ac \\), decyduje o liczbie miejsc zerowych: \\( \\Delta > 0 \\) – dwa, \\( \\Delta = 0 \\) – jedno, \\( \\Delta < 0 \\) – brak.[1][5]\n- **Miejsca zerowe**: Rozwiązania równania \\( ax^2 + bx + c = 0 \\); wzory Vieta: \\( x_{1,2} = \\frac{-b \\pm \\sqrt{\\Delta}}{2a} \\).[5]\n- **Dziedzina**: \\( D_f = \\mathbb{R} \\).[2][4]\n- **Zbiór wartości**: Jeśli \\( a > 0 \\), \\( W_f = \\langle q, \\infty \\rangle \\); jeśli \\( a < 0 \\), \\( W_f = (-\\infty, q \\rangle \\).[2]\n- **Postać iloczynowa**: \\( f(x) = a(x - x_1)(x - x_2) \\) dla \\( \\Delta \\geq 0 \\).[5]\n\n**Wzory i zależności**\n- Wyróżnik: \\[ \\Delta = b^2 - 4ac \\][1][5]\n- Współrzędne wierzchołka: \\[ p = -\\frac{b}{2a}, \\quad q = -\\frac{\\Delta}{4a} \\][5][7]\n- Miejsca zerowe: \\[ x_{1,2} = \\frac{-b \\pm \\sqrt{\\Delta}}{2a} \\][5]\n- Funkcja pierwotna (całka nieokreślona): \\[ F(x) = \\frac{1}{3} a x^3 + \\frac{1}{2} b x^2 + c x + C \\][1]\n\n**Przykład**\nOblicz miejsca zerowe, wyróżnik i współrzędne wierzchołka dla \\( f(x) = 2x^2 - 4x + 1 \\).\n\n**Rozwiązanie**:\n- Wyróżnik: \\( \\Delta = (-4)^2 - 4 \\cdot 2 \\cdot 1 = 16 - 8 = 8 > 0 \\) (dwa miejsca zerowe).[5]\n- Miejsca zerowe: \\[ x_{1,2} = \\frac{4 \\pm \\sqrt{8}}{4} = \\frac{4 \\pm 2\\sqrt{2}}{4} = 1 \\pm \\frac{\\sqrt{2}}{2} \\][5]\n- Wierzchołek: \\( p = \\frac{4}{4} = 1 \\), \\( q = f(1) = 2(1)^2 - 4(1) + 1 = -1 \\) (lub \\( q = -\\frac{8}{8} = -1 \\)).[5]'

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
      <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
      <style>
        body {
          font-family: -apple-system, system-ui;
          padding: 20px;
          line-height: 1.6;
          color: #333;
          font-size: 16px;
        }
        h3 { color: #1a73e8; font-size: 24px; border-bottom: 1px solid #eee; padding-bottom: 10px; }
        strong { color: #000; }
        .example-box {
          background-color: #f8f9fa;
          border-radius: 8px;
          padding: 15px;
          border-left: 5px solid #1a73e8;
          margin-top: 20px;
        }
        .mjx-chtml { outline: none !important; }
      </style>
    </head>
    <body>
      ${
        currentData
          ? currentData
              // .replace(/^"|"$/g, '') // Usuwa cudzysłów na samym początku i na samym końcu
              // .replace(/\\"/g, '"') // Zamienia \" na zwykły cudzysłów "
              // .replace(/\\n/g, '<br>') // Na wszelki wypadek, gdyby \n przychodziło jako tekst
              .replace(/\n/g, '<br>')
              .replace('### Przykład', '<div class="example-box"><strong>Przykład</strong>') +
            '</div>'
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
