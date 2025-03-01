<script lang="ts" generics="Item extends unknown">
  import { ariaListbox } from '../../src';
  // @ts-ignore
  import styles from '@hokulea/core/controls.module.css';
  import type { Snippet } from 'svelte';
  import type { ListboxOptions } from '../../src/aria-listbox';

  let {
    items,
    selection,
    select,
    activateItem,
    item,
    disabled,
    multi
  }: {
    items: Item[];
    item: Snippet<[Item]>;
  } & ListboxOptions<Item> = $props();

  ariaListbox(document.createElement('div'), {
    items,
    selection,
    select,
    activateItem,
    disabled,
    multi
  });
</script>

<div
  role="listbox"
  use:ariaListbox={{
    items,
    selection,
    select,
    activateItem,
    disabled,
    multi
  }}
  class={styles.list}
>
  {#each items as option}
    <span role="option" aria-selected="false">
      {@render item(option)}
    </span>
  {/each}
</div>
