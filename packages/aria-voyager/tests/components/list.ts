import styles from '@hokulea/core/controls.module.css';

import { Listbox } from '../../src';

export function createListElement(parent: HTMLElement) {
  const element = document.createElement('div');

  element.role = 'listbox';
  element.classList.add(styles.list);

  parent.appendChild(element);

  return element;
}

export function appendItemToList(item: string, parent: HTMLElement) {
  const elem = document.createElement('span');

  elem.append(item);
  elem.role = 'option';

  parent.appendChild(elem);

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

      this.element.appendChild(elem);
    }

    this.listbox.readItems();
  }
}
