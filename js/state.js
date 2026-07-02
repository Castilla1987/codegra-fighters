/* =================== CONSTANTS =================== */
const CANVAS_W=900, CANVAS_H=520, GROUND_Y=440, GRAVITY=0.8, JUMP_V=-15, SPEED=3.6, DASH_SPEED=9;

/* =================== STATE =================== */
const S = {
  screen:'title',
  mode:null,
  p1Def:null, p2Def:null,
  enemyIndex:0,
  unlocked:false,
  fighters:[], projectiles:[], particles:[],
  timer:90, frame:0, timerAcc:0,
  keys:{},
  running:false,
  artStyle:'pixel',
  stageId:'recepcion',
  p1Meter:0, p2Meter:0,
  fightPhase:'fighting', introTimer:0, victoryTimer:0, koTimer:0, lastWinner:null, bigBanner:null,
  shake:0, flash:0,
};

const ART_STYLES = ['toon','photo','pixel'];
const ART_STYLE_LABEL = {toon:'🎨 CARICATURA', photo:'📷 FOTO REAL', pixel:'🕹️ PIXEL ART'};

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

/* =================== IMAGE HELPERS =================== */
function imgFor(key){
  if(S.artStyle==='toon') return IMAGES_TOON[key];
  if(S.artStyle==='pixel') return IMAGES_PIXEL[key];
  return IMAGES[key];
}
function srcFor(key){
  if(S.artStyle==='toon') return IMG_SRC_TOON[key];
  if(S.artStyle==='pixel') return IMG_SRC_PIXEL[key];
  return IMG_SRC[key];
}

/* =================== SCREEN MGMT =================== */
function showScreen(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.add('hidden'));
  if(id) document.getElementById(id).classList.remove('hidden');
  const inFight = id===null;
  document.getElementById('hud').classList.toggle('hidden', !inFight);
  document.getElementById('timer').classList.toggle('hidden', !inFight);
  document.getElementById('controls-hint').classList.toggle('hidden', !inFight);
  document.getElementById('btn-pause').classList.toggle('hidden', !inFight);
  showTouchControls(inFight);
  if(!inFight){ S.paused = false; document.getElementById('pause-overlay').classList.add('hidden'); }

  const video = document.getElementById('menu-video');
  if(!inFight && CONFIG.MENU_VIDEO_URL){
    if(video.getAttribute('src')!==CONFIG.MENU_VIDEO_URL) video.src = CONFIG.MENU_VIDEO_URL;
    video.classList.remove('hidden');
    video.play().catch(()=>{});
    document.getElementById(id).classList.add('video-bg');
  } else {
    video.classList.add('hidden');
    video.pause();
  }
  if(!inFight && CONFIG.MENU_BG_IMAGE){
    document.getElementById(id).style.backgroundImage = `url("${CONFIG.MENU_BG_IMAGE}")`;
    document.getElementById(id).style.backgroundSize = 'cover';
    document.getElementById(id).style.backgroundPosition = 'center';
    document.getElementById(id).classList.add('video-bg');
  }
}
