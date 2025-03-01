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

// interface ListboxSignature<T> {
//   Args: {
//     Positional: [];
//     Named: { disabled?: boolean } & EmitterSignature<T>;
//   };
// }

// export default class ListboxModifier<T> extends Modifier<ListboxSignature<T>> {
//   private listbox?: Listbox;
//   declare private updater: ReactiveUpdateStrategy;
//   declare private emitter: EmitStrategy;

//   private prevItems?: T[];
//   private prevSelection?: T | T[];
//   private prevMulti?: boolean;
//   private prevDisabled?: boolean;

//   constructor(owner: Owner, args: ArgsFor<ListboxSignature<T>>) {
//     super(owner, args);

//     registerDestructor(this, () => {
//       // eslint-disable-next-line @typescript-eslint/no-unsafe-call
//       this.listbox?.dispose();
//     });
//   }

//   modify(
//     element: Element,
//     _: PositionalArgs<ListboxSignature<T>>,
//     options: NamedArgs<ListboxSignature<T>>
//   ) {
//     if (!this.listbox) {
//       this.updater = new ReactiveUpdateStrategy();

//       this.listbox = new Listbox(element as HTMLElement, {
//         updater: this.updater
//       });
//     }

//     if (options.items && !(this.emitter instanceof IndexEmitStrategy)) {
//       this.emitter = createIndexEmitter<T>(this.listbox, options);
//     } else if (!options.items && !(this.emitter instanceof ItemEmitStrategy)) {
//       this.emitter = createItemEmitter<T>(this.listbox, options);
//     }

//     if (options.items && !isEqual(this.prevItems, (options as WithItems<T>).items)) {
//       this.updater.updateItems();
//       this.prevItems = [...(options as WithItems<T>).items];
//     }

//     if (options.selection && !isEqual(asArray(this.prevSelection), asArray(options.selection))) {
//       this.updater.updateSelection();
//       this.prevSelection = asArray(options.selection);
//     }

//     let optionsChanged = false;

//     if (this.prevMulti !== options.multi) {
//       if (options.multi) {
//         element.setAttribute('aria-multiselectable', 'true');
//       } else {
//         element.removeAttribute('aria-multiselectable');
//       }

//       optionsChanged = true;

//       this.prevMulti = options.multi;
//     }

//     if (this.prevDisabled !== options.disabled) {
//       if (options.disabled) {
//         element.setAttribute('aria-disabled', 'true');
//       } else {
//         element.removeAttribute('aria-disabled');
//       }

//       optionsChanged = true;

//       this.prevDisabled = options.disabled;
//     }

//     if (optionsChanged) {
//       this.updater.updateOptions();
//     }
//   }
// }

export type ListboxOptions<T = unknown> = { disabled?: boolean } & EmitterSignature<T>;

function setMulti(element: HTMLElement, multi = false) {
  if (multi) {
    element.setAttribute('aria-multiselectable', 'true');
  } else {
    element.removeAttribute('aria-multiselectable');
  }
}

function setDisabled(element: HTMLElement, disabled = false) {
  if (disabled) {
    element.setAttribute('aria-disabled', 'true');
  } else {
    element.removeAttribute('aria-disabled');
  }
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
      console.log({ updatedParam: updates });

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

// ariaListbox(document.createElement('div'), {
//   items: ['Banana', 'Apple', 'Pear'],
//   select: (selection: string) => {}
// });
