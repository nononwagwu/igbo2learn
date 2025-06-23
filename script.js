document.addEventListener('DOMContentLoaded', () => {
  // Fetch proverbs.json
  fetch('proverbs.json')
    .then(response => response.json())
    .then(proverbs => {
      // ===========================
      // Populate Proverbs Gallery
      // ===========================
      const list = document.getElementById('proverb-list');
      proverbs.forEach(proverb => {
        const card = document.createElement('div');
        card.className = 'proverb-card';
        card.innerHTML = `
          <h3>“${proverb.text}”</h3>
          <p><i>${proverb.meaning}</i></p>
        `;
        list.appendChild(card);
      });

      // ===========================
      // Show One-by-One Proverbs
      // ===========================
      let current = 0;
      const showProverbButton = document.getElementById('show-proverb');
      const proverbDisplay = document.getElementById('proverb-display');

      showProverbButton.addEventListener('click', () => {
        if (current < proverbs.length) {
          proverbDisplay.textContent = proverbs[current].text;
          current++;
        } else {
          proverbDisplay.textContent = "All proverbs revealed!";
        }
      });

      // ===========================
      // Proverb of the Day Modal
      // ===========================
      const randomProverb = proverbs[Math.floor(Math.random() * proverbs.length)];
      const modal = document.createElement('div');
      modal.id = 'proverb-modal';
      modal.innerHTML = `
        <div class="modal-content">
          <h2>Proverb of the Day</h2>
          <p>${randomProverb.text}</p>
          <button id="close-modal">Close</button>
        </div>
      `;
      document.body.appendChild(modal);

      document.getElementById('close-modal').addEventListener('click', () => {
        modal.remove();
      });
    })
    .catch(error => {
      console.error('Error loading proverbs:', error);
    });
});
