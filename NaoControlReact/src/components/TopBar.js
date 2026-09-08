import React from 'react';
import PropTypes from 'prop-types';
import HeronLogo from './HeronLogo';
import './TopBar.css';

/**
 * Barra superior: identidad del semillero a la izquierda y telemetría a la derecha.
 *
 * Solo presenta datos que recibe por props. No consulta al robot ni envía
 * comandos: la lógica sigue viviendo en NaoController.
 *
 * @param {object} props
 * @param {boolean} props.isConnected Si el WebSocket de control está abierto.
 * @param {string} props.hostIP Dirección del robot a la que apunta la interfaz.
 * @param {number} props.battery Porcentaje de batería informado por el robot.
 * @param {string} props.batteryColor Color con el que se pinta la batería.
 * @returns {JSX.Element} La barra superior.
 */
const TopBar = ({ isConnected, hostIP, battery, batteryColor }) => (
  <header className="topbar">
    <div className="topbar-brand">
      <span className="topbar-logo"><HeronLogo size={30} /></span>
      <span className="topbar-title">NAO CONTROL</span>
      <span className="topbar-team">Semillero de Robótica Aplicada</span>
    </div>

    <div className="topbar-telemetry">
      <div className={`tele tele-conn ${isConnected ? 'is-online' : 'is-offline'}`}>
        <span className="tele-dot" aria-hidden="true" />
        <span>{isConnected ? 'CONECTADO' : 'SIN CONEXIÓN'}</span>
      </div>

      <div className="tele tele-ip">
        <span className="tele-label">IP</span>
        <span className="tele-value">{hostIP || 'N/A'}</span>
      </div>

      <div className="tele tele-battery">
        <span className="tele-gauge" aria-hidden="true">
          <span
            className="tele-gauge-fill"
            style={{ width: `${Math.max(0, Math.min(100, battery))}%`, background: batteryColor }}
          />
        </span>
        <span className="tele-value" style={{ color: batteryColor }}>
          {battery ? `${battery}%` : 'N/A'}
        </span>
      </div>
    </div>
  </header>
);

TopBar.propTypes = {
  isConnected: PropTypes.bool.isRequired,
  hostIP: PropTypes.string,
  battery: PropTypes.number,
  batteryColor: PropTypes.string,
};

export default TopBar;
