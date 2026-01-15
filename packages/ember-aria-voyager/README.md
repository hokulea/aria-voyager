# ember-aria-voyager

[![Maintainability](https://qlty.sh/gh/hokulea/projects/aria-voyager/maintainability.svg)](https://qlty.sh/gh/hokulea/projects/aria-voyager)
[![Code Coverage](https://qlty.sh/gh/hokulea/projects/aria-voyager/coverage.svg)](https://qlty.sh/gh/hokulea/projects/aria-voyager)

_Canoe vessel that navigates your aria._

Ember reactivity bindings for [`aria-voyager`](https://github.com/hokulea/aria-voyager).

## BYOM: Bring Your Own Markup

... and this library will make it interactive, according to applicable [ARIA
patterns](https://www.w3.org/WAI/ARIA/apg/patterns/). This library does not
apply styling, it will operate on the accessibility tree.

## Supported Features

See [`hokulea/aria-voyager`](https://github.com/hokulea/aria-voyager/) for a
full list of supported features.

## Installation

```sh
pnpm add ember-aria-voyager
```

## Usage

### `{{ariaListbox}}`

Basic example:

```glimmer-ts
import { ariaListbox } from 'ember-aria-voyager';
const options = ['apple', 'banana', 'pineapple'];

<template>
  <ul role="listbox" {{ariaListbox items=options}}>
    {{#each options as |option|}}
      <li role="option">{{option}}</li>
    {{/each}}
  </ul>
</template>
```

Here are the options, you can pass to `{{ariaListbox}}`

```ts
type ListboxSignature<T = HTMLElement> = {
  items?: T[];
  selection?: T | T[];
  activateItem?: (item: T) => void;
} & (
  | {
      multi: true;
      select?: (selection: T[]) => void;
    }
  | {
      multi?: false;
      select?: (selection: T) => void;
    }
)
```

When passing `items` the `select()` and `selection` can work off of your passed items, anyway will fall back to the HTMLElement

Full example:

```glimmer-ts
import { ariaListbox } from 'ember-aria-voyager';
const options = ['apple', 'banana', 'pineapple'];
const context = new class {
  @tracked selection = [options[0]];
  @tracked disabled = false;
  
  select: (fruits: string[]) => {
    this.selection = fruits;
  }
};

const selection = ['banana'];

<template>
  <ul role="listbox" {{ariaListbox 
    items=options
    multi=true
    disabled=context.disabled
    selection=context.selection
    select=context.select
  }}>
    {{#each options as |option|}}
      <li role="option">{{option}}</li>
    {{/each}}
  </ul>
</template>
```

### `{{ariaMenu}}`

Basic example:

```glimmer-ts
import { ariaMenu } from 'ember-aria-voyager';

<template>
  <div role="menu" {{ariaMenu}}>
    <button role="menuitem">Version Info</button>
    <a role="menuitem" href="https://github.com/hokulea/aria-voyager" target="_blank">Github</a>
    <button role="menuitem" popovertarget="authormenu">Author</button>
    <div role="menu" id="authormenu" popover {{ariaMenu}}>
      <a role="menuitem" href="https://gos.si"  target="_blank">Homepage</a>
      <a role="menuitem" href="https://github.com" target="_blank">Github</a>
    </div>
  </div>
</template>
```

Here are the options, you can pass to `{{ariaMenu}}`

```ts
interface MenuSignature<T> {
  items?: T[];
  disabled?: boolean;
}
```

Here is a full example:

```glimmer-ts
import { ariaMenu } from 'ember-aria-voyager';
const items = [
  {
    label: 'Version Info',
    action: () => console.log('1.2.4');
  },
  {
    label 'Github',
    link: 'https://github.com/hokulea/aria-voyager'
  }
];

<template>
  <div role="menu" {{ariaMenu items=items}}>
    {{#each items as |item|}}
      {{#if item.action}}
        <button type="button" role="menuitem" {{on "click" item.action}}>{{item.label}}</button>
      {{else if item.link}}
        <a role="menuitem" href={{item.link}} target="_blank">{{item.label}}</a>
      {{else}}
        euw, what?
      {{/if}}
    {{/each}}
  </div>
</template>
```

### `{{ariaTablist}}`

Basic example:

```glimmer-ts
import { ariaTablist } from 'ember-aria-voyager';
const tabs = ['apple', 'banana', 'pineapple'];

<template>
  <div>
    <ul role="tablist" {{ariaTablist items=tabs}}>
      {{#each tabs as |tab id|}}
        <li role="tab" id="tab-{{id}}" aria-controls="panel-{{id}}">{{tab}}</li>
      {{/each}}
    </ul>

    {{#each tabs as |tab id|}}
      <div role="tabpanel" id="panel-{{id}}" aria-labelledby="tab-{{id}}">
        Contents Panel {{tab}}
      </div>
    {{/each}}
  <div>
</template>
```

Here are the options, you can pass to `{{ariaTablist}}`

```ts
import type { EmitStrategy, Orientation, TablistBehavior } from 'aria-voyager';

interface TablistSignature<T> {
  Element: HTMLElement;
  Args: {
    Positional: [];
    Named: {
      disabled?: boolean;
      orientation?: Orientation;
      behavior?: TablistBehavior;
    } & EmitterSignature<T>;
  };
}
```

When passing `items` the `select()` and `selection` can work off of your passed items, anyway will fall back to the HTMLElement

## Use in Classic Apps

`ember-aria-voyager` is primed to be used with polaris edition of ember using
imports. Classic v1 addons and v2 addons with compat automatically provide
re-exports, which this addon does not. Re-export it manually. Here is an example
for `ariaListbox`:

```ts
// app/modifiers/aria-listbox.js
export { ariaListbox as default } from 'ember-aria-voyager';
```
