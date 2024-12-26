import App from './views/app.js';
import './views/component/app-bar.js';

const app = new App({
	content: document.querySelector('#main-content'),
});

window.addEventListener('hashchange', () => {
	app.renderPage();
});

window.addEventListener('DOMContentLoaded', () => {
	app.renderPage();
});
