import { mockData } from './mockData.js';
import { ListContainer } from './ListContainer.js';

function render() {
  const app = document.getElementById('app');
  app.innerHTML = ListContainer({ items: mockData });
}

render();
