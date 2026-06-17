import { Group } from '#src';

const title = 'Group';

const html = `
<h1>${title}</h1>

<div id="container" class="button-group">
  <button class="button" data-intent="action" data-importance="supreme" aria-pressed="true" type="button">Italic</button>
  <button class="button" data-intent="alternative" data-importance="supreme" aria-pressed="true" type="button">Bold</button>
  <button class="button" data-intent="highlight" data-importance="supreme" aria-pressed="true" type="button">Underline</button>
</div>
`;

function load() {
  const parent = document.querySelector('#container') as HTMLElement;

  new Group(parent);
}

export default { html, load, title };
