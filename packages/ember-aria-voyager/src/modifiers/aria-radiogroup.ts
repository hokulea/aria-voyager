import { registerDestructor } from '@ember/destroyable';

import {
  IndexEmitStrategy,
  ItemEmitStrategy,
  RadioGroup,
  ReactiveUpdateStrategy
} from 'aria-voyager';
import Modifier from 'ember-modifier';
import { isEqual } from 'es-toolkit/predicate';

import {
  type ActivateHandler,
  createIndexEmitter,
  createItemEmitter,
  type Items,
  type SingleSelectionHandler
} from '#src/modifiers/-emitter.ts';

import type Owner from '@ember/owner';
import type { EmitStrategy } from 'aria-voyager';
import type { ArgsFor, NamedArgs, PositionalArgs } from 'ember-modifier';
import type { Simplify } from 'type-fest';

type RadioGroupOptions<T> = Simplify<
  SingleSelectionHandler<T> &
    (Items<T> | Partial<Items<T>>) &
    ActivateHandler<T> & { disabled?: boolean }
>;

export interface RadioGroupSignature<T> {
  Element: HTMLElement;
  Args: {
    Positional: [];
    Named: RadioGroupOptions<T>;
  };
}

export default class RadioGroupModifier<T> extends Modifier<RadioGroupSignature<T>> {
  private radioGroup?: RadioGroup;
  declare private updater: ReactiveUpdateStrategy;
  declare private emitter: EmitStrategy;

  private prevItems?: T[];
  private prevDisabled?: boolean;
  private prevSelection?: T;

  constructor(owner: Owner, args: ArgsFor<RadioGroupSignature<T>>) {
    super(owner, args);

    registerDestructor(this, () => {
      this.radioGroup?.dispose();
    });
  }

  modify(
    element: Element,
    _: PositionalArgs<RadioGroupSignature<T>>,
    options: NamedArgs<RadioGroupSignature<T>>
  ) {
    if (!this.radioGroup) {
      this.updater = new ReactiveUpdateStrategy();

      this.radioGroup = new RadioGroup(element as HTMLElement, {
        updater: this.updater
      });
    }

    if (options.select) {
      if (options.items && !(this.emitter instanceof IndexEmitStrategy)) {
        this.emitter = createIndexEmitter<T>(this.radioGroup, options);
      } else if (!options.items && !(this.emitter instanceof ItemEmitStrategy)) {
        this.emitter = createItemEmitter<T>(this.radioGroup, options);
      }
    }

    if (options.items && !isEqual(this.prevItems, options.items)) {
      this.updater.updateItems();
      this.prevItems = [...options.items];
    }

    if (options.selection && options.selection !== this.prevSelection) {
      this.updater.updateSelection();
      this.prevSelection = options.selection;
    }

    if (this.prevDisabled !== options.disabled) {
      if (options.disabled) {
        element.setAttribute('aria-disabled', 'true');
      } else {
        element.removeAttribute('aria-disabled');
      }

      this.prevDisabled = options.disabled;

      this.updater.updateOptions();
    }
  }
}
