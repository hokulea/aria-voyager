import type listbox from './modifiers/aria-listbox';
import type menu from './modifiers/aria-menu';
import type tablist from './modifiers/aria-tablist';

export default interface AriaVoyagerRegistry {
  'aria-listbox': typeof listbox;
  'aria-menu': typeof menu;
  'aria-tablist': typeof tablist;
}
