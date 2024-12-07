import type { Control, Item } from '../controls/control';
import type { EmitStrategy, EmitterOptions } from './emit-strategy';

export class ItemEmitStrategy implements EmitStrategy {
  constructor(
    private control: Control,
    private options: EmitterOptions<Item>
  ) {
    this.control = control;
    this.control.setEmitStrategy(this);
  }

  selected(selection: Item[]) {
    return this.options.select?.(selection);
  }

  itemActivated(item: Item) {
    return this.options.activateItem?.(item);
  }

  dispose(): void {
    // @ts-expect-error removing the reference here on purpose
    this.control = undefined;
  }
}
