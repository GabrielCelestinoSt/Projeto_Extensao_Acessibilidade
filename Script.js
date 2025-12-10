window.document.addEventListener("DOMContentLoaded", () => {
    
    // 1. A CLASSE (O motor do cronômetro/temporizador)
    class Cronometro {
        constructor(callback) {
            this.tempoDecorrido = 0;
            this.tempoIntervalo = null;
            this.on_off = false;
            this.callback = callback;
            this.modoTemporizador = false;
        }

        setTimer(h, m, s) {
            this.tempoDecorrido = (h * 3600 + m * 60 + s) * 1000;
            this.modoTemporizador = true;
            this.printTime();
        }

        start() {
            if (!this.on_off) {
                const startMoment = Date.now();
                const tempoBase = this.tempoDecorrido;

                this.tempoIntervalo = setInterval(() => {
                    const agora = Date.now();
                    const diferenca = agora - startMoment;

                    if (this.modoTemporizador) {
                        this.tempoDecorrido = tempoBase - diferenca;
                        if (this.tempoDecorrido <= 0) {
                            this.tempoDecorrido = 0;
                            this.pause();
                            alert("Tempo esgotado!");
                        }
                    } else {
                        this.tempoDecorrido = tempoBase + diferenca;
                    }
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
            this.tempoDecorrido = 0;
            this.on_off = false;
            this.modoTemporizador = false;
            this.printTime();
        }

        formatTime(ms) {
            // Garante que o tempo não fique negativo no visor
            const tempoAbsoluto = Math.max(0, ms);
            let date = new Date(tempoAbsoluto);
            let h = date.getUTCHours().toString().padStart(2, '0');
            let m = date.getUTCMinutes().toString().padStart(2, '0');
            let s = date.getUTCSeconds().toString().padStart(2, '0');
            let msPart = Math.floor(date.getUTCMilliseconds() / 10).toString().padStart(2, '0');
            return `${h}:${m}:${s}<span class="milissegundos">:${msPart}</span>`;
        }

        printTime() {
            this.callback(this.formatTime(this.tempoDecorrido));
        }
    }

    // 2. ELEMENTOS DO DOM (A ponte com o HTML)
    const display = document.getElementById('display');
    const btnStart = document.getElementById('start');
    const btnPause = document.getElementById('pause');
    const btnReset = document.getElementById('reset');
    
    // Inputs (certifique-se de que os IDs batem com o HTML)
    const inH = document.getElementById('inputHours');
    const inM = document.getElementById('inputMinutes');
    const inS = document.getElementById('inputSeconds');

    const meuCronometro = new Cronometro((tempoFormatado) => {
        display.innerHTML = tempoFormatado;
    });

    // 3. EVENTOS (O que acontece quando clica)
    btnStart.addEventListener('click', () => {
        const h = parseInt(inH.value) || 0;
        const m = parseInt(inM.value) || 0;
        const s = parseInt(inS.value) || 0;

        // Se estiver zerado e tiver valores nos inputs, configura timer
        if (meuCronometro.tempoDecorrido === 0 && (h > 0 || m > 0 || s > 0)) {
            meuCronometro.setTimer(h, m, s);
        }
        meuCronometro.start();
    });

    btnPause.addEventListener('click', () => {
        meuCronometro.pause();
        narrarTempo(gerarFraseDeTempo(meuCronometro.tempoDecorrido));
    });

    btnReset.addEventListener('click', () => {
        meuCronometro.reset();
        inH.value = inM.value = inS.value = ''; // Limpa os campos
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