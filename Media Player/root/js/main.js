const audio = document.getElementById('audio-player');
const playPauseBtn = document.getElementById('play-pause');
const stopBtn = document.getElementById('stop');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const progress = document.getElementById('progress');
const volume = document.getElementById('volume');
const trackTitle = document.getElementById('track-title');
const trackCover = document.getElementById('track-cover');



const playlist = [
  { src: 'songs/scar tissue.mp3', title: 'Scar Tissue - Red Hot Chili Peppers', cover:'covers/californicationAlbum.jpg' },
  { src: 'songs/staying alive.mp3', title: 'Staying Alive - Bee Gees', cover:'covers/stayingAliveAlbum.jpg' },
];

let currentIndex = 0;

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

playPauseBtn.addEventListener('click', () => {
    if (audio.paused) {
    audio.play();
    playPauseBtn.textContent = '⏸';
  } else {
    audio.pause();
    playPauseBtn.textContent = '▶';
  }
});
audio.addEventListener('ended', () => {
  playPauseBtn.textContent = '▶';
});

prevBtn.addEventListener('click', () => {
  loadTrack(currentIndex - 1);
  audio.play();
});
nextBtn.addEventListener('click', () => {
  loadTrack(currentIndex + 1);
  audio.play();
});

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

audio.addEventListener('ended', () => {
  loadTrack(currentIndex + 1);
  playPauseBtn.textContent = '⏸';
  audio.play();
});
document.addEventListener('DOMContentLoaded', () => {
  // Initialize volume slider
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