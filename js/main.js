const audio = document.getElementById('audio-player');
const playPauseBtn = document.getElementById('play-pause');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const muteBtn = document.getElementById('mute-unmute');
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

let clickTimer = null; // controlar dbclick

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

function playNext (){
  const lastIndex = proximo.length - 1;
  anterior.push(currentIndex);
  if (lastIndex >= 0){
    loadTrack(proximo.pop());
  } else {
    loadTrack(currentIndex + 1);
  }
  audio.play();
  playPauseBtn.textContent = '⏸';
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

prevBtn.addEventListener('click', () =>{
  if (clickTimer) {
    clearTimeout(clickTimer); // se ja tiver timer, duplo clique
    clickTimer = null;
  
//logica do pulo duplo
   const lastIndex = anterior.length - 1
   if (lastIndex >= 0) {
      proximo.push(currentIndex);
      loadTrack(anterior[lastIndex]);
      anterior.pop();
      audio.play();
      playPauseBtn.textContent = '⏸'; 
    }
  } else { 
    clickTimer = setTimeout(() => {
      clickTimer = null;
      audio.currentTime = 0; //logica clique simples
    }, 250);
  }
});

nextBtn.addEventListener('click', playNext);

muteBtn.addEventListener('click', () => {
  audio.muted = !audio.muted;
  muteBtn.textContent = audio.muted ? '🔇' : '🔊';
  updateSliderFill(volume);
});

audio.addEventListener('ended', playNext);

// atualiza as barras de progresso e o tempo da música
function updateSliderFill(slider) {
  let currentValue = slider.value;
  if (slider === volume && audio.muted) {
    currentValue = 0;
  }
  const value = (currentValue - slider.min) / (slider.max - slider.min) * 100;
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

// inicialização do player, sincroniza volume e carrega a primeira faixa
document.addEventListener('DOMContentLoaded', () => {
  volume.value = audio.volume;
  loadTrack(currentIndex);
  updateSliderFill(progress);
  updateSliderFill(volume);
});
