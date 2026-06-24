import { isEqual } from 'es-toolkit/predicate';

import {
  AbstractSelectionStrategy,
  type SelectionBehavior,
  type SelectionStrategy
} from '#src/behaviors/selection/selection-strategy';
import { isItemEnabled, isItemOf } from '#src/controls/-items';

import type { Behavior, BehaviorParameterBag, EventNames } from '#src/behaviors/behavior';
import type { Control, Item } from '#src/controls/control';

function isGroupContainer(element: Element): boolean {
  return (
    element.getAttribute('role') === 'group' || element.getAttribute('role') === 'presentation'
  );
}

function isSeparator(element: Element): boolean {
  return element.getAttribute('role') === 'separator' || element instanceof HTMLHRElement;
}

function isItemSelected(item: Item): boolean {
  return item.getAttribute('aria-checked') === 'true';
}

export interface RadioSelectionOptions {
  /**
   * Filter function to determine which items in control.enabledItems are radio items.
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
  implements Behavior, SelectionStrategy
{
  eventListeners: EventNames[] = ['focusin', 'keydown', 'pointerup'];

  #groups = new Map<string, Item[]>();
  #itemToGroup = new Map<Item, string>();
  #isRadioItem: (item: Item) => boolean;

  #selection: Item[] = [];

  get selection(): Item[] {
    return this.#selection;
  }

  get radioItems(): Item[] {
    return this.control.enabledItems.filter((item) => this.#isRadioItem(item));
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
      this.control.enabledItems.some((item) => this.#isRadioItem(item)) &&
      this.eventListeners.includes(event.type as EventNames)
    );
  }

  handle(bag: BehaviorParameterBag): BehaviorParameterBag {
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
    if (this.#isRadioItem(item) && isItemEnabled(item)) {
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
    // 1. Filter control.enabledItems through isRadioItem
    const radioItems = new Set(this.radioItems);

    // 2. Partition by data-group (missing → default key '')
    this.#groups = new Map<string, Item[]>();
    this.#itemToGroup = new Map();

    let groupIndex = 1;

    const walk = (parent: Element) => {
      for (const child of parent.children) {
        if (isSeparator(child)) {
          groupIndex++;
        } else if (isGroupContainer(child)) {
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
    const selection = Array.from(this.#groups.values(), (items) =>
      this.#enforceGroupInvariant(items)
    ).filter(Boolean) as Item[];

    this.#persistSelection(selection);
    this.select(selection);
  }

  /**
   * Read initial aria-checked from DOM, enforce per-group invariant.
   *
   * Per ADR-0001: if multiple have aria-checked="true", pick first and uncheck rest.
   * If none, check the first item.
   */
  #enforceGroupInvariant(items: Item[]): Item | undefined {
    if (items.length === 0) {
      return;
    }

    const selectedItems = items.filter((item) => isItemSelected(item));

    // No checked item: check the first item, uncheck the rest
    if (selectedItems.length === 0) {
      return items[0];
    }

    // Exactly one checked: keep it, ensure others are explicitely "false"
    // Multiple checked: keep first, uncheck the rest
    return selectedItems[0];
  }

  #selectItem(item: Item): void {
    const group = this.#itemToGroup.get(item);

    if (group === undefined) {
      return;
    }

    // find all selected items from all other groups (in the order they appear
    // in the DOM)
    const selection = this.#groups
      .entries()
      .flatMap(([k, v]) => {
        if (k === group) {
          return [item];
        }

        return v.filter((i) => isItemSelected(i));
      })
      .toArray();

    this.#persistSelection(selection);
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

  #persistSelection(selection: Item[]) {
    for (const element of this.radioItems) {
      element.setAttribute('aria-checked', selection.includes(element) ? 'true' : 'false');
    }
  }
}
