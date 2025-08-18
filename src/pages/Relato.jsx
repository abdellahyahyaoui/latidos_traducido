"use client"
import EncabezadoLibro from "./EncabezadoLibro"
import "./Relato.css"
import VideoPlayer from "./VideoPlayer"
import "./VideoPlayer.css"
import AudioPlayer from "./AudioPlayer"
import { useLanguage } from "../contexts/LanguageContext"

function esTextoArabe(texto) {
  return typeof texto === "string" && /[\u0600-\u06FF]/.test(texto)
}

// REGLAS DE RESALTADO PARA ESPAÑOL
function applySpanishHighlighting(texto) {
  return (
    texto
      // ✅ Citas entre comillas en rojo
      // .replace(/"([^"]+)"/g, '<span class="cita-roja">"$1"</span>')

      // ✅ Refrán árabe (solo si ya está escrito así en el texto)
      .replace(/—\s*Refrán árabe/g, '<span class="refran-arabe">— Refrán árabe</span>')

      // ✅ Nombres propios en rojo (políticos/entidades)
      .replace(
        /\b(Netanyahu|Sisi|Trump|Macron|Benjamin\s*Netanyahu|Abdel\s*Fattah\s*al-Sisi|Donald\s*Trump|)\b/giu,
        '<span class="nombre-rojo">$1</span>',
      )
      .replace(
        /\b(los\s+Emiratos\s+Árabes|los\s+Emiratos|Estados\s+Unidos|Europa|India|Israel)\b/giu,
        '<span class="nombre-rojo">$1</span>',
      )

      // ✅ Nombres y referencias en verde (primer grupo)
      .replace(
        /\b(Jesús|Moisés|Ibraham|David|Mohamed\s*Bouazizi|Abdellah\s*Yahyaoui\s*Azuz)\b/giu,
        (match) => `<span class="nombre-profeta">${match}</span>`,
      )

      // ✅ Nombres y referencias en verde (árabe y otros)
          .replace(
      /(Waseem\s*Hamid|Mohamed\s*Bouazizi|Abdellah\s*Yahyaoui\s*Azuz|Mohamed|Morsi|Yahya\s*Sinwar|Abu\s*Ubaidah|Al-Aqsa|Mezquita\s*de\s*Al-Aqsa|Gustavo\s*Petro|Marruecos|marroquí|Yemen|Egipto|de\s*los\s*Magribíes|Jalil\s*al-Hayya|مؤمن عليوة|Muhammad Qeriqaa|Anas Al-Sharif|Moamen Aliwa|Mamá|Lana|Muhammad Al-khalidi|محمد الخالدي|Ibrahim dahir|Muhammad Nofal|أنس الشريف|محمد قريقع|إبراهيم ظاهر|محمد نوفل)/giu,
      (match) => `<span class="nombre-profeta">${match}</span>`
      )

      // 👉 Añadido: Mahmoud y Amira en verde (incluye "Mahmoud Al Amoudi")
      .replace(/\b(Mahmoud\s+Al[-\s]*Amoudi|Mahmoud|Amira)\b/giu, '<span class="nombre-profeta">$1</span>')

      // ✅ Palabras clave
      .replace(/\b(Palestina)\b/giu, '<span class="resaltar-palestina">$1</span>')
      .replace(/\b(latido[s]?)\b/giu, '<span class="resaltar-latido">$1</span>')
      .replace(/\b(Gaza)\b/giu, '<span class="resaltar-gaza">$1</span>')

      // ✅ Ejemplos literales religiosos en verde
      .replace(/Allah\s*ﷻ/giu, '<span class="referencia-allah">$&</span>')
      .replace(/Muḥammad\s*ﷺ/giu, '<span class="referencia-profeta">$&</span>')
      .replace(/Subḥānahu\s+wa\s+Taʿālā/giu, '<span class="referencia-allah">$&</span>')
      .replace(/Profeta\s*ﷺ/giu, '<span class="referencia-profeta">$&</span>')
      .replace(/—\s*Abdellah\s*Yahyaoui\s*Azuz\s*—/giu, '<span class="cita-autor">$&</span>')
      .replace(/\[QURAN\](.*?)\[\/QURAN\]/giu, '<span class="cita-coran">$1</span>')

      // ✅ Frases árabes específicas en verde
      .replace(/إنا لله وإنا إليه راجعون/giu, '<span class="nombre-profeta">إنا لله وإنا إليه راجعون</span>')
      .replace(/رحمكم الله/giu, '<span class="nombre-profeta">رحمكم الله</span>')
  )
}

// REGLAS DE RESALTADO PARA ÁRABE
function applyArabicHighlighting(texto) {
  return (
    texto
      // // ✅ Citas entre comillas en rojo
      .replace(/"([^"]+)"/g, '<span class="cita-roja">"$1"</span>')
      .replace(/«([^»]+)»/g, '<span class="cita-roja">«$1»</span>')

      // ✅ Nombres propios políticos/entidades en rojo
      .replace(
        /\b(نتنياهو|السيسي|ترامب|ماكرون|بنيامين نتنياهو|عبد الفتاح السيسي|دونالد ترامب|محمد مرسي|يحيى السنوار)\b/giu,
        '<span class="nombre-rojo">$1</span>',
      )
      .replace(
        /\b(الإمارات العربية المتحدة|الإمارات|الولايات المتحدة|أوروبا|الهند|إسرائيل)\b/giu,
        '<span class="nombre-rojo">$1</span>',
      )

      // ✅ Nombres y referencias religiosas en verde
      .replace(
        /\b(عيسى|موسى|إبراهيم|داود|محمد بوعزيزي|عبد الله يحيوي عزوز|لله|محمود|أميرة)\b/giu,
        '<span class="nombre-profeta">$1</span>',
      )

      // ✅ Palabras clave
      .replace(/\b(فلسطين)\b/giu, '<span class="resaltar-palestina">$1</span>')
      .replace(/\b(نبضة|نبضات)\b/giu, '<span class="resaltar-latido">$1</span>')
      .replace(/\b(غزة)\b/giu, '<span class="resaltar-gaza">$1</span>')

      // ✅ Referencias religiosas específicas
      .replace(/الله\s*ﷻ/giu, '<span class="referencia-allah">$&</span>')
      .replace(/محمد\s*ﷺ/giu, '<span class="referencia-profeta">$&</span>')
      .replace(/سبحانه وتعالى/giu, '<span class="referencia-allah">$&</span>')
      .replace(/النبي\s*ﷺ/giu, '<span class="referencia-profeta">$&</span>')
      .replace(/إنا لله وإنا إليه راجعون/giu, '<span class="nombre-profeta">إنا لله وإنا إليه راجعون</span>')
      .replace(/رحمه الله/giu, '<span class="nombre-profeta">رحمه الله</span>')
      .replace(/—\s*عبد الله يحياوي عزوز\s*—/giu, '<span class="cita-autor">$&</span>')
  )
}

// REGLAS DE RESALTADO PARA INGLÉS
function applyEnglishHighlighting(texto) {
  return (
    texto
      // ✅ Citas entre comillas en rojo
      .replace(/"([^"]+)"/g, '<span class="cita-roja">"$1"</span>')

      // ✅ Refrán árabe
      .replace(/—\s*Arabic\s+proverb/gi, '<span class="refran-arabe">— Arabic proverb</span>')

      // ✅ Nombres propios políticos/entidades en rojo
      .replace(
        /\b(Netanyahu|Sisi|Trump|Pedro\s*Sánchez|Macron|Rufián|Abu\s*Ubaidah|Gustavo\s*Petro|Waseem\s*Hamid|Benjamin\s*Netanyahu|Abdel\s*Fattah\s*al-Sisi|Donald\s*Trump|Mohamed\s*Morsi|Yahya\s*Sinwar)\b/giu,
        '<span class="nombre-rojo">$1</span>',
      )
      .replace(
        /\b(United\s+Arab\s+Emirates|UAE|United\s+States|Europe|India|Israel)\b/giu,
        '<span class="nombre-rojo">$1</span>',
      )

      // ✅ Nombres y referencias religiosas en verde
      .replace(
        /\b(Jesus|Moses|Ibraham|David|Mohamed\s*Bouazizi|Abdellah\s*Yahyaoui\s*Azuz|Mahmoud|Amira)\b/giu,
        '<span class="nombre-profeta">$1</span>',
      )

      // ✅ Palabras clave
      .replace(/\b(Palestine)\b/giu, '<span class="resaltar-palestina">$1</span>')
      .replace(/\b(beat[s]?|heartbeat[s]?)\b/giu, '<span class="resaltar-latido">$1</span>')
      .replace(/\b(Gaza)\b/giu, '<span class="resaltar-gaza">$1</span>')

      // ✅ Referencias religiosas específicas
      .replace(/Allah\s*ﷻ/giu, '<span class="referencia-allah">$&</span>')
      .replace(/Prophet\s*Muhammad\s*ﷺ/giu, '<span class="referencia-profeta">$&</span>')
      .replace(/Prophet\s*ﷺ/giu, '<span class="referencia-profeta">$&</span>')
      .replace(/—\s*Abdellah\s*Yahyaoui\s*Azuz\s*—/giu, '<span class="cita-autor">$&</span>')
      .replace(/\[QURAN\](.*?)\[\/QURAN\]/giu, '<span class="cita-coran">$1</span>')
  )
}

// REGLAS DE RESALTADO PARA FRANCÉS
function applyFrenchHighlighting(texto) {
  return (
    texto
      // ✅ Citas entre comillas en rojo
      .replace(/"([^"]+)"/g, '<span class="cita-roja">"$1"</span>')
      .replace(/«([^»]+)»/g, '<span class="cita-roja">«$1»</span>')

      // ✅ Refrán árabe
      .replace(/—\s*Proverbe\s+arabe/gi, '<span class="refran-arabe">— Proverbe arabe</span>')

      // ✅ Nombres propios políticos/entidades en rojo
      .replace(
        /\b(Netanyahu|Sissi|Trump|Pedro\s*Sánchez|Macron|Rufián|Abu\s*Ubaidah|Gustavo\s*Petro|Waseem\s*Hamid|Benjamin\s*Netanyahu|Abdel\s*Fattah\s*al-Sissi|Donald\s*Trump|Mohamed\s*Morsi|Yahya\s*Sinwar)\b/giu,
        '<span class="nombre-rojo">$1</span>',
      )
      .replace(
        /\b(Émirats\s+arabes\s+unis|Émirats|États-Unis|Europe|Inde|Israël)\b/giu,
        '<span class="nombre-rojo">$1</span>',
      )

      // ✅ Nombres y referencias religiosas en verde
      .replace(
        /\b(Jésus|Moïse|Ibraham|David|Mohamed\s*Bouazizi|Abdellah\s*Yahyaoui\s*Azuz|Mahmoud|Amira)\b/giu,
        '<span class="nombre-profeta">$1</span>',
      )

      // ✅ Palabras clave
      .replace(/\b(Palestine)\b/giu, '<span class="resaltar-palestina">$1</span>')
      .replace(/\b(battement[s]?)\b/giu, '<span class="resaltar-latido">$1</span>')
      .replace(/\b(Gaza)\b/giu, '<span class="resaltar-gaza">$1</span>')

      // ✅ Referencias religiosas específicas
      .replace(/Allah\s*ﷻ/giu, '<span class="referencia-allah">$&</span>')
      .replace(/Prophète\s*Muhammad\s*ﷺ/giu, '<span class="referencia-profeta">$&</span>')
      .replace(/Prophète\s*ﷺ/giu, '<span class="referencia-profeta">$&</span>')
      .replace(/—\s*Abdellah\s*Yahyaoui\s*Azuz\s*—/giu, '<span class="cita-autor">$&</span>')
      .replace(/\[CORAN\](.*?)\[\/CORAN\]/giu, '<span class="cita-coran">$1</span>')
  )
}

export default function Relato(props) {
  const {
    autor,
     autorId,
    titulo,
    contenido,
    avanzarPagina,
    retrocederPagina,
    onGoToHome,
    onGoToAuthorIndex,
    onGoToMainIndex,
    esPrimeraPagina,
    sectionTitle,
    isFirstPageOfSection,
  } = props
  const { t, language } = useLanguage()

  function procesarTexto(texto) {
    if (typeof texto !== "string") return ""

    // Apply highlighting based on current language
    switch (language) {
      case "ar":
        return applyArabicHighlighting(texto)
      case "en":
        return applyEnglishHighlighting(texto)
      case "fr":
        return applyFrenchHighlighting(texto)
      default:
        return applySpanishHighlighting(texto)
    }
  }

  // 👇 APLANA si viene [[...]]
  const contenidoPlano = Array.isArray(contenido) && Array.isArray(contenido[0]) ? contenido.flat() : contenido

  const esEspecial = contenidoPlano?.[0]?.tipo !== undefined

  const renderEspecial = (page) => {
    if (!page) return null

    switch (page.tipo) {
      case "texto":
        return (page.content || []).map((parrafo, i) => (
          <div
            key={i}
            className={`parrafo-relato ${esTextoArabe(parrafo) ? "texto-arabe" : ""}`}
            dangerouslySetInnerHTML={{ __html: procesarTexto(parrafo) }}
          />
        ))

      case "videoTexto": {
        const paragraphs = Array.isArray(page.texto) ? page.texto : [page.texto].filter(Boolean)

        // Si NO hay vídeo, renderiza solo texto a ancho completo
        if (!page.video) {
          return paragraphs.map((parrafo, i) => (
            <div
              key={i}
              className={"parrafo-relato " + (esTextoArabe(parrafo) ? "texto-arabe" : "")}
              dangerouslySetInnerHTML={{ __html: procesarTexto(parrafo) }}
            />
          ))
        }

        // Si hay vídeo, layout a dos columnas con todos los párrafos del chunk
        return (
          <div className="especial-video-texto">
            <div className="video-col especial-media-box">
              <VideoPlayer src={page.video} title="" />
            </div>
            <div className="texto-col">
              {paragraphs.map((parrafo, i) => (
                <div
                  key={i}
                  className={"parrafo-relato " + (esTextoArabe(parrafo) ? "texto-arabe" : "")}
                  dangerouslySetInnerHTML={{ __html: procesarTexto(parrafo) }}
                />
              ))}
            </div>
          </div>
        )
      }

      case "dobleTexto": {
        const arrArabe = Array.isArray(page.arabe) ? page.arabe : [page.arabe].filter(Boolean)
        const arrEspanol = Array.isArray(page.espanol) ? page.espanol : [page.espanol].filter(Boolean)
        const len = Math.max(arrArabe.length, arrEspanol.length)
        const safeArabe = Array.from({ length: len }, (_, i) => arrArabe[i] || "")
        const safeEspanol = Array.from({ length: len }, (_, i) => arrEspanol[i] || "")

        return (
          <div className="especial-doble-texto">
            <div className="col-arabe texto-arabe">
              {safeArabe.map((txt, i) => (
                <div
                  key={i}
                  className="parrafo-relato texto-arabe"
                  dangerouslySetInnerHTML={{ __html: procesarTexto(txt) }}
                />
              ))}
            </div>
            <div className="col-espanol">
              {safeEspanol.map((txt, i) => (
                <div key={i} className="parrafo-relato" dangerouslySetInnerHTML={{ __html: procesarTexto(txt) }} />
              ))}
            </div>
          </div>
        )
      }

      case "imagen":
        return (
          <div>
            <div className="cuadro-imagen-final">
              <img
                src={page.src || "/placeholder.svg?height=600&width=800&query=imagen%20de%20capitulo"}
                alt={page.alt || "imagen"}
              />
            </div>
            <div className="anas">
              {page.caption &&
                (Array.isArray(page.caption) ? (
                  <div className="caption-texto-arabe">
                    {page.caption.map((line, index) => (
                      <p key={index} dangerouslySetInnerHTML={{ __html: procesarTexto(line) }} />
                    ))}
                  </div>
                ) : (
                  <p
                    className="caption-texto-arabe"
                    dangerouslySetInnerHTML={{ __html: procesarTexto(page.caption) }}
                  />
                ))}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="relato-container">
      <div className="relato-header-top">
        <EncabezadoLibro onGoToHome={onGoToHome} />
        <span className="relato-autor-superior" onClick={onGoToAuthorIndex}>
          {autor}
        </span>
      </div>

      {sectionTitle && isFirstPageOfSection && (
        <h2 className={`relato-titulo ${esTextoArabe(sectionTitle) ? "texto-arabe" : ""}`}>{sectionTitle}</h2>
      )}
      {!sectionTitle && esPrimeraPagina && (
        <h2 className={`relato-titulo ${esTextoArabe(titulo) ? "texto-arabe" : ""}`}>{titulo}</h2>
      )}

      <div className="relato-content">
        {esEspecial
          ? renderEspecial(contenidoPlano[0])
          : (contenidoPlano || []).map((parrafo, i) => (
              <div
                key={i}
                className={`parrafo-relato ${esTextoArabe(parrafo) ? "texto-arabe" : ""}`}
                dangerouslySetInnerHTML={{ __html: procesarTexto(parrafo) }}
              />
            ))}

        {/* Reproductores de audio y video integrados */}
       {autorId === 2 && sectionTitle === " Jatofin ! "  && (
  <AudioPlayer title={t("roadToGaza")} src="/audio/Voice-to-gaza.mp3" />
)}
   {autorId === 2 && sectionTitle === "خاطوفين!"  && (
  <AudioPlayer title={t("roadToGaza")} src="/audio/Voice-to-gaza.mp3" />
)}
        
        {autorId === 8 &&
 isFirstPageOfSection &&
 (
   sectionTitle === "Oh Diyaa… cuentale al Mensajero de Allah" ||
   sectionTitle === "يا ضياء... أخبر رسول الله." ||
   sectionTitle === "Ô Diyaa… raconte au Messager d'Allah" ||
   sectionTitle === "Oh Diyaa… tell the Messenger of Allah"
 ) && (
   <AudioPlayer title={t("introAbdulrazzaq")} src="/audio/abdulrazzaq.mp3" />
 )}

        {autor === "Khaled Abu Huwaishel" &&
          isFirstPageOfSection &&
          (sectionTitle.includes("Ayuda Española") || sectionTitle === "مساعدات إسبانية: عارٌ يسقط على غزة") && (
            <VideoPlayer title="" src="/videos/ayuda-espana.mp4" />
          )}
      </div>

      <div className="navegacion-relato">
        <div className="boton-anterior" onClick={retrocederPagina}>
          <span className="texto-ant">{t("ui.back")}</span>
        </div>
        <div className="boton-indice-principal" onClick={onGoToMainIndex} title={t("irAlIndicePrincipal")}>
          <span className="triangulo rojo">▼</span>
        </div>
        <div className="boton-siguiente" onClick={avanzarPagina}>
          <span className="texto-sig">{t("siguiente")}</span>
        </div>
      </div>
    </div>
  )
}
