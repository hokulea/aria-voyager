import type { Control } from '#src';

export interface ControlWithItems {
  items: HTMLElement[];
}

export interface ControlItems {
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
}

export function getControlItems(control: Control): ControlItems {
  return {
    firstItem: control.items[0],
    secondItem: control.items[1],
    thirdItem: control.items[2],
    fourthItem: control.items[3],
    fifthItem: control.items[4],
    sixthItem: control.items[5],
    fourthLastItem: control.items.at(-4) as HTMLElement,
    thirdLastItem: control.items.at(-3) as HTMLElement,
    secondLastItem: control.items.at(-2) as HTMLElement,
    lastItem: control.items.at(-1) as HTMLElement
  };
}
