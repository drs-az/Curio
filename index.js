
document.addEventListener('DOMContentLoaded', () => {
  const kidsKey = 'kids';
  const list = document.querySelector('.profile-list');
  const form = document.getElementById('addKidForm');
  const leaderboard = document.getElementById('leaderboard');

  const stored = localStorage.getItem(kidsKey);
  let kids = stored ? JSON.parse(stored) : ['Kid1', 'Kid2'];
  if (!stored) {
    localStorage.setItem(kidsKey, JSON.stringify(kids));
  }

  function saveKids() {
    localStorage.setItem(kidsKey, JSON.stringify(kids));
  }

  function renderKids() {
    list.innerHTML = '';
    kids.forEach((name, idx) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = `profile.html?child=${encodeURIComponent(name)}`;
      a.textContent = `${name}'s Profile`;
      const del = document.createElement('button');
      del.textContent = 'Delete';
      del.className = 'delete-btn';
      del.addEventListener('click', () => {
        if (confirm(`Delete ${name}?`)) {
          kids.splice(idx, 1);
          localStorage.removeItem(`${name}_videos`);
          localStorage.removeItem(`${name}_certs`);
          saveKids();
          renderKids();
          renderLeaderboard();
        }
      });
      li.appendChild(a);
      li.appendChild(del);
      list.appendChild(li);
    });
  }

  function renderLeaderboard() {
    if (!leaderboard) return;
    leaderboard.innerHTML = '';
    kids.forEach(name => {
      const certs = JSON.parse(localStorage.getItem(`${name}_certs`) || '[]');
      const li = document.createElement('li');
      li.textContent = `${name}: ${certs.length} certificates`;
      leaderboard.appendChild(li);
    });
  }

  renderKids();
  renderLeaderboard();

  form.addEventListener('submit', e => {
    e.preventDefault();
    const input = document.getElementById('kidName');
    const name = input.value.trim();
    if (name) {
      kids.push(name);
      saveKids();
      renderKids();
      renderLeaderboard();
      form.reset();
    }
  });
});

