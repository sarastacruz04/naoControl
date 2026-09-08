import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { naoHost } from '../services/naoHost';
import './CameraStage.css';

/**
 * Visor de la cámara del robot, siempre presente en el centro de la pantalla.
 *
 * Consume el mismo flujo MJPEG que el menú de cámara: `http://<host>:8080/video.mjpeg`.
 * No envía comandos al robot; solo muestra la imagen que este ya emite.
 *
 * @param {object} props
 * @param {string} props.currentMode Modo de control activo, para rotularlo sobre la imagen.
 * @returns {JSX.Element} El visor con su marco y sus indicadores.
 */
const CameraStage = ({ currentMode }) => {
  const [streamUrl, setStreamUrl] = useState('');
  const [hasImage, setHasImage] = useState(false);

  useEffect(() => {
    setStreamUrl(`http://${naoHost()}:8080/video.mjpeg`);
    setHasImage(false);
  }, []);

  const MODE_LABELS = {
    walk: 'CAMINATA',
    larm: 'BRAZO IZQUIERDO',
    rarm: 'BRAZO DERECHO',
    head: 'CABEZA',
  };

  return (
    <section className="camera-stage">
      <div className="camera-frame">
        {streamUrl && (
          <img
            className="camera-image"
            src={streamUrl}
            alt="Vista de la cámara del robot"
            onLoad={() => setHasImage(true)}
            onError={() => setHasImage(false)}
          />
        )}

        {!hasImage && (
          <div className="camera-placeholder">
            <svg width="72" height="72" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M2.5 6.8h3.2l1.4-2h5.8l1.4 2h3.2v8.7h-15z" />
              <circle cx="10" cy="10.6" r="2.9" />
            </svg>
            <p>Sin imagen de la cámara</p>
          </div>
        )}

        {/* Esquinas del visor */}
        <span className="camera-corner tl" aria-hidden="true" />
        <span className="camera-corner tr" aria-hidden="true" />
        <span className="camera-corner bl" aria-hidden="true" />
        <span className="camera-corner br" aria-hidden="true" />

        <div className={`camera-badge ${hasImage ? 'is-live' : 'is-down'}`}>
          <span className="camera-badge-dot" aria-hidden="true" />
          <span>{hasImage ? 'EN VIVO' : 'SIN SEÑAL'}</span>
        </div>

        <div className="camera-tag">CÁMARA SUPERIOR</div>

        <div className="camera-footer">
          <span className="camera-footer-key">MODO</span>
          <span>{MODE_LABELS[currentMode] || currentMode}</span>
        </div>
      </div>
    </section>
  );
};

CameraStage.propTypes = {
  currentMode: PropTypes.string.isRequired,
};

export default CameraStage;
