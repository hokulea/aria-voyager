import { registerDestructor } from '@ember/destroyable';

import { IndexEmitStrategy, ItemEmitStrategy, Listbox, ReactiveUpdateStrategy } from 'aria-voyager';
import Modifier from 'ember-modifier';
import isEqual from 'lodash.isequal';

import {
  asArray,
  createIndexEmitter,
  createItemEmitter,
  type EmitterSignature,
  type WithItems
} from './-emitter.ts';

import type Owner from '@ember/owner';
import type { EmitStrategy } from 'aria-voyager';
import type { ArgsFor, NamedArgs, PositionalArgs } from 'ember-modifier';

interface ListboxSignature<T> {
  Args: {
    Positional: [];
    Named: { disabled?: boolean } & EmitterSignature<T>;
  };
}

export default class ListboxModifier<T> extends Modifier<ListboxSignature<T>> {
  private listbox?: Listbox;
  declare private updater: ReactiveUpdateStrategy;
  declare private emitter: EmitStrategy;

  private prevItems?: T[];
  private prevSelection?: T | T[];
  private prevMulti?: boolean;
  private prevDisabled?: boolean;

  constructor(owner: Owner, args: ArgsFor<ListboxSignature<T>>) {
    super(owner, args);

    registerDestructor(this, () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      this.listbox?.dispose();
    });
  }

  modify(
    element: Element,
    _: PositionalArgs<ListboxSignature<T>>,
    options: NamedArgs<ListboxSignature<T>>
  ) {
    if (!this.listbox) {
      this.updater = new ReactiveUpdateStrategy();

      this.listbox = new Listbox(element as HTMLElement, {
        updater: this.updater
      });
    }

    if (options.items && !(this.emitter instanceof IndexEmitStrategy)) {
      this.emitter = createIndexEmitter<T>(this.listbox, options);
    } else if (!options.items && !(this.emitter instanceof ItemEmitStrategy)) {
      this.emitter = createItemEmitter<T>(this.listbox, options);
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

    if (this.prevMulti !== options.multi) {
      if (options.multi) {
        element.setAttribute('aria-multiselectable', 'true');
      } else {
        element.removeAttribute('aria-multiselectable');
      }

      optionsChanged = true;

      this.prevMulti = options.multi;
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
