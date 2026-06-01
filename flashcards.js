// Flashcard study session logic

// Read which topic to study from the URL (e.g., flashcards.html?topic=greetings)
// Defaults to 'greetings' if no param is given.
const urlParams = new URLSearchParams(window.location.search);
const topic = urlParams.get('topic') || 'greetings';

// State
let cards = [];
let currentIndex = 0;
let knewCount = 0;
let dontKnowCount = 0;

// DOM elements
const cardWord = document.getElementById('card-word');
const cardPronunciation = document.getElementById('card-pronunciation');
const cardTranslation = document.getElementById('card-translation');
const cardCounter = document.getElementById('card-counter');
const topicTitle = document.getElementById('topic-title');
const flashcard = document.getElementById('flashcard');
const completeScreen = document.getElementById('flashcard-complete');
const cardStage = document.querySelector('.flashcard-stage');
const audioBtn = document.getElementById('audio-btn');

// Load cards for the topic
async function loadCards() {
    try {
        const res = await fetch('language.json');
        if (!res.ok) throw new Error('Could not load language.json');
        const data = await res.json();

        cards = data[topic];
        if (!cards || cards.length === 0) {
            cardWord.textContent = 'No cards found';
            cardPronunciation.textContent = '';
            cardTranslation.textContent = `Topic "${topic}" not found in data.`;
            return;
        }

        // Set the topic title (capitalize first letter)
        topicTitle.textContent = topic.charAt(0).toUpperCase() + topic.slice(1);

        showCard(0);
    } catch (err) {
        console.error(err);
        cardWord.textContent = 'Error loading cards';
        cardTranslation.textContent = err.message;
    }
}

// Display a specific card
function showCard(index) {
    const card = cards[index];
    cardWord.textContent = card.igbo;
    cardPronunciation.textContent = `(${card.pronunciation})`;
    cardTranslation.textContent = card.english;
    cardCounter.textContent = `${index + 1} / ${cards.length}`;
}

// Move to next card or end session
function nextCard() {
    currentIndex++;
    if (currentIndex >= cards.length) {
        endSession();
    } else {
        showCard(currentIndex);
    }
}

// End session: hide cards, show completion screen
function endSession() {
    cardStage.style.display = 'none';
    document.getElementById('total-cards').textContent = cards.length;
    document.getElementById('knew-count').textContent = knewCount;
    document.getElementById('dontknow-count').textContent = dontKnowCount;
    completeScreen.style.display = 'block';
}

// Audio button placeholder — no real audio files yet
audioBtn.addEventListener('click', () => {
    // For now: visual feedback only. Real audio playback comes when audio files exist.
    audioBtn.classList.add('audio-active');
    setTimeout(() => audioBtn.classList.remove('audio-active'), 300);
});

// Button handlers
document.getElementById('btn-know').addEventListener('click', () => {
    knewCount++;
    nextCard();
});

document.getElementById('btn-dontknow').addEventListener('click', () => {
    dontKnowCount++;
    nextCard();
});

// Start
loadCards();