import { getGroupChildren } from '#src/controls/-roles.js';
import { PointerNavigation } from '#src/navigation-patterns/pointer-navigation.js';
import { RovingTabindexStrategy } from '#src/navigation-patterns/roving-tabindex-strategy.js';

import { EndNavigation } from '../navigation-patterns/end-navigation';
import { HomeNavigation } from '../navigation-patterns/home-navigation';
import { NextNavigation } from '../navigation-patterns/next-navigation';
import { PreviousNavigation } from '../navigation-patterns/previous-navigation';
import { Control } from './control';

import type { EmitStrategy } from '#src/emit-strategies/emit-strategy.js';
import type { UpdateStrategy } from '#src/update-strategies/update-strategy.js';

interface GroupOptions {
  updater?: UpdateStrategy;
  emitter?: EmitStrategy;
}

export class Group extends Control {
  focusStrategy: RovingTabindexStrategy = new RovingTabindexStrategy(this);

  get activeItem() {
    return this.focusStrategy.activeItem;
  }

  get prevActiveItem() {
    return this.focusStrategy.prevActiveItem;
  }

  constructor(element: HTMLElement, options: GroupOptions = {}) {
    super(element, options);

    this.registerNavigationPatterns([
      new NextNavigation(this, ['ArrowDown', 'ArrowRight']),
      new PreviousNavigation(this, ['ArrowUp', 'ArrowLeft']),
      new HomeNavigation(this),
      new EndNavigation(this),
      new PointerNavigation(this),
      this.focusStrategy
    ]);

    // setup
    element.role = 'group';

    this.readOptions();
    this.readItems();
  }

  dispose() {
    super.dispose();
  }

  readItems() {
    this.items = getGroupChildren(this.element);

    this.focusStrategy.updateItems();
  }

  readOptions(): void {
    super.readOptions();

    this.element.setAttribute('tabindex', this.options.disabled ? '-1' : '0');

    this.focusStrategy.updateItems();
  }
}
