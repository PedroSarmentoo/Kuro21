// Distribuição inicial da rodada (base do CDU01 / US02).
// Camada de regras: não usa o DOM nem importa nada de src/ui ou src/storage.

/**
 * Distribui duas cartas para o jogador e duas para o dealer, alternando
 * como na mesa real: jogador, dealer, jogador, dealer.
 *
 * @param {import('./baralho.js').Baralho} baralho
 * @returns {{ jogador: Array<{rank: string, suit: string}>, dealer: Array<{rank: string, suit: string}> }}
 */
export function distribuirInicial(baralho) {
  const jogador = [];
  const dealer = [];
  for (let volta = 0; volta < 2; volta++) {
    jogador.push(baralho.comprar());
    dealer.push(baralho.comprar());
  }
  return { jogador, dealer };
}
