import React, { useState, useEffect } from 'react';
import { naoHost } from '../services/naoHost';
import './CameraMenu.css';

/**
 * Panel de información de la cámara.
 *
 * La imagen en sí vive ahora en el centro de la pantalla (CameraStage), así que
 * este panel no la duplica: informa de a dónde apunta el flujo y si está
 * llegando. Solo muestra datos reales; no hay controles que el robot no acepte.
 */
const CameraMenu = ({ isOpen, onClose, cameraUrl, isEmbedded = false }) => {
  const [currentCameraUrl, setCurrentCameraUrl] = useState('');
  const [streamOk, setStreamOk] = useState(null);

  useEffect(() => {
    setCurrentCameraUrl(cameraUrl || `http://${naoHost()}:8080/video.mjpeg`);
    setStreamOk(null);
  }, [cameraUrl]);

  // Se comprueba con una imagen suelta para no abrir un segundo flujo continuo.
  useEffect(() => {
    if (!currentCameraUrl) return undefined;

    const probe = new Image();
    let active = true;
    probe.onload = () => { if (active) setStreamOk(true); };
    probe.onerror = () => { if (active) setStreamOk(false); };
    probe.src = currentCameraUrl;

    return () => {
      active = false;
      probe.onload = null;
      probe.onerror = null;
      probe.src = '';
    };
  }, [currentCameraUrl]);

  if (!isOpen) return null;

  const containerClass = isEmbedded ? 'menu embedded' : 'menu active';

  let host = '—';
  try {
    host = new URL(currentCameraUrl).hostname;
  } catch (_error) { /* la URL aún no está lista */ }

  const STATE_TEXT = { true: 'Recibiendo imagen', false: 'Sin señal', null: 'Comprobando…' };
  const STATE_CLASS = { true: 'is-ok', false: 'is-down', null: 'is-wait' };

  return (
    <div className={containerClass}>
      <header>
        <h3>Cámara</h3>
        {!isEmbedded && <button className="close-btn" onClick={onClose}>✕</button>}
      </header>

      <dl className="camera-facts">
        <dt>Estado</dt>
        <dd className={`camera-state ${STATE_CLASS[String(streamOk)]}`}>
          <span className="camera-state-dot" aria-hidden="true" />
          {STATE_TEXT[String(streamOk)]}
        </dd>

        <dt>Robot</dt>
        <dd>{host}</dd>

        <dt>Puerto</dt>
        <dd>8080</dd>

        <dt>Formato</dt>
        <dd>MJPEG</dd>
      </dl>

      <p className="camera-note">
        La imagen se muestra en el centro de la pantalla, siempre visible.
      </p>
    </div>
  );
};

export default CameraMenu;
