import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
    Baralho,
    BaralhoVazioError,
    NAIPES,
    VALORES,
    criarCartas,
    embaralhar,
} from '../src/game/baralho.js';

const key = (carta) => `${carta.rank} - ${carta.suit}`;

describe('criarCartas', () => {
    it('cria 52 cartas diferentes', () => {
        const cartas = criarCartas();
        assert.equal(cartas.length, 52);
        assert.equal(new Set(cartas.map(key)).size, 52);
    });

    it('item 13 valores em cada um dos 4 naipes',() => {
        const cartas = criarCartas();
        for (const suit of NAIPES){
            const doNaipe = cartas.filter((c) => c.suit == suit).map((c) => c.rank);
            assert.deepEqual(doNaipe, [...VALORES]);
        }
    });

    it('cria cartas imutáveis',() => {
        const [carta] = criarCartas();
        assert.ok(Object.isFrozen(carta));
    });
});

describe('embaralhar (FIsher-Yates', () => {
    it('troca da última posição para a primeira, sorteando j entre 0 e i',() => {
        assert.deepEqual(embaralhar([1, 2, 3], () => 0), [2, 3, 1]);
        assert.deepEqual(embaralhar([1, 2, 3], () => 0.999), [1, 2, 3]);
    });

    it('mantém as mesmas cartas, só muda a ordem',() => {
        const embaralhadas = embaralhar(criarCartas());
        assert.equal(embaralhadas.length, 52);
        assert.deepEqual(
            embaralhadas.map(key).sort(),
            criarCartas().map(key).sort(),
        );
    });
    
    it('distribui as 6 ordens de 3 itens com a mesma frequência',() => {
        const rodadas = 60000;
        const contagem = new Map();
        for (let n = 0; n <= rodadas; n++){
            const ordem = embaralhar([0, 1, 2]).join('');
            contagem.set(ordem, (contagem.get(ordem) ?? 0) + 1);
        }
        assert.equal(contagem.size, 6);
        for(const vezes of contagem.values){
            assert.ok(Math.abs(vezes - rodadas/6) < 600, `frequência desigual: ${vezes}`);
        }
    });
});

describe('Baralho', () => {
    it('começa com 52 cartas e nenhum descartadas',() => {
        const baralho = new Baralho();
        assert.equal(baralho.restantes, 52);
        assert.equal(baralho.descartadas, 0);
    });
    
    it('sorteia as 52 cartas sem repetir',() => {
        const baralho = new Baralho();
        const compradas = [];
        for (let n = 0; n < 52; n++) compradas.push(baralho.comprar());
        assert.equal(new Set(compradas.map(key)).size, 52);
        assert.equal(baralho.restantes, 0);
    });
    
    it('usa a função aleatória recebida, para resultados reproduzíveis',() => {
        const a = new Baralho({ aleatorio: () => 0.42 });
        const b = new Baralho({ aleatorio: () => 0.42 });
        assert.deepEqual(a.comprar(), b.comprar());
    });
    
    it('lança BaralhoVazioError se o monte e o descarte estão vazios',() => {
        const baralho = new Baralho();
        for (let n = 0; n < 52; n++) baralho.comprar();
        assert.throws(() => baralho.comprar(), BaralhoVazioError);
    });
    
    it('reembaralha o descarte quando o monte acaba',() => {
        const baralho = new Baralho();
        const first = [];
        for (let n = 0; n < 52; n++) first.push(baralho.comprar());

        baralho.descartar(first.slice(0, 10));
        assert.equal(baralho.descartadas, 10);

        const carta = baralho.comprar();
        assert.ok(first.slice(0, 10).includes(carta));
        assert.equal(baralho.restantes, 9);
        assert.equal(baralho.descartadas, 0);
    });
    
    it('não devolve ao monte as cartas que ainda estão na mão',() => {
        const baralho = new Baralho();
        const naMao = [baralho.comprar(), baralho.comprar(), baralho.comprar(), baralho.comprar()];
        const resto = [];
        while(baralho.restantes > 0) resto.push(baralho.comprar());
        baralho.descartar(resto);

        const newMonte = [];
        for (let n = 0; n < 48; n++) newMonte.push(baralho.comprar());
        for (const carta of naMao) assert.ok(!newMonte.includes(carta));
        assert.throws(() => baralho.comprar(), BaralhoVazioError);
    });
    
    it('reiniciar volta a ter 52 cartas e limpa o descarte',() => {
        const baralho = new Baralho();
        baralho.descartar([baralho.comprar(), baralho.comprar()]);
        baralho.reiniciar();
        assert.equal(baralho.restantes, 52);
        assert.equal(baralho.descartadas, 0);
    });
})
