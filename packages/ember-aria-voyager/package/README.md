# ember-aria-voyager

[![Test Coverage](https://api.codeclimate.com/v1/badges/6bd88c10540e66d94e2a/test_coverage)](https://codeclimate.com/github/hokulea/aria-voyager/test_coverage)
[![Maintainability](https://api.codeclimate.com/v1/badges/6bd88c10540e66d94e2a/maintainability)](https://codeclimate.com/github/hokulea/aria-voyager/maintainability)

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

### `{{listbox}}`

Basic example:

```glimmer-ts
import { listbox } from 'ember-aria-voyager';
const options = ['apple', 'banana', 'pineapple'];

<template>
  <ul role="listbox" {{listbox items=options}}>
    {{#each options as |option|}}
      <li role="option">{{option}}</li>
    {{/each}}
  </ul>
</template>
```

Here are the options, you can pass to `{{listbox}}`

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
import { listbox } from 'ember-aria-voyager';
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
  <ul role="listbox" {{listbox 
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

### `{{menu}}`

Basic example:

```glimmer-ts
import { menu } from 'ember-aria-voyager';

<template>
  <div role="menu" {{menu}}>
    <button role="menuitem">Version Info</button>
    <a role="menuitem" href="https://github.com/hokulea/aria-voyager" target="_blank">Github</a>
    <button role="menuitem" popovertarget="authormenu">Author</button>
    <div role="menu" id="authormenu" popover {{menu}}>
      <a role="menuitem" href="https://gos.si"  target="_blank">Homepage</a>
      <a role="menuitem" href="https://github.com" target="_blank">Github</a>
    </div>
  </div>
</template>
```

Here are the options, you can pass to `{{menu}}`

```ts
interface MenuSignature<T> {
  items?: T[];
  disabled?: boolean;
}
```

Here is a full example:

```glimmer-ts
import { menu } from 'ember-aria-voyager';
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
  <div role="menu" {{menu items=items}}>
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
