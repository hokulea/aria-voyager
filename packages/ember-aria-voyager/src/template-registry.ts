import type group from './modifiers/aria-group';
import type listbox from './modifiers/aria-listbox';
import type menu from './modifiers/aria-menu';
import type radiogroup from './modifiers/aria-radiogroup';
import type tablist from './modifiers/aria-tablist';

export default interface AriaVoyagerRegistry {
  'aria-group': typeof group;
  'aria-listbox': typeof listbox;
  'aria-menu': typeof menu;
  'aria-radiogroup': typeof radiogroup;
  'aria-tablist': typeof tablist;
}
