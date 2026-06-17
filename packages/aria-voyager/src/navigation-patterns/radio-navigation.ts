import { isItemOf } from '#src/controls/-utils.js';

import type { Control, Item } from '../controls/control';
import type { EventNames, NavigationParameterBag, NavigationPattern } from './navigation-pattern';

export interface RadioNavigationBehavior {
  /**
   * Selection behavior:
   *
   * - `automatic`: aria-checked follows focus (arrow keys auto-check)
   * - `manual`: aria-checked only changes on Space or pointer click
   *
   * @defaultValue `automatic`
   */
  singleSelection?: 'automatic' | 'manual';
}

const DEFAULT_BEHAVIOR: Required<RadioNavigationBehavior> = {
  singleSelection: 'automatic'
};

export interface RadioNavigationOptions {
  /**
   * Filter function to determine which items in control.items are radio items.
   *
   * @defaultValue `() => true` (all items are radio items)
   */
  isRadioItem?: (item: Item) => boolean;

  /**
   * Selection behavior configuration.
   */
  behavior?: RadioNavigationBehavior;
}

const DEFAULT_GROUP = '';

export class RadioNavigation implements NavigationPattern {
  eventListeners: EventNames[] = ['focusin', 'keydown', 'pointerup'];

  #groups = new Map<string, Item[]>();
  #behavior: Required<RadioNavigationBehavior>;
  #isRadioItem: (item: Item) => boolean;

  constructor(
    private control: Control,
    options?: RadioNavigationOptions
  ) {
    this.#behavior = {
      ...DEFAULT_BEHAVIOR,
      ...options?.behavior
    };
    this.#isRadioItem = options?.isRadioItem ?? (() => true);
  }

  matches(event: Event): boolean {
    return (
      this.control.items.some((item) => this.#isRadioItem(item)) &&
      this.eventListeners.includes(event.type as EventNames)
    );
  }

  handle(bag: NavigationParameterBag): NavigationParameterBag {
    const { event, item } = bag;

    if (event.type === 'focusin' && item && isItemOf(item, this.control)) {
      this.#handleFocus(event as FocusEvent, item);
    }

    if (event.type === 'pointerup' && item && isItemOf(item, this.control)) {
      this.#handlePointer(event as MouseEvent, item);
    }

    if (event.type === 'keydown') {
      this.#handleKeyboard(event as KeyboardEvent, item);
    }

    return bag;
  }

  #handleFocus(_event: FocusEvent, item: Item) {
    // focusin: automatic mode checks the focused item
    if (this.#behavior.singleSelection === 'automatic' && this.#isRadioItem(item)) {
      this.#check(item);
    }
  }

  #handlePointer(_event: MouseEvent, item: Item) {
    // pointerup: check the clicked item
    if (this.#isRadioItem(item)) {
      this.#check(item);
    }
  }

  #handleKeyboard(event: KeyboardEvent, item?: Item) {
    // Space: check the active item
    if (event.key === ' ' && this.control.activeItem && this.#isRadioItem(this.control.activeItem)) {
      this.#check(this.control.activeItem);
      return;
    }

    // Automatic mode: check the item when navigating with arrow keys
    // (item is set by NextNavigation/PreviousNavigation/etc.)
    if (
      this.#behavior.singleSelection === 'automatic' &&
      item &&
      this.#isRadioItem(item)
    ) {
      this.#check(item);
    }
  }

  /**
   * Called from control.readItems() to re-partition items and re-enforce invariant.
   */
  updateItems(): void {
    // 1. Filter control.items through isRadioItem
    const radioItems = this.control.items.filter((item) => this.#isRadioItem(item));

    // 2. Partition by data-group (missing → default key '')
    this.#groups = new Map<string, Item[]>();

    for (const item of radioItems) {
      const group = this.#getGroup(item);

      if (!this.#groups.has(group)) {
        this.#groups.set(group, []);
      }

      (this.#groups.get(group) as Item[]).push(item);
    }

    // 3. For each group, enforce invariant
    for (const items of this.#groups.values()) {
      this.enforceGroupInvariant(items);
    }
  }

  /**
   * Read initial aria-checked from DOM, enforce per-group invariant.
   *
   * Per ADR-0001: if multiple have aria-checked="true", pick first and uncheck rest.
   * If none, check the first item.
   */
  private enforceGroupInvariant(items: Item[]): void {
    if (items.length === 0) {
      return;
    }

    const checkedItems = items.filter((item) => item.getAttribute('aria-checked') === 'true');

    if (checkedItems.length === 0) {
      // No item checked → check the first item, uncheck rest
      for (const [i, item] of items.entries()) {
        item.setAttribute('aria-checked', i === 0 ? 'true' : 'false');
      }
    } else if (checkedItems.length === 1) {
      // Exactly one checked → keep it, ensure others are explicitly "false"
      const checkedItem = checkedItems[0];

      for (const item of items) {
        item.setAttribute('aria-checked', item === checkedItem ? 'true' : 'false');
      }
    } else {
      // Multiple checked → keep first, uncheck rest
      const firstChecked = checkedItems[0];

      for (const item of items) {
        item.setAttribute('aria-checked', item === firstChecked ? 'true' : 'false');
      }
    }
  }

  /**
   * Check an item: uncheck siblings in same group, emit.
   */
  #check(item: Item): void {
    const group = this.#getGroup(item);
    const groupItems = this.#groups.get(group) ?? [];

    // Uncheck all other items in that group
    for (const sibling of groupItems) {
      if (sibling === item) {
        sibling.setAttribute('aria-checked', 'true');
      } else {
        sibling.setAttribute('aria-checked', 'false');
      }
    }

    // Emit
    this.control.emitter?.selected([item]);
  }

  /**
   * Get group key from item. Returns item.dataset.group ?? ''
   */
  #getGroup(item: Item): string {
    return item.dataset.group ?? DEFAULT_GROUP;
  }
}
