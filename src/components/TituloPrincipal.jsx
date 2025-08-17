"use client"
import React from "react"
import { useLanguage } from "../contexts/LanguageContext"
import "./TituloPrincipal.css"

export default function TituloPrincipal() {
  const { t } = useLanguage() // obtenemos la función de traducción

  // Dividimos el título en partes para mantener los colores
  const titulo = t("titulo") // clave del título en translations
  const [parte1, parte2, parte3] = titulo.split(" ") // simple split por espacios

  return (
    <h1 className="titulo">
      <span className="rojo">{parte1}</span>{" "}
      <span className="negro">{parte2}</span>{" "}
      <span className="verde">{parte3}</span>
    </h1>
  )
}
