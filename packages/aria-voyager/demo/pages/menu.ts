import { Menu } from '#src';
import { createCodeMenu, withTriggerButton } from '#tests/menu/-shared';

const title = 'Menu';

const html = `
<h1>${title}</h1>

<div id="container" class="two-col"></div>
`;

function menuAsControl(parent: HTMLElement) {
  const { codeMenu } = createCodeMenu(parent);

  new Menu(codeMenu);
}

function menuWithTriggerButton(parent: HTMLElement) {
  const cont = document.createElement('div');

  parent.append(cont);

  const { codeMenu } = createCodeMenu(cont);

  codeMenu.classList.add('code-menu');

  const trigger = withTriggerButton(codeMenu, cont);

  trigger.classList.add('code-trigger');

  new Menu(codeMenu);
}

function load() {
  const parent = document.querySelector('#container') as HTMLElement;

  menuAsControl(parent);
  menuWithTriggerButton(parent);
}

export default { html, load, title };
