// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@hokulea/core/controls.module.css';

import { Listbox } from '../../src';
import { getCompositeItems } from './-composites';

export function createListElement(parent: HTMLElement) {
  const element = document.createElement('div');

  element.role = 'listbox';
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  element.classList.add(styles.list as string);

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

export function getItems(parent: HTMLElement) {
  return getCompositeItems(parent, '[role="option"]', '[role="listbox"]');
}
