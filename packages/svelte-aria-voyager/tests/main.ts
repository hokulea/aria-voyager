import { mount } from 'svelte';

// eslint-disable-next-line import/no-unassigned-import
import '@hokulea/core/index.css';
// eslint-disable-next-line import/no-unassigned-import
import '@hokulea/theme-moana/dist/moana.css';

import App from './App.svelte';

const app = mount(App, {
  target: document.getElementById('app') as HTMLElement
});

export default app;
