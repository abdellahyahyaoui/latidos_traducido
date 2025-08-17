"use client"
import { useEffect } from "react"
import { Send, MessageSquare, Mail, Heart, X } from "lucide-react" // Iconos de Lucide React
import "./ContactModal.css"

export default function ContactModal({ onClose }) {
  // Cerrar modal con tecla Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    document.addEventListener("keydown", handleEscape)
    document.body.style.overflow = "hidden" // Evita el scroll del body cuando el modal está abierto

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset" // Restaura el scroll del body al cerrar
    }
  }, [onClose])

  const handleLinkClick = (url) => {
    window.open(url, "_blank")
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X className="icon-modal" /> {/* Icono de cierre de Lucide React */}
        </button>

        <div className="modal-header">
          <h2 className="modal-title">SÍGUENOS</h2>
        </div>

        <div className="modal-links-wrapper">
          <div className="social-icons-grid">
            {/* Telegram */}
            <div
              className="social-icon-wrapper telegram"
              onClick={() => handleLinkClick("https://t.me/latidosdeesperanza")}
            >
              <Send className="icon-modal" /> {/* Icono de Lucide */}
              <span className="icon-label">Telegram</span>
            </div>

            {/* WhatsApp */}
            {/* <div
              className="social-icon-wrapper whatsapp-business"
              onClick={() => handleLinkClick("https://wa.me/34611582216")}
            > */}
              {/* SVG inline para WhatsApp */}
              {/* <svg className="icon-modal" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="white">
                <path d="M380.9 97.1C339.3 55.5 283.9 32 224.3 32c-105.3 0-191 85.7-191 191 0 33.6 8.8 66.4 25.5 95.3L32 480l164.8-25.5c27.6 15 58.7 22.9 91.4 22.9h.1c105.3 0 191-85.7 191-191 0-59.6-23.5-115-64.4-157.3zm-156.6 342c-27 0-53.4-7.2-76.5-20.8l-5.5-3.3-97.9 15.1 15-95.4-3.6-5.8c-15.5-25.1-23.7-54.1-23.7-83.8 0-88.3 71.9-160.2 160.2-160.2 42.8 0 83 16.6 113.2 46.8 30.2 30.2 46.8 70.4 46.8 113.2 0 88.3-71.9 160.2-160.2 160.2zm91.5-121.5c-5-2.5-29.5-14.6-34-16.2-4.6-1.7-7.9-2.5-11.3 2.5-3.3 5-13 16.2-16 19.5-3 3.3-5.8 3.7-10.8 1.2-5-2.5-21.1-7.8-40.2-24.9-14.9-13.3-24.9-29.7-27.8-34.7-3-5-0.3-7.7 2.2-10.2 2.3-2.3 5-6 7.5-9 2.5-3 3.3-5 5-8.3 1.7-3.3 0.8-6.2-0.4-8.7-1.2-2.5-11.3-27.2-15.5-37.3-4.1-9.9-8.2-8.5-11.3-8.7-2.9-0.2-6.2-0.2-9.5-0.2s-8.7 1.2-13.2 6.2c-4.6 5-17.5 17.1-17.5 41.8s17.9 48.5 20.4 51.8c2.5 3.3 35.2 53.7 85.3 75.3 11.9 5.1 21.2 8.1 28.4 10.4 11.9 3.8 22.8 3.3 31.4 2 9.6-1.4 29.5-12.1 33.7-23.9 4.2-11.8 4.2-21.9 2.9-23.9-1.3-2.1-4.6-3.3-9.6-5.8z" />
              </svg>
              <span className="icon-label">WhatsApp</span>
            </div> */}

            {/* Instagram */}
            <div
              className="social-icon-wrapper instagram-direct"
              onClick={() => handleLinkClick("https://www.instagram.com/ismael_guzman2025/?igsh=MWhwczgwMGg2Ymh2NQ%3D%3D#")}
            >
              <MessageSquare className="icon-modal" /> {/* Icono de Lucide */}
              <span className="icon-label">Instagram</span>
            </div>

            {/* TikTok */}
            <div
              className="social-icon-wrapper tiktok"
              onClick={() => handleLinkClick("https://www.tiktok.com/@adam_azuz?_t=ZN-8yXjoQdRX9C&_r=1")}
            >
              {/* SVG inline para TikTok */}
              <svg className="icon-modal" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="white">
                <path fill="#e9f0f0ff" d="M20 4h6v30a10 10 0 1 1-6-9z" />
                <path fill="#ffffffff" d="M26 4h6v3a7 7 0 0 0 7 7v6a13 13 0 0 1-13-13z" />
                <path fill="#fff" d="M20 4h6v30a10 10 0 1 1-6-9z" />
              </svg>
              <span className="icon-label">TikTok</span>
            </div>

            {/* Email */}
            <div
              className="social-icon-wrapper email"
              onClick={() => handleLinkClick("mailto:abdellahyahyaouiazuz@gmail.com")}
            >
              <Mail className="icon-modal" /> {/* Icono de Lucide */}
              <span className="icon-label">Contacto</span>
            </div>
          </div>

          {/* Botón Donar - Separado y centrado debajo de la cuadrícula */}
          {/* <div className="donate-button-modal" onClick={() => handleLinkClick("https://paypal.me/abdellahyahyaoui")}>
            <Heart className="donate-icon" /> 
            Donar
          </div> */}
        </div>

        <div className="modal-footer">
          <p className="copyright-text">© 2025 Latidos de Esperanza. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  )
}
