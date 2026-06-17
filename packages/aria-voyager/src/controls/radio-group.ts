import { EndNavigation } from '../navigation-patterns/end-navigation';
import { HomeNavigation } from '../navigation-patterns/home-navigation';
import { NextNavigation } from '../navigation-patterns/next-navigation';
import { PointerNavigation } from '../navigation-patterns/pointer-navigation';
import { PreviousNavigation } from '../navigation-patterns/previous-navigation';
import { RadioNavigation } from '../navigation-patterns/radio-navigation';
import { RovingTabindexStrategy } from '../navigation-patterns/roving-tabindex-strategy';
import { Control } from './control';

import type { EmitStrategy } from '../emit-strategies/emit-strategy';
import type { RadioNavigationBehavior } from '../navigation-patterns/radio-navigation';
import type { UpdateStrategy } from '../update-strategies/update-strategy';

export type RadioGroupBehavior = RadioNavigationBehavior;

export interface RadioGroupOptions {
  updater?: UpdateStrategy;
  emitter?: EmitStrategy;
  behavior?: RadioGroupBehavior;
}

export class RadioGroup extends Control {
  focusStrategy: RovingTabindexStrategy = new RovingTabindexStrategy(this);
  #radioNavigation: RadioNavigation;

  get activeItem() {
    return this.focusStrategy.activeItem;
  }

  get prevActiveItem() {
    return this.focusStrategy.prevActiveItem;
  }

  constructor(element: HTMLElement, options: RadioGroupOptions = {}) {
    super(element, {
      capabilities: {
        singleSelection: true,
        multiSelection: false
      },
      ...options
    });

    this.#radioNavigation = new RadioNavigation(this, {
      behavior: options.behavior ?? { singleSelection: 'automatic' }
    });

    this.registerNavigationPatterns([
      new NextNavigation(this, ['ArrowDown', 'ArrowRight']),
      new PreviousNavigation(this, ['ArrowUp', 'ArrowLeft']),
      new HomeNavigation(this),
      new EndNavigation(this),
      new PointerNavigation(this),
      this.focusStrategy,
      this.#radioNavigation
    ]);

    // setup
    element.role = 'radiogroup';

    this.readOptions();
    this.readItems();
  }

  dispose() {
    super.dispose();
  }

  readItems() {
    this.items = [...this.element.querySelectorAll<HTMLElement>(':scope [role="radio"]')];

    this.#radioNavigation.updateItems();

    this.focusStrategy.updateItems();
  }

  readOptions(): void {
    super.readOptions();

    this.element.setAttribute('tabindex', this.options.disabled ? '-1' : '0');

    this.focusStrategy.updateItems();
  }
}
