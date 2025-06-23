// making proverbs show one at a time
const proverbs = [
  "A na-eme eji ama aka.",
  "Ebe onye dara ka chi ya kwaturu ya.",
  "Nwata bulie aka, o bulie aka nne ya.",
];

let current = 0;

document.getElementById('show-proverb').addEventListener('click', () => {
  const display = document.getElementById('proverb-display');
  if (current < proverbs.length) {
    display.textContent = proverbs[current];
    current++;
  } else {
    display.textContent = "All proverbs revealed!";
  }
});


// add dom manipulation for proverb of the day pop-up
document.addEventListener('DOMContentLoaded', () => {
  const proverbs = [
    "A na-eme eji ama aka.",
    "Ebe onye dara ka chi ya kwaturu ya.",
    "Nwata bulie aka, o bulie aka nne ya.",
  ];
  const randomProverb = proverbs[Math.floor(Math.random() * proverbs.length)];

  const modal = document.createElement('div');
  modal.id = 'proverb-modal';
  modal.innerHTML = `
    <div class="modal-content">
      <h2>Proverb of the Day</h2>
      <p>${randomProverb}</p>
      <button id="close-modal">Close</button>
    </div>
  `;
  document.body.appendChild(modal);

  document.getElementById('close-modal').addEventListener('click', () => {
    modal.remove();
  });
});