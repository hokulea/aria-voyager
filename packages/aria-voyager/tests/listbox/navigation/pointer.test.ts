import { describe, expect, it } from 'vitest';

import { Listbox } from '../../../src';
import { createListWithFruits } from '../-shared';

// describe('propagation is stopped for items', () => {
//   let propagationStopped = false;

//   const event = new PointerEvent('pointerup', { bubbles: true });

//   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//   // @ts-ignore
//   event.__TEST__ = true;

//   const nativeStopPropagation = event.stopPropagation;

//   event.stopPropagation = function () {
//     propagationStopped = true;
//     nativeStopPropagation.call(this);
//   };

//   const list = createListWithFruits();

//   new Listbox(list);

//   it('propagation stops on item', () => {
//     propagationStopped = false;
//     list.children[1].dispatchEvent(event);
//     expect(propagationStopped).toBeTruthy();
//   });

//   it('propagation continues when not on item', () => {
//     propagationStopped = false;
//     list.dispatchEvent(event);
//     expect(propagationStopped).toBeFalsy();
//   });
// });

describe('use pointer to activate items', () => {
  const list = createListWithFruits();

  new Listbox(list);

  const firstItem = list.children[0];
  const secondItem = list.children[1];
  const thirdItem = list.children[2];

  expect(list.getAttribute('aria-activedescendant')).toBeNull();
  expect(firstItem.getAttribute('aria-current')).toBeNull();
  expect(secondItem.getAttribute('aria-current')).toBeNull();
  expect(thirdItem.getAttribute('aria-current')).toBeNull();

  it('select not an item does nothing', () => {
    list.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));

    expect(list.getAttribute('aria-activedescendant')).toBeNull();
    expect(firstItem.getAttribute('aria-current')).toBeNull();
    expect(secondItem.getAttribute('aria-current')).toBeNull();
    expect(thirdItem.getAttribute('aria-current')).toBeNull();
  });

  it('select second item', () => {
    secondItem.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));

    expect(list.getAttribute('aria-activedescendant')).toBe(secondItem.id);
    expect(firstItem.getAttribute('aria-current')).toBeNull();
    expect(secondItem.getAttribute('aria-current')).toBe('true');
    expect(thirdItem.getAttribute('aria-current')).toBeNull();
  });

  it('select third item', () => {
    thirdItem.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));

    expect(list.getAttribute('aria-activedescendant')).toBe(thirdItem.id);
    expect(firstItem.getAttribute('aria-current')).toBeNull();
    expect(secondItem.getAttribute('aria-current')).toBeNull();
    expect(thirdItem.getAttribute('aria-current')).toBe('true');
  });
});
