import { isEqual } from 'es-toolkit/predicate';

import { isItemOf } from '#src/controls/-utils.js';

import type { Control, Item } from '../controls/control';
import type { EventNames, NavigationParameterBag, NavigationPattern } from './navigation-pattern';

export interface CheckBehaviorOptions {
  /**
   * Filter function to determine which items in control.items are checkable.
   *
   * @defaultValue `(item) => item.hasAttribute('aria-checked')`
   */
  isCheckableItem?: (item: Item) => boolean;
}

/**
 * CheckBehavior manages aria-checked state for items that can be toggled independently.
 *
 * Unlike RadioNavigation (which enforces single-selection per group), CheckBehavior
 * allows any combination of items to be checked/unchecked.
 *
 * Used for:
 * - menuitemcheckbox in Menu
 * - option with aria-checked in Listbox
 * - treeitem with aria-checked in Tree
 */
export class CheckBehavior implements NavigationPattern {
  eventListeners: EventNames[] = ['keydown', 'pointerup'];

  #checked: Item[] = [];
  #checkableItems: Item[] = [];
  #isCheckableItem: (item: Item) => boolean;

  constructor(
    private control: Control,
    options?: CheckBehaviorOptions
  ) {
    this.#isCheckableItem =
      options?.isCheckableItem ?? ((item) => item.hasAttribute('aria-checked'));
  }

  matches(event: Event): boolean {
    return (
      this.#checkableItems.length > 0 && this.eventListeners.includes(event.type as EventNames)
    );
  }

  handle(bag: NavigationParameterBag): NavigationParameterBag {
    const { event, item } = bag;

    if (event.type === 'pointerup' && item && isItemOf(item, this.control)) {
      this.#handlePointer(item);
    }

    if (event.type === 'keydown') {
      this.#handleKeyboard(event as KeyboardEvent);
    }

    return bag;
  }

  #handlePointer(item: Item) {
    if (this.#isCheckableItem(item)) {
      this.#toggle(item);
    }
  }

  #handleKeyboard(event: KeyboardEvent) {
    if (
      !(
        event.key === ' ' &&
        this.control.activeItem &&
        this.#isCheckableItem(this.control.activeItem)
      )
    ) {
      return;
    }

    event.preventDefault();
    this.#toggle(this.control.activeItem);
  }

  /**
   * Called from control.readItems() to re-filter checkable items and re-read state.
   */
  updateItems(): void {
    this.#checkableItems = this.control.items.filter((item) => this.#isCheckableItem(item));
    this.readChecked();
  }

  /**
   * Read initial aria-checked state from DOM.
   */
  readChecked(): void {
    this.#checked = this.#checkableItems.filter(
      (item) => item.getAttribute('aria-checked') === 'true'
    );
  }

  /**
   * Toggle an item's checked state.
   */
  #toggle(item: Item): void {
    const isChecked = item.getAttribute('aria-checked') === 'true';
    const newChecked = !isChecked;

    item.setAttribute('aria-checked', newChecked ? 'true' : 'false');

    // Update internal state
    const prevChecked = this.#checked;

    this.#checked = newChecked ? [...this.#checked, item] : this.#checked.filter((i) => i !== item);

    // Emit with dedup
    if (isEqual(prevChecked, this.#checked)) {
      return;
    }

    this.control.emitter?.checked(this.#checked);
  }
}
