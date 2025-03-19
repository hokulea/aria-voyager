import { IndexEmitStrategy, ItemEmitStrategy, Listbox, ReactiveUpdateStrategy } from 'aria-voyager';
import isEqual from 'lodash.isequal';

import {
  asArray,
  createIndexEmitter,
  createItemEmitter,
  type EmitterSignature,
  type WithItems
} from './-emitter';

import type { EmitStrategy } from 'aria-voyager';

export type ListboxOptions<T = unknown> = { disabled?: boolean } & EmitterSignature<T>;

function setAriaAttribute(element: HTMLElement, attribute: string, present: boolean) {
  if (present) {
    element.setAttribute(attribute, 'true');
  } else {
    element.removeAttribute(attribute);
  }
}

function setMulti(element: HTMLElement, multi = false) {
  setAriaAttribute(element, 'aria-multiselectable', multi);
}

function setDisabled(element: HTMLElement, disabled = false) {
  setAriaAttribute(element, 'aria-disabled', disabled);
}

export function ariaListbox<T>(element: HTMLElement, options: ListboxOptions<T>) {
  setMulti(element, options.multi);
  setDisabled(element, options.disabled);

  const updater = new ReactiveUpdateStrategy();
  const listbox = new Listbox(element, {
    updater
  });

  let items = options.items;
  let selection = options.selection;

  let emitter: EmitStrategy = options.items
    ? createIndexEmitter<T>(listbox, options)
    : createItemEmitter<T>(listbox, options);

  return {
    update: (updates: Partial<ListboxOptions<T>>) => {
      // callbacks
      options.select = updates.select ?? options.select;
      options.activateItem = updates.activateItem ?? options.activateItem;

      // attributes
      let optionsChanged = false;

      if ('disabled' in updates && options.disabled !== updates.disabled) {
        options.disabled = updates.disabled;
        setDisabled(element, options.disabled);

        optionsChanged = true;
      }

      if ('multi' in updates && options.multi !== updates.multi) {
        options.multi = updates.multi;
        setMulti(element, options.multi);

        optionsChanged = true;
      }

      // items
      if (updates.items && !(emitter instanceof IndexEmitStrategy)) {
        emitter = createIndexEmitter<T>(listbox, options);
      } else if (!updates.items && !(emitter instanceof ItemEmitStrategy)) {
        emitter = createItemEmitter<T>(listbox, options);
      }

      if (updates.items && !isEqual(items, (updates as WithItems<T>).items)) {
        updater.updateItems();
        items = (updates as WithItems<T>).items;
      }

      // selection
      if (updates.selection && !isEqual(asArray(selection), asArray(updates.selection))) {
        updater.updateSelection();
        selection = asArray(updates.selection);
      }

      // attributes
      if (optionsChanged) {
        updater.updateOptions();
      }
    },
    destroy: () => {
      listbox.dispose();
    }
  };
}
