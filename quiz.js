document.addEventListener('DOMContentLoaded', () => {
  const BACKEND_URL = 'http://localhost:4000';

  const token = localStorage.getItem('token');
  if (!token) {
    // Show message to user
    document.getElementById('quiz-form').innerHTML = '<p style="color:red;font-weight:bold;">Please sign up or log in before taking the quiz. Redirecting...</p>';
    document.getElementById('submit-quiz').disabled = true; // disable submit button

    // Automatically redirect to auth page after 2 seconds
    setTimeout(() => {
      window.location.href = 'auth.html';
    }, 2000);

    return; // stop loading questions
  }

  let questions = [];

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

    fetch(`${BACKEND_URL}/quiz/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // ✅ Send JWT token in header
      },
      body: JSON.stringify({ answers })
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
