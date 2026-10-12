import { createCardElement, setHandCards } from './table.js';

// Dados fixos, só para conferir o layout. Não é lógica de jogo.
export function renderDemoHands(table) {
  setHandCards(table.dealerCards, [
    createCardElement({ rank: '7', suit: 'ouros' }),
    createCardElement({ faceDown: true }),
  ]);
  setHandCards(table.playerCards, [
    createCardElement({ rank: 'K', suit: 'espadas' }),
    createCardElement({ rank: 'A', suit: 'copas' }),
    createCardElement({ rank: '5', suit: 'paus' }),
  ]);
  table.dealerScore.textContent = '7';
  table.playerScore.textContent = '16';
  table.betValue.textContent = '50';
  table.status.textContent = 'Modo de demonstração do layout.';
}
