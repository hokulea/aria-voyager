import { Group } from '#src';

export function createButtonGroup(parent = document.body) {
  const container = document.createElement('div');

  for (let i = 1; i <= 5; i++) {
    const btn = document.createElement('button');

    btn.setAttribute('type', 'button');
    btn.append(`Button ${i}`);

    container.append(btn);
  }

  const group = new Group(container);

  parent.append(container);

  return { container, group };
}

export function getGroupItems(list: Group) {
  return {
    firstItem: list.items[0],
    secondItem: list.items[1],
    thirdItem: list.items[2],
    fourthItem: list.items[3],
    fifthItem: list.items[4],
    sixthItem: list.items[5],
    // ...
    fourthLastItem: list.items.at(-4) as HTMLElement,
    thirdLastItem: list.items.at(-3) as HTMLElement,
    secondLastItem: list.items.at(-2) as HTMLElement,
    lastItem: list.items.at(-1) as HTMLElement
  };
}
