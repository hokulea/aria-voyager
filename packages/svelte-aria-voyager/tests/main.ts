import { mount } from 'svelte';

import '@hokulea/core/index.css';
import '@hokulea/theme-moana/dist/moana.css';

import App from './App.svelte';

const app = mount(App, {
  target: document.querySelector('#app') as HTMLElement
});

export default app;
