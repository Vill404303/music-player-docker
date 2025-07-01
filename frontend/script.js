
const musicContainer = document.getElementById('music-container');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

const audio = document.getElementById('audio');
const progress = document.getElementById('progress');
const progressContainer = document.getElementById('progress-container');
const title = document.getElementById('title');
const cover = document.getElementById('cover');
const background = document.getElementById('background');
const volumeSlider = document.getElementById('volume-slider');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');

const playlistBtn = document.getElementById('playlist-btn');
const playlistContainer = document.getElementById('playlist-container');
const playlist = document.getElementById('playlist');

let songs = [];
let songIndex = 0;


async function getSongs() {
  try {
    const res = await fetch('/api/songs');
    if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
    }
    songs = await res.json();
    loadSong(songs[songIndex]);
    populatePlaylist(); 
  } catch (error) {
    console.error('Tidak dapat mengambil daftar lagu:', error);
    title.innerText = 'Gagal memuat';
  }
}

function populatePlaylist() {
    playlist.innerHTML = '';
    songs.forEach((song, index) => {
        const li = document.createElement('li');
        li.innerText = song.title;
        li.setAttribute('data-index', index);
        playlist.appendChild(li);
    });
}

function highlightActiveSong() {
    const listItems = document.querySelectorAll('#playlist li');
    listItems.forEach(item => {
        item.classList.remove('active');
    });

    const activeListItem = document.querySelector(`#playlist li[data-index="${songIndex}"]`);
    if (activeListItem) {
        activeListItem.classList.add('active');
    }
}

function loadSong(song) {
  title.innerText = song.title;
  audio.src = `/music/${song.id}.mp3`;
  cover.src = `/images/${song.id}.jpg`;
  background.style.backgroundImage = `url(/images/${song.id}.jpg)`;
  highlightActiveSong();
}

function playSong() {
  musicContainer.classList.add('play');
  playBtn.querySelector('i.fas').classList.remove('fa-play');
  playBtn.querySelector('i.fas').classList.add('fa-pause');
  audio.play();
}

function pauseSong() {
  musicContainer.classList.remove('play');
  playBtn.querySelector('i.fas').classList.add('fa-play');
  playBtn.querySelector('i.fas').classList.remove('fa-pause');
  audio.pause();
}

function prevSong() {
  songIndex--;
  if (songIndex < 0) {
    songIndex = songs.length - 1;
  }
  loadSong(songs[songIndex]);
  playSong();
}

function nextSong() {
  songIndex++;
  if (songIndex > songs.length - 1) {
    songIndex = 0;
  }
  loadSong(songs[songIndex]);
  playSong();
}

function updateProgress(e) {
  const { duration, currentTime } = e.srcElement;
  const progressPercent = (currentTime / duration) * 100;
  progress.style.width = `${progressPercent}%`;

  if(duration) {
      const durationMinutes = Math.floor(duration / 60);
      let durationSeconds = Math.floor(duration % 60);
      if (durationSeconds < 10) { durationSeconds = `0${durationSeconds}`; }
      durationEl.innerText = `${durationMinutes}:${durationSeconds}`;
  }
  
  const currentMinutes = Math.floor(currentTime / 60);
  let currentSeconds = Math.floor(currentTime % 60);
  if (currentSeconds < 10) { currentSeconds = `0${currentSeconds}`; }
  currentTimeEl.innerText = `${currentMinutes}:${currentSeconds}`;
}

function setProgress(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;
  if (duration) {
      audio.currentTime = (clickX / width) * duration;
  }
}

playBtn.addEventListener('click', () => {
  const isPlaying = musicContainer.classList.contains('play');
  isPlaying ? pauseSong() : playSong();
});

prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);
audio.addEventListener('timeupdate', updateProgress);
progressContainer.addEventListener('click', setProgress);
audio.addEventListener('ended', nextSong);
volumeSlider.addEventListener('input', (e) => {
  audio.volume = e.target.value;
});


playlistBtn.addEventListener('click', () => {
    musicContainer.classList.toggle('show-playlist');
});

playlist.addEventListener('click', (e) => {
    if (e.target.tagName === 'LI') {
        const clickedIndex = parseInt(e.target.getAttribute('data-index'));

        if (songIndex !== clickedIndex) {
            songIndex = clickedIndex;
            loadSong(songs[songIndex]);
            playSong();
        }
        
        musicContainer.classList.remove('show-playlist');
    }
});

getSongs();
