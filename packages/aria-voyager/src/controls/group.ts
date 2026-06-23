import { RovingTabindexStrategy } from '#src/behaviors/focus/roving-tabindex-strategy';
import { EndNavigation } from '#src/behaviors/navigation/end-navigation';
import { HomeNavigation } from '#src/behaviors/navigation/home-navigation';
import { NextNavigation } from '#src/behaviors/navigation/next-navigation';
import { PointerNavigation } from '#src/behaviors/navigation/pointer-navigation';
import { PreviousNavigation } from '#src/behaviors/navigation/previous-navigation';
import { getGroupChildren } from '#src/controls/-roles';
import { Control } from '#src/controls/control';

import type { EmitStrategy } from '#src/emit-strategies/emit-strategy';
import type { UpdateStrategy } from '#src/update-strategies/update-strategy';

interface GroupOptions {
  updater?: UpdateStrategy;
  emitter?: EmitStrategy;
}

export class Group extends Control {
  protected focusStrategy: RovingTabindexStrategy;

  get activeItem() {
    return this.focusStrategy.activeItem;
  }

  get prevActiveItem() {
    return this.focusStrategy.prevActiveItem;
  }

  constructor(element: HTMLElement, options: GroupOptions = {}) {
    super(element, options);

    this.focusStrategy = new RovingTabindexStrategy(this);

    this.registerBehavior([
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

    this.focusStrategy.updateItems();
  }
}
