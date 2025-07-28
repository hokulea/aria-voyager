import { isItemOf } from '../controls/-utils';
import { type Control } from '../controls/control';

import type { UpdateStrategy } from './update-strategy';

export class DomObserverUpdateStrategy implements UpdateStrategy {
  // eslint-disable-next-line unicorn/consistent-function-scoping
  private observer: MutationObserver = new MutationObserver((changes) => {
    if (!this.control) {
      return;
    }

    const changedItems = changes.some((change) => change.type === 'childList');

    const itemAttributes = new Set(['aria-disabled']);
    const changedItemAttributes = changes.some(
      (change) =>
        change.type === 'attributes' &&
        isItemOf(change.target as HTMLElement, this.control as Control) &&
        itemAttributes.has(change.attributeName as string)
    );

    if (changedItems || changedItemAttributes) {
      this.control.readItems();
    }

    const optionAttributes = new Set([...this.control.optionAttributes, 'aria-disabled']);
    const changedOptions = changes.some(
      (change) =>
        change.target === (this.control as Control).element &&
        change.type === 'attributes' &&
        optionAttributes.has(change.attributeName as string)
    );

    if (changedOptions) {
      this.control.readOptions();
    }

    const changedSelection = changes.every(
      (c) => c.type === 'attributes' && c.attributeName === 'aria-selected'
    );

    if (changedSelection) {
      this.control.readSelection();
    }
  });

  constructor(private control?: Control) {
    this.observe();
  }

  private observe() {
    if (!this.control) {
      return;
    }

    this.observer.observe(this.control.element, {
      subtree: true,
      childList: true,
      attributes: true
    });
  }

  setControl(control: Control) {
    this.observer.disconnect();
    this.control = control;
    this.observe();
  }

  dispose() {
    this.control = undefined;
    this.observer.disconnect();
  }
}
