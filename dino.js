import {
  getCustomProperty,
  incrementCustomProperty,
  setCustomProperty,
} from './updateCustomProperty.js';

const dinoElement = document.querySelector('[data-dino]');

const JUMP_SPEED = 0.45;
const GRAVITY = 0.0015;
const DINO_FRAME_COUNT = 2;
const FRAME_TIME = 100;
let isJumping;
let dinoFrame;
let currentFrameTime;
let yVelocity;
export function setUpDino() {
  isJumping = false;
  dinoFrame = 0;
  currentFrameTime = 0;
  yVelocity = 0;
  setCustomProperty(dinoElement, '--bottom', 0);
  // ['click','ontouchstart'].forEach( evt =>
  //     document.addEventListener(evt, onJump)
  // );

  document.removeEventListener('keydown', onJump);

  document.addEventListener('keydown', onJump);
}

export function updateDino(delta, speedScale) {
  handleRun(delta, speedScale);
  handleJump(delta);
}

export function getDinoRect() {
  return dinoElement.getBoundingClientRect();
}

export function setDinoLose() {
  dinoElement.src = `images/lose.jpg`;
}

function handleRun(delta, speedScale) {
  if (isJumping) {
    dinoElement.src = `images/dino-stationary.jpg`;
    return;
  }

  if (currentFrameTime >= FRAME_TIME) {
    dinoFrame = (dinoFrame + 1) % DINO_FRAME_COUNT;
    dinoElement.src = `images/dino-run-${dinoFrame}.jpg`;
    currentFrameTime -= FRAME_TIME;
  }

  currentFrameTime += delta * speedScale;
}

function handleJump(delta) {
  if (!isJumping) return;

  incrementCustomProperty(dinoElement, '--bottom', yVelocity * delta);

  if (getCustomProperty(dinoElement, '--bottom') <= 0) {
    setCustomProperty(dinoElement, '--bottom', 0);
    isJumping = false;
  }

  yVelocity -= GRAVITY * delta;
}

function onJump(e) {
  if (e.code !== 'Space' || isJumping) return;
  yVelocity = JUMP_SPEED;
  isJumping = true;
}
