export async function fireKey(element: EventTarget, key: string, options?: KeyboardEventInit) {
  element.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key, ...options }));
  await Promise.resolve();
}

export async function fireKeyUp(element: EventTarget, key: string, options?: KeyboardEventInit) {
  element.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key, ...options }));
  await Promise.resolve();
}

export async function firePointer(element: EventTarget, options?: PointerEventInit) {
  element.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, ...options }));
  await Promise.resolve();
}

export async function fireHover(element: EventTarget) {
  element.dispatchEvent(new PointerEvent('pointerover', { bubbles: true }));
  await Promise.resolve();
}

export async function fireUnhover(element: EventTarget) {
  element.dispatchEvent(new PointerEvent('pointerout', { bubbles: true }));
  await Promise.resolve();
}

export async function focusControl(element: HTMLElement) {
  element.focus();
  await Promise.resolve();
}

export async function blurControl(element: HTMLElement) {
  element.blur();
  await Promise.resolve();
}
