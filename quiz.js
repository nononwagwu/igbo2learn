document.addEventListener('DOMContentLoaded', () => {
  let questions = [];
  const BACKEND_URL = 'http://localhost:3000'; // your backend URL

  // Fetch questions from backend
  fetch(`${BACKEND_URL}/quiz`)
    .then(res => res.json())
    .then(data => {
      questions = data;
      const form = document.getElementById('quiz-form');
      form.innerHTML = '';

      // Dynamically create questions from backend data
      questions.forEach((q, index) => {
        const div = document.createElement('div');
        div.innerHTML = `
          <p><strong>Question ${index + 1}:</strong> ${q.question}</p>
          ${q.options.map(opt => `
            <label><input type="radio" name="q${index}" value="${opt}"> ${opt}</label>
          `).join('')}
        `;
        form.appendChild(div);
      });
    })
    .catch(() => {
      document.getElementById('result').textContent = 'Failed to load quiz questions.';
    });

  document.getElementById('submit-quiz').addEventListener('click', () => {
    // Collect user answers
    const answers = {};
    questions.forEach((q, index) => {
      const selected = document.querySelector(`input[name="q${index}"]:checked`);
      if (selected) {
        answers[q.id] = selected.value;  // use q.id from backend questions
      }
    });

    if (Object.keys(answers).length === 0) {
      document.getElementById('result').textContent = 'Please answer at least one question.';
      return;
    }

    // Get token from localStorage
    const token = localStorage.getItem('token');

    // Send answers to backend to check, include Authorization header with token
    fetch(`${BACKEND_URL}/quiz/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Send JWT token in header
      },
      body: JSON.stringify({ userId: 'guest', answers }) // You can replace 'guest' with actual userId after auth
    })
    .then(res => res.json())
    .then(result => {
      if (result.error) {
        document.getElementById('result').textContent = `Error: ${result.error}`;
      } else {
        document.getElementById('result').textContent = `You got ${result.correctCount} out of ${result.totalCount} correct!`;
      }
    })
    .catch(() => {
      document.getElementById('result').textContent = 'Failed to submit quiz answers.';
    });
  });
});
