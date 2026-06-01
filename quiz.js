// Read topic from URL (?topic=greetings). If no topic, show all questions (legacy mode).
const urlParams = new URLSearchParams(window.location.search);
const topic = urlParams.get('topic');

let questions = [];
let isLessonQuiz = false; // true when ?topic= is in URL → we're in lesson flow

document.addEventListener('DOMContentLoaded', () => {
    fetch('quiz.json')
        .then(res => res.json())
        .then(data => {
            if (topic && data[topic]) {
                // Lesson quiz mode — only this topic's questions
                questions = data[topic];
                isLessonQuiz = true;
                updateHeaderForLesson();
            } else if (Array.isArray(data)) {
                // Old format fallback (in case old data sneaks in)
                questions = data;
            } else {
                // No topic specified → combine all topics
                questions = Object.values(data).flat();
            }

            renderQuestions();
        });

    document.getElementById('submit-quiz').addEventListener('click', handleSubmit);
});

function updateHeaderForLesson() {
    const titleEl = document.querySelector('.lessons-header h1');
    const subtitleEl = document.querySelector('.lessons-header .lessons-subtitle');
    if (titleEl) titleEl.textContent = `${topic.charAt(0).toUpperCase() + topic.slice(1)} Quiz`;
    if (subtitleEl) subtitleEl.textContent = 'Test what you just learned';
}

function renderQuestions() {
    const form = document.getElementById('quiz-form');
    form.innerHTML = '';

    questions.forEach((q, index) => {
        const div = document.createElement('div');
        div.innerHTML = `
            <p><strong>Question ${index + 1}:</strong> ${q.question}</p>
            ${q.options.map((opt) => `
                <label><input type="radio" name="q${index}" value="${opt}"> ${opt}</label>
            `).join('')}
        `;
        form.appendChild(div);
    });
}

function handleSubmit() {
    let score = 0;
    let unanswered = 0;

    questions.forEach((q, index) => {
        const selected = document.querySelector(`input[name="q${index}"]:checked`);
        if (!selected) {
            unanswered++;
        } else if (selected.value === q.answer) {
            score++;
        }
    });

    const result = document.getElementById('result');

    if (unanswered > 0) {
        result.textContent = `Please answer all questions. ${unanswered} unanswered.`;
        result.style.color = "#8b0000";
        return;
    }

    if (isLessonQuiz) {
        // In lesson flow → redirect to completion screen with score
        window.location.href = `complete.html?topic=${topic}&score=${score}&total=${questions.length}`;
    } else {
        // Standalone quiz mode
        result.textContent = `Your score is ${score} / ${questions.length}`;
        result.style.color = score === questions.length ? "#4a8c4a" : "#8b0000";
    }
}