import { default as ariaListbox } from './modifiers/aria-listbox.ts';
import { default as ariaMenu } from './modifiers/aria-menu.ts';
import { default as ariaTablist } from './modifiers/aria-tablist.ts';

export type { Orientation, TablistBehavior } from 'aria-voyager';

export {
  ariaListbox,
  ariaMenu,
  ariaTablist,
  /** @deprecated use `ariaListbox` */
  ariaListbox as listbox,
  /** @deprecated use `ariaMenu` */
  ariaMenu as menu,
  /** @deprecated use `ariaTablist` */
  ariaTablist as tablist
};
