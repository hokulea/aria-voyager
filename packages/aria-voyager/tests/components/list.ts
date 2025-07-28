// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Listbox } from '#src';

import styles from '@hokulea/core/controls.module.css';

import { getCompositeItems } from './-composites';

export function createListElement(parent: HTMLElement) {
  const element = document.createElement('div');

  element.role = 'listbox';

  element.classList.add(styles.list);

  parent.append(element);

  return element;
}

export function appendItemToList(item: string, parent: HTMLElement) {
  const elem = document.createElement('span');

  elem.append(item);
  elem.role = 'option';

  parent.append(elem);

  return elem;
}

export class List {
  element: HTMLDivElement;
  listbox: Listbox;

  constructor(parent: HTMLElement) {
    this.element = createListElement(parent);
    this.listbox = new Listbox(this.element);
  }

  get items() {
    return this.listbox.items;
  }

  setItems(items: string[]) {
    for (const item of items) {
      const elem = document.createElement('span');

      elem.append(item);
      elem.role = 'option';

      this.element.append(elem);
    }

    this.listbox.readItems();
  }
}

export function getItems(parent: HTMLElement) {
  return getCompositeItems(parent, '[role="option"]', '[role="listbox"]');
}
