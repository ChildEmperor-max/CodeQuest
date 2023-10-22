export let keyListenersEnabled = true;

var keys = {
  w: {
    pressed: false,
    justPressed: false,
  },
  a: {
    pressed: false,
    justPressed: false,
  },
  s: {
    pressed: false,
    justPressed: false,
  },
  d: {
    pressed: false,
    justPressed: false,
  },
  e: {
    pressed: false,
    justPressed: false,
  },
  q: {
    pressed: false,
    justPressed: false,
  },
  p: {
    pressed: false,
    justPressed: false,
  },
  r: {
    pressed: false,
    justPressed: false,
  },
  f: {
    pressed: false,
    justPressed: false,
  },
  h: {
    pressed: false,
    justPressed: false,
  },
  shift: {
    pressed: false,
    justPressed: false,
  },
  ctrl: {
    pressed: false,
    justPressed: false,
  },
  space: {
    pressed: false,
    justPressed: false,
  },
};

const handleKeyDown = (event) => {
  if (!keyListenersEnabled) return;

  switch (event.code) {
    case "KeyW":
      keys.w.justPressed = !keys.w.justPressed;
      keys.w.pressed = true;
      break;
    case "KeyA":
      keys.a.justPressed = !keys.a.justPressed;
      keys.a.pressed = true;
      break;
    case "KeyS":
      keys.s.justPressed = !keys.s.justPressed;
      keys.s.pressed = true;
      break;
    case "KeyD":
      keys.d.justPressed = !keys.d.justPressed;
      keys.d.pressed = true;
      break;
    case "KeyE":
      keys.e.justPressed = !keys.e.justPressed;
      keys.e.pressed = true;
      break;
    case "KeyQ":
      keys.q.justPressed = !keys.q.justPressed;
      keys.q.pressed = true;
      break;
    case "KeyP":
      keys.p.justPressed = !keys.p.justPressed;
      keys.p.pressed = true;
      break;
    case "KeyR":
      keys.r.justPressed = !keys.r.justPressed;
      keys.r.pressed = true;
      break;
    case "KeyF":
      keys.f.justPressed = !keys.f.justPressed;
      keys.f.pressed = true;
      break;
    case "KeyH":
      keys.h.justPressed = !keys.h.justPressed;
      keys.h.pressed = true;
      break;
    case "ShiftLeft":
      keys.shift.justPressed = !keys.shift.justPressed;
      keys.shift.pressed = true;
      break;
    case "ControlLeft":
      keys.ctrl.justPressed = !keys.ctrl.justPressed;
      keys.ctrl.pressed = true;
      break;
    case "Space":
      keys.space.justPressed = !keys.space.justPressed;
      keys.space.pressed = true;
      break;
  }
};

const handleKeyUp = (event) => {
  if (!keyListenersEnabled) return;

  switch (event.code) {
    case "KeyW":
      keys.w.pressed = false;
      break;
    case "KeyA":
      keys.a.pressed = false;
      break;
    case "KeyS":
      keys.s.pressed = false;
      break;
    case "KeyD":
      keys.d.pressed = false;
      break;
    case "KeyE":
      keys.e.pressed = false;
      break;
    case "KeyQ":
      keys.q.pressed = false;
      break;
    case "KeyP":
      keys.p.pressed = false;
      break;
    case "KeyR":
      keys.r.pressed = false;
      break;
    case "KeyF":
      keys.f.pressed = false;
      break;
    case "KeyH":
      keys.f.pressed = false;
      break;
    case "ShiftLeft":
      keys.shift.pressed = false;
      break;
    case "ControlLeft":
      keys.ctrl.pressed = false;
      break;
    case "Space":
      keys.space.pressed = false;
      break;
  }
};

window.addEventListener("keydown", handleKeyDown);

window.addEventListener("keyup", handleKeyUp);

export function enableKeyListeners() {
  keyListenersEnabled = true;
}

export function disableKeyListeners() {
  keyListenersEnabled = false;
}

export default keys;
