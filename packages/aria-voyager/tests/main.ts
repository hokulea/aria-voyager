import './main.css';

import '@hokulea/core/style.css';
import '@hokulea/theme-moana/dist/moana.css';

import { Tabs } from './components/tabs';

const app = document.querySelector('#app') as HTMLElement;

// import { List } from './components/list';

// const list = new List(app);

// list.element.style.height = '300px';
// list.element.style.position = 'relative';
// // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
// list.setItems([...Array(20).keys()].map((i) => `Item ${i + 1}`));

const tabs = new Tabs(app, {
  behavior: {
    singleSelection: 'manual'
  }
});

tabs.tablist.element.setAttribute('aria-orientation', 'vertical');

for (let i = 1; i <= 5; i++) {
  tabs.addTab(`Tab ${i.toString()}`, `Content ${i.toString()}`);
}
