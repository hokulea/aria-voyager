import { registerDestructor } from '@ember/destroyable';

import { IndexEmitStrategy, ItemEmitStrategy, Menu, ReactiveUpdateStrategy } from 'aria-voyager';
import Modifier from 'ember-modifier';
import { isEqual } from 'es-toolkit/predicate';

import {
  type ActivateHandler,
  type CheckHandler,
  createIndexEmitter,
  createItemEmitter,
  type Items,
  type MultiSelectionHandler
} from '#src/modifiers/-emitter.ts';

import type Owner from '@ember/owner';
import type { EmitStrategy } from 'aria-voyager';
import type { ArgsFor, NamedArgs, PositionalArgs } from 'ember-modifier';
import type { Simplify } from 'type-fest';

type MenuOptions<T> = Simplify<
  Omit<MultiSelectionHandler<T>, 'multi'> &
    (Items<T> | Partial<Items<T>>) &
    ActivateHandler<T> &
    CheckHandler<T> & { disabled?: boolean }
>;

export interface MenuSignature<T> {
  Element: HTMLElement;
  Args: {
    Positional: [];
    Named: MenuOptions<T>;
  };
}

export default class MenuModifier<T> extends Modifier<MenuSignature<T>> {
  private menu?: Menu;
  declare private updater: ReactiveUpdateStrategy;
  declare private emitter: EmitStrategy;

  private prevItems?: T[];
  private prevDisabled?: boolean;

  constructor(owner: Owner, args: ArgsFor<MenuSignature<T>>) {
    super(owner, args);

    registerDestructor(this, () => {
      this.menu?.dispose();
    });
  }

  modify(
    element: Element,
    _: PositionalArgs<MenuSignature<T>>,
    options: NamedArgs<MenuSignature<T>>
  ) {
    if (!this.menu) {
      this.updater = new ReactiveUpdateStrategy();

      this.menu = new Menu(element as HTMLElement, {
        updater: this.updater
      });
    }

    if (options.check || options.select) {
      if (options.items && !(this.emitter instanceof IndexEmitStrategy)) {
        this.emitter = createIndexEmitter<T>(this.menu, { ...options, multi: true });
      } else if (!options.items && !(this.emitter instanceof ItemEmitStrategy)) {
        this.emitter = createItemEmitter<T>(this.menu, { ...options, multi: true });
      }
    }

    if (options.items && !isEqual(this.prevItems, options.items)) {
      this.updater.updateItems();
      this.prevItems = [...options.items];
    }

    let optionsChanged = false;

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
