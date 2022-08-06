/** 
 *  2C = Two of clubs(Treboles)
 *  2D = Two of Diamonds(Treboles)
 *  2H = Two of Heart(Treboles)
 *  2S = Two of Spades(Treboles)
 */
let deck = [];
const tipos = ['C', 'D', 'H', 'S'],
    especiales = ['A', 'J', 'Q', 'K'];

let puntosJugadores = [];

//REFERENCIAS DEL HTML
const btnPedir = document.querySelector('#btnPedir'),
    btnDetener = document.querySelector('#btnDetener'),
    btnNuevo = document.querySelector('#btnNuevo');


const divCartasJugadores = document.querySelectorAll('.divCartas'),
    puntosHTML = document.querySelectorAll('small');


const inicializarJuego = (numJugadores = 2) => {
    deck = createDeck();
    puntosJugadores = [];
    for (let i = 0; i < numJugadores; i++) {
        puntosJugadores.push(0);
    }
    puntosHTML.forEach(elem => elem.innerText = 0);
    divCartasJugadores.forEach(elem => elem.innerHTML = '');

    btnPedir.disabled = false;
    btnDetener.disabled = false;
}
/**
 * It creates a deck of cards, shuffles it, and then logs it to the console.
 */
const createDeck = () => {

    deck = [];
    /* Creating the cards from 2 to 10. */
    for (let i = 2; i <= 10; i++) {
        for (let tipo of tipos) {
            deck.push(i + tipo);
        }
    }
    /* Creating the cards from A to K. */
    for (let tipo of tipos) {
        for (let especial of especiales) {
            deck.push(especial + tipo);
        }
    }
    return _.shuffle(deck);
}

const pedirCard = () => {
    if (deck.length === 0) {
        throw 'No hay cartas en el deck'
    }
    return deck.pop();
}

/**
 * It takes a string, checks if it's a number, if it's not, it checks if it's an A, if it's not, it
 * returns 10, if it is, it returns 11, if it is a number, it returns the number
 * @param carta - pedirCard()
 * @returns The value of the card.
 */
const valorCarta = (carta) => {
    const valor = carta.substring(0, carta.length - 1);
    return (isNaN(valor)) ?
        (valor === 'A') ? 11 : 10
        : Number(valor);
}
/**
 * The function acumularPuntos takes two arguments, carta and turno, and returns the value of the
 * array puntosJugadores at the index of turno plus the value of the function valorCarta at the
 * index of carta.
 * @param carta - the card that was drawn
 * @param turno - 0 or 1
 * @returns the value of the array puntosJugadores[turno]
 */
const acumularPuntos = (carta, turno) => {
    puntosJugadores[turno] = puntosJugadores[turno] + valorCarta(carta);
    puntosHTML[turno].innerText = puntosJugadores[turno];

    return puntosJugadores[turno];
}

const crearCarta = (carta, turno) => {
    const img = document.createElement('img');
    img.src = `assets/img/${carta}.png`;
    img.classList.add('carta');
    divCartasJugadores[turno].appendChild(img);
}

const determinarGanador = () => {

    const [puntosComputadora, puntosJugador] = puntosJugadores;

    if (puntosJugador === puntosComputadora) {
        alertify.set('notifier', 'position', 'top-right');
        alertify.warning('Empates!!!');
    } else if (puntosJugador > puntosComputadora || puntosComputadora <= 21 || puntosComputadora < 21) {
        alertify.set('notifier', 'position', 'top-right');
        alertify.success('Jugador 1, Es el Ganador!!!');

    } else if (puntosJugador < puntosComputadora || puntosComputadora <= 21 || puntosComputadora > 21) {
        alertify.set('notifier', 'position', 'top-right');
        alertify.error('Jugador 1, perdiste!!!')
    };
}
//TURNO DE LA COMPUTADORA
/**
 * The computer's turn function takes a minimum number of points as an argument and returns the
 * computer's points.
 * @param puntosMinimos - The minimum points that the computer needs to reach to win.
 */
const turnoComputadora = (puntosMinimos) => {
    let puntosComputadora = 0;
    do {
        const carta = pedirCard();
        puntosComputadora = acumularPuntos(carta, puntosJugadores.length - 1);
        crearCarta(carta, puntosJugadores.length - 1);

        if ((puntosMinimos > 21) || (puntosComputadora === 21)) {
            break;
        }
    } while ((puntosComputadora <= puntosMinimos) && (puntosMinimos <= 21));
    determinarGanador();
}

//eventos
/* It's a function that is executed when the button is clicked. */
btnPedir.addEventListener('click', () => {
    const carta = pedirCard();
    const puntosJugador = acumularPuntos(carta, 0);
    //FUNCION INSERTAR LA CARTA
    crearCarta(carta, 0);

    /* It's checking if the player's points are greater than 21, if they are, it's disabling the
    buttons and it's calling the computer's turn function. If the player's points are greater than
    or equal to 21, it's disabling the buttons and it's calling the computer's turn function. */
    if (puntosJugador > 21) {
        console.warn('Lo siento mucho, perdiste');
        btnPedir.disabled = true;
        btnDetener.disabled = true;
        turnoComputadora(puntosJugador);
    } else if (puntosJugador >= 21) {
        console.warn('21, Genial!!')
        btnPedir.disabled = true;
        btnDetener.disabled = true;
        turnoComputadora(puntosJugador);
    }
});

/* It's disabling the buttons when the user clicks on the button. */
btnDetener.addEventListener('click', () => {
    btnDetener.disabled = true;
    btnPedir.disabled = true;
    turnoComputadora(puntosJugadores);
})

btnNuevo.addEventListener('click', () => {
    inicializarJuego();
});

