
document.addEventListener('DOMContentLoaded', () => {
  const kidsKey = 'kids';
  const list = document.querySelector('.profile-list');
  const form = document.getElementById('addKidForm');
  let kids = JSON.parse(localStorage.getItem(kidsKey) || '[]');
  if (kids.length === 0) {
    kids = ['Kid1', 'Kid2'];
  }

  function saveKids() {
    localStorage.setItem(kidsKey, JSON.stringify(kids));
  }

  function renderKids() {
    list.innerHTML = '';
    kids.forEach(name => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = `profile.html?child=${encodeURIComponent(name)}`;
      a.textContent = `${name} Profile`;
      li.appendChild(a);
      list.appendChild(li);
    });
  }

  renderKids();

  form.addEventListener('submit', e => {
    e.preventDefault();
    const input = document.getElementById('kidName');
    const name = input.value.trim();
    if (name) {
      kids.push(name);
      saveKids();
      renderKids();
      form.reset();
    }
  });
});

