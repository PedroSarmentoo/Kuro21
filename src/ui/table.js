// Camada de interface da mesa: só desenha e expõe os elementos.
// Nenhuma regra de Blackjack deve ficar aqui (isso pertence a src/game).

const NAIPES = {
  paus: { simbolo: '♣', vermelho: false },
  espadas: { simbolo: '♠', vermelho: false },
  copas: { simbolo: '♥', vermelho: true },
  ouros: { simbolo: '♦', vermelho: true },
};

/** Referências aos elementos da mesa, para as próximas histórias usarem. */
export function getTableElements() {
  const byId = (id) => document.getElementById(id);
  return {
    balance: byId('balance-value'),
    betValue: byId('bet-value'),
    status: byId('status'),
    dealerCards: byId('dealer-cards'),
    playerCards: byId('player-cards'),
    dealerScore: byId('dealer-score'),
    playerScore: byId('player-score'),
    chips: byId('chips'),
    btnDeal: byId('btn-deal'),
    btnHit: byId('btn-hit'),
    btnStand: byId('btn-stand'),
  };
}

/**
 * Cria o elemento visual de uma carta.
 * @param {{rank?: string, suit?: keyof typeof NAIPES, faceDown?: boolean}} options
 */
export function createCardElement({ rank, suit, faceDown = false } = {}) {
  const el = document.createElement('div');
  el.className = 'card';

  if (faceDown) {
    el.classList.add('card--back');
    el.setAttribute('role', 'img');
    el.setAttribute('aria-label', 'Carta virada para baixo');
    return el;
  }

  const naipe = NAIPES[suit];
  if (naipe.vermelho) el.classList.add('card--red');
  el.setAttribute('role', 'img');
  el.setAttribute('aria-label', `${rank} de ${suit}`);

  const canto = (extra = '') => {
    const c = document.createElement('span');
    c.className = `card__corner ${extra}`.trim();
    c.innerHTML = `<span>${rank}</span><span>${naipe.simbolo}</span>`;
    return c;
  };
  const pip = document.createElement('span');
  pip.className = 'card__pip';
  pip.textContent = naipe.simbolo;

  el.append(canto(), pip, canto('card__corner--end'));
  return el;
}

/** Substitui o conteúdo de uma área de cartas (os espaços vazios somem). */
export function setHandCards(container, cardElements) {
  container.replaceChildren(...cardElements);
}
