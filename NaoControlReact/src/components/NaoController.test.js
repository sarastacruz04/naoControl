import {
  isAutonomousLifeActive,
  joystickToArm,
  joystickToHead,
  joystickToWalk
} from './NaoController';

/**
 * Marco de NAOqi para ALMotion.moveToward(x, y, theta):
 *   vx > 0  ->  adelante
 *   vy > 0  ->  IZQUIERDA
 *   wz > 0  ->  giro antihorario (izquierda)
 *
 * Marco del joystick (useJoystick.js):
 *   joyX > 0  ->  derecha en pantalla
 *   joyY > 0  ->  arriba en pantalla (adelante)
 */

test('el joystick hacia adelante manda al NAO hacia adelante', () => {
  expect(joystickToWalk(0, 1).vx).toBeGreaterThan(0);
});

test('el joystick hacia atras manda al NAO hacia atras', () => {
  expect(joystickToWalk(0, -1).vx).toBeLessThan(0);
});

test('el joystick a la derecha manda al NAO a la derecha', () => {
  // En el marco de NAOqi, la derecha es vy negativo.
  expect(joystickToWalk(1, 0).vy).toBeLessThan(0);
});

test('el joystick a la izquierda manda al NAO a la izquierda', () => {
  // En el marco de NAOqi, la izquierda es vy positivo.
  expect(joystickToWalk(-1, 0).vy).toBeGreaterThan(0);
});

test('el eje lateral no altera el eje frontal ni viceversa', () => {
  expect(joystickToWalk(1, 0).vx).toBe(0);
  expect(joystickToWalk(0, 1).vy).toBe(0);
});

test('una diagonal conserva ambos ejes con su signo correcto', () => {
  // Arriba y a la derecha: el NAO avanza y se desplaza a su derecha.
  const diagonal = joystickToWalk(0.6, 0.8);

  expect(diagonal.vx).toBeCloseTo(0.8);
  expect(diagonal.vy).toBeCloseTo(-0.6);
});

test('el joystick centrado deja el robot quieto', () => {
  expect(joystickToWalk(0, 0)).toEqual({ vx: 0, vy: 0, wz: 0 });
});

test('el joystick nunca solicita rotacion', () => {
  // El giro se pide con los botones turnLeft / turnRight, no con el joystick.
  expect(joystickToWalk(1, 1).wz).toBe(0);
  expect(joystickToWalk(-1, -1).wz).toBe(0);
});

test('la magnitud se conserva: el mapeo solo reorienta los ejes', () => {
  const { vx, vy } = joystickToWalk(0.6, 0.8);

  expect(Math.hypot(vx, vy)).toBeCloseTo(Math.hypot(0.6, 0.8));
});

/**
 * Cabeza. NAOqi usa dos convenciones distintas en las dos articulaciones:
 *   HeadYaw   > 0  ->  IZQUIERDA   (rango -2.0857 a 2.0857 rad)
 *   HeadPitch > 0  ->  ABAJO       (rango -0.6720 a 0.5149 rad)
 * Por eso los dos ejes del joystick se invierten, no solo el lateral.
 */

test('el joystick a la derecha gira la cabeza a la derecha', () => {
  // HeadYaw negativo es la derecha del robot.
  expect(joystickToHead(1, 0).yaw).toBeLessThan(0);
});

test('el joystick a la izquierda gira la cabeza a la izquierda', () => {
  expect(joystickToHead(-1, 0).yaw).toBeGreaterThan(0);
});

test('el joystick hacia arriba levanta la cabeza', () => {
  // HeadPitch negativo mira hacia arriba.
  expect(joystickToHead(0, 1).pitch).toBeLessThan(0);
});

test('el joystick hacia abajo baja la cabeza', () => {
  expect(joystickToHead(0, -1).pitch).toBeGreaterThan(0);
});

test('en la cabeza cada eje del joystick mueve una sola articulacion', () => {
  expect(joystickToHead(1, 0).pitch).toBe(0);
  expect(joystickToHead(0, 1).yaw).toBe(0);
});

test('el joystick centrado deja la cabeza quieta', () => {
  expect(joystickToHead(0, 0)).toEqual({ yaw: 0, pitch: 0 });
});

test('la cabeza y la caminata comparten el mismo sentido lateral', () => {
  // Un gesto a la derecha manda el robot y su mirada al mismo lado.
  expect(Math.sign(joystickToHead(1, 0).yaw)).toBe(Math.sign(joystickToWalk(1, 0).vy));
});

/**
 * Brazos. Ambos hombros comparten mapeo:
 *   ShoulderPitch > 0  ->  brazo ABAJO   (rango -2.0857 a 2.0857 rad)
 *   ShoulderRoll  > 0  ->  hacia la IZQUIERDA del robot
 * LShoulderRoll va de -0.3142 a 1.3265 rad y RShoulderRoll de -1.3265 a 0.3142:
 * son espejo, de modo que un mismo valor mueve cada brazo al mismo lado.
 */

test('el joystick a la derecha mueve el brazo hacia la derecha del robot', () => {
  // ShoulderRoll negativo apunta a la derecha del robot.
  expect(joystickToArm(1, 0).roll).toBeLessThan(0);
});

test('el joystick a la izquierda mueve el brazo hacia la izquierda del robot', () => {
  expect(joystickToArm(-1, 0).roll).toBeGreaterThan(0);
});

test('el joystick hacia arriba levanta el brazo', () => {
  // ShoulderPitch negativo levanta el brazo.
  expect(joystickToArm(0, 1).pitch).toBeLessThan(0);
});

test('el joystick hacia abajo baja el brazo', () => {
  expect(joystickToArm(0, -1).pitch).toBeGreaterThan(0);
});

test('en los brazos cada eje del joystick mueve una sola articulacion', () => {
  expect(joystickToArm(1, 0).pitch).toBe(0);
  expect(joystickToArm(0, 1).roll).toBe(0);
});

test('el joystick centrado deja los brazos quietos', () => {
  expect(joystickToArm(0, 0)).toEqual({ roll: 0, pitch: 0 });
});

test('los tres modos comparten el mismo sentido lateral', () => {
  // Un gesto a la derecha manda cuerpo, mirada y brazos al mismo lado.
  const lateral = [
    joystickToWalk(1, 0).vy,
    joystickToHead(1, 0).yaw,
    joystickToArm(1, 0).roll
  ];

  expect(lateral.every((axis) => Math.sign(axis) === -1)).toBe(true);
});

test('la cabeza y los brazos comparten el mismo sentido vertical', () => {
  expect(Math.sign(joystickToArm(0, 1).pitch)).toBe(Math.sign(joystickToHead(0, 1).pitch));
});

/**
 * Vida autonoma. El robot no responde si o no: manda el nombre del modo en que
 * esta ALAutonomousLife. Solo "disabled" significa apagada; "unknown" es la
 * respuesta cuando el robot no pudo consultarlo y tampoco debe contar como
 * encendida. La rama de error del control server envia un false real.
 */

test('el estado "disabled" apaga el boton', () => {
  expect(isAutonomousLifeActive('disabled')).toBe(false);
});

test('el estado "unknown" no cuenta como encendida', () => {
  expect(isAutonomousLifeActive('unknown')).toBe(false);
});

test('los modos activos encienden el boton', () => {
  expect(isAutonomousLifeActive('interactive')).toBe(true);
  expect(isAutonomousLifeActive('solitary')).toBe(true);
  expect(isAutonomousLifeActive('safeguard')).toBe(true);
});

test('tambien se acepta un si/no directo del robot', () => {
  expect(isAutonomousLifeActive(true)).toBe(true);
  expect(isAutonomousLifeActive(false)).toBe(false);
});

test('el estado se lee sin importar mayusculas ni espacios', () => {
  expect(isAutonomousLifeActive('  Disabled ')).toBe(false);
  expect(isAutonomousLifeActive('INTERACTIVE')).toBe(true);
});

test('una respuesta vacia o inesperada deja el boton apagado', () => {
  expect(isAutonomousLifeActive('')).toBe(false);
  expect(isAutonomousLifeActive('   ')).toBe(false);
  expect(isAutonomousLifeActive(undefined)).toBe(false);
  expect(isAutonomousLifeActive(null)).toBe(false);
  expect(isAutonomousLifeActive(0)).toBe(false);
});

test('el boton puede alternar en los dos sentidos', () => {
  // El fallo original hacia que la interfaz siempre creyera estar en ON, y por
  // eso solo llegaba a pedir "apaga". Con la traduccion, negar el estado da la
  // peticion correcta en ambos sentidos.
  expect(!isAutonomousLifeActive('disabled')).toBe(true);
  expect(!isAutonomousLifeActive('interactive')).toBe(false);
});
