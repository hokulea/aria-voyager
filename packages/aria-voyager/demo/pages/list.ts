import { List } from '#tests/components/list';

const title = 'List';

const html = `
<h1>${title}</h1>

<div id="container"></div>
`;

function load() {
  const parent = document.querySelector('#container') as HTMLElement;
  const list = new List(parent);

  list.element.style.height = '300px';
  list.element.style.position = 'relative';

  // eslint-disable-next-line unicorn/prefer-iterator-to-array
  list.setItems([...Array.from({ length: 20 }).keys()].map((i) => `Item ${i + 1}`));
}

export default { html, load, title };
