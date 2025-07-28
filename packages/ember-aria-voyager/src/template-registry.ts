import type listbox from './modifiers/aria-listbox';
import type menu from './modifiers/aria-menu';
import type tablist from './modifiers/aria-tablist';

export default interface AriaVoyagerRegistry {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  'aria-listbox': typeof listbox;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  'aria-menu': typeof menu;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  'aria-tablist': typeof tablist;
}
