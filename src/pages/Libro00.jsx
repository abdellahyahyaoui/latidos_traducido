"use client"

import React, { useRef, useState, useEffect, useMemo } from "react"
import HTMLFlipBook from "react-pageflip"
import Portada from "./Portada"
import Prologo from "./Prologo"
import Indice from "./Indice"
import Relato from "./Relato"
import AutorIndice from "../components/AutorIndice"
import { splitPrologoIntoPages, splitRelatoWithPartsIntoPages } from "./utils/splitContentIntoPages"
import "./Libro.css"

import { prologos } from "./utils/prologo" // importa el objeto con idiomas
import { useLanguage } from "../contexts/LanguageContext"
import ContactModal from "../components/ContactModal" // ✅ Reintroducido

const Pagina = React.forwardRef(({ children }, ref) => (
  <div className="pagina-libro" ref={ref}>
    {children}
  </div>
))

export default function Libro() {
  const bookRef = useRef()
  const [windowDimensions, setWindowDimensions] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1000,
    height: typeof window !== "undefined" ? window.innerHeight : 800,
  })
  const [isMobile, setIsMobile] = useState(false)
  const [isContactModalOpen, setIsContactModalOpen] = useState(false) // ✅ Reintroducido el estado del modal

const [autores, setAutores] = useState([])
useEffect(() => {
  const loadData = async () => {
    let basePath
    switch (language) {
      case "ar":
        basePath = "/data/ar/"
        break
      case "fr":
        basePath = "/data/fr/"
        break
      default:
        basePath = "/data/es/"
    }

    try {
      const [autoresRes, cartasRes, poesiaRes] = await Promise.all([
        fetch(`${basePath}autores.json`).then(r => r.json()),
        fetch(`${basePath}cartas-esperanza.json`).then(r => r.json()),
        fetch(`${basePath}poesia.json`).then(r => r.json()),
      ])
      setAutores([...autoresRes, ...cartasRes, ...poesiaRes])
    } catch (err) {
      console.error("Error cargando JSON:", err)
    }
  }

  loadData()
}, [language])


 const { language } = useLanguage()

const paginatedPrologo = useMemo(() => {
  const contenido = prologos[language] || prologos["es"] // selecciona idioma o español
  return splitPrologoIntoPages(contenido, 12)
}, [language])

  const paginatedAutores = useMemo(() => {
    // Límites iguales que el resto del libro
    const FIRST_PAGE_MAX = 10
    const OTHER_PAGES_MAX = 12

    return autores.map((autor) => {
      const allPages = []
      ;(autor.parts || []).forEach((part) => {
        if (part.especial && Array.isArray(part.pages)) {
          // Aplana arrays anidados (soluciona cuando pegas un array de objetos junto)
          const specialPages = (Array.isArray(part.pages) ? part.pages : [part.pages]).flatMap((p) =>
            Array.isArray(p) ? p : [p],
          )

          specialPages.forEach((page, i) => {
            // 📌 Caso especial: videoTexto con paginación por bloques
            if (page.tipo === "videoTexto") {
              const textoArr = Array.isArray(page.texto) ? page.texto : [page.texto].filter(Boolean)
              const firstPageWithVideoMax = Math.max(1, Math.floor(FIRST_PAGE_MAX * 0.6))
              const firstChunk = textoArr.slice(0, firstPageWithVideoMax)

              if (firstChunk.length) {
                allPages.push({
                  content: [{ tipo: "videoTexto", video: page.video, texto: firstChunk }],
                  sectionTitle: i === 0 ? part.title : null,
                  isFirstPageOfSection: i === 0,
                  isEspecial: true,
                })
              }

              let offset = firstChunk.length
              while (offset < textoArr.length) {
                const chunk = textoArr.slice(offset, offset + OTHER_PAGES_MAX)
                allPages.push({
                  content: [{ tipo: "texto", content: chunk }],
                  sectionTitle: null,
                  isFirstPageOfSection: false,
                  isEspecial: true,
                })
                offset += OTHER_PAGES_MAX
              }
            } else if (page.tipo === "dobleTexto") {
              const arabeArr = Array.isArray(page.arabe) ? page.arabe : [page.arabe].filter(Boolean)
              const espArr = Array.isArray(page.espanol) ? page.espanol : [page.espanol].filter(Boolean)
              const maxLen = Math.max(arabeArr.length, espArr.length)
              const pairs = []
              for (let idx = 0; idx < maxLen; idx++) {
                pairs.push({ arabe: arabeArr[idx] || "", espanol: espArr[idx] || "" })
              }
              let offset = 0
              let isFirstOfThisSpecial = true
              while (offset < pairs.length) {
                const limit = isFirstOfThisSpecial && i === 0 ? FIRST_PAGE_MAX : OTHER_PAGES_MAX
                const chunk = pairs.slice(offset, offset + limit)
                allPages.push({
                  content: [
                    { tipo: "dobleTexto", arabe: chunk.map((p) => p.arabe), espanol: chunk.map((p) => p.espanol) },
                  ],
                  sectionTitle: i === 0 && isFirstOfThisSpecial ? part.title : null,
                  isFirstPageOfSection: i === 0 && isFirstOfThisSpecial,
                  isEspecial: true,
                })
                offset += limit
                isFirstOfThisSpecial = false
              }
           } else if (page.tipo === "texto") {
  const textoArr = Array.isArray(page.content) ? page.content : [page.content].filter(Boolean)
  let offset = 0
  let isFirstOfThisSpecial = true
  while (offset < textoArr.length) {
    const limit = isFirstOfThisSpecial && i === 0 ? FIRST_PAGE_MAX : OTHER_PAGES_MAX
    const chunk = textoArr.slice(offset, offset + limit)
    allPages.push({
      content: [{ tipo: "texto", content: chunk }],
      sectionTitle: i === 0 && isFirstOfThisSpecial ? part.title : null,
      isFirstPageOfSection: i === 0 && isFirstOfThisSpecial,
      isEspecial: true,
    })
    offset += limit
    isFirstOfThisSpecial = false
  }
} else {
  // Otros tipos especiales tal cual
  allPages.push({
    content: [page],
    sectionTitle: i === 0 ? part.title : null,
    isFirstPageOfSection: i === 0,
    isEspecial: true,
  })
}

          })
        } else {
          const paginated = splitRelatoWithPartsIntoPages([part], OTHER_PAGES_MAX, FIRST_PAGE_MAX)
          allPages.push(...paginated)
        }
      })

      return {
        ...autor,
        paginatedContent: allPages,
      }
    })
  }, [autores])

  const pageMapData = useMemo(() => {
    const map = []
    let currentPageIndex = 0

    const authorIndexPageStarts = {}
    const authorStoryPageStarts = {}
    const autorPartGlobalPageStarts = {}

    map.push({ type: "portada" })
    currentPageIndex++

    paginatedPrologo.forEach((pageContent, pageIndex) => {
      map.push({ type: "prologo", pageIndex: pageIndex })
      currentPageIndex++
    })

    const mainIndexPage = currentPageIndex
    map.push({ type: "indice" })
    currentPageIndex++

    paginatedAutores.forEach((autor) => {
      authorIndexPageStarts[autor.id] = currentPageIndex
      map.push({ type: "autorIndice", autorId: autor.id })
      currentPageIndex++

      autorPartGlobalPageStarts[autor.id] = {}

      authorStoryPageStarts[autor.id] = currentPageIndex
      autor.paginatedContent.forEach((pageData, pageIndexInAutor) => {
        if (pageData.isFirstPageOfSection && pageData.sectionTitle) {
          autorPartGlobalPageStarts[autor.id][pageData.sectionTitle] = currentPageIndex
        }

        map.push({
          type: "relato",
          autorId: autor.id,
          pageIndex: pageIndexInAutor,
          sectionTitle: pageData.sectionTitle,
          isFirstPageOfSection: pageData.isFirstPageOfSection,
        })
        currentPageIndex++
      })
    })

    return { map, authorIndexPageStarts, authorStoryPageStarts, mainIndexPage, autorPartGlobalPageStarts }
  }, [paginatedPrologo, paginatedAutores])

  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth
      const newHeight = window.innerHeight
      setWindowDimensions({
        width: newWidth,
        height: newHeight,
      })
      setIsMobile(newWidth <= 768)
    }

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize)
      handleResize()
      return () => window.removeEventListener("resize", handleResize)
    }
  }, [])

  const avanzarPagina = () => {
    const flip = bookRef.current.pageFlip()
    flip.flipNext()
  }

  const retrocederConAnimacion = () => {
    const flip = bookRef.current.pageFlip()
    if (flip.getCurrentPageIndex() > 0) {
      flip.flipPrev()
    }
  }

  const volverAlInicio = () => {
    const flip = bookRef.current.pageFlip()
    flip.turnToPage(0)
  }

  const irAPagina = (pageIndex) => {
    const flip = bookRef.current.pageFlip()
    flip.turnToPage(pageIndex)
  }

  // ✅ Funciones para abrir y cerrar el modal
  const openContactModal = () => {
    setIsContactModalOpen(true)
  }
  const closeContactModal = () => {
    setIsContactModalOpen(false)
  }

  return (
    <div className="contenedor-libro">
      <HTMLFlipBook
        ref={bookRef}
        width={windowDimensions.width}
        height={isMobile ? "auto" : windowDimensions.height}
        size="stretch"
        minWidth={windowDimensions.width}
        maxWidth={windowDimensions.width}
        minHeight={isMobile ? 0 : windowDimensions.height}
        maxHeight={isMobile ? "auto" : windowDimensions.height}
        showCover={false}
        mobileScrollSupport={true}
        usePortrait={true}
        singlePage={true}
        className="libro-pantalla-completa"
        useMouseEvents={false}
      >
        {pageMapData.map.map((pageInfo, index) => {
          if (pageInfo.type === "portada") {
            return (
              <Pagina key={index}>
                <Portada
                  avanzarPagina={avanzarPagina}
                  onGoToHome={volverAlInicio}
                  openContactModal={openContactModal}
                />
              </Pagina>
            )
          } else if (pageInfo.type === "prologo") {
            const contentForPage = paginatedPrologo[pageInfo.pageIndex]
            const esPrimeraPagina = pageInfo.pageIndex === 0
            return (
              <Pagina key={index}>
                <Prologo
                  contenido={contentForPage}
                  avanzarPagina={avanzarPagina}
                  retrocederPagina={retrocederConAnimacion}
                  onGoToHome={volverAlInicio}
                  onGoToMainIndex={() => irAPagina(pageMapData.mainIndexPage)}
                  esPrimeraPagina={esPrimeraPagina}
                />
              </Pagina>
            )
          } else if (pageInfo.type === "indice") {
            return (
              <Pagina key={index}>
                <Indice
                  autores={paginatedAutores}
                  onGoToHome={volverAlInicio}
                  irAPagina={(autorId) => irAPagina(pageMapData.authorIndexPageStarts[autorId])}
                />
              </Pagina>
            )
          } else if (pageInfo.type === "autorIndice") {
            const autor = paginatedAutores.find((a) => a.id === pageInfo.autorId)
            return (
              <Pagina key={index}>
                <AutorIndice
                  autor={autor}
                  irAPagina={irAPagina}
                  onGoToHome={volverAlInicio}
                  autorPartGlobalPageStarts={pageMapData.autorPartGlobalPageStarts}
                />
              </Pagina>
            )
          } else if (pageInfo.type === "relato") {
            const autor = paginatedAutores.find((a) => a.id === pageInfo.autorId)
            const pageData = autor?.paginatedContent?.[pageInfo.pageIndex]

            if (!autor || !pageData) {
              console.error("Error: Autor o datos de página no encontrados para relato", pageInfo)
              return null
            }

            const authorIndexPage = pageMapData.authorIndexPageStarts[autor.id]

            return (
              <Pagina key={index}>
                <Relato
                  autor={autor.nombre}
                  titulo={autor.titulo}
                  contenido={pageData.content}
                  sectionTitle={pageData.sectionTitle}
                  isFirstPageOfSection={pageData.isFirstPageOfSection}
                  esPrimeraPagina={pageInfo.pageIndex === 0}
                  avanzarPagina={avanzarPagina}
                  retrocederPagina={retrocederConAnimacion}
                  onGoToHome={volverAlInicio}
                  onGoToAuthorIndex={() => irAPagina(authorIndexPage)}
                  onGoToMainIndex={() => irAPagina(pageMapData.mainIndexPage)}
                />
              </Pagina>
            )
          }
          return null
        })}
      </HTMLFlipBook>
      {isContactModalOpen && <ContactModal onClose={closeContactModal} />}{" "}
      {/* ✅ Renderiza el modal condicionalmente */}
    </div>
  )
}

