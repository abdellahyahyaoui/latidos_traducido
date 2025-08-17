"use client"
import "./Corazon.css"
import corazon from "../assets/corazon.png"
// ✅ ELIMINADO: import { useNavigate } from 'react-router-dom';

export default function Corazon({ clickable = false, onGoToHome }) {
  // ✅ Añadido onGoToHome
  // ✅ ELIMINADO: const navigate = useNavigate();

  return (
    <img
      src={corazon || "/placeholder.svg"}
      alt="Corazón con cufia"
      className="corazon-palestina"
      // ✅ Modificado para usar onGoToHome
      onClick={() => clickable && onGoToHome && onGoToHome()}
    />
  )
}
