import { type Control, type EmitStrategy, IndexEmitStrategy, ItemEmitStrategy } from 'aria-voyager';

export function asArray(val?: unknown) {
  if (val === undefined) {
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return Array.isArray(val) ? val : [val];
}

export type WithItems<T> = (
  | {
      multi?: boolean;
      select?: ((selection: T[]) => void) | ((selection: T) => void);
      check?: ((selection: T[]) => void) | ((selection: T) => void);
    }
  | {
      multi: true;
      select?: (selection: T[]) => void;
      check?: (selection: T[]) => void;
    }
  | {
      multi?: false;
      select?: (selection: T) => void;
      check?: (selection: T) => void;
    }
) & {
  items: T[];
  selection?: T | T[];
  activateItem?: (item: T) => void;
};

export type OptionalItems = (
  | {
      multi?: boolean;
      select?: ((selection: HTMLElement[]) => void) | ((selection: HTMLElement) => void);
      check?: ((selection: HTMLElement[]) => void) | ((selection: HTMLElement) => void);
    }
  | {
      multi: true;
      select?: (selection: HTMLElement[]) => void;
      check?: (selection: HTMLElement[]) => void;
    }
  | {
      multi?: false;
      select?: (selection: HTMLElement) => void;
      check?: (selection: HTMLElement) => void;
    }
) & {
  items?: HTMLElement[];
  selection?: HTMLElement | HTMLElement[];
  activateItem?: (item: HTMLElement) => void;
};

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

export function createItemEmitter<T>(control: Control, options: EmitterSignature<T>): EmitStrategy {
  return new ItemEmitStrategy(control, {
    select: (selection: HTMLElement[]) => {
      (options.select as ((selection: HTMLElement | HTMLElement[]) => void) | undefined)?.(
        options.multi ? selection : selection[0]
      );
    },

    check: (selection: HTMLElement[]) => {
      (options.check as ((selection: HTMLElement | HTMLElement[]) => void) | undefined)?.(
        options.multi ? selection : selection[0]
      );
    },

    activateItem: (item: HTMLElement) => {
      (options.activateItem as ((item: HTMLElement) => void) | undefined)?.(item);
    }
  });
}

export function createIndexEmitter<T>(
  control: Control,
  options: EmitterSignature<T>
): EmitStrategy {
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

    check: (selection: number[]) => {
      if (options.multi) {
        const items = selection
          .map((index) => findByIndex(index))
          .filter((i) => i !== undefined) as T[];

        (options.check as ((selection: T[]) => void) | undefined)?.(items);
      } else {
        const item = findByIndex(selection[0]);

        if (item) {
          (options.check as ((selection: T) => void) | undefined)?.(item);
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
