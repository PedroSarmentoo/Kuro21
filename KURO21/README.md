# Kuro21

Jogo de Blackjack (jogador contra o dealer) para navegador, com fichas virtuais e sem dinheiro real.
Trabalho de Engenharia de Software, Grupo 5.

Especificação completa: documento de requisitos (SRS) do Kuro21, versão de 19/08/2026.

## Como rodar

Requisitos: [Node.js](https://nodejs.org) 20 ou superior.

```bash
npm install     # só na primeira vez
npm run dev     # abre o jogo em http://localhost:5173
```

Para ver a mesa com cartas de exemplo (útil para revisar o layout), abra `http://localhost:5173/#demo`.

Outros comandos:

```bash
npm run build     # gera o site estático na pasta dist/
npm run preview   # serve a pasta dist/ para conferir o build
npm run test:aposta  # cenários determinísticos de seleção e validação (US01)
```

## Estrutura

```
index.html            estrutura da mesa
src/
  main.js             ponto de entrada
  styles/             CSS (tokens, layout, mesa, cartas, controles)
  ui/                 desenho da interface (sem regras do jogo)
  game/               regras: baralho, pontuação, rodada, dealer (T03, T06, US02 em diante)
  storage/            Local Storage (US07, US12)
tests/                testes (T07)
docs/
  decisao-tecnologia.md   por que JavaScript, Vite, DOM e sem back-end
  convencao-git.md        branches, commits e Pull Requests
```

Regra de dependência: `game` não importa `ui` nem `storage`. Isso mantém as regras testáveis sem navegador.

## Estado atual

Entregue na T04: estrutura do projeto e tela da mesa responsiva (computador e celular em pé ou deitado).

Entregue na US01 (KURO-4): seleção cumulativa das fichas de 5, 10, 25, 50 e 100, total atualizado,
botão **Limpar aposta**, validação de saldo e confirmação da seleção. Aposta igual a zero, negativa,
inválida ou acima do saldo é rejeitada sem modificar o saldo. Uma ficha que ultrapassaria o saldo
também é rejeitada, preservando o total anterior e explicando o motivo.

O saldo inicial continua em 1.000 fichas virtuais e não é debitado nesta história. O débito único e a
distribuição de cartas pertencem à US02 (KURO-5, Sprint 2). Por isso, o botão se chama **Confirmar aposta**;
Comprar e Parar continuam desabilitados. Após confirmar, é possível limpar para montar outra seleção.
O modo `#demo` continua sendo apenas uma demonstração visual.

### Integração e verificação da US01

- `src/game/bet.js`: regras puras, sem DOM ou armazenamento; não altera os estados recebidos.
- `src/ui/betting.js`: `setupBetting(table, { balance, onConfirm })` recebe o saldo e entrega
  `{ amount, balance }` à função `onConfirm` uma única vez por seleção confirmada. A US02 deverá
  conectar o início da rodada a essa função e controlar o bloqueio dos controles durante a partida.
- Os testes de aposta usam o executor nativo do Node, sem dependências novas. A infraestrutura
  de testes de baralho e pontuação (T07 / KURO-22) permanece uma tarefa separada.
- Para conferir na interface: some fichas, limpe, tente ultrapassar 1.000, aposte exatamente 1.000
  e confirme. O saldo deve permanecer em 1.000 e cliques repetidos não devem confirmar novamente.
- Para verificar saldo insuficiente durante o desenvolvimento, passe `balance: 0` ou `balance: 4`
  a `setupBetting` em `src/main.js`: a mensagem deve explicar a falta de saldo e bloquear a aposta.
  Não há reinício de saldo nem persistência nesta história; essas funções pertencem a outras tarefas.

## Trabalho em grupo

Veja [docs/convencao-git.md](docs/convencao-git.md) antes de criar a primeira branch.
Os tickets estão no Jira, projeto KURO.
