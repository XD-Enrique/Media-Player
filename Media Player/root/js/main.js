const audio = document.getElementById('audio-player');
const playPauseBtn = document.getElementById('play-pause');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const progress = document.getElementById('progress');
const volume = document.getElementById('volume');
const trackTitle = document.getElementById('track-title');
const trackCover = document.getElementById('track-cover');
const playlistEl = document.getElementById('playlist');

const playlist = [
  { src: 'songs/scar tissue.mp3', title: 'Scar Tissue - Red Hot Chili Peppers', cover: 'covers/californicationAlbum.jpg' },
  { src: 'songs/staying alive.mp3', title: 'Staying Alive - Bee Gees', cover: 'covers/stayingAliveAlbum.jpg' },
  { src: 'songs/sugar.mp3', title: 'Sugar - System Of A Down', cover: 'covers/SoadAlbum.jpg' }
];

let anterior = [];
let proximo = [];
let currentIndex = 0;

// Create playlist items dynamically
playlist.forEach((track, index) => {
  const li = document.createElement('li');
  li.textContent = track.title;
  li.addEventListener('click', () => {
    anterior.push(currentIndex);
    loadTrack(index);
    audio.play();
    updateActive();
    playPauseBtn.textContent = '⏸';
  });
  playlistEl.appendChild(li);
});

// Load the first track
function loadTrack(index) {
  if (index < 0) index = playlist.length - 1;
  else if (index >= playlist.length) index = 0;
  currentIndex = index;

  audio.src = playlist[index].src;
  trackTitle.textContent = playlist[index].title;
  trackCover.src = playlist[index].cover;
  audio.load();
  updateActive();
}

// Initialize the player
function updateActive() {
  [...playlistEl.children].forEach((li, i) => {
    li.classList.toggle('active', i === currentIndex);
  });
}

// play, pause, stop, previous, and next functionality
playPauseBtn.addEventListener('click', () => {
  if (audio.paused) {
    audio.play();
    playPauseBtn.textContent = '⏸';
  } else {
    audio.pause();
    playPauseBtn.textContent = '▶';
  }
});

prevBtn.addEventListener('click', () => {
  audio.currentTime = 0;
});

prevBtn.addEventListener('dblclick', () => {
  lastIndex = anterior.length - 1;
  if (lastIndex >= 0) {
    proximo.push(currentIndex); // guarda o índice atual em próximo
    loadTrack(anterior[lastIndex]); // verifica se anterior está definido
    anterior.pop(); // remove o último índice após voltar
    audio.play();
    playPauseBtn.textContent = '⏸';
  }
});

nextBtn.addEventListener('click', () => {
  lastIndex = proximo.length - 1;
  if (lastIndex >= 0) {
    anterior.push(currentIndex); // guarda o índice atual em anterior
    loadTrack(proximo[lastIndex]);
    proximo.pop(); // remove o último índice após avançar
    audio.play();
    playPauseBtn.textContent = '⏸';
  }else{
    anterior.push(currentIndex); // guarda o índice atual em anterior
    loadTrack(currentIndex + 1);
    audio.play();
    playPauseBtn.textContent = '⏸';
  }
});

// play next track when current ends
audio.addEventListener('ended', () => {
  lastIndex = proximo.length - 1;
  if (lastIndex >= 0) {
  anterior.push(currentIndex); // guarda o índice atual em anterior
  loadTrack(proximo[lastIndex]);
  proximo.pop(); // remove o último índice após avançar
  audio.play();
  playPauseBtn.textContent = '⏸';
  }else{
    anterior.push(currentIndex); // guarda o índice atual em anterior
    loadTrack(currentIndex + 1);
    audio.play();
    playPauseBtn.textContent = '⏸';
  }
});

// Update progress bar and volume control
audio.addEventListener('timeupdate', () => {
  progress.max = Math.floor(audio.duration);
  progress.value = Math.floor(audio.currentTime);
});

progress.addEventListener('input', () => {
  audio.currentTime = progress.value;
});

volume.addEventListener('input', () => {
  audio.volume = volume.value;
});

// initialize volume slider
document.addEventListener('DOMContentLoaded', () => {
  volume.value = audio.volume;
  loadTrack(currentIndex);
});
