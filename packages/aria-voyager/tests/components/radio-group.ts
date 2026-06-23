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
  options?: { checked?: boolean }
) {
  const elem = document.createElement('button');

  elem.type = 'button';
  elem.role = 'radio';

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

  setItems(items: string[]) {
    for (const item of items) {
      appendRadioItem(this.element, item);
    }

    this.radioGroup.readItems();
  }
}
