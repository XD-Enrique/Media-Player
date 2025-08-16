const audio = document.getElementById('audio-player');
const playPauseBtn = document.getElementById('play-pause');
const stopBtn = document.getElementById('stop');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const progress = document.getElementById('progress');
const volume = document.getElementById('volume');
const trackTitle = document.getElementById('track-title');
const trackCover = document.getElementById('track-cover');
const playlistEl = document.getElementById('playlist');

// Playlist array with song objects
const playlist = [
  { src: 'songs/scar tissue.mp3', title: 'Scar Tissue - Red Hot Chili Peppers', cover:'covers/californicationAlbum.jpg' },
  { src: 'songs/staying alive.mp3', title: 'Staying Alive - Bee Gees', cover:'covers/stayingAliveAlbum.jpg' },
  { src: 'songs/sugar.mp3', title: 'Sugar - System Of A Down', cover:'covers/SoadAlbum.jpg' },
  // Add more songs as needed
];

// Create playlist items dynamically
playlistItems.forEach((item, index) => {
  item.addEventListener('click', () => {
    // Carrega a música pelo índice
    loadTrack(index);
    audio.play();

    // Atualiza o botão de play/pause
    playPauseBtn.textContent = '⏸';

    // Marca visualmente a música ativa
    playlistItems.forEach(li => li.classList.remove('active'));
    item.classList.add('active');
  });
});

// Current track index
let currentIndex = 0;

// Load the first track
function loadTrack(index) {
  if (index < 0) index = playlist.length - 1;
  else if (index >= playlist.length) index = 0;
  currentIndex = index;

  audio.src = playlist[index].src;
  trackTitle.textContent = playlist[index].title;
  trackCover.src = playlist[index].cover;
  audio.load();
}

loadTrack(currentIndex);

// Play, pause, stop, previous, and next functionality
playPauseBtn.addEventListener('click', () => {
    if (audio.paused) {
    audio.play();
    playPauseBtn.textContent = '⏸';
  } else {
    audio.pause();
    playPauseBtn.textContent = '▶';
  }
});

// When the audio is stopped, reset the play button
audio.addEventListener('ended', () => {
  playPauseBtn.textContent = '▶';
});

// Next and previous track functionality
prevBtn.addEventListener('click', () => {
  loadTrack(currentIndex - 1);
  audio.play();
  playPauseBtn.textContent = '⏸';
});
nextBtn.addEventListener('click', () => {
  loadTrack(currentIndex + 1);
  audio.play();
  playPauseBtn.textContent = '⏸';
});

// Time update and progress bar functionality
audio.addEventListener('timeupdate', () => {
  progress.max = Math.floor(audio.duration);
  progress.value = Math.floor(audio.currentTime);
});

progress.addEventListener('input', () => {
  audio.currentTime = progress.value;
});

//volume control functionality
volume.addEventListener('input', () => {
  audio.volume = volume.value;
});

// Auto-load next track when current track ends
audio.addEventListener('ended', () => {
  loadTrack(currentIndex + 1);
  playPauseBtn.textContent = '⏸';
  audio.play();
});

  // Initialize volume slider
document.addEventListener('DOMContentLoaded', () => {
  volume.value = audio.volume;
  trackTitle.textContent = playlist[currentIndex].title;
});

/*

dor de cabeca, equalizador, animação, barras

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioCtx.createAnalyser();

// Conecta o elemento de áudio no Analyser
const source = audioCtx.createMediaElementSource(audio);
source.connect(analyser);
analyser.connect(audioCtx.destination);

// Configurações do Analyser
analyser.fftSize = 256; // número de barras (quanto menor, menos barras)
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

const canvas = document.getElementById('equalizer');
const canvasCtx = canvas.getContext('2d');
const WIDTH = canvas.width;
const HEIGHT = canvas.height;

function drawBars() {
  requestAnimationFrame(drawBars);

  analyser.getByteFrequencyData(dataArray);

  // Fundo
  canvasCtx.fillStyle = "rgba(0, 0, 0, 0)";
  canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

  const barWidth = (WIDTH / bufferLength) * 2.5;
  let x = 0;

  for (let i = 0; i < bufferLength; i++) {
    const barHeight = dataArray[i];

    // Cor roxa fixa
    canvasCtx.fillStyle = `rgb(150, 0, 200)`;

    // Parte de cima (normal)
    canvasCtx.fillRect(
      x,
      HEIGHT / 2 - barHeight / 2,
      barWidth,
      barHeight / 2
    );

    // Parte de baixo (espelho)
    canvasCtx.fillRect(
      x,
      HEIGHT / 2,
      barWidth,
      barHeight / 2
    );

    x += barWidth + 1;
  }
}
  */