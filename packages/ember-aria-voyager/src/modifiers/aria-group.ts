import { registerDestructor } from '@ember/destroyable';

import { Group, ReactiveUpdateStrategy } from 'aria-voyager';
import Modifier from 'ember-modifier';
import { isEqual } from 'es-toolkit/predicate';

import type Owner from '@ember/owner';
import type { EmitStrategy } from 'aria-voyager';
import type { ArgsFor, NamedArgs, PositionalArgs } from 'ember-modifier';

export interface GroupSignature<T> {
  Element: HTMLElement;
  Args: {
    Positional: [];
    Named: {
      items?: T[];
      disabled?: boolean;
    };
  };
}

export default class GroupModifier<T> extends Modifier<GroupSignature<T>> {
  private group?: Group;
  declare private updater: ReactiveUpdateStrategy;
  declare private emitter: EmitStrategy;

  private prevItems?: T[];
  private prevDisabled?: boolean;

  constructor(owner: Owner, args: ArgsFor<GroupSignature<T>>) {
    super(owner, args);

    registerDestructor(this, () => {
      this.group?.dispose();
    });
  }

  modify(
    element: Element,
    _: PositionalArgs<GroupSignature<T>>,
    options: NamedArgs<GroupSignature<T>>
  ) {
    if (!this.group) {
      this.updater = new ReactiveUpdateStrategy();

      this.group = new Group(element as HTMLElement, {
        updater: this.updater
      });
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
