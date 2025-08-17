
"use client"
import { useLanguage } from "../contexts/LanguageContext"
import "./LanguageSelector.css"

export default function LanguageSelectorButton() {
  const { language, setLanguage } = useLanguage()

  const languages = [
    { code: "es", img: "/flags/es.png" },
    { code: "en", img: "/flags/en.png" },
    { code: "fr", img: "/flags/fr.png" },
    { code: "ar", img: "/flags/ar.png" },
  ]

  const chooseLanguage = (code) => {
    setLanguage(code)

    if (code === "ar") {
      document.body.style.fontFamily = "'Amiri', serif"
      document.body.dir = "rtl"
    } else {
      document.body.style.fontFamily = "'Cinzel', serif"
      document.body.dir = "ltr"
    }
  }

  return (
    <div className="language-button-wrapper">
      <button className="contact-button-main">
        Language
        <div className="flag-dropdown">
          {languages.map((lang) => (
            <div
              key={lang.code}
              className={`flag-circle ${language === lang.code ? "active" : ""}`}
              onClick={() => chooseLanguage(lang.code)}
            >
              <img src={lang.img} alt={lang.code} />
            </div>
          ))}
        </div>
      </button>
    </div>
  )
}
