import { registerDestructor } from '@ember/destroyable';

import { ItemEmitStrategy, RadioGroup, ReactiveUpdateStrategy } from 'aria-voyager';
import Modifier from 'ember-modifier';
import { isEqual } from 'es-toolkit/predicate';

import type Owner from '@ember/owner';
import type { EmitStrategy } from 'aria-voyager';
import type { ArgsFor, NamedArgs, PositionalArgs } from 'ember-modifier';

export interface RadioGroupSignature<T> {
  Element: HTMLElement;
  Args: {
    Positional: [];
    Named: {
      items?: T[];
      select?: (selection: HTMLElement) => void;
      disabled?: boolean;
    };
  };
}

export default class RadioGroupModifier<T> extends Modifier<RadioGroupSignature<T>> {
  private radioGroup?: RadioGroup;
  declare private updater: ReactiveUpdateStrategy;
  declare private emitter: EmitStrategy;

  private prevItems?: T[];
  private prevDisabled?: boolean;

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

    if (options.select && !(this.emitter instanceof ItemEmitStrategy)) {
      this.emitter = new ItemEmitStrategy(this.radioGroup, {
        select: (selection: HTMLElement[]) => {
          options.select?.(selection[0] as HTMLElement);
        }
      });
    }

    if (options.items && !isEqual(this.prevItems, options.items)) {
      this.updater.updateItems();
      this.prevItems = [...options.items];
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
