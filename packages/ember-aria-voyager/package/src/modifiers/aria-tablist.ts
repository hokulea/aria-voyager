import { registerDestructor } from '@ember/destroyable';

import { IndexEmitStrategy, ItemEmitStrategy, ReactiveUpdateStrategy, Tablist } from 'aria-voyager';
import Modifier from 'ember-modifier';
import isEqual from 'lodash.isequal';

import {
  asArray,
  createIndexEmitter,
  createItemEmitter,
  type EmitterSignature,
  type WithItems
} from './-emitter';

import type Owner from '@ember/owner';
import type { EmitStrategy, Orientation, TablistBehavior } from 'aria-voyager';
import type { ArgsFor, NamedArgs, PositionalArgs } from 'ember-modifier';

export interface TablistSignature<T> {
  Element: HTMLElement;
  Args: {
    Positional: [];
    Named: {
      disabled?: boolean;
      orientation?: Orientation;
      behavior?: TablistBehavior;
    } & EmitterSignature<T>;
  };
}

export default class TablistModifier<T> extends Modifier<TablistSignature<T>> {
  private tablist?: Tablist;
  declare private updater: ReactiveUpdateStrategy;
  declare private emitter: EmitStrategy;

  private prevItems?: T[];
  private prevSelection?: T | T[];
  private prevDisabled?: boolean;
  private prevOrientation?: Orientation;

  constructor(owner: Owner, args: ArgsFor<TablistSignature<T>>) {
    super(owner, args);

    registerDestructor(this, () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      this.tablist?.dispose();
    });
  }

  modify(
    element: Element,
    _: PositionalArgs<TablistSignature<T>>,
    options: NamedArgs<TablistSignature<T>>
  ) {
    if (!this.tablist) {
      this.updater = new ReactiveUpdateStrategy();

      this.tablist = new Tablist(element as HTMLElement, {
        updater: this.updater,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        behavior: options.behavior
      });
    }

    if (options.items && !(this.emitter instanceof IndexEmitStrategy)) {
      this.emitter = createIndexEmitter<T>(this.tablist, options);
    } else if (!options.items && !(this.emitter instanceof ItemEmitStrategy)) {
      this.emitter = createItemEmitter<T>(this.tablist, options);
    }

    if (options.items && !isEqual(this.prevItems, (options as WithItems<T>).items)) {
      this.updater.updateItems();
      this.prevItems = [...(options as WithItems<T>).items];
    }

    if (options.selection && !isEqual(asArray(this.prevSelection), asArray(options.selection))) {
      this.updater.updateSelection();
      this.prevSelection = asArray(options.selection);
    }

    let optionsChanged = false;

    if (this.prevOrientation !== options.orientation) {
      if (options.orientation) {
        element.setAttribute('aria-orientation', options.orientation as string);
      } else {
        element.removeAttribute('aria-orientation');
      }

      optionsChanged = true;

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      this.prevOrientation = options.orientation;
    }

    if (this.prevDisabled !== options.disabled) {
      if (options.disabled) {
        element.setAttribute('aria-disabled', 'true');
      } else {
        element.removeAttribute('aria-disabled');
      }

      optionsChanged = true;

      this.prevDisabled = options.disabled;
    }

    if (optionsChanged) {
      this.updater.updateOptions();
    }
  }
}
