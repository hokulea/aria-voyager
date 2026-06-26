import { type Control, IndexEmitStrategy, ItemEmitStrategy } from 'aria-voyager';

import type { Simplify } from 'type-fest';

export function asArray(val?: unknown) {
  if (val === undefined) {
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return Array.isArray(val) ? val : [val];
}

export type Items<T> = { items: T[] };
export type ActivateHandler<T> = { activateItem?: (item: T) => void };
export type CheckHandler<T> = { check?: (selection: T[]) => void; checks?: T[] };
export type SingleSelectionHandler<T> = {
  multi?: false;
  selection?: T;
  select?: (selection: T) => void;
};
export type MultiSelectionHandler<T> = {
  multi: true;
  selection?: T[];
  select?: (selection: T[]) => void;
};
export type SelectionHandler<T> = SingleSelectionHandler<T> | MultiSelectionHandler<T>;

export type WithItems<T> = SelectionHandler<T> & Items<T> & ActivateHandler<T> & CheckHandler<T>;

export type EmitterSignature<T> = Simplify<
  SelectionHandler<T> & (Items<T> | Partial<Items<T>>) & ActivateHandler<T> & CheckHandler<T>
>;

export function createItemEmitter<T>(control: Control, options: EmitterSignature<T>) {
  return new ItemEmitStrategy(control, {
    select: (selection: HTMLElement[]) => {
      (options.select as ((selection: HTMLElement | HTMLElement[]) => void) | undefined)?.(
        options.multi ? selection : (selection[0] as HTMLElement)
      );
    },

    check: (selection: HTMLElement[]) => {
      (options.check as ((selection: HTMLElement[]) => void) | undefined)?.(selection);
    },

    activateItem: (item: HTMLElement) => {
      (options.activateItem as ((item: HTMLElement) => void) | undefined)?.(item);
    }
  });
}

export function createIndexEmitter<T>(control: Control, options: EmitterSignature<T>) {
  const findByIndex = (index: number) => {
    return options.items?.[index] ?? undefined;
  };

  return new IndexEmitStrategy(control, {
    select: (selection: number[]) => {
      if (options.multi) {
        const items = selection
          .map((index) => findByIndex(index))
          .filter((i) => i !== undefined) as T[];

        options.select?.(items);
      } else {
        const item = findByIndex(selection[0] as number);

        if (item) {
          options.select?.(item);
        }
      }
    },

    check: (selection: number[]) => {
      const items = selection
        .map((index) => findByIndex(index))
        .filter((i) => i !== undefined) as T[];

      options.check?.(items);
    },

    activateItem: (index: number) => {
      const item = findByIndex(index);

      if (item) {
        options.activateItem?.(item);
      }
    }
  });
}
