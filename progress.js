document.addEventListener('DOMContentLoaded', () => {
  const BACKEND_URL = 'http://localhost:4000';
  const token = localStorage.getItem('token');

  const progressContainer = document.getElementById('progress-list');

  if (!token) {
    progressContainer.innerHTML = '<p style="color:red;font-weight:bold;">Please sign up or log in first. Redirecting...</p>';
    setTimeout(() => window.location.href = 'auth.html', 2000);
    return;
  }

  fetch(`${BACKEND_URL}/progress`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        progressContainer.innerHTML = `<p style="color:red;">Error: ${data.error}</p>`;
        return;
      }

      if (data.progress.length === 0) {
        progressContainer.innerHTML = `<p>No quiz attempts found yet. Take a quiz to see your progress!</p>`;
        return;
      }

      const list = document.createElement('ul');
      data.progress.forEach(entry => {
        const li = document.createElement('li');
        const date = new Date(entry.dateTaken).toLocaleString();
        li.textContent = `Quiz ${entry.quizId}: ${entry.score} correct answers - taken on ${date}`;
        list.appendChild(li);
      });
      progressContainer.innerHTML = '';
      progressContainer.appendChild(list);
    })
    .catch(() => {
      progressContainer.innerHTML = '<p style="color:red;">Failed to load your progress.</p>';
    });
});
