// US01: seleção de aposta. Não debita saldo nem inicia a rodada (US02).
export const CHIP_VALUES = Object.freeze([5, 10, 25, 50, 100]);

const isValidBalance = (balance) => Number.isFinite(balance) && balance >= 0;

export function createBetState(balance) {
  if (!isValidBalance(balance)) {
    throw new RangeError('O saldo deve ser um número finito e não negativo.');
  }
  return { balance, amount: 0, confirmed: false };
}

/** Retorna null quando a aposta é válida, ou o motivo da rejeição. */
export function validateBet(amount, balance) {
  if (!isValidBalance(balance)) return 'invalid-balance';
  if (!Number.isFinite(amount) || amount <= 0) return 'invalid-amount';
  if (amount > balance) return 'insufficient-balance';
  return null;
}

/** Uma seleção rejeitada devolve o mesmo estado, sem alterar aposta ou saldo. */
export function addChip(state, value) {
  if (state.confirmed) return { state, error: 'already-confirmed' };
  if (!CHIP_VALUES.includes(value)) return { state, error: 'invalid-chip' };

  const amount = state.amount + value;
  const error = validateBet(amount, state.balance);
  if (error) return { state, error };

  return { state: { ...state, amount }, error: null };
}

export function clearBet(state) {
  return { ...state, amount: 0, confirmed: false };
}

/** Confirma a seleção uma única vez; o débito pertence ao início da rodada. */
export function confirmBet(state) {
  if (state.confirmed) return { state, error: 'already-confirmed' };
  const error = validateBet(state.amount, state.balance);
  if (error) return { state, error };

  return { state: { ...state, confirmed: true }, error: null };
}
