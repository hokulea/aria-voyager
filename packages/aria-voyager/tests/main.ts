/* eslint-disable import/no-unassigned-import */
import './main.css';

import { List } from './components/list';

const app = document.getElementById('app') as HTMLElement;

const list = new List(app);

list.setItems(['Banana', 'Apple', 'Pear']);
