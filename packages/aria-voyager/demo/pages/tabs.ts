import { Tabs } from '#tests/components/tabs';

const title = 'Tabs';

const html = `
<h1>${title}</h1>

<div id="container"></div>
`;

function load() {
  const parent = document.querySelector('#container') as HTMLElement;
  const tabs = new Tabs(parent, {
    behavior: {
      singleSelection: 'manual'
    }
  });

  tabs.tablist.element.setAttribute('aria-orientation', 'vertical');

  for (let i = 1; i <= 5; i++) {
    tabs.addTab(`Tab ${i.toString()}`, `Content ${i.toString()}`);
  }
}

export default { html, load, title };
