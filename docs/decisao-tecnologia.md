# Decisão de tecnologia (KURO-16)

Registro das escolhas técnicas do Kuro21, com o motivo de cada uma, para o grupo e o professor
entenderem por que o projeto é assim. Origem dos requisitos: SRS do Kuro21, Grupo 5, 19/08/2026.

## Resumo

| Tema | Decisão |
|---|---|
| Arquitetura | Somente front-end (sem back-end). Tudo roda no navegador |
| Linguagem | JavaScript (ES modules) |
| Ferramenta de build | Vite |
| Renderização | DOM + CSS (cartas e fichas são elementos HTML) |
| Persistência | Local Storage (IndexedDB só se a necessidade surgir) |
| Testes (T07) | Vitest, a ser adicionado na T07 |
| Hospedagem | Site estático (por exemplo GitHub Pages) |

## Contexto

O SRS define um jogo de Blackjack single-player, sem dinheiro real e sem multiplayer (seção 1.2),
renderizado no cliente e sem instalação (seção 2.1), com o dealer rodando "no cliente (ou servidor)"
(seção 2.2). O RNF03 manda persistir saldo e estatísticas com Local Storage ou IndexedDB.
Os RNF01 e RNF02 pedem animações a 60 FPS, carregamento inicial abaixo de 3 s e layout responsivo.

## Decisões

### 1. Sem back-end
Nenhum requisito exige servidor: não há contas, ranking, multiplayer nem dados compartilhados.
Um servidor acrescentaria hospedagem, latência a cada jogada (contra o RNF01) e a necessidade de
sincronizar o estado do servidor com o salvo no navegador (US07 e US12).

Consequências aceitas:
- Quem abrir o console do navegador pode ver as cartas ou editar o saldo. Como as fichas são
  fictícias, isso só afeta o próprio jogador.
- Os dados ficam presos ao navegador usado. Trocar de aparelho começa do zero. O SRS não pede sincronização.

Quando reavaliar: se o escopo passar a incluir ranking online, contas ou multiplayer (fora da v1).

### 2. JavaScript com Vite
Vite entrega servidor de desenvolvimento com recarga automática (`npm run dev`) e um build estático
otimizado (`npm run build`), sem configuração extra. TypeScript foi descartado para reduzir a
curva de aprendizado do grupo.

### 3. Renderização em DOM + CSS
| Opção | Vantagens | Desvantagens | Veredito |
|---|---|---|---|
| DOM + CSS | Responsividade e acessibilidade nativas; animação por `transform` na GPU; fácil de testar | Menos indicado para milhares de objetos | Escolhida |
| Canvas 2D | Controle total do desenho | Responsividade, texto e acessibilidade manuais | Descartada |
| WebGL | Efeitos 3D | Complexidade e custo desproporcionais para um jogo de cartas | Descartada |

Um jogo de cartas tem poucas dezenas de elementos na tela, e o DOM atende bem aos 60 FPS.

### 4. Separação em camadas
```
src/game/      regras do jogo: baralho (T03), pontuação (T06), rodada, dealer. Sem acesso ao DOM
src/ui/        desenho da mesa, fichas e botões. Sem regras de Blackjack
src/storage/   leitura e gravação no Local Storage (US07, US12)
```
Regra de dependência: `ui` pode usar `game` e `storage`, mas `game` não importa nada de `ui`
nem de `storage`. Isso deixa a lógica testável sem navegador (T07).

### 5. Persistência
Local Storage guarda saldo, estatísticas e o estado da rodada. Os dados são pequenos e síncronos,
o que simplifica o código. Todo acesso deve estar em `try/catch`, porque o navegador pode bloquear
o armazenamento (modo privado, cota cheia) e o jogo precisa continuar funcionando.

## Verificação feita nesta entrega
- Build de produção gerado sem erros.
- Carregamento abaixo de 3 s em máquina local (medido pelo evento `load` do navegador).
- Layout sem rolagem horizontal ou vertical em 1920x1080, 1366x768, 820x1180, 390x844, 844x390 e 360x640.
- Aberto sem erros de console no Chromium (mesmo motor do Chrome e do Edge).
- **Ainda não verificado:** Firefox e Safari. O grupo deve abrir a página nesses navegadores e registrar o resultado.
