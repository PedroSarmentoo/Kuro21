import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { Baralho } from '../src/game/baralho.js';
import { distribuirInicial } from '../src/game/distribuicao.js';

describe('distribuirInicial', () => {
  it('dá duas cartas ao jogador e duas ao dealer', () => {
    const baralho = new Baralho();
    const { jogador, dealer } = distribuirInicial(baralho);
    assert.equal(jogador.length, 2);
    assert.equal(dealer.length, 2);
    assert.equal(baralho.restantes, 48);
  });

  it('alterna jogador, dealer, jogador, dealer', () => {
    const compradas = [];
    const baralhoFalso = { comprar: () => compradas.push(compradas.length) - 1 };
    const { jogador, dealer } = distribuirInicial(baralhoFalso);
    assert.deepEqual(jogador, [0, 2]);
    assert.deepEqual(dealer, [1, 3]);
  });

  it('não repete cartas entre as mãos', () => {
    const { jogador, dealer } = distribuirInicial(new Baralho());
    const todas = [...jogador, ...dealer].map((c) => `${c.rank}-${c.suit}`);
    assert.equal(new Set(todas).size, 4);
  });
});
