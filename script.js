let targetSequence = "";
let countdownInterval; // Interwał dla widocznego licznika
let timerHandle;      // Timeout dla automatycznego sprawdzenia
let pairInSerieCount = 3;
let secondsForAnswer = 10;
let millisecondsForAnswer = 1000 * secondsForAnswer;




// --- STATYSTYKI ---
let totalRounds = 0;    // Liczba wszystkich podejść
let correctRounds = 0;  // Liczba wygranych podejść

function generatePair() {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const randomLetter = letters.charAt(Math.floor(Math.random() * letters.length));
    const randomNumber = numbers.charAt(Math.floor(Math.random() * numbers.length));
    return randomLetter + randomNumber;
}

async function startGame() {

    // 1. Pobieramy wybraną wartość z dropdownu
    const pairSelect = document.getElementById("pair-select");
    pairInSerieCount = parseInt(pairSelect.value); // zamieniamy tekst na liczbę

    // 2. Ukrywamy dropdown na czas gry
    document.getElementById("pair-count-settings-area").style.display = "none";


    // Resetowanie stanu początkowego rundy
    targetSequence = "";
    document.getElementById("start-btn").style.display = "none";
    document.getElementById("message").innerText = "";
    document.getElementById("input-area").style.display = "none";
    document.getElementById("user-input").value = "";


    document.getElementById("display-area").style.display = "inline-block";
    document.getElementById("help-btn").style.display = "none";


    // 1. Faza wyświetlania
    for (let i = 0; i < pairInSerieCount; i++) {
        let pair = generatePair();
        targetSequence += pair;

        document.getElementById("display-area").innerText = pair;
        await new Promise(r => setTimeout(r, 3000));

        document.getElementById("display-area").innerText = "";
        if (i < pairInSerieCount - 1) {
            await new Promise(r => setTimeout(r, 2000));
        }
    }

    // 2. Odliczanie 5 sekund "Przygotuj się"
    for (let i = 5; i > 0; i--) {
        document.getElementById("display-area").innerText = `Get ready... ${i}`;
        await new Promise(r => setTimeout(r, 1000));
    }

    // 3. Faza wpisywania odpowiedzi
    document.getElementById("display-area").innerText = "Enter characters you remember";
//    document.getElementById("display-area").innerText = "Wpisz zapamiętane znaki";
    document.getElementById("input-area").style.display = "block";

    const inputField = document.getElementById("user-input");
    inputField.focus();

    // 4. Timer na odpowiedź
    let timeLeft = secondsForAnswer;
    const timerDisplay = document.getElementById("countdown-timer");
    timerDisplay.innerText = `Pozostało czasu: ${timeLeft}s`;

    clearInterval(countdownInterval);
    clearTimeout(timerHandle);

    countdownInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.innerText = `Time left: ${timeLeft}s`;
//        timerDisplay.innerText = `Pozostało czasu: ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
        }
    }, 1000);

    timerHandle = setTimeout(() => {
        checkResult();
    }, millisecondsForAnswer);
}

function checkResult() {
    clearInterval(countdownInterval);
    clearTimeout(timerHandle);

    const inputField = document.getElementById("user-input");
    const userInput = inputField.value;

    // Normalizacja (Upper Case zgodnie z Twoim kodem)
    let cleanUser = userInput.replace(/\s+/g, '').toUpperCase();
    let cleanTarget = targetSequence.replace(/\s+/g, '').toUpperCase();

    // --- LOGIKA STATYSTYK ---
    totalRounds++; // Zwiększamy licznik wszystkich gier
    let isCorrect = (cleanUser === cleanTarget);

    if (isCorrect) {
        correctRounds++; // Zwiększamy licznik poprawnych
    }

    // Obliczanie procentu skuteczności
    let successRate = Math.round((correctRounds / totalRounds) * 100);
    let imagePath = "images/normalCat.png"
    //color scale
    let myColor = "#f5e21b"
    if (successRate <= 50){
        myColor = "#ff3300"
        imagePath = "images/sadCat.png"
    } else if (successRate < 75){
        myColor = "#ff9933"
        imagePath = "images/normalCat.png"
    } else{
        myColor = "#009933"
        imagePath = "images/happyCat.png"
    }


    // Wyświetlenie wyniku i statystyk
    const messageDisplay = document.getElementById("message");
    const statsInfo = `<p style="color: ${myColor};" ><b>Success rate: ${correctRounds}/${totalRounds}
    <br>Your percent success rate: ${successRate}%</b></p>`;

    if (isCorrect) {
        messageDisplay.innerHTML = `<span style='color:green; font-weight:bold;'>Bravo!<br>Correct result.</span>`;
//        messageDisplay.innerHTML = `<span style='color:green; font-weight:bold;'>Brawo!<br>Wynik poprawny.</span>`;
        document.getElementById("stats-area").innerHTML = statsInfo;
        document.getElementById("picture-place").innerHTML = `<img src="${imagePath}" alt="Cat Status">`
    } else {
        messageDisplay.innerHTML = `<span style='color:red; font-weight:bold;'>
        Error!<br>Your entered sequence: ${cleanUser}<br>Correct sequence: ${targetSequence}</span>`;
        document.getElementById("stats-area").innerHTML = statsInfo;
        document.getElementById("picture-place").innerHTML = `<img src="${imagePath}" alt="Cat Status">`
    }

    // Porządki końcowe
    inputField.value = "";
    document.getElementById("input-area").style.display = "none";
    document.getElementById("start-btn").style.display = "inline-block";
    document.getElementById("start-btn").innerText = "Play again";
    document.getElementById("display-area").innerText = "";

    document.getElementById("display-area").style.display = "none";
    document.getElementById("help-btn").style.display = "inline-block";
}

function toggleHelp() {
    const modal = document.getElementById("help-modal");
    if (modal.style.display === "block") {
        modal.style.display = "none";
    } else {
        modal.style.display = "block";
    }
}

// Close the modal if the user clicks outside of it
window.onclick = function(event) {
    const modal = document.getElementById("help-modal");
    if (event.target == modal) {
        modal.style.display = "none";
    }
}