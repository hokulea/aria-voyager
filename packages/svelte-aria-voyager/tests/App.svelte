<script lang="ts">
  import List from './components/List.svelte';

  const FRUITS = ['Banana', 'Apple', 'Pear'];
  const POKEMON = ['Bulbasaur', 'Charmander', 'Squirtle', 'Pikachu'];

  let options = $state(FRUITS);
  let disabled = $state(false);
  let multi = $state(false);
</script>

<main>
  <h1>Vite + Svelte</h1>

  <div>
    <List items={options} {disabled} {multi}>
      {#snippet item(option)}
        <span>{option}</span>
      {/snippet}
    </List>
  </div>

  <button type="button" class="button" onclick={() => (options = FRUITS)}>Set to Fruits</button>
  <button type="button" class="button" onclick={() => (options = POKEMON)}>Set to Pokemon</button>

  <p class="read-the-docs">Click on the Vite and Svelte logos to learn more</p>
</main>

<style>
  .read-the-docs {
    color: #888;
  }
</style>
