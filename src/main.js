import '@fontsource/shippori-mincho/latin-500.css';
import '@fontsource/shippori-mincho/latin-700.css';
import '@fontsource/zen-kaku-gothic-new/latin-500.css';
import '@fontsource/zen-kaku-gothic-new/latin-700.css';

import './styles/tokens.css';
import './styles/base.css';
import './styles/layout.css';
import './styles/table.css';
import './styles/cards.css';
import './styles/controls.css';

import { getTableElements } from './ui/table.js';
import { renderDemoHands } from './ui/demo.js';
import { setupBetting } from './ui/betting.js';

// T04 fornece a mesa; US01 conecta a seleção de aposta.
// Débito do saldo e distribuição de cartas pertencem à US02.
const table = getTableElements();

// Para revisar o layout sem a lógica do jogo, abra a página com #demo no endereço.
if (window.location.hash === '#demo') {
  renderDemoHands(table);
} else {
  setupBetting(table);
}
