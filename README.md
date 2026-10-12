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

Entregue na T04: estrutura do projeto, tela da mesa responsiva (computador e celular em pé ou deitado),
fichas e botões, ainda **sem lógica de jogo**. Os botões aparecem desabilitados de propósito.

## Trabalho em grupo

Veja [docs/convencao-git.md](docs/convencao-git.md) antes de criar a primeira branch.
Os tickets estão no Jira, projeto KURO.
