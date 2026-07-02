/* =================== ASSETS (precarga de imágenes y sprites) =================== */

/* Imágenes base (foto real) */
const IMAGES = {};
for(const k in IMG_SRC){
  const im = new Image();
  im.src = IMG_SRC[k];
  IMAGES[k]=im;
}

/* Imágenes toon / caricatura */
const IMAGES_TOON = {};
for(const k in IMG_SRC_TOON){
  const im = new Image();
  im.src = IMG_SRC_TOON[k];
  IMAGES_TOON[k]=im;
}

/* Imágenes pixel art */
const IMAGES_PIXEL = {};
for(const k in IMG_SRC_PIXEL){
  const im = new Image();
  im.src = IMG_SRC_PIXEL[k];
  IMAGES_PIXEL[k]=im;
}

/* Piezas de rig esquelético pixel-art */
const PIXEL_PARTS = {};
for(const charId in IMG_SRC_PIXEL_PARTS){
  PIXEL_PARTS[charId] = {};
  PIXEL_PART_NAMES.forEach(p=>{
    const im = new Image();
    im.src = IMG_SRC_PIXEL_PARTS[charId][p];
    PIXEL_PARTS[charId][p] = im;
  });
}

/* Imágenes personalizadas de enemigos (faceImg / bodyImg de CONFIG) */
const IMAGES_ENEMY = {};
ENEMIES.forEach(e=>{
  if(e.faceImg){ const im=new Image(); im.src=e.faceImg; IMAGES_ENEMY[e.id+'_face']=im; }
  if(e.bodyImg){ const im=new Image(); im.src=e.bodyImg; IMAGES_ENEMY[e.id+'_body']=im; }
});

/* Fondos de escenario personalizados */
const IMAGES_STAGE = {};
for(const k in CONFIG.STAGE_BG_IMAGES){
  if(CONFIG.STAGE_BG_IMAGES[k]){
    const im=new Image(); im.src=CONFIG.STAGE_BG_IMAGES[k]; IMAGES_STAGE[k]=im;
  }
}

/* ── Javier Castilla: sprites de combate ── */
function preloadJavierFrames(arr){
  return arr.map(src => { const im = new Image(); im.src = src; return im; });
}

const JAVIER_WALK_IMGS = [];
(function(){
  const srcs = [IMG_JAVIER_WALK_0,IMG_JAVIER_WALK_1,IMG_JAVIER_WALK_2,
                IMG_JAVIER_WALK_3,IMG_JAVIER_WALK_4,IMG_JAVIER_WALK_5];
  srcs.forEach(src => {
    const im = new Image();
    im.src = src;
    JAVIER_WALK_IMGS.push(im);
  });
})();

const JAVIER_IDLE_IMG = (function(){
  const im = new Image(); im.src = IMG_JAVIER_IDLE; return im;
})();

const JAVIER_PUNCH_IMGS    = preloadJavierFrames(JAVIER_PUNCH);
const JAVIER_KICK_IMGS     = preloadJavierFrames(JAVIER_KICK);
const JAVIER_JUMPKICK_IMGS = preloadJavierFrames(JAVIER_JUMPKICK);
const JAVIER_HITLIGHT_IMGS = preloadJavierFrames(JAVIER_HITLIGHT);
const JAVIER_HITHEAVY_IMGS = preloadJavierFrames(JAVIER_HITHEAVY);
const JAVIER_CONFUSED_IMGS = preloadJavierFrames(JAVIER_CONFUSED);
const JAVIER_SPECIAL_IMGS  = preloadJavierFrames(JAVIER_SPECIAL);
const JAVIER_KO_IMGS       = preloadJavierFrames(JAVIER_KO);
const JAVIER_SEL_IMGS      = preloadJavierFrames(JAVIER_SEL);
const JAVIER_IDLE_BREATH_IMGS = preloadJavierFrames(JAVIER_IDLE_BREATH);
const JAVIER_WALK_NEW_IMGS = preloadJavierFrames(JAVIER_WALK_NEW);
const JAVIER_VICTORY_IMGS  = preloadJavierFrames(JAVIER_VICTORY);
const JAVIER_DASH_FWD_IMGS = preloadJavierFrames(JAVIER_DASH_FWD);
const JAVIER_DASH_BACK_IMGS= preloadJavierFrames(JAVIER_DASH_BACK);
