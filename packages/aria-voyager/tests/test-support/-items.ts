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

export function getControlItems<T extends ControlWithItems>(control: T): ControlItems {
  return {
    firstItem: control.items[0],
    secondItem: control.items[1],
    thirdItem: control.items[2],
    fourthItem: control.items[3],
    fifthItem: control.items[4],
    sixthItem: control.items[5],
    fourthLastItem: control.items.at(-4),
    thirdLastItem: control.items.at(-3),
    secondLastItem: control.items.at(-2),
    lastItem: control.items.at(-1)
  };
}
