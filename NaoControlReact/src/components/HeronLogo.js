import React from 'react';

/**
 * Garza del Semillero de Robótica Aplicada, dibujada como silueta vectorial.
 *
 * Se dibuja en lugar de usar `public/logo.png` porque esa imagen lleva un
 * degradado oscuro incrustado: sobre la barra se vería como un recuadro gris.
 * Al ser vectorial se mantiene nítida a cualquier tamaño y toma el color del
 * contexto mediante `currentColor`.
 *
 * @param {object} props
 * @param {number} [props.size=30] Lado del icono en píxeles.
 * @returns {JSX.Element} La garza como SVG.
 */
const HeronLogo = ({ size = 30 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    role="img"
    aria-label="Garza del semillero"
  >
    {/* pico */}
    <path d="M8.8 4.6 L2.2 7.7 L9.0 7.2 Z" fill="currentColor" stroke="none" />
    {/* cabeza */}
    <circle cx="11.2" cy="5.6" r="2.8" fill="currentColor" stroke="none" />
    {/* penacho */}
    <path d="M13.7 4.2 C15.5 3.4 16.6 4.4 16.1 5.9" strokeWidth="1.1" />
    {/* cuello */}
    <path d="M11.5 8.2 C10.0 10.6 10.5 13.9 13.2 15.9" strokeWidth="2.4" />
    {/* cuerpo y ala */}
    <path
      d="M13.2 15.7 C13.8 11.7 16.4 9.1 19.6 9.3 C23.4 9.6 27.4 13.5 29.6 20.3
         C24.6 21.1 18.6 21.1 15.2 20.3 C13.8 19.3 13.1 17.7 13.2 15.7 Z"
      fill="currentColor"
      stroke="none"
    />
    {/* patas */}
    <path d="M16.6 20.8 L15.9 26.6 M19.0 20.9 L19.5 26.6" strokeWidth="1.3" />
    {/* pies */}
    <path
      d="M15.9 26.6 L13.3 28.8 M15.9 26.6 L17.3 29.0
         M19.5 26.6 L17.2 29.0 M19.5 26.6 L21.9 29.0"
      strokeWidth="1.1"
    />
  </svg>
);

export default HeronLogo;
