import { isEqual } from 'es-toolkit/predicate';

import { isItemOf } from '#src/controls/-utils.js';
import {
  AbstractSelectionStrategy,
  type SelectionBehavior,
  type SelectionStrategy
} from '#src/navigation-patterns/selection-strategy.js';

import type { Control, Item } from '../controls/control';
import type { EventNames, NavigationParameterBag, NavigationPattern } from './navigation-pattern';

export interface RadioSelectionOptions {
  /**
   * Filter function to determine which items in control.items are radio items.
   *
   * @defaultValue `() => true` (all items are radio items)
   */
  isRadioItem?: (item: Item) => boolean;

  /**
   * Selection behavior configuration.
   */
  behavior?: SelectionBehavior;
}

const SELECTION_ATTRIBUTE = 'aria-checked';

export class RadioSelectionStrategy
  extends AbstractSelectionStrategy
  implements NavigationPattern, SelectionStrategy
{
  eventListeners: EventNames[] = ['focusin', 'keydown', 'pointerup'];

  #groups = new Map<string, Item[]>();
  #itemToGroup = new Map<Item, string>();
  #isRadioItem: (item: Item) => boolean;

  #selection: Item[] = [];

  get selection(): Item[] {
    return this.#selection;
  }

  constructor(control: Control, options?: RadioSelectionOptions) {
    super(control, options?.behavior);

    this.#isRadioItem = options?.isRadioItem ?? (() => true);

    this.readSelection();
  }

  isSelectionAttriute(attributeName: string): boolean {
    return attributeName === SELECTION_ATTRIBUTE;
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
    if (this.behavior.singleSelection === 'automatic' && this.#isRadioItem(item)) {
      this.#selectItem(item);
    }
  }

  #handlePointer(_event: MouseEvent, item: Item) {
    // pointerup: check the clicked item
    if (this.#isRadioItem(item)) {
      this.#selectItem(item);
    }
  }

  #handleKeyboard(event: KeyboardEvent, item?: Item) {
    // Space: check the active item
    if (
      event.key === ' ' &&
      this.control.activeItem &&
      this.#isRadioItem(this.control.activeItem)
    ) {
      this.#selectItem(this.control.activeItem);

      return;
    }

    // Automatic mode: check the item when navigating with arrow keys
    // (item is set by NextNavigation/PreviousNavigation/etc.)
    if (this.behavior.singleSelection === 'automatic' && item && this.#isRadioItem(item)) {
      this.#selectItem(item);
    }
  }

  /**
   * Called from control.readItems() to re-partition items and re-enforce invariant.
   */
  readSelection(): void {
    // 1. Filter control.items through isRadioItem
    const radioItems = new Set(this.control.enabledItems.filter((item) => this.#isRadioItem(item)));

    // 2. Partition by data-group (missing → default key '')
    this.#groups = new Map<string, Item[]>();
    this.#itemToGroup = new Map();

    let groupIndex = 1;

    const walk = (parent: Element) => {
      for (const child of parent.children) {
        if (this.#isSeparator(child)) {
          groupIndex++;
        } else if (child.getAttribute('role') === 'group') {
          groupIndex++;
          walk(child);
          groupIndex++;
        } else if (radioItems.has(child as Item)) {
          const key = String(groupIndex);

          if (!this.#groups.has(key)) {
            this.#groups.set(key, []);
          }

          (this.#groups.get(key) as Item[]).push(child as Item);
          this.#itemToGroup.set(child as Item, key);
        }
      }
    };

    walk(this.control.element);

    // 3. For each group, enforce invariant
    for (const items of this.#groups.values()) {
      this.#enforceGroupInvariant(items);
    }

    this.#readSelectionFromItemsStoreAndNotify();
  }

  /**
   * Read initial aria-checked from DOM, enforce per-group invariant.
   *
   * Per ADR-0001: if multiple have aria-checked="true", pick first and uncheck rest.
   * If none, check the first item.
   */
  #enforceGroupInvariant(items: Item[]): Item | undefined {
    if (items.length === 0) {
      return undefined;
    }

    const selectedItems = items.filter((item) => this.#isItemSelected(item));

    // No checked item: check the first item, uncheck the rest
    if (selectedItems.length === 0) {
      for (const [i, item] of items.entries()) {
        item.setAttribute('aria-checked', i === 0 ? 'true' : 'false');
      }

      return items[0];
    }

    // Exactly one checked: keep it, ensure others are explicitely "false"
    if (selectedItems.length === 1) {
      const selectedItem = selectedItems[0];

      for (const item of items) {
        item.setAttribute('aria-checked', item === selectedItem ? 'true' : 'false');
      }

      return undefined;
    }

    // Multiple checked: keep first, uncheck the rest
    const firstSelected = selectedItems[0];

    for (const item of items) {
      item.setAttribute('aria-checked', item === firstSelected ? 'true' : 'false');
    }

    return firstSelected;
  }

  #selectItem(item: Item): void {
    const group = this.#itemToGroup.get(item);

    if (group === undefined) {
      return;
    }

    const groupItems = this.#groups.get(group) ?? [];

    for (const sibling of groupItems) {
      if (sibling === item) {
        sibling.setAttribute('aria-checked', 'true');
      } else {
        sibling.setAttribute('aria-checked', 'false');
      }
    }

    this.#readSelectionFromItemsStoreAndNotify();
  }

  #isItemSelected(item: Item) {
    return item.getAttribute('aria-checked') === 'true';
  }

  #isSeparator(element: Element): boolean {
    return element.getAttribute('role') === 'separator' || element instanceof HTMLHRElement;
  }

  #readSelectionFromItemsStoreAndNotify() {
    const selection = this.control.enabledItems.filter(
      (item) => this.#isRadioItem(item) && this.#isItemSelected(item)
    );

    this.select(selection);
  }

  select(selection: Item | Item[]) {
    if (!Array.isArray(selection)) {
      this.select([selection]);

      return;
    }

    if (isEqual(selection, this.#selection)) {
      return;
    }

    this.#selection = selection;

    this.notifyListener('read');
    this.control.emitter?.selected(this.#selection);
  }
}
