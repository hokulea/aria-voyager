<script lang="ts" generics="Item extends unknown">
  import { ariaListbox } from '../../src';
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
    item?: Snippet<[Item]>;
  } & ListboxOptions<Item> = $props();

  function isSelected(option: Item) {
    return Array.isArray(selection) ? selection.includes(option) : selection === option;
  }
</script>

<div
  role="listbox"
  tabindex="0"
  use:ariaListbox={{
    items,
    selection,
    select,
    activateItem,
    disabled,
    multi
  }}
  class="list"
>
  {#each items as option}
    <span role="option" aria-selected={isSelected(option) ? 'true' : 'false'}>
      {#if item}
        {@render item(option)}
      {:else}
        {option}
      {/if}
    </span>
  {/each}
</div>
