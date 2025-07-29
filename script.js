document.addEventListener('DOMContentLoaded', function() {
  const params = new URLSearchParams(window.location.search);
  const child = params.get('child') || 'Child';
  const profileName = document.getElementById('profileName');
  profileName.textContent = child + "'s Profile";

  const videosKey = child + '_videos';
  const certKey = child + '_certs';

  let videos = JSON.parse(localStorage.getItem(videosKey) || '[]');
  let certs = JSON.parse(localStorage.getItem(certKey) || '[]');

  function hasCertificate(title) {
    return certs.some(c => c.title === title);
  }

  const videoList = document.getElementById('videoList');
  const certList = document.getElementById('certList');

  function saveVideos() {
    localStorage.setItem(videosKey, JSON.stringify(videos));
  }

  function saveCerts() {
    localStorage.setItem(certKey, JSON.stringify(certs));
  }

  function parseVideoUrl(url) {
    const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]+)/);
    if (yt) {
      return { url: `https://www.youtube.com/embed/${yt[1]}?rel=0`, embed: true };
    }
    return { url: url, embed: false };
  }

  function renderVideos() {
    videoList.innerHTML = '';
    videos.forEach(v => {
      const container = document.createElement('div');
      const title = document.createElement('div');
      title.textContent = v.title;
      if (v.embed) {
        const iframe = document.createElement('iframe');
        iframe.src = v.url;
        iframe.style.width = '100%';
        iframe.style.aspectRatio = '16 / 9';
        iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-presentation');
        iframe.setAttribute('allow', 'autoplay; encrypted-media; fullscreen');
        iframe.setAttribute('allowfullscreen', '');

        const button = document.createElement('button');
        button.textContent = 'Get Certificate';
        const badge = document.createElement('span');
        badge.textContent = 'Completed';
        badge.className = 'badge';
        badge.style.display = hasCertificate(v.title) ? 'inline-block' : 'none';

        button.addEventListener('click', function () {
          const pass = prompt('Enter passcode');
          if (pass !== 'LearningIsFun!') {
            alert('Incorrect passcode');
            return;
          }
          const c = { title: v.title, date: new Date().toLocaleDateString() };
          certs.push(c);
          saveCerts();
          renderCerts();
          badge.style.display = 'inline-block';
        });

        const controls = document.createElement('div');
        controls.className = 'controls';
        controls.appendChild(button);
        controls.appendChild(badge);

        container.appendChild(title);
        container.appendChild(iframe);
        container.appendChild(controls);
      } else {
        const video = document.createElement('video');
        video.controls = true;
        video.src = v.url;
        video.style.width = '100%';
        const badge = document.createElement('span');
        badge.textContent = 'Completed';
        badge.className = 'badge';
        badge.style.display = hasCertificate(v.title) ? 'inline-block' : 'none';

        video.addEventListener('ended', function() {
          const c = { title: v.title, date: new Date().toLocaleDateString() };
          certs.push(c);
          saveCerts();
          renderCerts();
          badge.style.display = 'inline-block';
        });
        container.appendChild(title);
        container.appendChild(video);
        const controls = document.createElement('div');
        controls.className = 'controls';
        controls.appendChild(badge);
        container.appendChild(controls);
      }
      videoList.appendChild(container);
    });
  }

  function renderCerts() {
    certList.innerHTML = '';
    certs.forEach(c => {
      const li = document.createElement('li');
      li.innerHTML = `<div class="certificate">
        <h3>Certificate of Completion</h3>
        <p>This certifies that <strong>${child}</strong> completed <strong>${c.title}</strong> on ${c.date}</p>
      </div>`;
      certList.appendChild(li);
    });
  }

  renderVideos();
  renderCerts();

  const form = document.getElementById('addVideoForm');
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const pass = document.getElementById('passcode').value;
    if (pass !== 'LearningIsFun!') {
      alert('Incorrect passcode');
      return;
    }
    const title = document.getElementById('videoTitle').value || 'Untitled';
    const urlInput = document.getElementById('videoUrl');
    const fileInput = document.getElementById('videoFile');
    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const reader = new FileReader();
      reader.onload = function(ev) {
        videos.push({ title: title, url: ev.target.result, embed: false });
        saveVideos();
        renderVideos();
      };
      reader.readAsDataURL(file);
    } else if (urlInput.value) {
      const parsed = parseVideoUrl(urlInput.value);
      videos.push({ title: title, url: parsed.url, embed: parsed.embed });
      saveVideos();
      renderVideos();
    }
    form.reset();
  });
});

