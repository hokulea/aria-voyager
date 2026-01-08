import './main.css';

import '@hokulea/core/style.css';
import '@hokulea/theme-moana/dist/moana.css';

import list from './pages/list';
import menu from './pages/menu';
import tabs from './pages/tabs';

type PageModule = {
  html: string;
  title?: string;
  cleanup?: () => void;
  load?: () => void;
};

const pages: Record<string | number, PageModule> = {
  '/list': list,
  '/tabs': tabs,
  '/menu': menu
};

const home = {
  html: `<h2>Available Controls</h2>
  <ul>
    ${Object.entries(pages)
      .map(([url, data]) => `<li><a href="#${url}">${data.title}</a></li>`)
      .join('')}
  </ul>`
};

const modules: Record<string | number, PageModule> = {
  '/': home,
  ...pages,
  404: { html: `<h1>404</h1><p>Page not found.</p>` }
};

let currentModule: PageModule | undefined;

const renderPage = (app: Element, html: string) => {
  app.innerHTML = html;
};

export function router(app: Element, path: string) {
  if (typeof currentModule?.cleanup === 'function') {
    try {
      currentModule.cleanup();
    } catch (error) {
      console.error('Error occurred during cleanup:', error);
    }
  }

  currentModule = path in modules ? modules[path] : modules['404'];

  renderPage(app, currentModule.html);

  if (typeof currentModule.load === 'function') {
    currentModule.load();
  }
}

export function handleRoute() {
  const app = globalThis.document.querySelector('#app') as Element;
  const path = globalThis.location.hash.slice(1) || '/';

  router(app, path);
}

globalThis.addEventListener('load', handleRoute);
globalThis.addEventListener('hashchange', handleRoute);
