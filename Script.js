window.document.addEventListener("DOMContentLoaded", () => {
  class Cronometro {
    constructor(callback) {
        this.startTempo = 0;
        this.tempoDecorrido = 0;
        this.tempoIntervalo = null;
        this.on_off = false;
        // Callback para atualizar a UI (separação de responsabilidades)
        this.callback = callback; 
    }

    start() {
        if (!this.on_off) {
            // Ajusta o start time subtraindo o que já passou (caso tenha pausado)
            this.startTempo = Date.now() - this.tempoDecorrido;
            
            // Atualiza a cada 10ms para ter precisão de milissegundos
            this.tempoIntervalo = setInterval(() => {
                this.tempoDecorrido = Date.now() - this.startTempo;
                this.printTime();
            }, 10);
            
            this.on_off = true;
        }
    }

    pause() {
        if (this.on_off) {
            clearInterval(this.tempoIntervalo);
            this.on_off = false;
        }
    }

    reset() {
        clearInterval(this.tempoIntervalo);
        this.startTempo = 0;
        this.tempoDecorrido = 0;
        this.on_off = false;
        this.printTime();
    }

    // Formata o tempo (MM:SS:ms)
    formatTime(timeInMs) {
        let date = new Date(timeInMs);
        let hours = date.getUTCHours().toString().padStart(2, '0');
        let minutes = date.getUTCMinutes().toString().padStart(2, '0');
        let seconds = date.getUTCSeconds().toString().padStart(2, '0');
        let milliseconds = Math.floor(date.getUTCMilliseconds() / 10).toString().padStart(2, '0');

        return `${hours}:${minutes}:${seconds}:${milliseconds}`;
    }

    printTime() {
        // Chama a função que atualiza o HTML
        this.callback(this.formatTime(this.tempoDecorrido));
    }
}

// --- Integração com o DOM (Interface) ---

// Elementos HTML
const display = document.getElementById('display');
const btnStart = document.getElementById('start');
const btnPause = document.getElementById('pause');
const btnReset = document.getElementById('reset');

// Instancia a classe passando a função que atualiza o texto na tela
const meuCronometro = new Cronometro((tempoFormatado) => {
    display.textContent = tempoFormatado;
});

// Event Listeners
btnStart.addEventListener('click', () => {
    meuCronometro.start();
    toggleBotoes(true); // Função visual para alternar botões
});

btnPause.addEventListener('click', () => {
    meuCronometro.pause();
    toggleBotoes(false);
});

btnReset.addEventListener('click', () => {
    meuCronometro.reset();
    toggleBotoes(false);
});

// Função auxiliar para UX (esconder/mostrar botões)
function toggleBotoes(rodando) {
    btnStart.style.display = rodando ? 'none' : 'inline-block';
    btnPause.style.display = rodando ? 'inline-block' : 'none';
}
});