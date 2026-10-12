# Convenção de Git

Regras simples para o grupo trabalhar em paralelo sem pisar no código um do outro.

## Branches
- `main`: sempre funcionando. Ninguém commita direto nela.
- Uma branch por ticket, criada a partir da `main`: `tipo/KURO-<número>-descricao-curta`
  - `feature/KURO-4-selecionar-aposta`
  - `fix/KURO-21-asa-valendo-onze`
  - `docs/KURO-16-decisao-tecnologia`
  - `chore/KURO-16-estrutura-base`

## Commits
Formato: `KURO-<número>: o que mudou, no imperativo`
- `KURO-21: calcula pontuação com Ás como 1 ou 11`
- `KURO-3: embaralha o baralho com Fisher-Yates`

Commits pequenos, um assunto por commit. O número do ticket no início faz o Jira ligar o commit ao ticket.

## Fluxo de um ticket
1. Passar o ticket para "Em andamento" no Jira.
2. Criar a branch a partir da `main` atualizada (`git pull` antes).
3. Trabalhar e commitar.
4. Abrir um Pull Request para a `main` com o link do ticket na descrição.
5. Pelo menos **uma outra pessoa** revisa e aprova.
6. Fazer o merge, apagar a branch e passar o ticket para "Concluído".

## Pull Request: checklist
- [ ] Atende aos critérios de aceite do ticket
- [ ] `npm run build` roda sem erros
- [ ] Testado em tela de computador e de celular, quando mexe na interface
- [ ] Sem código ou arquivos que não pertencem ao ticket

## Conflitos
Antes de abrir o PR, traga a `main` para a sua branch (`git merge main`) e resolva os conflitos localmente.
