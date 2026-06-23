import type { Control } from '#src/controls/control';
import type { UpdateStrategy } from '#src/update-strategies/update-strategy';

export class ReactiveUpdateStrategy implements UpdateStrategy {
  constructor(private control?: Control) {}

  setControl(control: Control) {
    this.control = control;
  }

  updateItems() {
    this.control?.readItems();
  }

  updateSelection() {
    if (this.control?.usesSelection()) {
      this.control.readSelection();
    }
  }

  updateOptions() {
    this.control?.readOptions();
  }

  dispose() {
    this.control = undefined;
  }
}
