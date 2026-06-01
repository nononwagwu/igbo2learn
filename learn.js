const urlParams = new URLSearchParams(window.location.search);
const topic = urlParams.get('topic') || 'greetings';

let cards = [];
let currentIndex = 0;

const wordEl = document.getElementById('word');
const pronunciationEl = document.getElementById('pronunciation');
const englishEl = document.getElementById('english');
const currentStepEl = document.getElementById('current-step');
const totalStepsEl = document.getElementById('total-steps');
const progressFill = document.getElementById('progress-fill');
const titleEl = document.getElementById('lesson-title');
const audioBtn = document.getElementById('audio-btn');
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');

async function loadLesson() {
    try {
        const res = await fetch('language.json');
        const data = await res.json();
        cards = data[topic];

        if (!cards || cards.length === 0) {
            wordEl.textContent = 'No lesson found';
            return;
        }

        titleEl.textContent = topic.charAt(0).toUpperCase() + topic.slice(1);
        totalStepsEl.textContent = cards.length;
        showStep(0);
    } catch (err) {
        console.error(err);
        wordEl.textContent = 'Error loading lesson';
    }
}

function showStep(index) {
    const card = cards[index];
    wordEl.textContent = card.igbo;
    pronunciationEl.textContent = `(${card.pronunciation})`;
    englishEl.textContent = card.english;
    currentStepEl.textContent = index + 1;

    const percent = ((index + 1) / cards.length) * 100;
    progressFill.style.width = `${percent}%`;

    // Update button state
    btnPrev.disabled = index === 0;
    btnNext.textContent = index === cards.length - 1 ? 'Practice with Flashcards →' : 'Next →';
}

btnNext.addEventListener('click', () => {
    if (currentIndex < cards.length - 1) {
        currentIndex++;
        showStep(currentIndex);
    } else {
        // End of lesson → go to flashcards for the same topic
        window.location.href = `flashcards.html?topic=${topic}`;
    }
});

btnPrev.addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        showStep(currentIndex);
    }
});

audioBtn.addEventListener('click', () => {
    audioBtn.classList.add('audio-active');
    setTimeout(() => audioBtn.classList.remove('audio-active'), 300);
});

loadLesson();