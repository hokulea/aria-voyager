import type { Control, Item } from '../controls/control';
import type { EventNames, NavigationParameterBag, NavigationPattern } from './navigation-pattern';

export class ScrollToItem implements NavigationPattern {
  eventListeners: EventNames[] = ['keydown'];

  constructor(private control: Control) {}

  matches() {
    return this.control.items.length > 0;
  }

  handle(bag: NavigationParameterBag): NavigationParameterBag {
    const { event, item } = bag;

    if (event.type === 'keydown') {
      if (item) {
        this.scrollToItem(item);
      }

      // prevent default when scrolling keys are used
      this.preventScrolling(event as KeyboardEvent);
    }

    // if (event.type === 'pointerup' && item) {
    //   event.stopPropagation();
    // }

    return bag;
  }

  private preventScrolling(event: KeyboardEvent) {
    if (
      event.key === 'ArrowUp' ||
      event.key === 'ArrowDown' ||
      event.key === 'ArrowLeft' ||
      event.key === 'ArrowRight' ||
      event.key === 'PageUp' ||
      event.key === 'PageDown' ||
      event.key === 'Home' ||
      event.key === 'End' ||
      event.key === ' ' ||
      (event.key === 'a' && event.metaKey)
    ) {
      event.preventDefault();
    }
  }

  private scrollToItem(item: Item) {
    // are we going downwards ?
    if (
      this.control.prevActiveItem &&
      this.control.items.indexOf(this.control.prevActiveItem) < this.control.items.indexOf(item)
    ) {
      this.scrollDownwardsToItem(item);
    } else {
      this.scrollUpwardsToItem(item);
    }
  }

  private scrollUpwardsToItem(item: HTMLElement) {
    if (!this.isItemInViewport(item) || item.offsetTop === 0) {
      const buffer = this.calcBuffer();

      this.control.element.scrollTop = item.offsetTop - buffer;
    }
  }

  private scrollDownwardsToItem(item: HTMLElement) {
    if (!this.isItemInViewport(item)) {
      const buffer = this.calcBuffer();

      this.control.element.scrollTop =
        item.offsetTop - this.control.element.clientHeight + item.clientHeight + buffer;
    }
  }

  private isItemInViewport(item: HTMLElement) {
    const buffer = this.calcBuffer();

    // from top
    const viewportLowerEdge = this.control.element.scrollTop + this.control.element.clientHeight;
    const itemLowerEdge = item.offsetTop + item.clientHeight + buffer;
    const visibleFromTop = viewportLowerEdge >= itemLowerEdge;

    // from bottom
    const viewportUpperEdge = this.control.element.scrollTop;
    const itemUpperEdge = item.offsetTop - buffer;
    const visibleFromBottom = viewportUpperEdge <= itemUpperEdge;

    // item is taller than container
    const itemIsTallerThanContainer = item.clientHeight > this.control.element.clientHeight;

    return visibleFromTop && visibleFromBottom && !itemIsTallerThanContainer;
  }

  private calcBuffer() {
    const style = window.getComputedStyle(this.control.element);
    const padding = style.getPropertyValue('padding-block');

    return Math.max(2, Number.parseFloat(padding));
  }
}
