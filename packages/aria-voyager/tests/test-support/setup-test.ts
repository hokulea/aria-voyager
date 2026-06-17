import { afterEach, beforeEach } from 'vitest';
import { userEvent } from 'vitest/browser';

export function setupTest() {
  beforeEach(async () => {
    // Reset pointer before any DOM is created
    await userEvent.unhover(document.body);
  });

  afterEach(() => {
    // Close any open popovers
    for (const el of document.querySelectorAll('[popover]')) {
      try {
        (el as HTMLElement).hidePopover();
      } catch {
        // already closed
      }
    }

    // Wipe the entire document body
    document.body.innerHTML = '';

    // Make sure no element keeps focus
    if (document.activeElement) {
      (document.activeElement as HTMLElement).blur();
    }
  });
}
