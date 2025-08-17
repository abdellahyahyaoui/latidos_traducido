
"use client"
import EncabezadoLibro from "../pages/EncabezadoLibro"
import "./AutorIndice.css"
import { useEffect, useRef, useState } from "react"
import AuthorContactButton from "./AuthorContactButton"

function esTextoArabe(texto) {
  return /[\u0600-\u06FF]/.test(texto)
}

export default function AutorIndice({ autor, irAPagina, onGoToHome, autorPartGlobalPageStarts }) {
  const [showScrollIndicatorLeft, setShowScrollIndicatorLeft] = useState(false)
  const [showScrollIndicatorRight, setShowScrollIndicatorRight] = useState(false)
  const [leftTriangleDirection, setLeftTriangleDirection] = useState("down")
  const [rightTriangleDirection, setRightTriangleDirection] = useState("down")

  const partsListRef = useRef(null)
  const descriptionWrapperRef = useRef(null)

  // ✅ AÑADIR: Validación temprana de datos
  useEffect(() => {
    console.log("🔍 AutorIndice recibió:", {
      autorId: autor?.id,
      autorNombre: autor?.nombre,
      partsCount: autor?.parts?.length || 0,
      hasDescription: !!autor?.description,
      autorPartGlobalPageStarts: autorPartGlobalPageStarts?.[autor?.id],
    })
  }, [autor, autorPartGlobalPageStarts])

  const handleLeftTriangleClick = () => {
    if (partsListRef.current) {
      const { scrollTop, clientHeight } = partsListRef.current
      const scrollAmount = clientHeight * 0.7

      if (leftTriangleDirection === "down") {
        partsListRef.current.scrollTo({
          top: scrollTop + scrollAmount,
          behavior: "smooth",
        })
      } else {
        partsListRef.current.scrollTo({
          top: scrollTop - scrollAmount,
          behavior: "smooth",
        })
      }
    }
  }

  const handleRightTriangleClick = () => {
    if (descriptionWrapperRef.current) {
      const { scrollTop, clientHeight } = descriptionWrapperRef.current
      const scrollAmount = clientHeight * 0.7

      if (rightTriangleDirection === "down") {
        descriptionWrapperRef.current.scrollTo({
          top: scrollTop + scrollAmount,
          behavior: "smooth",
        })
      } else {
        descriptionWrapperRef.current.scrollTo({
          top: scrollTop - scrollAmount,
          behavior: "smooth",
        })
      }
    }
  }

  const handleLeftScroll = () => {
    if (partsListRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = partsListRef.current
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 5
      const isNearTop = scrollTop <= 5

      if (isNearBottom) {
        setLeftTriangleDirection("up")
      } else if (isNearTop) {
        setLeftTriangleDirection("down")
      }
    }
  }

  const handleRightScroll = () => {
    if (descriptionWrapperRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = descriptionWrapperRef.current
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 5
      const isNearTop = scrollTop <= 5

      if (isNearBottom) {
        setRightTriangleDirection("up")
      } else if (isNearTop) {
        setRightTriangleDirection("down")
      }
    }
  }

  useEffect(() => {
    const checkScrollable = () => {
      if (partsListRef.current) {
        const { scrollHeight, clientHeight } = partsListRef.current
        setShowScrollIndicatorLeft(scrollHeight > clientHeight)
      }

      if (descriptionWrapperRef.current) {
        const { scrollHeight, clientHeight } = descriptionWrapperRef.current
        setShowScrollIndicatorRight(scrollHeight > clientHeight)
      }
    }

    checkScrollable()
    window.addEventListener("resize", checkScrollable)

    const leftElement = partsListRef.current
    const rightElement = descriptionWrapperRef.current

    if (leftElement) {
      leftElement.addEventListener("scroll", handleLeftScroll)
    }
    if (rightElement) {
      rightElement.addEventListener("scroll", handleRightScroll)
    }

    const initialCheckTimeout = setTimeout(() => {
      handleRightScroll()
      handleLeftScroll()
    }, 100)

    return () => {
      window.removeEventListener("resize", checkScrollable)
      if (leftElement) {
        leftElement.removeEventListener("scroll", handleLeftScroll)
      }
      if (rightElement) {
        rightElement.removeEventListener("scroll", handleRightScroll)
      }
      clearTimeout(initialCheckTimeout)
    }
  }, [autor.parts, autor.description])

  // ✅ AÑADIR: Validación de datos antes del render
  if (!autor) {
    return (
      <div className="autor-indice-container">
        <div className="autor-indice-header">
          <EncabezadoLibro onGoToHome={onGoToHome} />
        </div>
        <div style={{ padding: "20px", textAlign: "center" }}>
          <h2>❌ Error: Datos del autor no disponibles</h2>
          <button onClick={onGoToHome}>Volver al inicio</button>
        </div>
      </div>
    )
  }

  if (!autor.parts || autor.parts.length === 0) {
    return (
      <div className="autor-indice-container">
        <div className="autor-indice-header">
          <EncabezadoLibro onGoToHome={onGoToHome} />
        </div>
        <div style={{ padding: "20px", textAlign: "center" }}>
          <h2>❌ Error: Sin contenido disponible</h2>
          <p>
            El autor <strong>{autor.nombre}</strong> no tiene partes disponibles
          </p>
          <button onClick={onGoToHome}>Volver al inicio</button>
        </div>
      </div>
    )
  }

  return (
    <div className="autor-indice-container">
      <div className="autor-indice-header">
        <EncabezadoLibro onGoToHome={onGoToHome} />
      </div>

      <div className="autor-indice-main-content">
        <h2 className="autor-indice-titulo">Índice</h2>

        <div className="autor-indice-columns">
          <div className={`autor-indice-left-column ${!showScrollIndicatorLeft ? "no-scroll" : ""}`}>
            <h3 className="autor-indice-subtitulo">Partes del Relato</h3>
            <ul className="autor-indice-parts-list" ref={partsListRef}>
              {autor.parts.map((part, index) => {
                // ✅ AÑADIR: Validación de navegación
                const pageStart = autorPartGlobalPageStarts?.[autor.id]?.[part.title]

                return (
                  <li
                    key={index}
                    onClick={() => {
                      if (pageStart !== undefined) {
                        console.log(`📖 Navegando a: ${part.title} (página ${pageStart})`)
                        irAPagina(pageStart)
                      } else {
                        console.error(`❌ No se encontró página para: ${part.title}`)
                      }
                    }}
                    className={`autor-indice-part-item ${esTextoArabe(part.title) ? "texto-arabe" : ""}`}
                    lang={esTextoArabe(part.title) ? "ar" : undefined}
                    style={{
                      cursor: pageStart !== undefined ? "pointer" : "not-allowed",
                      opacity: pageStart !== undefined ? 1 : 0.5,
                    }}
                  >
                    {`${index + 1}. ${part.title}`}
                    {pageStart === undefined && <span style={{ color: "red", fontSize: "12px" }}> (Error)</span>}
                  </li>
                )
              })}
            </ul>
            {showScrollIndicatorLeft && (
              <div
                className="scroll-indicator clickeable"
                onClick={handleLeftTriangleClick}
                title={leftTriangleDirection === "down" ? "Scroll hacia abajo" : "Scroll hacia arriba"}
              >
                {leftTriangleDirection === "down" ? "▼" : "▲"}
              </div>
            )}
          </div>

          <div className={`autor-indice-right-column ${!showScrollIndicatorRight ? "no-scroll" : ""}`}>
            <div className="author-header">
              {autor.image && (
                <img
                  src={autor.image || "/placeholder.svg?height=120&width=120&query=author profile picture"}
                  alt={`Foto de ${autor.nombre}`}
                  className="author-profile-image"
                />
              )}
              <h3
                className={`autor-indice-subtitulo ${esTextoArabe(autor.nombre) ? "texto-arabe" : ""}`}
                lang={esTextoArabe(autor.nombre) ? "ar" : undefined}
              >
                {autor.nombre}
              </h3>
            </div>

            <div className="autor-indice-description-wrapper" ref={descriptionWrapperRef}>
             <p
  className={`autor-indice-description ${esTextoArabe(autor.description) ? "texto-arabe" : ""}`}
  lang={esTextoArabe(autor.description) ? "ar" : undefined}
>
  {autor.description || "Descripción no disponible"}
</p>
              {showScrollIndicatorRight && (
                <div
                  className="scroll-indicator clickeable"
                  onClick={handleRightTriangleClick}
                  title={rightTriangleDirection === "down" ? "Scroll hacia abajo" : "Scroll hacia arriba"}
                >
                  {rightTriangleDirection === "down" ? "▼" : "▲"}
                </div>
              )}
            </div>

            {autor.social && (
              <div className="contact-button-container">
                <AuthorContactButton authorName={autor.nombre} socialLinks={autor.social} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

