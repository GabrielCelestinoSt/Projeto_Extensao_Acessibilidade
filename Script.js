window.document.addEventListener("DOMContentLoaded", () => {
  class Cronometro {
    constructor(callback) {
        this.startTempo = 0;
        this.tempoDecorrido = 0;
        this.tempoIntervalo = null;
        this.on_off = false;
        this.callback = callback; 
    }

    start() {
        if (!this.on_off) {

            this.startTempo = Date.now() - this.tempoDecorrido;
            
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

    formatTime(timeInMs) {
        let date = new Date(timeInMs);
        let hours = date.getUTCHours().toString().padStart(2, '0');
        let minutes = date.getUTCMinutes().toString().padStart(2, '0');
        let seconds = date.getUTCSeconds().toString().padStart(2, '0');
        let milliseconds = Math.floor(date.getUTCMilliseconds() / 10).toString().padStart(2, '0');

        return `${hours}:${minutes}:${seconds}<span class="milissegundos">:${milliseconds}</span>`;
    }

    printTime() {
        this.callback(this.formatTime(this.tempoDecorrido));
    }
}


const display = document.getElementById('display');
const btnStart = document.getElementById('start');
const btnPause = document.getElementById('pause');
const btnReset = document.getElementById('reset');

const meuCronometro = new Cronometro((tempoFormatado) => {
    display.innerHTML = tempoFormatado;
});

btnStart.addEventListener('click', () => {
    meuCronometro.start();

});

btnPause.addEventListener('click', () => {
    meuCronometro.pause();

    
    const tempoEmMs = meuCronometro.tempoDecorrido;
    
    const textoParaFalar = gerarFraseDeTempo(tempoEmMs);
    
    narrarTempo(textoParaFalar);

    
});

btnReset.addEventListener('click', () => {    
    meuCronometro.reset();

});

function gerarFraseDeTempo(ms) {

    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    
    // Captura os milissegundos restantes (0 a 999)
    const milliseconds = Math.floor(ms % 1000);

    let partes = [];

    if (hours > 0) {
        partes.push(`${hours} ${hours === 1 ? 'hora' : 'horas'}`);
    }

    if (minutes > 0) {
        partes.push(`${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`);
    }

    if (seconds > 0) {
        partes.push(`${seconds} ${seconds === 1 ? 'segundo' : 'segundos'}`);
    }

    if (milliseconds > 0) {
        partes.push(`${milliseconds} milissegundos`);
    }

    if (partes.length === 0) {
        return "Zero segundos";
    }

    return partes.join(' e ');
}

function narrarTempo(texto) {
    window.speechSynthesis.cancel();

    const mensagem = new SpeechSynthesisUtterance(texto);
    
    mensagem.lang = 'pt-BR';
    
    window.speechSynthesis.speak(mensagem);
}
});