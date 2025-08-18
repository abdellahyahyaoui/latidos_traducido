// "use client"

// import { createContext, useContext, useState, useEffect, useCallback } from "react"

// const LanguageContext = createContext()

// const translations = {
//   es: {
//      LatidosDeEsperanza: "Latidos De Esperanza",
//   DescripcionLatidosDeEsperanza: "Relatos y testimonios que forman parte de la obra principal",
//   LatidosDesdeGaza: "Latidos Desde Gaza",
//   DescripcionLatidosDesdeGaza: "Cartas de esperanza desde Gaza",
//   Versos: "Versos",
//   DescripcionVersos: "Poemas y fragmentos poéticos",
//   IndiceDeAutores: "Índice de autores",
//   ScrollAbajo: "Desplazar hacia abajo",
//   ScrollArriba: "Desplazar hacia arriba",
//     "ui.back": "Volver",
//     "ui.loading": "Cargando...",
//     "ui.error": "Error",
//     "section.latidos-esperanza": "Latidos De Esperanza",
//     "section.latidos-gaza": "Latidos Desde Gaza",
//     "section.versos": "Versos",
//     siguiente: "Siguiente",
//     dirigidoPor: "Dirigido por",
//     titulo: "Latidos De Esperanza",
//     prologo: "Una obra que trasciende fronteras y despierta conciencias",
//   },
//   en: {
//     LatidosDeEsperanza: "Heartbeats of Hope",
//   DescripcionLatidosDeEsperanza: "Stories and testimonies that are part of the main work",
//   LatidosDesdeGaza: "Heartbeats from Gaza",
//   DescripcionLatidosDesdeGaza: "Letters of hope from Gaza",
//   Versos: "Verses",
//   DescripcionVersos: "Poems and poetic fragments",
//   IndiceDeAutores: "Authors Index",
//   ScrollAbajo: "Scroll down",
//   ScrollArriba: "Scroll up",
//     "ui.back": "Back",
//     "ui.loading": "Loading...",
//     "ui.error": "Error",
//     "section.latidos-esperanza": "Heartbeats of Hope",
//     "section.latidos-gaza": "Heartbeats from Gaza",
//     "section.versos": "Verses",
//     siguiente: "Next",
//     dirigidoPor: "Directed by",
//     titulo: "Heartbeats of Hope",
//     prologo: "A work that transcends borders and awakens consciences",
//   },
//   ar: {
//     LatidosDeEsperanza: "نبضات الأمل",
//   DescripcionLatidosDeEsperanza: "قصص وشهادات جزء من العمل الرئيسي",
//   LatidosDesdeGaza: "نبضات من غزة",
//   DescripcionLatidosDesdeGaza: "رسائل أمل من غزة",
//   Versos: "أبيات",
//   DescripcionVersos: "قصائد ومقتطفات شعرية",
//   IndiceDeAutores: "فهرس المؤلفين",
//   ScrollAbajo: "التمرير للأسفل",
//   ScrollArriba: "التمرير للأعلى",
//     "ui.back": "رجوع",
//     "ui.loading": "جاري التحميل...",
//     "ui.error": "خطأ",
//     "section.latidos-esperanza": "نبضات الأمل",
//     "section.latidos-gaza": "نبضات من غزة",
//     "section.versos": "أبيات",
//     siguiente: "التالي",
//     dirigidoPor: "من إخراج",
//     titulo: "نبضات الأمل",
//     prologo: "عمل يتجاوز الحدود ويوقظ الضمائر",
//   },
//   fr: {
//     LatidosDeEsperanza: "Battements d'Espoir",
//   DescripcionLatidosDeEsperanza: "Récits et témoignages faisant partie de l'œuvre principale",
//   LatidosDesdeGaza: "Battements de Gaza",
//   DescripcionLatidosDesdeGaza: "Lettres d'espoir de Gaza",
//   Versos: "Versets",
//   DescripcionVersos: "Poèmes et extraits poétiques",
//   IndiceDeAutores: "Index des auteurs",
//   ScrollAbajo: "Faire défiler vers le bas",
//   ScrollArriba: "Faire défiler vers le haut",
//     "ui.back": "Retour",
//     "ui.loading": "Chargement...",
//     "ui.error": "Erreur",
//     "section.latidos-esperanza": "Battements d'Espoir",
//     "section.latidos-gaza": "Battements de Gaza",
//     "section.versos": "Versets",
//     siguiente: "Suivant",
//     dirigidoPor: "Dirigé par",
//     titulo: "Battements d'Espoir",
//     prologo: "Une œuvre qui transcende les frontières et éveille les consciences",
//   },
// }

// export const LanguageProvider = ({ children }) => {
//   const [language, setLanguage] = useState("es")
//   const [autoresData, setAutoresData] = useState([])
//   const [cartasEsperanzaData, setCartasEsperanzaData] = useState([])
//   const [poesiaData, setPoesiaData] = useState([])
//   const [loading, setLoading] = useState(true)

//   const loadData = useCallback(async () => {
//     setLoading(true)
//     try {
//       const [autoresResponse, cartasResponse, poesiaResponse] = await Promise.all([
//         import(`../data/${language}/autores.json`),
//         import(`../data/${language}/cartas-esperanza.json`),
//         import(`../data/${language}/poesia.json`),
//       ])

//       setAutoresData(autoresResponse.default || [])
//       setCartasEsperanzaData(cartasResponse.default || [])
//       setPoesiaData(poesiaResponse.default || [])
//     } catch (error) {
//       console.error("Error loading data:", error)
//       if (language !== "es") {
//         try {
//           const [autoresResponse, cartasResponse, poesiaResponse] = await Promise.all([
//             import(`../data/es/autores.json`),
//             import(`../data/es/cartas-esperanza.json`),
//             import(`../data/es/poesia.json`),
//           ])

//           setAutoresData(autoresResponse.default || [])
//           setCartasEsperanzaData(cartasResponse.default || [])
//           setPoesiaData(poesiaResponse.default || [])
//         } catch (fallbackError) {
//           console.error("Error loading fallback data:", fallbackError)
//         }
//       }
//     } finally {
//       setLoading(false)
//     }
//   }, [language])

//   useEffect(() => {
//     const savedLanguage = localStorage.getItem("language")
//     if (savedLanguage && translations[savedLanguage]) {
//       setLanguage(savedLanguage)
//     }
//   }, [])

//   useEffect(() => {
//     localStorage.setItem("language", language)
//     document.documentElement.lang = language
//     document.documentElement.dir = language === "ar" ? "rtl" : "ltr"
//   }, [language])

//   useEffect(() => {
//     loadData()
//   }, [loadData])

//   const t = useCallback(
//     (key) => {
//       return translations[language]?.[key] || key
//     },
//     [language],
//   )

//   const value = {
//     language,
//     setLanguage,
//     t,
//     isRTL: language === "ar",
//     autoresData,
//     cartasEsperanzaData,
//     poesiaData,
//     loading,
//   }

//   return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
// }

// export const useLanguage = () => {
//   const context = useContext(LanguageContext)
//   if (!context) {
//     throw new Error("useLanguage must be used within a LanguageProvider")
//   }
//   return context
// }
"use client"

import { createContext, useContext, useState, useEffect, useCallback } from "react"

const LanguageContext = createContext()

const translations = {
  es: {
    LatidosDeEsperanza: "Latidos De Esperanza",
    DescripcionLatidosDeEsperanza: "Relatos y testimonios que forman parte de la obra principal",
    LatidosDesdeGaza: "Latidos Desde Gaza",
    DescripcionLatidosDesdeGaza: "Cartas de esperanza desde Gaza",
    Versos: "Versos",
    DescripcionVersos: "Poemas y fragmentos poéticos",
    IndiceDeAutores: "Índice de autores",
    ScrollAbajo: "Desplazar hacia abajo",
    ScrollArriba: "Desplazar hacia arriba",
    "ui.back": "Volver",
    "ui.loading": "Cargando...",
    "ui.error": "Error",
    "section.latidos-esperanza": "Latidos De Esperanza",
    "section.latidos-gaza": "Latidos Desde Gaza",
    "section.versos": "Versos",
    siguiente: "Siguiente",
    dirigidoPor: "Dirigido por",
     tituloPalabra1: "Latidos",
    tituloPalabra2: "De",
   tituloPalabra3: "Esperanza",
    titulo: "Latidos De Esperanza",
    prologo: "Prólogo",
     minombre:"Abdellah Yahyaoui Azuz"
  },
  en: {
    LatidosDeEsperanza: "Heartbeats of Hope",
    DescripcionLatidosDeEsperanza: "Stories and testimonies that are part of the main work",
    LatidosDesdeGaza: "Heartbeats from Gaza",
    DescripcionLatidosDesdeGaza: "Letters of hope from Gaza",
    Versos: "Verses",
    DescripcionVersos: "Poems and poetic fragments",
    IndiceDeAutores: "Authors Index",
    ScrollAbajo: "Scroll down",
    ScrollArriba: "Scroll up",
    "ui.back": "Back",
    "ui.loading": "Loading...",
    "ui.error": "Error",
    "section.latidos-esperanza": "Heartbeats of Hope",
    "section.latidos-gaza": "Heartbeats from Gaza",
    "section.versos": "Verses",
    siguiente: "Next",
    dirigidoPor: "Directed by",
     tituloPalabra1: "Heartbeats",
    tituloPalabra2: "of",
   tituloPalabra3: "Hope",
    
    prologo: "Prologue",
     titulo: "Heartbeats of Hope",
    minombre:"Abdellah Yahyaoui Azuz"
  },
  ar: {
    LatidosDeEsperanza: "نبضات الأمل",
    DescripcionLatidosDeEsperanza: "قصص وشهادات جزء من العمل الرئيسي",
    LatidosDesdeGaza: "نبضات من غزة",
    DescripcionLatidosDesdeGaza: "رسائل أمل من غزة",
    Versos: "أبيات",
    DescripcionVersos: "قصائد ومقتطفات شعرية",
    IndiceDeAutores: "فهرس المؤلفين",
    ScrollAbajo: "التمرير للأسفل",
    ScrollArriba: "التمرير للأعلى",
    "ui.back": "رجوع",
    "ui.loading": "جاري التحميل...",
    "ui.error": "خطأ",
    "section.latidos-esperanza": "نبضات الأمل",
    "section.latidos-gaza": "نبضات من غزة",
    "section.versos": "أبيات",
    siguiente: "التالي",
    dirigidoPor: "من تأليف",
     tituloPalabra1: "نبضات",
    tituloPalabra2: " ",
   tituloPalabra3: " الأمل",
    
    titulo: "نبضات الأمل",
    prologo: " مقدمة",
    minombre:" عبد الله يحيوي عزوز"
  },
  fr: {
    LatidosDeEsperanza: "Battements d'Espoir",
    DescripcionLatidosDeEsperanza: "Récits et témoignages faisant partie de l'œuvre principale",
    LatidosDesdeGaza: "Battements de Gaza",
    DescripcionLatidosDesdeGaza: "Lettres d'espoir de Gaza",
    Versos: "Versets",
    DescripcionVersos: "Poèmes et extraits poétiques",
    IndiceDeAutores: "Index des auteurs",
    ScrollAbajo: "Faire défiler vers le bas",
    ScrollArriba: "Faire défiler vers le haut",
    "ui.back": "Retour",
    "ui.loading": "Chargement...",
    "ui.error": "Erreur",
    "section.latidos-esperanza": "Battements d'Espoir",
    "section.latidos-gaza": "Battements de Gaza",
    "section.versos": "Versets",
    siguiente: "Suivant",
    dirigidoPor: "Dirigé par",
    tituloPalabra1: "Battements",
    tituloPalabra2: "d'",
   tituloPalabra3: "Espoir",
   titulo: "Battements d'Espoir",
    
    prologo: "Préface",
     minombre:"Abdellah Yahyaoui Azuz"
  },
}

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("es")
  const [autoresData, setAutoresData] = useState([])
  const [cartasEsperanzaData, setCartasEsperanzaData] = useState([])
  const [poesiaData, setPoesiaData] = useState([])
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [autoresResponse, cartasResponse, poesiaResponse] = await Promise.all([
        fetch(`/data/${language}/autores.json`).then(res => res.json()),
        fetch(`/data/${language}/cartas-esperanza.json`).then(res => res.json()),
        fetch(`/data/${language}/poesia.json`).then(res => res.json()),
      ])

      setAutoresData(autoresResponse || [])
      setCartasEsperanzaData(cartasResponse || [])
      setPoesiaData(poesiaResponse || [])
    } catch (error) {
      console.error("Error loading data:", error)
      if (language !== "es") {
        try {
          const [autoresResponse, cartasResponse, poesiaResponse] = await Promise.all([
            fetch(`/data/es/autores.json`).then(res => res.json()),
            fetch(`/data/es/cartas-esperanza.json`).then(res => res.json()),
            fetch(`/data/es/poesia.json`).then(res => res.json()),
          ])

          setAutoresData(autoresResponse || [])
          setCartasEsperanzaData(cartasResponse || [])
          setPoesiaData(poesiaResponse || [])
        } catch (fallbackError) {
          console.error("Error loading fallback data:", fallbackError)
        }
      }
    } finally {
      setLoading(false)
    }
  }, [language])

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language")
    if (savedLanguage && translations[savedLanguage]) {
      setLanguage(savedLanguage)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("language", language)
    document.documentElement.lang = language
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr"
  }, [language])

  useEffect(() => {
    loadData()
  }, [loadData])

  const t = useCallback(
    (key) => translations[language]?.[key] || key,
    [language]
  )

  const value = {
    language,
    setLanguage,
    t,
    isRTL: language === "ar",
    autoresData,
    cartasEsperanzaData,
    poesiaData,
    loading,
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) throw new Error("useLanguage must be used within a LanguageProvider")
  return context
}
