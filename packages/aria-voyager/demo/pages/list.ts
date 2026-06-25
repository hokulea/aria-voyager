import { List } from '#tests/components/list';

const title = 'List';

const html = `
<h1>${title}</h1>

<div id="normal">
Normal
</div>

<div id="multi">
Multi
</div>

<div id="check">
Check
</div>
`;

function load() {
  const parentNormal = document.querySelector('#normal') as HTMLElement;
  const listNormal = new List(parentNormal);

  listNormal.element.style.height = '250px';
  listNormal.element.style.position = 'relative';
  listNormal.element.ariaMultiSelectable = 'true';

  // eslint-disable-next-line unicorn/prefer-iterator-to-array
  listNormal.setItems([...Array.from({ length: 20 }).keys()].map((i) => `Item ${i + 1}`));

  const parentMulti = document.querySelector('#multi') as HTMLElement;
  const listMulti = new List(parentMulti);

  listMulti.element.style.height = '250px';
  listMulti.element.style.position = 'relative';
  listMulti.element.ariaMultiSelectable = 'true';

  // eslint-disable-next-line unicorn/prefer-iterator-to-array
  listMulti.setItems([...Array.from({ length: 20 }).keys()].map((i) => `Item ${i + 1}`));

  const parentCheck = document.querySelector('#check') as HTMLElement;
  const listCheck = new List(parentCheck, { behavior: { check: true } });

  listCheck.element.style.height = '250px';
  listCheck.element.style.position = 'relative';
  listCheck.element.dataset.check = 'true';

  // eslint-disable-next-line unicorn/prefer-iterator-to-array
  listCheck.setItems([...Array.from({ length: 20 }).keys()].map((i) => `Item ${i + 1}`));
}

export default { html, load, title };
