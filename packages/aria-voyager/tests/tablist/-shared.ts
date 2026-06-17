import { afterAll, beforeAll } from 'vitest';

import { Tablist } from '#src';
import { appendTab, createTabElement } from '#tests/components/tabs';

import { getControlItems } from '#tests/test-support/-items';
import { setupTest } from '#tests/test-support/setup-test';

import type { TablistOptions } from '#src';

export function createTabs(options?: TablistOptions) {
  const { container, tablist } = createTabElement(document.body);

  for (let i = 1; i <= 5; i++) {
    appendTab(container, `Tab ${i.toString()}`, `Content ${i.toString()}`);
  }

  const tabs = new Tablist(tablist, options);

  return { container, tablist, tabs };
}

export function getTabItems(tabs: Tablist) {
  return {
    firstItem: tabs.items[0],
    secondItem: tabs.items[1],
    thirdItem: tabs.items[2],
    fourthItem: tabs.items[3],
    fifthItem: tabs.items[4],
    // ...
    fourthLastItem: tabs.items.at(-4) as HTMLElement,
    thirdLastItem: tabs.items.at(-3) as HTMLElement,
    secondLastItem: tabs.items.at(-2) as HTMLElement,
    lastItem: tabs.items.at(-1) as HTMLElement
  };
}

export type TabsContext = {
  tabs: Tablist;
  container: HTMLElement;
  tablist: HTMLElement;
  firstItem: HTMLElement;
  secondItem: HTMLElement;
  thirdItem: HTMLElement;
  fourthItem: HTMLElement;
  fifthItem: HTMLElement;
  sixthItem: HTMLElement;
  fourthLastItem: HTMLElement;
  thirdLastItem: HTMLElement;
  secondLastItem: HTMLElement;
  lastItem: HTMLElement;
};

export interface SetupTabsOptions extends TablistOptions {
  tabCount?: number;
}

export function setupTabs(options?: SetupTabsOptions): TabsContext {
  setupTest();

  const ctx: Partial<TabsContext> = {};
  const result = {} as TabsContext;

  const properties: (keyof TabsContext)[] = [
    'tabs',
    'container',
    'tablist',
    'firstItem',
    'secondItem',
    'thirdItem',
    'fourthItem',
    'fifthItem',
    'sixthItem',
    'fourthLastItem',
    'thirdLastItem',
    'secondLastItem',
    'lastItem'
  ];

  for (const prop of properties) {
    Object.defineProperty(result, prop, {
      get: () => ctx[prop],
      enumerable: true
    });
  }

  beforeAll(() => {
    const { container, tablist } = createTabElement(document.body);

    ctx.container = container;
    ctx.tablist = tablist;

    const count = options?.tabCount ?? 5;

    for (let i = 1; i <= count; i++) {
      appendTab(container, `Tab ${i.toString()}`, `Content ${i.toString()}`);
    }

    ctx.tabs = new Tablist(tablist, options);

    // Populate items
    const items = getControlItems(ctx.tabs);

    Object.assign(ctx, items);
  });

  afterAll(() => {
    ctx.tabs?.dispose();
  });

  return result;
}
