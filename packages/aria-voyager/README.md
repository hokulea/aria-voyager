# aria-voyager

_Canoe vessel that navigates your aria._

A framework agnostic / universal package that implements navigation patterns for
various aria roles and features.

## BYOM: Bring Your Own Markup

... and this library will make it interactive, according to applicable [ARIA
patterns](https://www.w3.org/WAI/ARIA/apg/patterns/). This library does not
apply styling, it will operate on the accessibility tree.

## Supported Features

See [`hokulea/aria-voyager`](https://github.com/hokulea/aria-voyager/) for a
full list of supported features.

## Installation

```sh
pnpm add aria-voyager
```

## Usage

### Controls

#### `Listbox`

Bring your own markup in at first, here is an example markup for a list:

```html
<ul role="listbox">
  <li role="option">Banana</li>
  <li role="option" aria-selected="true">Apple</li>
  <li role="option">Mango</li>
</ul>
```

To make it interactive, create a new `Listbox` instance pointing it at your element.

```ts
import { Listbox } from 'aria-voyager';

const listElement = document.querySelector('[role="listbox"]');
new Listbox(listElement);
```

That is already enough to start making your listbox interactive. It will read
the options from the provided HTML.

`Listbox` accepts options as second parameter:

```ts
import type { EmitStrategy, UpdateStrategy } from 'aria-voyager';

interface ListboxOptions {
  updater?: UpdateStrategy;
  emitter?: EmitStrategy;
}
```

See [updater](#updater) and [emitter](#emitter).

#### `Menu`

Bring your own markup in at first, here is an example markup for a menu:

```html
<div role="menu">
  <button role="menuitem">Version Info</button>
  <a role="menuitem" href="https://github.com/hokulea/aria-voyager" target="_blank">Github</a>
  <button role="menuitem" popovertarget="authormenu">Author</button>
  <div role="menu" id="authormenu" popover>
    <a role="menuitem" href="https://gos.si" target="_blank">Homepage</a>
    <a role="menuitem" href="https://github.com" target="_blank">Github</a>
  </div>
</div>
```

To make it interactive, create a new `Menu` instance pointing it at your element.

```ts
import { Menu } from 'aria-voyager';

const menuElement = document.querySelector('[role="menu"]');
new Menu(menuElement);
```

`Menu` accepts options as second parameter:

```ts
import type { EmitStrategy, UpdateStrategy } from 'aria-voyager';

interface MenuOptions {
  updater?: UpdateStrategy;
  emitter?: EmitStrategy;
}
```

See [updater](#updater) and [emitter](#emitter).

### Strategies

`aria-voyager` supports the concept of input (updater) and output (emitter)
through exchangeable strategies.

#### Updater

The job of an updater is to tell the controls, when new updates are available,
such as selection has changed, new elements were added or existing ones
removed from the DOM.

By default, `aria-voyager` uses the `DOMOberserverUpdateStrategy` which - as the
name suggests - observes the DOM for changes. So the controls stay updated from
your changes to the DOM.

That might be inefficient given different rendering strategies in the various
frontend frameworks flush changes more frequent than what seems the right dosis for
such a DOMObserver.

To optimize this, there is a blank `ReactiveUpdateStrategy`, which you can extend
to write a framework integration. With that you can hook into the reactivity
system of your framework and tell `aria-voyager` when updates are available.

#### Emitter

Controls are interactive elements, so you also want to know when things are
happening to react on user interactions.

Emitters are the way to receive those events. `aria-voyager` ships with two
strategies, that emit changes:

1. `IndexEmitStrategy` which tells you the indexes of the elements, based on the
   index of an elements amongst its children in the DOM.

2. `ItemEmitStrategy` which tells you which elements are changed.

Both are suited to write a framework integration to bridge between DOM and your
application code.
