import { type Control, IndexEmitStrategy, ItemEmitStrategy } from 'aria-voyager';

export function asArray(val?: unknown) {
  if (val === undefined) {
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return Array.isArray(val) ? val : [val];
}

export type WithItems<T> = {
  items: T[];
  selection?: T | T[];
  activateItem?: (item: T) => void;
} & (
  | {
      multi?: boolean;
      select?: ((selection: T[]) => void) | ((selection: T) => void);
    }
  | {
      multi: true;
      select?: (selection: T[]) => void;
    }
  | {
      multi?: false;
      select?: (selection: T) => void;
    }
);

export type OptionalItems = {
  items?: HTMLElement[];
  selection?: HTMLElement | HTMLElement[];
  activateItem?: (item: HTMLElement) => void;
} & (
  | {
      multi?: boolean;
      select?: ((selection: HTMLElement[]) => void) | ((selection: HTMLElement) => void);
    }
  | {
      multi: true;
      select?: (selection: HTMLElement[]) => void;
    }
  | {
      multi?: false;
      select?: (selection: HTMLElement) => void;
    }
);

export type EmitterSignature<T> = T extends never ? OptionalItems : WithItems<T>;
// export type EmitterSignature<T = HTMLElement> = (T extends HTMLElement
//   ? {
//       items?: HTMLElement[];
//     }
//   : {
//       items: T[];
//     }) & {
//   selection?: T | T[];
//   activateItem?: (item: T) => void;
// } & (
//     | {
//         multi?: boolean;
//         select?: ((selection: T[]) => void) | ((selection: T) => void);
//       }
//     | {
//         multi: true;
//         select?: (selection: T[]) => void;
//       }
//     | {
//         multi?: false;
//         select?: (selection: T) => void;
//       }
//   );

export function createItemEmitter<T>(control: Control, options: EmitterSignature<T>) {
  return new ItemEmitStrategy(control, {
    select: (selection: HTMLElement[]) => {
      (options.select as ((selection: HTMLElement | HTMLElement[]) => void) | undefined)?.(
        options.multi ? selection : selection[0]
      );
    },

    activateItem: (item: HTMLElement) => {
      (options.activateItem as ((item: HTMLElement) => void) | undefined)?.(item);
    }
  });
}

export function createIndexEmitter<T>(control: Control, options: EmitterSignature<T>) {
  const findByIndex = (index: number) => {
    return (options as WithItems<T>).items[index] ?? undefined;
  };

  return new IndexEmitStrategy(control, {
    select: (selection: number[]) => {
      if (options.multi) {
        const items = selection
          .map((index) => findByIndex(index))
          .filter((i) => i !== undefined) as T[];

        (options.select as ((selection: T[]) => void) | undefined)?.(items);
      } else {
        const item = findByIndex(selection[0]);

        if (item) {
          (options.select as ((selection: T) => void) | undefined)?.(item);
        }
      }
    },

    activateItem: (index: number) => {
      const item = findByIndex(index);

      if (item) {
        (options.activateItem as ((item: T) => void) | undefined)?.(item);
      }
    }
  });
}
