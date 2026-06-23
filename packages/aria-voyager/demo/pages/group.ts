import { Group, RadioGroup } from '#src';

const title = 'Group';

const html = `
<h1>${title}</h1>

<div id="container1" class="button-group">
  <button class="button" data-intent="action" data-importance="supreme" aria-pressed="true" type="button">Italic</button>
  <button class="button" data-intent="alternative" data-importance="supreme" aria-pressed="true" type="button">Bold</button>
  <button class="button" data-intent="highlight" data-importance="supreme" aria-pressed="true" type="button">Underline</button>
</div>

<div id="container2" class="button-group">
  <button class="button" data-intent="action" data-importance="supreme" aria-pressed="true" type="button">Italic</button>
  <button class="button" data-intent="alternative" data-importance="supreme" aria-pressed="true" type="button">Bold</button>
  <button class="button" data-intent="highlight" data-importance="supreme" aria-pressed="true" type="button">Underline</button>
</div>

<h1>Radio Group</h1>

<div id="container3" class="button-group">
  <button class="button" role="radio" data-intent="action" data-importance="supreme" aria-checked="true" type="button">Left</button>
  <button class="button" role="radio" data-intent="alternative" data-importance="supreme" aria-checked="true" type="button">Center</button>
  <button class="button" role="radio" data-intent="highlight" data-importance="supreme" aria-checked="true" type="button">Right</button>
  <button class="button" role="radio" data-intent="highlight" data-importance="supreme" aria-checked="true" type="button">Justified</button>
</div>

<div id="container4" class="button-group">
  <button class="button" role="radio" data-intent="action" data-importance="supreme" aria-checked="true" type="button">Left</button>
  <button class="button" role="radio" data-intent="alternative" data-importance="supreme" aria-checked="true" type="button">Center</button>
  <button class="button" role="radio" data-intent="highlight" data-importance="supreme" aria-checked="true" type="button">Right</button>
  <button class="button" role="radio" data-intent="highlight" data-importance="supreme" aria-checked="true" type="button">Justified</button>
</div>
`;

function load() {
  new Group(document.querySelector('#container1') as HTMLElement);
  new Group(document.querySelector('#container2') as HTMLElement);
  new RadioGroup(document.querySelector('#container3') as HTMLElement);
  new RadioGroup(document.querySelector('#container4') as HTMLElement);
}

export default { html, load, title };
