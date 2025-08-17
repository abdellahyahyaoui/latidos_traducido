// ✅ 2. RelatoEspecial.jsx (Nuevo componente personalizado)
import React from "react"
import VideoPlayer from "../pages/VideoPlayer"
import "./Relato.css"

export default function RelatoEspecial({ contenido, pageIndex, avanzarPagina, retrocederPagina, onGoToHome }) {
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768
  const item = contenido[pageIndex]

  if (!item) return null

  return (
    <div className="relato-container">
      <div className="relato-content">
        {item.type === "text" && (
          <>
            {item.title && <h2 className="relato-titulo">{item.title}</h2>}
            <p className="parrafo-relato">{item.text}</p>
          </>
        )}

        {item.type === "video" && (
          <div className="video-page-content">
            <VideoPlayer src={item.src} />
            <p className="video-text" style={{ marginTop: '1rem', fontSize: '1.2rem', fontStyle: 'italic' }}>{item.text}</p>
          </div>
        )}

        {item.type === "dual" && (
          <div className={`dual-language-content ${isMobile ? "mobile-stacked" : "desktop-side-by-side"}`} style={{ width: '100%' }}>
            <p className="arabic-text" dir="rtl" lang="ar" style={{ fontFamily: 'Amiri, serif', fontSize: '1.3rem', color: '#2e7d32', fontWeight: 'bold', flex: 1, textAlign: 'center', lineHeight: '1.6' }}>
              {item.arabic}
            </p>
            <p className="spanish-text" style={{ fontSize: '1.2rem', color: '#333', fontStyle: 'italic', flex: 1, textAlign: 'center', lineHeight: '1.5' }}>
              {item.spanish}
            </p>
          </div>
        )}

        {item.type === "image" && (
          <div className="final-image-content" style={{ textAlign: 'center' }}>
            <img src={item.src} alt={item.alt} className="final-chapter-image" style={{ maxWidth: '100%', height: 'auto', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
          </div>
        )}
      </div>

      <div className="navegacion-relato">
        <div className="boton-anterior" onClick={retrocederPagina}><span className="texto-ant">Anterior</span></div>
        <div className="boton-indice-principal" onClick={onGoToHome}><span className="triangulo rojo">▼</span></div>
        <div className="boton-siguiente" onClick={avanzarPagina}><span className="texto-ant">Siguiente</span></div>
      </div>
    </div>
  )
}


