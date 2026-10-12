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

// T04: apenas a estrutura e a mesa. A lógica do jogo entra nas próximas histórias
// (baralho: T03, pontuação: T06, aposta: US01, rodada: US02 em diante).
const table = getTableElements();

// Para revisar o layout sem a lógica do jogo, abra a página com #demo no endereço.
if (window.location.hash === '#demo') {
  renderDemoHands(table);
}
