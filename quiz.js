document.addEventListener('DOMContentLoaded', () => {
  let questions = [];

  fetch('quiz.json')
    .then(res => res.json())
    .then(data => {
      questions = data;
      const form = document.getElementById('quiz-form');

      // Dynamically create questions
      questions.forEach((q, index) => {
        const div = document.createElement('div');
        div.innerHTML = `
          <p><strong>Question ${index + 1}:</strong> ${q.question}</p>
          ${q.options.map((opt, i) => `
            <label><input type="radio" name="q${index}" value="${opt}"> ${opt}</label>
          `).join('')}
        `;
        form.appendChild(div);
      });
    });

  document.getElementById('submit-quiz').addEventListener('click', () => {
    let score = 0;
    questions.forEach((q, index) => {
      const selected = document.querySelector(`input[name="q${index}"]:checked`);
      if (selected && selected.value === q.answer) {
        score++;
      }
    });

    const result = document.getElementById('result');
    result.textContent = `Your score is ${score} / ${questions.length}`;
    result.style.color = score === questions.length ? "green" : "red";
  });
});
