"use client"
import EncabezadoLibro from "./EncabezadoLibro"
import AutorItem from "./AutorItem"
import { useLanguage } from "../contexts/LanguageContext"
import "./indice.css"
import { useEffect, useRef, useState } from "react"

export default function Indice({ autores, onGoToHome, irAPagina }) {
  const [showScrollIndicators, setShowScrollIndicators] = useState({
    libro: false,
    cartas: false,
    poesia: false,
  })

  const [triangleDirections, setTriangleDirections] = useState({
    libro: "down",
    cartas: "down",
    poesia: "down",
  })

  const libroListRef = useRef(null)
  const cartasListRef = useRef(null)
  const poesiaListRef = useRef(null)

  const { t, autoresData, cartasEsperanzaData, poesiaData } = useLanguage()

  const idsCartasEsperanza = cartasEsperanzaData.map((autor) => autor.id)
  const idsPoesia = poesiaData.map((autor) => autor.id)
  const idsExcluidos = [...idsCartasEsperanza, ...idsPoesia]

  const autoresDelLibroSolamente = autoresData.filter((autor) => !idsExcluidos.includes(autor.id))

  const handleTriangleClick = (section, listRef) => {
    if (listRef.current) {
      const { scrollTop, clientHeight } = listRef.current
      const scrollAmount = clientHeight * 0.7
      const newTop = triangleDirections[section] === "down" ? scrollTop + scrollAmount : scrollTop - scrollAmount

      listRef.current.scrollTo({
        top: newTop,
        behavior: "smooth",
      })
    }
  }

  const handleScroll = (section, listRef) => {
    if (listRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listRef.current
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 10
      setTriangleDirections((prev) => ({
        ...prev,
        [section]: isNearBottom ? "up" : "down",
      }))
    }
  }

  useEffect(() => {
    const checkScrollable = () => {
      const lists = [
        { ref: libroListRef, section: "libro" },
        { ref: cartasListRef, section: "cartas" },
        { ref: poesiaListRef, section: "poesia" },
      ]

      const newIndicators = {}
      lists.forEach(({ ref, section }) => {
        if (ref.current) {
          newIndicators[section] = ref.current.scrollHeight > ref.current.clientHeight
        }
      })

      setShowScrollIndicators(newIndicators)
    }

    checkScrollable()
    window.addEventListener("resize", checkScrollable)

    const libroEl = libroListRef.current
    const cartasEl = cartasListRef.current
    const poesiaEl = poesiaListRef.current

    if (libroEl) libroEl.addEventListener("scroll", () => handleScroll("libro", libroListRef))
    if (cartasEl) cartasEl.addEventListener("scroll", () => handleScroll("cartas", cartasListRef))
    if (poesiaEl) poesiaEl.addEventListener("scroll", () => handleScroll("poesia", poesiaListRef))

    return () => {
      window.removeEventListener("resize", checkScrollable)
      if (libroEl) libroEl.removeEventListener("scroll", () => handleScroll("libro", libroListRef))
      if (cartasEl) cartasEl.removeEventListener("scroll", () => handleScroll("cartas", cartasListRef))
      if (poesiaEl) poesiaEl.removeEventListener("scroll", () => handleScroll("poesia", poesiaListRef))
    }
  }, [autoresDelLibroSolamente, cartasEsperanzaData, poesiaData])

  return (
    <div className="indice-container">
      <div className="indice-header">
        <EncabezadoLibro onGoToHome={onGoToHome} />
      </div>

      <div className="indice-content">
        <h2 className="indice-titulo">{t("IndiceDeAutores")}</h2>

        <div className="secciones-container">
          {/* Sección: Los del libro */}
          <div className={`seccion-autores ${!showScrollIndicators.libro ? "no-scroll" : ""}`}>
            <h3 className="seccion-titulo">{t("LatidosDeEsperanza")}</h3>
            <p className="seccion-descripcion">{t("DescripcionLatidosDeEsperanza")}</p>

            <div className="lista-autores" ref={libroListRef}>
              {autoresDelLibroSolamente.map((autor, index) => (
                <AutorItem
                  key={autor.id}
                  id={autor.id}
                  nombre={`${index + 1}. ${autor.nombre}`}
                  fragmento={autor.fragmento}
                  onNavigateToPage={() => irAPagina(autor.id)}
                />
              ))}
            </div>

            {showScrollIndicators.libro && (
              <div
                className="scroll-indicator clickeable"
                onClick={() => handleTriangleClick("libro", libroListRef)}
                title={triangleDirections.libro === "down" ? t("ScrollAbajo") : t("ScrollArriba")}
              >
                {triangleDirections.libro === "down" ? "▼" : "▲"}
              </div>
            )}
          </div>

          {/* Sección: Cartas de Esperanza */}
          <div className={`seccion-autores ${!showScrollIndicators.cartas ? "no-scroll" : ""}`}>
            <h3 className="seccion-titulo">{t("LatidosDesdeGaza")}</h3>
            <p className="seccion-descripcion">{t("DescripcionLatidosDesdeGaza")}</p>

            <div className="lista-autores" ref={cartasListRef}>
              {cartasEsperanzaData.map((autor, index) => (
                <AutorItem
                  key={`carta-${autor.id}`}
                  id={autor.id}
                  nombre={`${index + 1}. ${autor.nombre}`}
                  fragmento={autor.fragmento}
                  onNavigateToPage={() => irAPagina(autor.id)}
                />
              ))}
            </div>

            {showScrollIndicators.cartas && (
              <div
                className="scroll-indicator clickeable"
                onClick={() => handleTriangleClick("cartas", cartasListRef)}
                title={triangleDirections.cartas === "down" ? t("ScrollAbajo") : t("ScrollArriba")}
              >
                {triangleDirections.cartas === "down" ? "▼" : "▲"}
              </div>
            )}
          </div>

          {/* Sección: Poesía */}
          <div className={`seccion-autores ${!showScrollIndicators.poesia ? "no-scroll" : ""}`}>
            <h3 className="seccion-titulo">{t("Versos")}</h3>
            <p className="seccion-descripcion">{t("DescripcionVersos")}</p>

            <div className="lista-autores" ref={poesiaListRef}>
              {poesiaData.map((autor, index) => (
                <AutorItem
                  key={`poesia-${autor.id}`}
                  id={autor.id}
                  nombre={`${index + 1}. ${autor.nombre}`}
                  fragmento={autor.fragmento}
                  onNavigateToPage={() => irAPagina(autor.id)}
                />
              ))}
            </div>

            {showScrollIndicators.poesia && (
              <div
                className="scroll-indicator clickeable"
                onClick={() => handleTriangleClick("poesia", poesiaListRef)}
                title={triangleDirections.poesia === "down" ? t("ScrollAbajo") : t("ScrollArriba")}
              >
                {triangleDirections.poesia === "down" ? "▼" : "▲"}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
