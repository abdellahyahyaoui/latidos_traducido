import React, { useEffect, useRef } from 'react';
import { PageFlip } from 'page-flip';
import 'page-flip/dist/page-flip.scss';
import './LibroRealista.css';

export default function LibroRealista() {
  const bookRef = useRef();
  const flipRef = useRef();

  useEffect(() => {
    if (!bookRef.current) return;

    flipRef.current = new PageFlip(bookRef.current, {
      width: window.innerWidth,
      height: window.innerHeight,
      size: 'stretch',
      showCover: true,
      useMouseEvents: true, // lo necesitas para que se vea la esquina doblarse
      mobileScrollSupport: false,
      maxShadowOpacity: 0.5,
      startZIndex: 0,
    });

    flipRef.current.loadFromHTML(document.querySelectorAll('.page'));

    return () => flipRef.current.destroy();
  }, []);

  return (
    <div className="contenedor-libro-realista">
      <div ref={bookRef} className="book-flip-container"></div>

      {/* Páginas deben ir aquí también */}
      <div className="page" data-density="hard"><div className="page-content">Portada</div></div>
      <div className="page"><div className="page-content">Preámbulo</div></div>
      <div className="page"><div className="page-content">Índice</div></div>
      <div className="page"><div className="page-content">Relato</div></div>
    </div>
  );
}
