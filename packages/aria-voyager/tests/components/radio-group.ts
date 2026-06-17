import { RadioGroup } from '#src';

export function createRadioGroupElement(parent: HTMLElement) {
  const element = document.createElement('div');

  element.role = 'radiogroup';

  element.classList.add('radiogroup');

  parent.append(element);

  return element;
}

export function appendRadioItem(
  parent: HTMLElement,
  label: string,
  options?: { group?: string; checked?: boolean }
) {
  const elem = document.createElement('button');

  elem.type = 'button';
  elem.role = 'radio';

  if (options?.group) {
    elem.dataset.group = options.group;
  }

  if (options?.checked) {
    elem.setAttribute('aria-checked', 'true');
  }

  elem.append(label);

  parent.append(elem);

  return elem;
}

export class RadioButtonGroup {
  element: HTMLDivElement;
  radioGroup: RadioGroup;

  constructor(parent: HTMLElement) {
    this.element = createRadioGroupElement(parent);
    this.radioGroup = new RadioGroup(this.element);
  }

  get items() {
    return this.radioGroup.items;
  }

  setItems(items: string[], options?: { group?: string }) {
    for (const item of items) {
      appendRadioItem(this.element, item, { group: options?.group });
    }

    this.radioGroup.readItems();
  }
}

export function createRadioGroup(parent: HTMLElement, items: string[]) {
  const element = createRadioGroupElement(parent);

  for (const item of items) {
    appendRadioItem(element, item);
  }

  const radioGroup = new RadioGroup(element);

  return { element, radioGroup };
}

export function getItems(radioGroup: RadioGroup) {
  return {
    firstItem: radioGroup.items[0],
    secondItem: radioGroup.items[1],
    thirdItem: radioGroup.items[2],
    fourthItem: radioGroup.items[3],
    fifthItem: radioGroup.items[4],
    sixthItem: radioGroup.items[5],
    fourthLastItem: radioGroup.items.at(-4) as HTMLElement,
    thirdLastItem: radioGroup.items.at(-3) as HTMLElement,
    secondLastItem: radioGroup.items.at(-2) as HTMLElement,
    lastItem: radioGroup.items.at(-1) as HTMLElement
  };
}
