/* =================== ESCENARIOS =================== */
function drawBackground(){
  const customImg = IMAGES_STAGE[S.stageId];
  if(CONFIG.STAGE_BG_IMAGES[S.stageId] && customImg && customImg.complete && customImg.naturalWidth){
    ctx.drawImage(customImg, 0, 0, CANVAS_W, CANVAS_H);
    ctx.fillStyle='rgba(0,0,0,0.25)'; ctx.fillRect(0,GROUND_Y,CANVAS_W,10);
    return;
  }
  switch(S.stageId){
    case 'salajuntas': drawStageSalaJuntas(); break;
    case 'archivo': drawStageArchivo(); break;
    case 'salonactos': drawStageSalonActos(); break;
    default: drawStageRecepcion(); break;
  }
}

function drawStageRecepcion(){
  const g = ctx.createLinearGradient(0,0,0,CANVAS_H);
  g.addColorStop(0,'#274472'); g.addColorStop(1,'#0e1730');
  ctx.fillStyle=g; ctx.fillRect(0,0,CANVAS_W,CANVAS_H);
  ctx.fillStyle='#1b2a4a'; ctx.fillRect(0,40,CANVAS_W,90);
  ctx.fillStyle='#2dd4bf'; ctx.font='bold 26px Fredoka, sans-serif'; ctx.textAlign='center';
  ctx.fillText('COLEGIO OFICIAL DE ENFERMERÍA DE GRANADA', CANVAS_W/2, 95);
  ctx.fillStyle='#3a2e22'; ctx.fillRect(0,GROUND_Y,CANVAS_W,CANVAS_H-GROUND_Y);
  ctx.fillStyle='#2a2018'; ctx.fillRect(0,GROUND_Y,CANVAS_W,10);
  for(let i=0;i<6;i++){
    ctx.fillStyle='#5a4632';
    ctx.fillRect(40+i*150, GROUND_Y-46, 70, 46);
    ctx.fillStyle='#caa46a';
    ctx.fillRect(45+i*150, GROUND_Y-41, 60, 6);
  }
}

function drawStageSalaJuntas(){
  const g = ctx.createLinearGradient(0,0,0,CANVAS_H);
  g.addColorStop(0,'#3a4a6b'); g.addColorStop(1,'#15233d');
  ctx.fillStyle=g; ctx.fillRect(0,0,CANVAS_W,CANVAS_H);
  ctx.fillStyle='#a9cdf0'; ctx.fillRect(60,70,260,140);
  ctx.fillStyle='#fef6e4'; ctx.beginPath(); ctx.arc(260,110,28,0,7); ctx.fill();
  ctx.strokeStyle='#1b2a4a'; ctx.lineWidth=8; ctx.strokeRect(60,70,260,140);
  ctx.beginPath(); ctx.moveTo(190,70); ctx.lineTo(190,210); ctx.moveTo(60,140); ctx.lineTo(320,140); ctx.lineWidth=4; ctx.stroke();
  ctx.fillStyle='#fdf6e3'; ctx.fillRect(580,60,260,150);
  ctx.strokeStyle='#caa46a'; ctx.lineWidth=6; ctx.strokeRect(580,60,260,150);
  ctx.fillStyle='#9fb3d9'; ctx.font='bold 16px Fredoka, sans-serif'; ctx.textAlign='center';
  ctx.fillText('ORDEN DEL DÍA', 710, 110);
  ctx.font='12px Fredoka, sans-serif';
  ctx.fillText('1. Lectura del acta anterior', 710, 140);
  ctx.fillText('2. Asuntos varios', 710, 165);
  ctx.fillText('3. Ruegos y preguntas', 710, 190);
  ctx.fillStyle='#5a4632'; ctx.fillRect(0,GROUND_Y,CANVAS_W,CANVAS_H-GROUND_Y);
  ctx.fillStyle='#4a3a28'; ctx.fillRect(0,GROUND_Y,CANVAS_W,10);
  ctx.fillStyle='#7a5a35'; ctx.fillRect(20,GROUND_Y-30,CANVAS_W-40,22);
  ctx.fillStyle='#5a4025'; ctx.fillRect(20,GROUND_Y-10,CANVAS_W-40,8);
  for(let i=0;i<7;i++){
    ctx.fillStyle='#2b2b2b';
    ctx.fillRect(60+i*120, GROUND_Y-54, 26, 26);
    ctx.fillRect(60+i*120, GROUND_Y-30, 26, 8);
  }
}

function drawStageArchivo(){
  const g = ctx.createLinearGradient(0,0,0,CANVAS_H);
  g.addColorStop(0,'#4a3f2b'); g.addColorStop(1,'#1c150c');
  ctx.fillStyle=g; ctx.fillRect(0,0,CANVAS_W,CANVAS_H);
  const folderColors=['#e74c3c','#3498db','#f1c40f','#2ecc71','#9b59b6','#e67e22','#1abc9c'];
  for(let row=0; row<3; row++){
    const y = 50 + row*70;
    ctx.fillStyle='#6e5a3a'; ctx.fillRect(20,y+46,CANVAS_W-40,10);
    for(let i=0;i<22;i++){
      ctx.fillStyle = folderColors[(row*7+i)%folderColors.length];
      const fw=14+ (i%3)*4;
      ctx.fillRect(28+i*38, y, fw, 46);
      ctx.fillStyle='rgba(0,0,0,0.18)'; ctx.fillRect(28+i*38, y, fw, 6);
    }
  }
  ctx.fillStyle='#2a2018'; ctx.fillRect(0,GROUND_Y,CANVAS_W,CANVAS_H-GROUND_Y);
  ctx.fillStyle='#1c150c'; ctx.fillRect(0,GROUND_Y,CANVAS_W,10);
  for(let i=0;i<5;i++){
    ctx.fillStyle='#8a8f99';
    ctx.fillRect(60+i*170, GROUND_Y-70, 80, 70);
    ctx.fillStyle='#6e7480';
    for(let d=0;d<3;d++) ctx.fillRect(66+i*170, GROUND_Y-64+d*22, 68, 16);
    ctx.fillStyle='#ffd23f';
    for(let d=0;d<3;d++) ctx.fillRect(126+i*170, GROUND_Y-58+d*22, 6, 6);
  }
}

function drawStageSalonActos(){
  const g = ctx.createLinearGradient(0,0,0,CANVAS_H);
  g.addColorStop(0,'#1e3a6b'); g.addColorStop(1,'#0a1530');
  ctx.fillStyle=g; ctx.fillRect(0,0,CANVAS_W,CANVAS_H);
  ctx.fillStyle='rgba(255,255,255,0.06)';
  ctx.font='bold 22px Fredoka, sans-serif'; ctx.textAlign='left';
  for(let r=0;r<5;r++){
    for(let c=0;c<6;c++){
      ctx.save();
      ctx.translate(20+c*160, 50+r*70);
      ctx.fillText('codegra', 0, 0);
      ctx.restore();
    }
  }
  const sg = ctx.createRadialGradient(CANVAS_W/2,150,20,CANVAS_W/2,150,260);
  sg.addColorStop(0,'rgba(255,255,255,0.18)'); sg.addColorStop(1,'rgba(255,255,255,0)');
  ctx.fillStyle=sg; ctx.fillRect(0,0,CANVAS_W,CANVAS_H);
  ctx.fillStyle='#7a1f2b';
  for(let i=0;i<4;i++){ ctx.fillRect(i*22, 0, 16, CANVAS_H); ctx.fillRect(CANVAS_W-16-i*22, 0, 16, CANVAS_H); }
  ctx.fillStyle='#1b2a4a'; ctx.fillRect(0,GROUND_Y,CANVAS_W,CANVAS_H-GROUND_Y);
  ctx.fillStyle='#10182b'; ctx.fillRect(0,GROUND_Y,CANVAS_W,10);
  ctx.fillStyle='rgba(255,255,255,0.08)';
  ctx.fillRect(0,GROUND_Y+10,CANVAS_W,18);
}

/* =================== PIXEL-ART RIG ESQUELÉTICO =================== */
const RIG_W = 220, RIG_H = 360;
const RIG_TORSO = {x:46, y:120};
const RIG_HEAD  = {x:46, y:0};
const RIG_SHOULDER_BACK  = {x:74,  y:140};
const RIG_SHOULDER_FRONT = {x:146, y:140};
const RIG_HIP_BACK  = {x:86,  y:232};
const RIG_HIP_FRONT = {x:134, y:232};
const RIG_ARM_PIVOT = {x:20, y:0};
const RIG_LEG_PIVOT = {x:24, y:0};
const DEG = Math.PI/180;

function pixelPartsReady(charId){
  const parts = PIXEL_PARTS[charId];
  if(!parts) return false;
  return PIXEL_PART_NAMES.every(p=> parts[p].complete && parts[p].naturalWidth);
}

function pixelPose(f){
  let armBack=8*DEG, armFront=-8*DEG, legBack=3*DEG, legFront=-3*DEG, headBob=0;
  if(f.y < -2){
    armBack=-25*DEG; armFront=-25*DEG; legBack=12*DEG; legFront=12*DEG; headBob=-8;
  }
  if(f.state==='walk'){
    const s = Math.sin(f.walkCycle);
    armBack = 18*DEG*s; armFront = -18*DEG*s;
    legBack = -15*DEG*s; legFront = 15*DEG*s;
  }
  if(f.state==='dash'){
    const s = Math.sin(f.walkCycle);
    armBack = 30*DEG*s; armFront = -34*DEG*s - 10*DEG;
    legBack = -26*DEG*s; legFront = 26*DEG*s;
  }
  if(f.state==='punch'){
    const prog = 1 - f.stateTimer/18;
    const ext = Math.sin(Math.min(Math.max(prog,0),1)*Math.PI);
    armFront = -8*DEG + (-92*DEG)*ext;
  }
  if(f.state==='kick'){
    const prog = 1 - f.stateTimer/24;
    const ext = Math.sin(Math.min(Math.max(prog,0),1)*Math.PI);
    legFront = -3*DEG + (-112*DEG)*ext;
    armBack = 8*DEG - 20*DEG*ext; armFront = -8*DEG - 10*DEG*ext;
  }
  if(f.state==='special'){
    const prog = 1 - f.stateTimer/46;
    const ext = Math.sin(Math.min(Math.max(prog,0),1)*Math.PI);
    armBack = 8*DEG + 157*DEG*ext;
    armFront = -8*DEG - 157*DEG*ext;
    headBob = -ext*4;
  }
  if(f.state==='victory'){
    const bounce = Math.sin((S.frame||0)*0.12)*3;
    armBack = 165*DEG; armFront = -165*DEG;
    headBob = -3 + bounce*0.4;
  }
  if(f.state==='block'){
    armBack=-70*DEG; armFront=-100*DEG;
  }
  if(f.state==='hit'){
    armBack=40*DEG; armFront=-40*DEG; legBack=-8*DEG; legFront=8*DEG; headBob=4;
  }
  return {armBack,armFront,legBack,legFront,headBob};
}

function drawPixelPart(img, pivotScreen, pivotLocal, angle){
  ctx.save();
  ctx.translate(pivotScreen.x, pivotScreen.y);
  ctx.rotate(angle);
  ctx.drawImage(img, -pivotLocal.x, -pivotLocal.y);
  ctx.restore();
}

function drawPixelFighter(f){
  const parts = PIXEL_PARTS[f.def.img];
  if(!parts || !pixelPartsReady(f.def.img)) return false;
  const pose = pixelPose(f);
  ctx.save();
  ctx.scale(f.w/RIG_W, f.h/RIG_H);
  drawPixelPart(parts.leg_back,  RIG_HIP_BACK,      RIG_LEG_PIVOT, pose.legBack);
  drawPixelPart(parts.arm_back,  RIG_SHOULDER_BACK, RIG_ARM_PIVOT, pose.armBack);
  ctx.drawImage(parts.torso, RIG_TORSO.x, RIG_TORSO.y);
  ctx.drawImage(parts.head,  RIG_HEAD.x,  RIG_HEAD.y + pose.headBob);
  drawPixelPart(parts.arm_front, RIG_SHOULDER_FRONT, RIG_ARM_PIVOT, pose.armFront);
  drawPixelPart(parts.leg_front, RIG_HIP_FRONT,      RIG_LEG_PIVOT, pose.legFront);
  ctx.restore();
  return true;
}

/* =================== SPRITES DE JAVIER (foto real animada) =================== */
const JAVIER_ANIM_MS_PER_FRAME = 70;

function drawJavierFrame(ctx, jImg, f, scaleMul){
  if(!jImg || !jImg.complete || !jImg.naturalWidth) return;
  const aspect = jImg.naturalWidth / jImg.naturalHeight;
  let dh = f.h * (scaleMul||1.35);
  const availableAboveGround = GROUND_Y - 6;
  if(dh > availableAboveGround) dh = availableAboveGround;
  const dw = dh * aspect;
  ctx.drawImage(jImg, (f.w - dw)/2, f.h - dh, dw, dh);
}

function javierAnimFrame(f, seqKey, frameCount){
  const sig = f.state + ':' + (f.hitKind||'') + ':' + (f.y < -2 ? 'air':'ground');
  if(f._javierAnimSig !== sig){
    f._javierAnimSig = sig;
    f._javierAnimStart = performance.now();
  }
  const elapsed = performance.now() - f._javierAnimStart;
  return Math.min(frameCount-1, Math.floor(elapsed / JAVIER_ANIM_MS_PER_FRAME));
}

function javierAnimFrameLoop(f, seqKey, frameCount){
  const sig = f.state + ':' + seqKey;
  if(f._javierAnimSig !== sig){
    f._javierAnimSig = sig;
    f._javierAnimStart = performance.now();
  }
  const elapsed = performance.now() - f._javierAnimStart;
  return Math.floor(elapsed / JAVIER_ANIM_MS_PER_FRAME) % frameCount;
}

function drawJavierPhotoSprite(f){
  if(f.state === 'dash'){
    const isForward = f.dashDodgeDir === f.facing;
    const arr = isForward ? JAVIER_DASH_FWD_IMGS : JAVIER_DASH_BACK_IMGS;
    if(f._javierDashSig !== f.state+isForward){
      f._javierDashSig = f.state+isForward;
      f._javierDashStart = performance.now();
    }
    const elapsed = performance.now() - f._javierDashStart;
    const idx = Math.min(arr.length-1, Math.floor(elapsed / 35));
    drawJavierFrame(ctx, arr[idx], f, 1.35);
    return;
  }
  if(f.state === 'walk' || f.state === 'run'){
    const n = JAVIER_WALK_NEW_IMGS.length;
    if(f._javierWalkSig !== 'walking'){
      f._javierWalkSig = 'walking';
      f._javierWalkStart = performance.now();
    }
    const elapsed = performance.now() - f._javierWalkStart;
    const idx = Math.floor(elapsed / 55) % n;
    drawJavierFrame(ctx, JAVIER_WALK_NEW_IMGS[idx], f, 1.35);
    return;
  }
  f._javierWalkSig = null;
  if(f.state === 'punch'){
    drawJavierFrame(ctx, JAVIER_PUNCH_IMGS[javierAnimFrame(f,'punch',JAVIER_PUNCH_IMGS.length)], f, 1.35); return;
  }
  if(f.state === 'kick'){
    const isAirborne = f.y < -2;
    const arr = isAirborne ? JAVIER_JUMPKICK_IMGS : JAVIER_KICK_IMGS;
    drawJavierFrame(ctx, arr[javierAnimFrame(f,'kick',arr.length)], f, 1.35); return;
  }
  if(f.state === 'special'){
    drawJavierFrame(ctx, JAVIER_SPECIAL_IMGS[javierAnimFrame(f,'special',JAVIER_SPECIAL_IMGS.length)], f, 1.45); return;
  }
  if(f.state === 'victory'){
    drawJavierFrame(ctx, JAVIER_VICTORY_IMGS[javierAnimFrame(f,'victory',JAVIER_VICTORY_IMGS.length)], f, 1.4); return;
  }
  if(f.state === 'hit'){
    if(f.hp <= 0){
      drawJavierFrame(ctx, JAVIER_KO_IMGS[javierAnimFrame(f,'ko',JAVIER_KO_IMGS.length)], f, 1.35); return;
    }
    if(f.hitKind === 'special'){
      drawJavierFrame(ctx, JAVIER_CONFUSED_IMGS[javierAnimFrame(f,'confused',JAVIER_CONFUSED_IMGS.length)], f, 1.35); return;
    }
    if(f.hitKind === 'heavy' || f.hitKind === 'jumpheavy'){
      drawJavierFrame(ctx, JAVIER_HITHEAVY_IMGS[javierAnimFrame(f,'hitheavy',JAVIER_HITHEAVY_IMGS.length)], f, 1.35); return;
    }
    drawJavierFrame(ctx, JAVIER_HITLIGHT_IMGS[javierAnimFrame(f,'hitlight',JAVIER_HITLIGHT_IMGS.length)], f, 1.35); return;
  }
  if((f.idleTimer||0) >= 420){
    const elapsed = (f.idleTimer - 420) * (1000/60);
    const idx = Math.floor(elapsed / JAVIER_ANIM_MS_PER_FRAME) % JAVIER_IDLE_BREATH_IMGS.length;
    drawJavierFrame(ctx, JAVIER_IDLE_BREATH_IMGS[idx], f, 1.35); return;
  }
  drawJavierFrame(ctx, JAVIER_WALK_NEW_IMGS[0], f, 1.35);
}

/* =================== DIBUJAR LUCHADOR =================== */
function drawFighter(f){
  ctx.save();
  if(f.chargeTimer>0){
    const CHARGE_THRESHOLD = 22;
    const prog = Math.min(1, f.chargeTimer / CHARGE_THRESHOLD);
    const isFull = f.chargeTimer >= CHARGE_THRESHOLD;
    const cx = f.x + f.w/2, cy = GROUND_Y - f.h*0.45;
    const pulse = isFull ? 0.75 + 0.25*Math.sin((S.frame||0)*0.4) : prog;
    const r = (isFull ? 34 : 14 + prog*20) * pulse;
    ctx.save();
    ctx.globalAlpha = 0.55 * pulse;
    const grad = ctx.createRadialGradient(cx,cy,0,cx,cy,r);
    grad.addColorStop(0, isFull ? '#ffd23fcc' : '#ffffff88');
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.fill();
    ctx.restore();
  }
  const isJavierWalking = (f.def.id === 'javier' && !f.isEnemy && f.state==='walk');
  const drawY = GROUND_Y - f.h + (f.y||0) + (f.state==='walk' && !isJavierWalking ? Math.sin(f.walkCycle)*4:0);
  let alpha=1, filter='';
  if(f.state==='hit') filter='hue-rotate(0deg) saturate(2)';
  if(f.frozen>0) filter='grayscale(1) brightness(1.4)';
  if(f.state==='block') alpha=0.85;
  ctx.translate(f.x + (f.facing===-1?f.w:0), drawY);
  ctx.scale(f.facing, 1);
  let scaleX=1, scaleY=1, offX=0;
  const usePixelRig = (S.artStyle==='pixel' && !f.isEnemy && pixelPartsReady(f.def.img));
  if(!usePixelRig){
    if(f.state==='punch' || f.state==='kick'){ scaleX=1.08; offX=-6; }
    if(f.state==='special'){ scaleX=1.15; scaleY=1.05; }
    if(f.state==='victory'){ scaleX=1.06; scaleY=1.03; }
  }
  ctx.translate(offX,0);
  ctx.scale(scaleX,scaleY);
  ctx.globalAlpha=alpha;
  if(filter) ctx.filter=filter;
  const prevSmoothing = ctx.imageSmoothingEnabled;
  if(S.artStyle==='pixel') ctx.imageSmoothingEnabled=false;
  if(!f.isEnemy){
    if(f.def.id === 'javier'){
      drawJavierPhotoSprite(f);
    } else if(usePixelRig){
      drawPixelFighter(f);
    } else {
      const img = imgFor(f.def.img);
      if(img.complete && img.naturalWidth) ctx.drawImage(img,0,0,f.w,f.h);
    }
  } else {
    const bodyImg = IMAGES_ENEMY[f.def.id+'_body'];
    const faceImg = IMAGES_ENEMY[f.def.id+'_face'];
    if(bodyImg && bodyImg.complete && bodyImg.naturalWidth){
      ctx.drawImage(bodyImg,0,0,f.w,f.h);
    } else {
      ctx.fillStyle = f.def.color;
      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(0,0,f.w,f.h,16) : ctx.rect(0,0,f.w,f.h);
      ctx.fill();
      if(faceImg && faceImg.complete && faceImg.naturalWidth){
        const fr = Math.min(f.w,f.h)*0.32;
        ctx.save();
        ctx.beginPath(); ctx.arc(f.w/2, fr+10, fr, 0, 7); ctx.closePath(); ctx.clip();
        ctx.drawImage(faceImg, f.w/2-fr, 10, fr*2, fr*2);
        ctx.restore();
        ctx.strokeStyle='#fff'; ctx.lineWidth=3;
        ctx.beginPath(); ctx.arc(f.w/2, fr+10, fr, 0, 7); ctx.stroke();
      } else {
        ctx.font = (f.h*0.5)+'px serif';
        ctx.textAlign='center'; ctx.textBaseline='middle';
        ctx.fillText(f.def.emoji, f.w/2, f.h*0.45);
      }
    }
  }
  ctx.imageSmoothingEnabled = prevSmoothing;
  ctx.filter='none'; ctx.globalAlpha=1;
  if(f.state==='block'){
    ctx.fillStyle='rgba(45,212,191,0.35)';
    ctx.beginPath(); ctx.roundRect? ctx.roundRect(0,0,f.w,f.h,12): ctx.rect(0,0,f.w,f.h); ctx.fill();
  }
  ctx.restore();
  if(f.frozen>0){
    ctx.save();
    ctx.fillStyle='#1e3a8a'; ctx.fillRect(f.x-10, drawY-46, f.w+20, 36);
    ctx.strokeStyle='#fff'; ctx.lineWidth=2; ctx.strokeRect(f.x-10, drawY-46, f.w+20, 36);
    ctx.fillStyle='#fff'; ctx.font='bold 11px monospace'; ctx.textAlign='center';
    ctx.fillText('¡ATURDIDO!', f.x+f.w/2, drawY-29);
    ctx.fillText('🤯', f.x+f.w/2, drawY-12);
    ctx.restore();
  }
  if(f.reversed>0){
    ctx.save();
    ctx.fillStyle='#fff'; ctx.font='bold 18px sans-serif'; ctx.textAlign='center';
    ctx.fillText('📸', f.x+f.w/2, drawY-12);
    ctx.restore();
  }
}

/* =================== PROYECTILES Y PARTÍCULAS =================== */
function drawProjectiles(){
  S.projectiles.forEach(p=>{
    ctx.save();
    if(p.kind==='basketball'){
      const by = p.y + Math.abs(Math.sin(p.bounce||0))*-40;
      ctx.translate(p.x, by);
      ctx.rotate((p.bounce||0)*2);
      ctx.fillStyle='#e67e22';
      ctx.beginPath(); ctx.arc(0,0,14,0,7); ctx.fill();
      ctx.strokeStyle='#3a2e22'; ctx.lineWidth=2;
      ctx.beginPath(); ctx.moveTo(-14,0); ctx.lineTo(14,0); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0,-14); ctx.lineTo(0,14); ctx.stroke();
      ctx.beginPath(); ctx.arc(0,0,14,0,7); ctx.stroke();
    } else if(p.kind==='papers'){
      ctx.translate(p.x,p.y);
      ctx.fillStyle='#fdf6e3'; ctx.strokeStyle='#999';
      for(let i=-1;i<=1;i++){
        ctx.save(); ctx.rotate((p.x*0.05+i)*0.4);
        ctx.fillRect(-14,-18,28,22); ctx.strokeRect(-14,-18,28,22);
        ctx.restore();
      }
    } else {
      ctx.translate(p.x,p.y);
      ctx.fillStyle='#f1c40f'; ctx.beginPath(); ctx.arc(0,0,12,0,7); ctx.fill();
    }
    ctx.restore();
  });
}

function drawParticles(){
  S.particles.forEach(p=>{
    const t = p.age/p.life;
    ctx.save();
    if(p.type==='hit'){
      ctx.globalAlpha = 1-t;
      ctx.fillStyle=p.color||'#fff';
      ctx.font='bold 26px Bangers, sans-serif'; ctx.textAlign='center';
      ctx.fillText(p.text||'¡PAF!', p.x, p.y - t*30);
    }
    if(p.type==='glitch'){
      ctx.globalAlpha = Math.max(0,1-t*3);
      ctx.fillStyle=p.color||'rgba(0,0,255,0.18)'; ctx.fillRect(0,0,CANVAS_W,CANVAS_H);
    }
    if(p.type==='flash'){
      ctx.globalAlpha = Math.max(0,1-t*1.5);
      ctx.fillStyle='#fff'; ctx.fillRect(0,0,CANVAS_W,CANVAS_H);
    }
    if(p.type==='aura'){
      ctx.globalAlpha = 0.4;
      ctx.strokeStyle=p.color; ctx.lineWidth=4;
      ctx.beginPath(); ctx.arc(p.x,p.y, 20+Math.sin(p.age*0.3)*8, 0, 7); ctx.stroke();
    }
    if(p.type==='icon'){
      ctx.globalAlpha = 1-t;
      ctx.font='28px sans-serif'; ctx.textAlign='center';
      const ox = Math.sin(p.age*0.4 + (p.icon==='📧'?2:p.icon==='📋'?4:0))*18;
      ctx.fillText(p.icon, p.x+ox, p.y-t*40);
    }
    if(p.type==='banner'){
      const fadeIn = Math.min(1, p.age/8);
      const fadeOut = Math.max(0, Math.min(1, (p.life-p.age)/14));
      const alpha = Math.min(fadeIn, fadeOut);
      const bob = Math.sin(p.age*0.15)*2;
      ctx.font='25px Bangers, sans-serif';
      const lines = p.sub ? [p.text, p.sub] : [p.text];
      const w1 = ctx.measureText(lines[0]).width;
      ctx.font='15px Fredoka, sans-serif';
      const w2 = lines[1] ? ctx.measureText(lines[1]).width : 0;
      const boxW = Math.min(CANVAS_W-30, Math.max(w1,w2)+50);
      const boxH = lines[1] ? 64 : 46;
      const boxX = CANVAS_W/2 - boxW/2;
      const boxY = 132 + bob;
      ctx.globalAlpha = alpha*0.93;
      ctx.fillStyle = p.color || '#274472';
      if(ctx.roundRect){ ctx.beginPath(); ctx.roundRect(boxX,boxY,boxW,boxH,12); ctx.fill(); }
      else ctx.fillRect(boxX,boxY,boxW,boxH);
      ctx.strokeStyle='rgba(255,255,255,0.6)'; ctx.lineWidth=2;
      if(ctx.roundRect){ ctx.beginPath(); ctx.roundRect(boxX,boxY,boxW,boxH,12); ctx.stroke(); }
      ctx.globalAlpha = alpha;
      ctx.fillStyle='#fff';
      ctx.font='25px Bangers, sans-serif'; ctx.textAlign='center';
      ctx.fillText(lines[0], CANVAS_W/2, boxY+30);
      if(lines[1]){
        ctx.font='15px Fredoka, sans-serif';
        ctx.fillText(lines[1], CANVAS_W/2, boxY+52);
      }
    }
    if(p.type==='combo'){
      const fadeIn = Math.min(1, p.age/5);
      const fadeOut = Math.max(0, Math.min(1, (p.life-p.age)/16));
      const alpha = Math.min(fadeIn, fadeOut);
      const popScale = p.age<8 ? 0.6 + 0.4*(p.age/8) : 1;
      const rise = -p.age*0.6;
      ctx.globalAlpha = alpha;
      ctx.textAlign='center';
      ctx.translate(p.x, p.y+rise);
      ctx.scale(popScale, popScale);
      ctx.font='bold 30px Bangers, sans-serif';
      ctx.fillStyle='#ffd23f';
      ctx.strokeStyle='#000'; ctx.lineWidth=4; ctx.lineJoin='round';
      const label = p.count+' HITS!';
      ctx.strokeText(label, 0, 0); ctx.fillText(label, 0, 0);
      ctx.font='bold 14px Bangers, sans-serif';
      ctx.fillStyle='#fff';
      ctx.strokeText('COMBO', 0, 18); ctx.fillText('COMBO', 0, 18);
    }
    ctx.restore();
  });
}

/* =================== BANNERS DE FINAL DE RONDA =================== */
function drawBigBanner(b){
  const age = b.age;
  const inDur = 14;
  let scale, alpha;
  if(age < inDur){
    const t = age/inDur;
    scale = 0.4 + 1.3*Math.sin(t*Math.PI/2);
    alpha = t;
  } else {
    const settle = Math.min(1, (age-inDur)/10);
    scale = 1.7 - 0.7*settle;
    alpha = 1;
  }
  const wobble = age>inDur ? Math.sin(age*0.15)*1.2 : 0;
  let label, sub, color, glow;
  if(b.kind==='p1'){
    label = (S.mode==='1p') ? '¡VICTORIA!' : (S.p1Def.name.toUpperCase()+' GANA');
    sub = S.mode==='1p' ? 'Has ganado el combate' : '¡'+S.p1Def.name+' se queda con el sillón!';
    color = '#ffd23f'; glow = '#ff8c42';
  } else if(b.kind==='p2'){
    label = (S.mode==='1p') ? '¡DERROTA!' : (S.p2Def.name.toUpperCase()+' GANA');
    sub = S.mode==='1p' ? S.p2Def.name+' te ha vencido' : '¡'+S.p2Def.name+' se queda con el sillón!';
    color = '#ff5a4d'; glow = '#b3140d';
  } else {
    label = '¡EMPATE!'; sub = 'Nadie cede el sillón'; color = '#9fb3d9'; glow = '#5a7ab9';
  }
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(CANVAS_W/2, CANVAS_H*0.38 + wobble);
  ctx.scale(scale, scale);
  ctx.textAlign = 'center';
  ctx.font = "bold 64px Bangers, cursive";
  ctx.lineJoin = 'round';
  ctx.shadowColor = glow; ctx.shadowBlur = 26;
  ctx.lineWidth = 10; ctx.strokeStyle = '#000';
  ctx.strokeText(label, 0, 0);
  ctx.fillStyle = color; ctx.fillText(label, 0, 0);
  ctx.shadowBlur = 0;
  if(age > inDur){
    ctx.globalAlpha = Math.min(1, (age-inDur)/12) * alpha;
    ctx.font = "22px Fredoka, sans-serif";
    ctx.lineWidth = 5; ctx.strokeStyle = '#000';
    ctx.strokeText(sub, 0, 46);
    ctx.fillStyle = '#fff'; ctx.fillText(sub, 0, 46);
  }
  ctx.restore();
}

function drawKOBanner(age){
  const inDur = 10;
  let scale, alpha;
  if(age < inDur){
    const t = age/inDur;
    scale = 0.3 + 1.6*Math.sin(t*Math.PI/2);
    alpha = t;
  } else {
    const settle = Math.min(1, (age-inDur)/8);
    scale = 1.9 - 0.9*settle;
    alpha = 1;
  }
  const shudder = age<inDur+6 ? (Math.random()*2-1)*3 : 0;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(CANVAS_W/2 + shudder, CANVAS_H*0.42);
  ctx.scale(scale, scale);
  ctx.textAlign = 'center';
  ctx.font = "bold 92px Bangers, cursive";
  ctx.lineJoin = 'round';
  ctx.shadowColor = '#ff2d2d'; ctx.shadowBlur = 30;
  ctx.lineWidth = 14; ctx.strokeStyle = '#000';
  ctx.strokeText('K.O.', 0, 0);
  const grad = ctx.createLinearGradient(0,-40,0,40);
  grad.addColorStop(0, '#fff');
  grad.addColorStop(0.5, '#ffe9a8');
  grad.addColorStop(1, '#ff5a3c');
  ctx.fillStyle = grad; ctx.fillText('K.O.', 0, 0);
  ctx.restore();
}
