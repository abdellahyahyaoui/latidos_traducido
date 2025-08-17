"use client"
import { useEffect } from "react"
import { Mail, Heart, X, Facebook, Instagram, Send, MessageSquare } from "lucide-react" // Iconos de Lucide React
import "../components/ContactModal.css" // Reutilizamos el CSS existente para el modal

export default function AuthorContactModal({ onClose, authorName, socialLinks }) {
  // Efecto para cerrar el modal con la tecla Escape y controlar el scroll del body
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

  // Función para abrir enlaces en una nueva pestaña
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
          <h2 className="modal-title">{authorName}</h2> {/* Título dinámico */}
        </div>

        <div className="modal-links-wrapper">
          <div className="social-icons-grid">
            {socialLinks.facebook && (
              <div className="social-icon-wrapper facebook" onClick={() => handleLinkClick(socialLinks.facebook)}>
                <Facebook className="icon-modal" />
                <span className="icon-label">Facebook</span>
              </div>
            )}

            {socialLinks.instagram && (
              <div
                className="social-icon-wrapper instagram-direct"
                onClick={() => handleLinkClick(socialLinks.instagram)}
              >
                <Instagram className="icon-modal" />
                <span className="icon-label">Instagram</span>
              </div>
            )}

            {socialLinks.tiktok && (
              <div className="social-icon-wrapper tiktok" onClick={() => handleLinkClick(socialLinks.tiktok)}>
                {/* SVG inline para TikTok, ya que Lucide no tiene un icono exacto */}
                <svg className="icon-modal" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="white">
                  <path fill="#e9f0f0ff" d="M20 4h6v30a10 10 0 1 1-6-9z" />
                  <path fill="#ffffffff" d="M26 4h6v3a7 7 0 0 0 7 7v6a13 13 0 0 1-13-13z" />
                  <path fill="#fff" d="M20 4h6v30a10 10 0 1 1-6-9z" />
                </svg>
                <span className="icon-label">TikTok</span>
              </div>
            )}

            {socialLinks.email && (
              <div className="social-icon-wrapper email" onClick={() => handleLinkClick(`mailto:${socialLinks.email}`)}>
                <Mail className="icon-modal" />
                <span className="icon-label">Correo</span>
              </div>
            )}
            {/* Puedes añadir más iconos si los datos sociales los incluyen, por ejemplo, Telegram o WhatsApp */}
            {socialLinks.telegram && (
              <div className="social-icon-wrapper telegram" onClick={() => handleLinkClick(socialLinks.telegram)}>
                <Send className="icon-modal" />
                <span className="icon-label">Telegram</span>
              </div>
            )}
            {socialLinks.whatsapp && (
              <div
                className="social-icon-wrapper whatsapp-business"
                onClick={() => handleLinkClick(socialLinks.whatsapp)}
              >
                <MessageSquare className="icon-modal" />
                <span className="icon-label">WhatsApp</span>
              </div>
            )}
          </div>

          {socialLinks.donation && (
            <div className="donate-button-modal" onClick={() => handleLinkClick(socialLinks.donation)}>
              <Heart className="donate-icon" />
              Donar
            </div>
          )}
        </div>

        <div className="modal-footer">
          <p className="copyright-text">© 2025 Latidos de Esperanza. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  )
}
