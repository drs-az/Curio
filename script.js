document.addEventListener('DOMContentLoaded', function() {
  const params = new URLSearchParams(window.location.search);
  const child = params.get('child') || 'Child';
  const profileName = document.getElementById('profileName');
  profileName.textContent = child + "'s Profile";

  const videosKey = child + '_videos';
  const certKey = child + '_certs';

  let videos = JSON.parse(localStorage.getItem(videosKey) || '[]');
  let certs = JSON.parse(localStorage.getItem(certKey) || '[]');

  const videoList = document.getElementById('videoList');
  const certList = document.getElementById('certList');

  function saveVideos() {
    localStorage.setItem(videosKey, JSON.stringify(videos));
  }

  function saveCerts() {
    localStorage.setItem(certKey, JSON.stringify(certs));
  }

  function renderVideos() {
    videoList.innerHTML = '';
    videos.forEach((v, idx) => {
      const container = document.createElement('div');
      const title = document.createElement('div');
      title.textContent = v.title;
      const video = document.createElement('video');
      video.controls = true;
      video.src = v.url;
      video.width = 480;
      video.addEventListener('ended', function() {
        const c = { title: v.title, date: new Date().toLocaleDateString() };
        certs.push(c);
        saveCerts();
        renderCerts();
      });
      container.appendChild(title);
      container.appendChild(video);
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
    const title = document.getElementById('videoTitle').value || 'Untitled';
    const urlInput = document.getElementById('videoUrl');
    const fileInput = document.getElementById('videoFile');
    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const reader = new FileReader();
      reader.onload = function(ev) {
        videos.push({ title: title, url: ev.target.result });
        saveVideos();
        renderVideos();
      };
      reader.readAsDataURL(file);
    } else if (urlInput.value) {
      videos.push({ title: title, url: urlInput.value });
      saveVideos();
      renderVideos();
    }
    form.reset();
  });
});

