"use client"
import React from "react"
import { useLanguage } from "../contexts/LanguageContext"
import EncabezadoLibro from "../pages/EncabezadoLibro"
import "../App.css"
import "./Prologo.css"

export default function Prologo({ contenido = [], avanzarPagina, retrocederPagina, onGoToHome, onGoToMainIndex, esPrimeraPagina }) {
  const { t } = useLanguage() // <-- aquí obtienes la función de traducción

  return (
    <div className="prologo-container">
      <EncabezadoLibro onGoToHome={onGoToHome} />

      <div className="prologo-main-content">
        {esPrimeraPagina && <h2 className="titulo-prologo">{t("prologo")}</h2>}

        <div className="cita">
          {contenido.map((parrafo, index) => (
            <div key={index} className="parrafo-prologo">
              {parrafo}
            </div>
          ))}
        </div>
      </div>

      <div className="navegacion-relato">
        <div className="boton-anterior" onClick={retrocederPagina}>
          <span className="texto-ant">{t("ui.back")}</span>
        </div>
        {onGoToMainIndex && (
          <div className="boton-indice-principal" onClick={onGoToMainIndex} title="Ir al Índice Principal">
            <span className="triangulo rojo">▼</span>
          </div>
        )}
        <div className="boton-siguiente" onClick={avanzarPagina}>
          <span className="texto-sig">{t("siguiente")}</span>
        </div>
      </div>
    </div>
  )
}
