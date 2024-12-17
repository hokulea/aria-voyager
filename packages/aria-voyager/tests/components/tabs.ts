// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@hokulea/core/controls.module.css';

import { Tablist } from '../../src';
import { uniqueId } from '../../src/utils';
import { getCompositeItems } from './-composites';

import type { TablistOptions } from '../../src';

export function createTabElement(parent: HTMLElement) {
  const container = document.createElement('div');

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  container.classList.add(styles.tabs as string);

  parent.appendChild(container);

  const tablist = document.createElement('div');

  tablist.role = 'tablist';

  container.append(tablist);

  return { container, tablist };
}

export function appendTab(parent: HTMLElement, label: string, contents: string | HTMLElement) {
  const panel = document.createElement('div');
  const panelId = uniqueId();
  const tabId = uniqueId();

  panel.role = 'tabpanel';
  panel.id = panelId;
  panel.setAttribute('aria-labelledby', tabId);

  panel.append(contents);

  const labEl = document.createElement('span');

  labEl.append(label);

  const elem = document.createElement('button');

  elem.append(labEl);
  elem.id = tabId;
  elem.role = 'tab';
  elem.type = 'button';
  elem.setAttribute('aria-controls', panelId);

  const tablist = parent.querySelector('[role="tablist"]') as HTMLDivElement;

  tablist.appendChild(elem);

  parent.append(panel);

  return elem;
}

export function removeTab(tab: HTMLElement) {
  const panel = document.getElementById(tab.getAttribute('aria-controls') as string);

  tab.parentElement?.removeChild(tab);

  if (panel) {
    panel.parentElement?.removeChild(panel);
  }
}

export class Tabs {
  element: HTMLDivElement;
  tablist: Tablist;

  constructor(parent: HTMLElement, options?: TablistOptions) {
    const { container, tablist } = createTabElement(parent);

    this.element = container;
    this.tablist = new Tablist(tablist, options);
  }

  get items() {
    return this.tablist.items;
  }

  addTab(label: string, contents: string | HTMLElement) {
    appendTab(this.element, label, contents);
  }
}

export function getItems(parent: HTMLElement) {
  return getCompositeItems(parent, '[role="tab"]');
}
