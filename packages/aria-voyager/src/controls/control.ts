import { DomObserverUpdateStrategy } from '../update-strategies/dom-observer-update-strategy';
import { isItemEnabled } from './-utils';

import type { EmitStrategy } from '../emit-strategies/emit-strategy';
import type { AbstractFocusStrategy } from '../navigation-patterns/focus-strategy';
import type {
  NavigationParameterBag,
  NavigationPattern
} from '../navigation-patterns/navigation-pattern';
import type { UpdateStrategy } from '../update-strategies/update-strategy';

function pipe<Value>(input: Value, ...fns: ((input: Value) => Value)[]) {
  let lastResult = input;

  for (const fn of fns) {
    lastResult = fn(lastResult);
  }

  return lastResult;
}

interface Capabilities {
  singleSelection: boolean;
  multiSelection: boolean;
}

interface ControlOptions {
  capabilities?: Capabilities;
  optionAttributes?: string[];
  updater?: UpdateStrategy;
}

export type Orientation = 'horizontal' | 'vertical';

interface Options {
  multiple: boolean;
  disabled: boolean;
  orientation: Orientation;
}

export type Item = HTMLElement;
export type List = Item[];
export type Tree = TreeItem[];
export type TreeItem = {
  item: Item;
  children: TreeItem[];
};

export abstract class Control {
  protected abstract focusStrategy: AbstractFocusStrategy;

  items: Item[] = [];

  get enabledItems() {
    if (this.options.disabled) {
      return [];
    }

    return this.items.filter((item) => isItemEnabled(item));
  }

  abstract get activeItem(): Item | undefined;
  abstract get prevActiveItem(): Item | undefined;

  element: HTMLElement;
  emitter?: EmitStrategy;
  updater: UpdateStrategy;

  /**
   * Capabilities define, which _behaviors_ are applicable to the given control
   */
  #capabilities: Capabilities = {
    singleSelection: false,
    multiSelection: false
  };

  get capabilities() {
    return this.#capabilities;
  }

  #optionAttributes: string[] = [];

  get optionAttributes() {
    return this.#optionAttributes;
  }

  /**
   * Options instruct, which behaviors are actually _active_
   */
  options: Options = {
    multiple: false,
    disabled: false,
    orientation: 'horizontal'
  };

  private navigationPatterns: NavigationPattern[] = [];

  #handler: (event: Event) => void;

  constructor(element: HTMLElement, options: ControlOptions) {
    this.element = element;

    this.#capabilities = options.capabilities ?? this.#capabilities;
    this.#optionAttributes = options.optionAttributes ?? this.#optionAttributes;
    this.updater = options.updater ?? new DomObserverUpdateStrategy(this);

    this.#handler = this.handleEvent.bind(this);

    if (options.updater) {
      options.updater.setControl(this);
    }
  }

  setEmitStrategy(emitter: EmitStrategy) {
    this.emitter?.dispose?.();
    this.emitter = emitter;
  }

  setUpdateStrategy(updater: UpdateStrategy) {
    this.updater.dispose?.();
    this.updater = updater;
  }

  protected registerNavigationPatterns(patterns: NavigationPattern[]) {
    this.navigationPatterns = patterns;

    const eventNames = new Set(this.navigationPatterns.flatMap((p) => p.eventListeners ?? []));

    for (const eventName of eventNames) {
      this.element.addEventListener(eventName, this.#handler);
    }
  }

  dispose() {
    this.updater.dispose?.();
    this.emitter?.dispose?.();
    this.focusStrategy.dispose();

    // unregister event listeners
    const eventNames = new Set(this.navigationPatterns.flatMap((p) => p.eventListeners ?? []));

    for (const eventName of eventNames) {
      this.element.removeEventListener(eventName, this.#handler);
    }

    // dispose navigation patterns
    for (const pattern of this.navigationPatterns) {
      pattern.dispose?.();
    }
  }

  private handleEvent(event: Event) {
    if (this.options.disabled) {
      return;
    }

    const patterns = this.navigationPatterns.filter((p) => p.matches(event));

    for (const p of patterns) p.prepare?.(event);

    pipe({ event } as NavigationParameterBag, ...patterns.map((p) => p.handle.bind(p)));

    event.stopPropagation();
  }

  // read in from DOM

  readOptions() {
    this.options.multiple =
      (this.element.hasAttribute('aria-multiselectable') &&
        this.element.getAttribute('aria-multiselectable') === 'true') ||
      false;

    this.options.disabled =
      (this.element.hasAttribute('aria-disabled') &&
        this.element.getAttribute('aria-disabled') === 'true') ||
      false;

    this.options.orientation = this.element.hasAttribute('aria-orientation')
      ? (this.element.getAttribute('aria-orientation') as Orientation)
      : 'horizontal';
  }

  readItems() {
    this.items = [];
  }

  readSelection() {
    // no-op, please implement
  }
}
