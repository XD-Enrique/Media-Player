const audio = document.getElementById('audio-player');
const playPauseBtn = document.getElementById('play-pause');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const progress = document.getElementById('progress');
const currentTimeEl = document.getElementById('current-time');
const totalTimeEl = document.getElementById('total-time');
const volume = document.getElementById('volume');
const trackTitle = document.getElementById('track-title');
const trackCover = document.getElementById('track-cover');
const playlistEl = document.getElementById('playlist');

const playlist = [
  { src: 'assets/songs/criticaleye, SHIRO, dolshi - Echoes [NCS Release].mp3', title: 'Echoes - Criticaleye, SHIRO, dolshi [NCS Release]', cover: 'assets/covers/echoes.jpg' },
  { src: 'assets/songs/Mazare, Drive!Drive! - Honest [NCS Release].mp3', title: 'Honest - Mazare, Drive!Drive! [NCS Release]', cover: 'assets/covers/honest.jpg' },
  { src: 'assets/songs/More Plastic - So Good [NCS Release].mp3', title: 'So Good - More Plastic [NCS Release]', cover: 'assets/covers/sogood.jpg' },
  { src: 'assets/songs/waera - harinezumi [NCS Release].mp3', title: 'harinezumi - waera [NCS Release]', cover: 'assets/covers/harinezumi.jpg' },
  { src: 'assets/songs/youth® - stuck in my head! [NCS Release].mp3', title: 'stuck in my head! - youth® [NCS Release]', cover: 'assets/covers/stuckinmyhead.jpg' },
  { src: 'assets/songs/Zachz Winner, Carpe - wooyawooya [NCS Release].mp3', title: 'wooyawooya - Zachz Winner, Carpe [NCS Release]', cover: 'assets/covers/wooyawooya.jpg' },
];

// pilha para controlar músicas anteriores e próximas
let anterior = [];
let proximo = [];
let currentIndex = 0;

// criar lista de reprodução na interface
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

// carregar a faixa atual
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

// atualizar destaque da faixa ativa na lista
function updateActive() {
  [...playlistEl.children].forEach((li, i) => {
    li.classList.toggle('active', i === currentIndex);
    if(i === currentIndex) {
      li.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    }
  });
}

// botoes de controle
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
    proximo.push(currentIndex); // guarda o índice atual em proximo
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

// próxima música automática
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

// atualiza as barras de progresso e o tempo da música
function updateSliderFill(slider) {
  const value = (slider.value - slider.min) / (slider.max - slider.min) * 100;
  slider.style.setProperty('--value', value + '%');
}

progress.addEventListener('input', () => {
  audio.currentTime = progress.value;
  updateSliderFill(progress);
});

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? '0' + secs : secs}`;
}

audio.addEventListener('loadedmetadata', () => {
  totalTimeEl.textContent = formatTime(audio.duration);
});

audio.addEventListener('timeupdate', () => {
  progress.max = Math.floor(audio.duration);
  progress.value = Math.floor(audio.currentTime);
  updateSliderFill(progress);
  currentTimeEl.textContent = formatTime(audio.currentTime);
});

volume.addEventListener('input', () => {
  audio.volume = volume.value;
  updateSliderFill(volume);
});

audio.addEventListener('timeupdate', () => {
  progress.max = Math.floor(audio.duration);
  progress.value = Math.floor(audio.currentTime);
  updateSliderFill(progress);
});

// inicialização do player, sincroniza volume e carrega a primeira faixa
document.addEventListener('DOMContentLoaded', () => {
  volume.value = audio.volume;
  loadTrack(currentIndex);
  updateSliderFill(progress);
  updateSliderFill(volume);
});
