/* eslint-disable import/no-unassigned-import */
import './main.css';

import '@hokulea/core/index.css';
import '@hokulea/theme-moana/dist/moana.css';

import { List } from './components/list';

const app = document.getElementById('app') as HTMLElement;

const list = new List(app);

list.element.style.height = '300px';
list.element.style.position = 'relative';
// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
list.setItems([...Array(20).keys()].map((i) => `Item ${i + 1}`));
