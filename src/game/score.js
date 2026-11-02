// Pontuação de uma mão de Blackjack (T06).
// Funções puras, sem DOM: podem ser usadas pela interface e testadas sem navegador.

const FIGURAS = ['J', 'Q', 'K'];

/**
 * Valor base de uma carta, com o Ás valendo 1.
 * @param {string} rank 'A', '2' a '10', 'J', 'Q' ou 'K'
 */
export function cardValue(rank) {
  if (rank === 'A') return 1;
  if (FIGURAS.includes(rank)) return 10;
  const numero = Number(rank);
  if (Number.isInteger(numero) && numero >= 2 && numero <= 10) return numero;
  throw new Error(`Carta inválida: ${rank}`);
}

/**
 * Pontuação da mão. Um Ás passa a valer 11 quando isso não estoura 21.
 * `soft` indica que há um Ás contando 11 (usado depois pela regra do dealer).
 * `bust` indica estouro (acima de 21).
 * `blackjack` indica Blackjack natural: Ás e carta de valor 10 nas duas primeiras cartas.
 * @param {{rank: string}[]} cards
 * @returns {{total: number, soft: boolean, bust: boolean, blackjack: boolean}}
 */
export function calculateScore(cards) {
  let total = 0;
  let temAs = false;
  for (const { rank } of cards) {
    total += cardValue(rank);
    if (rank === 'A') temAs = true;
  }
  // Só um Ás pode valer 11: dois valendo 11 já somam 22.
  const soft = temAs && total + 10 <= 21;
  if (soft) total += 10;

  return {
    total,
    soft,
    bust: total > 21,
    // Com duas cartas, só Ás + carta de valor 10 chega a 21.
    blackjack: cards.length === 2 && total === 21,
  };
}
