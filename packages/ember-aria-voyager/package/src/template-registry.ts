import type listbox from './modifiers/listbox';
import type menu from './modifiers/menu';
import type tablist from './modifiers/tablist';

export default interface AriaVoyagerRegistry {
  listbox: typeof listbox;
  menu: typeof menu;
  tablist: typeof tablist;
}
