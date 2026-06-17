import { Tablist } from '#src';
import { appendTab, createTabElement } from '#tests/components/tabs';

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
