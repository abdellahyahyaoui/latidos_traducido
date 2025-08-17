import "./EncabezadoLibro.css"
import Corazon from "../components/Corazon"
import { useLanguage } from "../contexts/LanguageContext"

export default function EncabezadoLibro({ onGoToHome }) {
   const { t } = useLanguage()

  return (
    <div className="encabezado-libro">
      {/* ✅ Pasado onGoToHome al Corazon */}
      <Corazon clickable onGoToHome={onGoToHome} />
     
<h1>
  <span className="rojo">{t("tituloPalabra1")}</span>{" "}
  <span className="negro">{t("tituloPalabra2")}</span>{" "}
  <span className="verde">{t("tituloPalabra3")}</span>
</h1>  
    </div>
  )
}
