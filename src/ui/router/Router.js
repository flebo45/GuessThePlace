export default class Router {
  constructor(rootId) {
    this.root = typeof rootId === 'string' ? document.getElementById(rootId) : rootId;
    if (!this.root) throw new Error(`Router: root element not found for id ${rootId}`);
    this.routes = {}; // path -> { render: (root, router) => Promise|void, css?: string[] }
    this.currentCss = [];
    this._registerPopState();
  }

  addRoute(path, config) {
    // config: { render: (root, router) => void|Promise, css?: string[] }
    this.routes[path] = config;
  }

  async navigate(path, { replace = false } = {}) {
    if (replace) {
      history.replaceState({}, '', path);
    } else {
      history.pushState({}, '', path);
    }
    await this._loadRoute(path);
  }

  async init() {
    await this._loadRoute(window.location.pathname);
  }

  async _loadRoute(path) {
    const route = this.routes[path];
    if (!route) {
      // Try 404 handling: go to /login if present, else clear root
      if (this.routes['/login']) {
        return this.navigate('/login', { replace: true });
      }
      this.root.innerHTML = '<h2>404 - Page not found</h2>';
      return;
    }

    // unload CSS from previous route and load new ones
    this._unloadCurrentCss();
    if (Array.isArray(route.css) && route.css.length) {
      await Promise.all(route.css.map(href => this._loadCss(href)));
    }

    // render view
    if (typeof route.render === 'function') {
      // clear and render
      this.root.innerHTML = '';
      await route.render(this.root, this);
    }
  }

  _registerPopState() {
    window.addEventListener('popstate', () => {
      this._loadRoute(window.location.pathname);
    });
  }

  _loadCss(href) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`link[data-router-css="${href}"]`)) {
        this.currentCss.push(href);
        return resolve();
      }
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.setAttribute('data-router-css', href);
      link.onload = () => { this.currentCss.push(href); resolve(); };
      link.onerror = (e) => reject(e);
      document.head.appendChild(link);
    });
  }

  _unloadCurrentCss() {
    for (const href of this.currentCss) {
      const node = document.querySelector(`link[data-router-css="${href}"]`);
      if (node) node.remove();
    }
    this.currentCss = [];
  }
}
