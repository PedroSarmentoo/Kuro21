import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { cardValue, calculateScore } from '../src/game/score.js';

// Cria uma mão com os valores informados e calcula sua pontuação.
const pontuar = (...valores) =>
  calculateScore(valores.map((rank) => ({ rank })));

describe('Pontuação da mão', () => {
  it('J, Q e K valem 10', () => {
    for (const figura of ['J', 'Q', 'K']) {
      assert.equal(cardValue(figura), 10);
      assert.equal(pontuar(figura, '2').total, 12);
    }
  });

  it('Ás vale 11 quando não provoca estouro', () => {
    assert.deepEqual(pontuar('A', '6'), {
      total: 17, soft: true, bust: false, blackjack: false,
    });
  });

  it('Ás passa a valer 1 para evitar estouro', () => {
    assert.deepEqual(pontuar('A', '9', 'K'), {
      total: 20, soft: false, bust: false, blackjack: false,
    });
  });

  it('com dois Ases, apenas um vale 11 quando possível', () => {
    assert.deepEqual(pontuar('A', 'A', '9'), {
      total: 21, soft: true, bust: false, blackjack: false,
    });
  });

  it('todos os Ases valem 1 quando necessário', () => {
    assert.deepEqual(pontuar('A', 'A', '9', 'K'), {
      total: 21, soft: false, bust: false, blackjack: false,
    });
  });

  it('calcula corretamente uma mão com quatro Ases', () => {
    assert.deepEqual(pontuar('A', 'A', 'A', 'A'), {
      total: 14, soft: true, bust: false, blackjack: false,
    });
  });

  it('identifica estouro acima de 21', () => {
    assert.deepEqual(pontuar('K', 'Q', '2'), {
      total: 22, soft: false, bust: true, blackjack: false,
    });
  });

  it('reconhece Blackjack natural com Ás e 10, J, Q ou K', () => {
    for (const valor of ['10', 'J', 'Q', 'K']) {
      for (const cartas of [['A', valor], [valor, 'A']]) {
        assert.deepEqual(pontuar(...cartas), {
          total: 21, soft: true, bust: false, blackjack: true,
        });
      }
    }
  });

  it('21 com três cartas não é Blackjack natural', () => {
    assert.deepEqual(pontuar('7', '7', '7'), {
      total: 21, soft: false, bust: false, blackjack: false,
    });
  });

  it('soma uma mão comum sem Ás', () => {
    assert.deepEqual(pontuar('8', '5'), {
      total: 13, soft: false, bust: false, blackjack: false,
    });
  });
});