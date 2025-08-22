"use client"
import TituloPrincipal from "../components/TituloPrincipal"
import Firma from "../components/Firma"
import ContactButton from "../components/ContactButton"
import LanguageSelector from "../components/LanguageSelector"
import corazon from "../assets/corazon.png"
import { useLanguage } from "../contexts/LanguageContext"

export default function Portada({ avanzarPagina, onGoToHome, openContactModal }) {
  const { t } = useLanguage() // 🔹 obtenemos la función de traducción

  return (
    <div className="container">
      {/* Selector de idioma arriba */}
      <LanguageSelector />

      <div className="portada">
        <TituloPrincipal />
        <img src={corazon || "/placeholder.svg"} alt="Corazón central" className="corazon" />
        <p className="autor">
          {t("dirigidoPor")} <Firma /> {/* 🔹 traducimos "Dirigido por" */}
        </p>
        <ContactButton openContactModal={openContactModal} />
      </div>

      <div className="navegacion-relato" style={{ justifyContent: "flex-end" , marginTop: "-20px"}}>
        <div className="boton-siguiente" onClick={avanzarPagina}>
          <span className="texto-sig">{t("siguiente")}</span> {/* 🔹 traducimos "Siguiente" */}
        </div>
      </div>
    </div>
  )
}
