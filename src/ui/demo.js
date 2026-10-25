import { calculateScore } from '../game/score.js';
import { createCardElement, setHandCards } from './table.js';

// Cartas fixas, só para conferir o layout. A pontuação usa a regra real (T06).
export function renderDemoHands(table) {
  const dealerAberta = { rank: '7', suit: 'ouros' };
  const jogador = [
    { rank: 'K', suit: 'espadas' },
    { rank: 'A', suit: 'copas' },
    { rank: '5', suit: 'paus' },
  ];

  setHandCards(table.dealerCards, [
    createCardElement(dealerAberta),
    createCardElement({ faceDown: true }),
  ]);
  setHandCards(table.playerCards, jogador.map((carta) => createCardElement(carta)));

  // O dealer mostra só a pontuação da carta aberta.
  table.dealerScore.textContent = String(calculateScore([dealerAberta]).total);
  table.playerScore.textContent = String(calculateScore(jogador).total);
  table.betValue.textContent = '50';
  table.status.textContent = 'Modo de demonstração do layout.';
}
