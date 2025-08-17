"use client"
import "./ContactButton.css"

export default function ContactButton({ openContactModal }) {
  return (
    <button className="contact-button-main" onClick={openContactModal} title="Contacto">
      Contacto
    </button>
  )
}
