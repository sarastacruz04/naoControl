/**
 * Resuelve el host del NAO al que apunta la interfaz.
 *
 * En produccion la pagina la sirve el propio robot en el puerto 3000, asi que
 * el host correcto es el de la URL abierta en el navegador. Ese sigue siendo
 * el comportamiento por defecto y no cambia nada de lo desplegado.
 *
 * Durante el desarrollo la pagina la sirve `npm start` desde el PC, donde el
 * host es `localhost` y no el robot. Definir REACT_APP_NAO_HOST permite
 * apuntar la interfaz a un NAO real sin desplegar nada en el:
 *
 *   REACT_APP_NAO_HOST=192.168.1.50 npm start
 *
 * Create React App sustituye las variables REACT_APP_* en tiempo de compilacion,
 * de modo que un build normal, sin la variable, queda exactamente igual que antes.
 *
 * @returns {string} IP o nombre de host del robot.
 */
export const naoHost = () => (
  process.env.REACT_APP_NAO_HOST || window.location.hostname
);

export default naoHost;
