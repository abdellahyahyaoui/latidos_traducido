"use client"
import { useState } from "react"
import AuthorContactModal from "./AuthorContactModal" // Ruta relativa
import "../components/ContactButton.css" // Reutilizamos el CSS existente para el botón

export default function AuthorContactButton({ authorName, socialLinks }) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  return (
    <>
      <button className="contact-button-main" onClick={openModal} title={`Contactar a ${authorName}`}>
        Contactar
      </button>
      {isModalOpen && <AuthorContactModal onClose={closeModal} authorName={authorName} socialLinks={socialLinks} />}
    </>
  )
}
