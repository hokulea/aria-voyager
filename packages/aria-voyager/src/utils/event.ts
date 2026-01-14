export function isToggleEvent(event: Event): event is ToggleEvent {
  return event.type === 'toggle';
}

export function isPointerEvent(event: Event): event is PointerEvent {
  return ['pointerover', 'pointerout', 'pointerup'].includes(event.type);
}

export function isKeyboardEvent(event: Event): event is KeyboardEvent {
  return ['keydown', 'keyup', 'keypress'].includes(event.type);
}

export function matchesKeys(event: KeyboardEvent, keyOrKeys: string | string[]) {
  const keys = Array.isArray(keyOrKeys) ? keyOrKeys : [keyOrKeys];

  return keys.includes(event.key);
}

export function doesEventMatchKeys(event: Event, keyOrKeys: string | string[]) {
  return (
    event instanceof KeyboardEvent && event.type === 'keydown' && matchesKeys(event, keyOrKeys)
  );
}
