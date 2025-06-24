async function loadTopic(topic) {      //to load topic
  const res = await fetch('language.json');   // fetch json file
  const data = await res.json();
  const lessons = data[topic];

  const contentArea = document.getElementById('content-area');
  contentArea.innerHTML = `<h2>${capitalize(topic)}</h2>`;

  lessons.forEach(entry => {
    const para = document.createElement('p');
    para.innerHTML = `<strong>${entry.igbo}</strong> - ${entry.english}`;
    contentArea.appendChild(para);
  });
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Capitalizes first letter
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Loads topic content dynamically from JSON and displays it
async function loadTopic(topic) {
  try {
    const res = await fetch('language.json');
    if (!res.ok) throw new Error('Failed to load language.json');
    const data = await res.json();

    const lessons = data[topic];
    const contentArea = document.getElementById('content-area');

    if (!lessons) {
      contentArea.innerHTML = `<p>Sorry, no data found for "${topic}".</p>`;
      return;
    }

    contentArea.innerHTML = `<h2>${capitalize(topic)}</h2>`;

    lessons.forEach(entry => {
      const para = document.createElement('p');
      para.innerHTML = `<strong>${entry.igbo}</strong> - ${entry.english}`;
      contentArea.appendChild(para);
    });
  } catch (error) {
    console.error(error);
    document.getElementById('content-area').innerHTML = `<p>Error loading data.</p>`;
  }
}
