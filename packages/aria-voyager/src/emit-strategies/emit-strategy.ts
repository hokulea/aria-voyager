import type { Item } from '../controls/control';

export interface EmitterOptions<T> {
  select?(selection: T[]): void;
  activateItem?(item: T): void;
}

export interface EmitStrategy {
  selected(selection: Item[]): void;

  itemActivated(item?: Item): void;

  dispose?(): void;
}
