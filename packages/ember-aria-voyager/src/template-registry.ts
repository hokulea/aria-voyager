import type group from './modifiers/aria-group';
import type listbox from './modifiers/aria-listbox';
import type menu from './modifiers/aria-menu';
import type tablist from './modifiers/aria-tablist';

export default interface AriaVoyagerRegistry {
  'aria-group': typeof group;
  'aria-listbox': typeof listbox;
  'aria-menu': typeof menu;
  'aria-tablist': typeof tablist;
}
