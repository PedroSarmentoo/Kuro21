import { CHIP_VALUES, createBetState, validateBet, addChip, clearBet, confirmBet } from '../game/bet.js';

const formatChips = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 });
const minimumChip = Math.min(...CHIP_VALUES);
const errorMessages = {
  'invalid-balance': 'Saldo inválido. Não é possível confirmar a aposta.',
  'invalid-amount': 'Selecione uma aposta maior que zero.',
  'insufficient-balance': 'Saldo insuficiente para adicionar esta ficha.',
  'invalid-chip': 'Selecione uma das fichas disponíveis.',
};

/**
 * Conecta os controles às regras de US01.
 * onConfirm recebe { amount, balance } para a futura integração com US02.
 * O saldo é recebido do estado da aplicação, nunca lido do texto da tela.
 */
export function setupBetting(table, { balance = 1000, onConfirm = () => {} } = {}) {
  let state = createBetState(balance);
  const chips = [...table.chips.querySelectorAll('button[data-value]')];

  function render(error = null) {
    const insufficient = state.balance < minimumChip;
    table.balance.textContent = formatChips.format(state.balance);
    table.betValue.textContent = formatChips.format(state.amount);
    table.btnClear.disabled = state.amount === 0;
    table.btnDeal.disabled = state.confirmed || validateBet(state.amount, state.balance) !== null;
    table.btnDeal.textContent = state.confirmed ? 'Aposta confirmada' : 'Confirmar aposta';

    for (const chip of chips) chip.disabled = state.confirmed || insufficient;

    let message = 'Escolha suas fichas e confira a aposta antes de confirmar.';
    if (state.amount > 0) message = 'Confira a aposta antes de confirmar.';
    if (state.confirmed) message = `Aposta de ${formatChips.format(state.amount)} fichas confirmada.`;
    if (errorMessages[error]) message = errorMessages[error];
    if (insufficient) message = `Saldo insuficiente. São necessárias ${minimumChip} fichas para apostar.`;

    table.status.textContent = message;
    table.status.classList.toggle('status--error', insufficient || Boolean(errorMessages[error]));
  }

  function handleChip(event) {
    const chip = event.target.closest?.('button[data-value]');
    if (!chip || !table.chips.contains(chip) || chip.disabled) return;
    const result = addChip(state, Number(chip.dataset.value));
    state = result.state;
    render(result.error);
  }

  function handleClear() {
    state = clearBet(state);
    render();
  }

  function handleConfirm() {
    const result = confirmBet(state);
    state = result.state;
    render(result.error);
    if (!result.error) onConfirm({ amount: state.amount, balance: state.balance });
  }

  table.chips.addEventListener('click', handleChip);
  table.btnClear.addEventListener('click', handleClear);
  table.btnDeal.addEventListener('click', handleConfirm);
  render();

  return {
    getState: () => ({ ...state }),
    destroy() {
      table.chips.removeEventListener('click', handleChip);
      table.btnClear.removeEventListener('click', handleClear);
      table.btnDeal.removeEventListener('click', handleConfirm);
    },
  };
}
