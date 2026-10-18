export const NAIPES = Object.freeze(['paus', 'espadas', 'copas', 'ouros']);

export const VALORES = Object.freeze([
    'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K',
]);

//Lançado quando não há cartas no monte nem no descarte para comprar.
export class BaralhoVazioError extends Error {
    constructor() {
        super('Não há cartas no momento nem no descarte para comprar.');
        this.name = 'BaralhoVazioError';
    }
}

//Criar as 52 cartas, uma de cada valor em cada naipe, na ordem de fábrica.
export function criarCartas(){
    const cartas = [];
    for(const suit of NAIPES){
        for (const rank of VALORES){
            cartas.push(Object.freeze({ rank, suit }));
        }
    }
    return cartas;
}

/**
 * Embaralha o vetor no próprio lugar com o algoritmo de Fisher-Yates
 * (versão de Durstenfeld): da última posição para a primeira, troca cada
 * posição i com uma posição j sorteada entre 0 e i. Toda ordem possível
 * tem a mesma chance de sair.
 *
 * @template T
 * @param {T[]} itens vetor a embaralhar (é modificado)
 * @param {() => number} aleatorio função que devolve um número em [0, 1).
 *   Padrão: Math.random. Os testes passam uma função fixa para ter resultado previsível.
 * @returns {T[]} o mesmo vetor, embaralhado
 */
export function embaralhar(itens, aleatorio = Math.random){
    for (let i = itens.length - 1; i > 0; i--){
        const j = Math.floor(aleatorio() * (i + 1));
        [itens[i], itens[j] = itens[j], itens[i]];
    }
    return itens;
}


export class Baralho{
    #monte = [];
    #descarte = [];
    #aleatorio;

    /** @param {{ aleatorio?: () => number }} [opcoes] */
    constructor({ aleatorio = Math.random } = {}){
        this.#aleatorio = aleatorio;
        this.reiniciar();
    }

    //Quantas cartas ainda há no monte de compra.
    get restantes(){
        return this.#monte.length;
    }

    //Quantas cartas estão na pilha de descarte.
    get descartadas(){
        return this.#descarte.length;
    }

    //Sorteia (retira) a carta do topo do monte.
    comprar(){
        if(this.#monte.length == 0){
            this.#reembaralharDescarte();
        }
        return this.#monte.pop();
    }

    /**
     * Devolve cartas à pilha de descarte
     * @param {Array<{rank: string, suit: string}>} cartas 
     */
    descartar(cartas){
        this.#descarte.push(...cartas);
    }

    //Volta ao baralho compleo de 52 cartas, embharalhado, e esvazia o descarte.
    reiniciar(){
        this.#monte = embaralhar(criarCartas(), this.#aleatorio);
        this.#descarte = [];
    }

    #reembaralharDescarte(){
        if(this.#descarte.length == 0){
            throw new BaralhoVazioError();
        }
        this.#monte = embaralhar(this.#descarte, this.#aleatorio);
        this.#descarte = [];
    }
}