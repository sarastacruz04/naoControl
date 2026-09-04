import { joystickToHead, joystickToWalk } from './NaoController';

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
