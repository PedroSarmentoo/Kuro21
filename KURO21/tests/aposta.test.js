import test from 'node:test';
import assert from 'node:assert/strict';
import { CHIP_VALUES, createBetState, validateBet, addChip, clearBet, confirmBet } from '../src/game/bet.js';

test('soma fichas diferentes e repetidas, mantendo o saldo durante a seleção', () => {
  const initial = Object.freeze(createBetState(1000));
  let state = initial;
  for (const value of [...CHIP_VALUES, 25]) {
    const result = addChip(Object.freeze(state), value);
    assert.equal(result.error, null);
    state = result.state;
    assert.equal(state.balance, 1000);
  }
  assert.equal(state.amount, 215);
  assert.deepEqual(initial, { balance: 1000, amount: 0, confirmed: false });
});

test('bloqueia confirmação de zero, valor negativo, inválido ou acima do saldo', () => {
  for (const amount of [0, -5, 1001, NaN, Infinity, -Infinity, '25', null]) {
    const state = Object.freeze({ balance: 1000, amount, confirmed: false });
    const result = confirmBet(state);
    assert.notEqual(result.error, null);
    assert.equal(result.state, state);
    assert.equal(result.state.balance, 1000);
    assert.equal(result.state.confirmed, false);
  }
});

test('aceita aposta igual ao saldo e rejeita a próxima ficha sem alterar o estado', () => {
  let state = createBetState(1000);
  for (let i = 0; i < 10; i++) state = addChip(state, 100).state;
  assert.equal(state.amount, 1000);
  assert.equal(validateBet(state.amount, state.balance), null);

  const rejected = addChip(Object.freeze(state), 5);
  assert.equal(rejected.error, 'insufficient-balance');
  assert.equal(rejected.state, state);

  const confirmed = confirmBet(state);
  assert.equal(confirmed.error, null);
  assert.deepEqual(confirmed.state, { balance: 1000, amount: 1000, confirmed: true });
});

test('rejeita uma ficha que ultrapassaria o saldo e permite continuar com uma menor', () => {
  const state = Object.freeze(addChip(createBetState(30), 25).state);
  const rejected = addChip(state, 10);
  assert.equal(rejected.error, 'insufficient-balance');
  assert.equal(rejected.state, state);
  const accepted = addChip(state, 5);
  assert.equal(accepted.error, null);
  assert.deepEqual(accepted.state, { balance: 30, amount: 30, confirmed: false });
});

test('rejeita fichas inexistentes sem reduzir nem aumentar o saldo', () => {
  const state = Object.freeze(createBetState(1000));
  for (const value of [0, -5, 1, 2.5, 200, NaN, Infinity, '25', null]) {
    assert.deepEqual(addChip(state, value), { state, error: 'invalid-chip' });
  }
});

test('saldo zerado ou abaixo da menor ficha impede a seleção', () => {
  for (const balance of [0, 2.5, 4]) {
    const state = Object.freeze(createBetState(balance));
    assert.equal(addChip(state, 5).error, 'insufficient-balance');
    assert.equal(confirmBet(state).error, 'invalid-amount');
    assert.equal(state.balance, balance);
  }
});

test('preserva saldo fracionário que poderá resultar do pagamento de Blackjack', () => {
  const result = addChip(createBetState(7.5), 5);
  assert.equal(result.error, null);
  assert.equal(confirmBet(result.state).state.balance, 7.5);
});

test('confirma uma única vez e impede adicionar fichas à seleção confirmada', () => {
  const selected = Object.freeze(addChip(createBetState(1000), 100).state);
  const first = confirmBet(selected);
  assert.equal(first.error, null);
  assert.equal(selected.confirmed, false);
  const confirmed = Object.freeze(first.state);
  assert.deepEqual(confirmBet(confirmed), { state: confirmed, error: 'already-confirmed' });
  assert.deepEqual(addChip(confirmed, 25), { state: confirmed, error: 'already-confirmed' });
  assert.equal(confirmed.balance, 1000);
});

test('limpa a seleção, inclusive após confirmar, e permite selecionar outra aposta', () => {
  const selected = addChip(createBetState(1000), 100).state;
  for (const state of [selected, confirmBet(selected).state]) {
    const cleared = clearBet(Object.freeze(state));
    assert.deepEqual(cleared, { balance: 1000, amount: 0, confirmed: false });
    assert.equal(confirmBet(cleared).error, 'invalid-amount');
    assert.equal(addChip(cleared, 10).state.amount, 10);
    assert.equal(state.amount, 100);
  }
});

test('rejeita um saldo de entrada inválido', () => {
  for (const balance of [-1, NaN, Infinity, '1000', null, undefined]) {
    assert.throws(() => createBetState(balance), RangeError);
    assert.equal(validateBet(5, balance), 'invalid-balance');
  }
});
