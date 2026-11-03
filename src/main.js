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

import { getTableElements, createCardElement, setHandCards } from './ui/table.js';
import { renderDemoHands } from './ui/demo.js';
import { Baralho } from './game/baralho.js';
import { distribuirInicial } from './game/distribuicao.js';

// Liga as regras (src/game) à mesa (src/ui).
// Já existe: baralho (T03) e distribuição inicial (US02).
// Ainda falta: aposta (US01), pontuação (T06), Hit/Stand e dealer.
const table = getTableElements();

// Para revisar o layout sem a lógica do jogo, abra a página com #demo no endereço.
if (window.location.hash === '#demo') {
  renderDemoHands(table);
} else {
  iniciarMesa();
}

function iniciarMesa() {
  const baralho = new Baralho(); // um baralho para a sessão inteira
  let maos = null; // cartas da rodada em andamento

  // Enquanto a aposta (US01) não existe, o botão de dar as cartas fica liberado.
  table.btnDeal.disabled = false;
  table.status.textContent = 'Clique em "Apostar e dar as cartas" para começar.';

  table.btnDeal.addEventListener('click', () => {
    // As cartas da rodada anterior vão para o descarte do baralho.
    if (maos) {
      baralho.descartar([...maos.jogador, ...maos.dealer]);
    }

    maos = distribuirInicial(baralho);

    setHandCards(
      table.playerCards,
      maos.jogador.map((carta) => createCardElement(carta)),
    );
    setHandCards(table.dealerCards, [
      createCardElement(maos.dealer[0]),
      createCardElement({ faceDown: true }), // a segunda carta do dealer fica escondida
    ]);

    // A pontuação entra com a T06.
    table.playerScore.textContent = '–';
    table.dealerScore.textContent = '–';
    table.status.textContent = `Cartas distribuídas. Restam ${baralho.restantes} no baralho.`;
  });
}
