"use client"
import EncabezadoLibro from "../pages/EncabezadoLibro"
import Firma from "../components/Firma"
import "./Relato.css"

export default function PrologoPaginado({ contenido, avanzarPagina, retrocederPagina, onGoToHome, onGoToMainIndex }) {
  return (
    <div className="relato-container">
      <div className="relato-header-top">
        <EncabezadoLibro onGoToHome={onGoToHome} />
        <span className="relato-autor-superior">Prólogo</span>
      </div>

      <h2 className="relato-titulo">Latidos de Esperanza</h2>

      <div className="relato-content">
        {contenido.map((parrafo, index) => (
          <p key={index} className="parrafo-relato">
            {parrafo}
          </p>
        ))}

        {/* Mostrar la firma solo en la última página */}
        {contenido.includes("— Abdellah") && (
          <div style={{ marginTop: "2rem", display: "flex", justifyContent: "center" }}>
            <Firma />
          </div>
        )}
      </div>

      <div className="navegacion-relato">
        <div className="boton-anterior" onClick={retrocederPagina}>
          <span className="triangulo verde">◀</span>
          <span className="texto-ant">Anterior</span>
        </div>

        {onGoToMainIndex && (
          <div className="boton-indice-principal" onClick={onGoToMainIndex} title="Ir al Índice Principal">
            <span className="triangulo rojo">▼</span>
          </div>
        )}

        <div className="boton-siguiente" onClick={avanzarPagina}>
          <span className="texto-sig">Siguiente</span>
          <span className="triangulo rojo">▶</span>
        </div>
      </div>
    </div>
  )
}
