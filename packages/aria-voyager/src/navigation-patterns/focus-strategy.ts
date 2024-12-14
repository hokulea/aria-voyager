import type { Control, Item } from '../controls/control';
import type { EventNames, NavigationParameterBag, NavigationPattern } from './navigation-pattern';
import type { SelectionStrategy } from './selection-strategy';

export interface FocusStrategy {
  activeItem?: Item;
  prevActiveItem?: Item;
  activateItem(item: Item): void;
  updateItems(): void;
}

/**
 * @see https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#keyboardnavigationinsidecomponents
 */
export abstract class AbstractFocusStrategy implements NavigationPattern, FocusStrategy {
  eventListeners: EventNames[] = ['focus', 'focusin'];

  activeItem?: Item;
  prevActiveItem?: Item;

  get selection(): Item[] {
    if (this.selectionStrategy) {
      return this.selectionStrategy.selection;
    }

    return [];
  }

  constructor(
    protected control: Control,
    private selectionStrategy?: SelectionStrategy
  ) {
    this.selectionStrategy?.addListener('read', this.readSelectionHandler.bind(this));
  }

  dispose() {
    this.selectionStrategy?.removeListener('read', this.readSelectionHandler.bind(this));
  }

  readSelectionHandler() {
    if (!this.hasFocus() && this.selection.length > 0) {
      this.activateSelection();
    }
  }

  hasFocus() {
    return (
      this.control.element.contains(document.activeElement) ||
      this.control.element === document.activeElement
    );
  }

  matches() {
    return this.control.enabledItems.length > 0;
  }

  handle(bag: NavigationParameterBag): NavigationParameterBag {
    const { event, item } = bag;

    if (event.type === 'focusin') {
      this.handleFocus(event as FocusEvent);

      return bag;
    }

    if (item) {
      this.activateItem(item, event.type === 'pointerover');
    }

    return bag;
  }

  handleFocus(event: FocusEvent) {
    if (this.control.element === event.target) {
      const selectionPresent = this.selection.length > 0;

      if (selectionPresent) {
        this.activateSelection();
      } else {
        this.activateItem(this.control.enabledItems[0]);
      }
    } else if (this.control.enabledItems.includes(event.target as Item)) {
      this.activateItem(event.target as Item);
    }
  }

  activateSelection() {
    this.activateItem(this.selection[0]);
  }

  abstract activateItem(item: Item, forceFocus?: boolean): void;

  abstract updateItems(): void;
}
