/* =================== HELPERS =================== */
function dist(a,b){ return Math.abs((a.x+a.w/2)-(b.x+b.w/2)); }
function facingTowards(a,b){
  const ac=a.x+a.w/2, bc=b.x+b.w/2;
  return (a.facing===1 && bc>=ac) || (a.facing===-1 && bc<=ac);
}
function setState(f, st, dur){ f.state=st; f.stateTimer=dur; f.hitDone=false; }
function addParticle(p){ S.particles.push(Object.assign({life:p.life||30, age:0}, p)); }
function addBanner(text, color, sub){
  S.particles.push({type:'banner', text, sub:sub||'', color:color||'#274472', life:170, age:0});
}
function showComboPopup(f, comboCount){
  S.particles.push({
    type:'combo', age:0, life:40,
    x:f.x+f.w/2, y:GROUND_Y-f.h-30,
    count:comboCount, facing:f.facing
  });
}
function triggerScreenEffect(kind){
  if(kind==='heavy'){
    S.shake = Math.max(S.shake||0, 14);
    S.flash = Math.max(S.flash||0, 0.35);
  } else {
    S.shake = Math.max(S.shake||0, 6);
    S.flash = Math.max(S.flash||0, 0.15);
  }
}

/* =================== FIGHTER FACTORY =================== */
function makeFighter(def, x, facing, isEnemy, initialMeter){
  const img = isEnemy ? null : imgFor(def.img);
  let h = isEnemy ? 220 : (S.artStyle==='toon' ? 240 : (def.h||240));
  let w = 110;
  if(!isEnemy && S.artStyle==='pixel'){
    h = 240;
    w = h * (RIG_W/RIG_H);
  } else if(img && img.complete && img.naturalWidth){
    w = h * (img.naturalWidth/img.naturalHeight);
  }
  const BASE_HP = 150;
  let maxHp = BASE_HP;
  if(isEnemy){
    const idx = S.mode==='1p' ? (S.enemyIndex||0) : 0;
    maxHp = BASE_HP + idx * 18;
  }
  return {
    def, x, vy:0, facing, hp:maxHp, maxHp, meter:initialMeter||0,
    state:'idle', stateTimer:0, hitDone:false, hitKind:'light', idleTimer:0,
    combo:0, comboTimer:0, blockFrames:0, stunTimer:0,
    dashDodgeTimer:0, dashDodgeCooldown:0, dashDodgeDir:1, invulnerable:false,
    lastDirTap:{left:0,right:0}, prevDirHeld:{left:false,right:false},
    chargeTimer:0, chargeType:null, attackCharged:false,
    frozen:0, reversed:0, buffDmg:1, buffSpeed:1, buffTimer:0,
    w, h, isEnemy:!!isEnemy, walkCycle:0,
  };
}

/* =================== DAMAGE =================== */
function applyDamage(att, def, dmg, opts={}){
  if(def.invulnerable){
    addParticle({x:def.x+def.w/2, y:GROUND_Y-def.h*0.75, type:'hit', color:'#7af7ff', text:'¡ESQUIVA!'});
    return;
  }
  let d = dmg*(att.buffDmg||1);
  const isSpecialHit = opts.hitKind==='special';
  let parried = false;
  if(def.state==='block'){
    const PARRY_WINDOW = 6;
    if((def.blockFrames||0) <= PARRY_WINDOW){
      parried = true;
      d = 0;
      AudioEngine.sfxParry();
      att.stunTimer = isSpecialHit ? 28 : 20;
      att.combo = 0; att.comboTimer = 0;
      triggerScreenEffect('light');
      addParticle({x:def.x+def.w/2, y:GROUND_Y-def.h*0.75, type:'hit', color:'#ffd23f', text:'¡PARRY!'});
    } else if(isSpecialHit){
      d *= 0.5;
      AudioEngine.sfxBlock();
    } else {
      d = 0;
      AudioEngine.sfxBlock();
    }
  } else { AudioEngine.sfxHit(); }
  def.hp = Math.max(0, def.hp - d);
  if(d>0 && opts.knock!==false){
    def.vy = opts.popup ? -7 : def.vy;
    def.x += (def.x+def.w/2 < att.x+att.w/2 ? -1:1) * (opts.knockDist||10);
  }
  if(def.state!=='block'){ def.hitKind = opts.hitKind || 'light'; def.idleTimer = 0; setState(def, 'hit', opts.hitTime||14); }
  att.meter = Math.min(100, att.meter + (opts.meterGain||0));
  addParticle({x:def.x+def.w/2, y:GROUND_Y-def.h*0.6, type:'hit', color:opts.color||'#fff', text:opts.text});
  if(d>0 && def.state!=='block'){
    att.combo = (att.combo||0) + 1;
    att.comboTimer = 45;
    def.combo = 0; def.comboTimer = 0;
    if(att.combo >= 2) showComboPopup(att, att.combo);
  }
  if(d>0 && def.state!=='block'){
    const isBig = opts.hitKind==='heavy' || opts.hitKind==='jumpheavy' || opts.hitKind==='special';
    triggerScreenEffect(isBig ? 'heavy' : 'light');
  }
  if(d>0 && navigator.vibrate){
    const isBig = opts.hitKind==='heavy' || opts.hitKind==='jumpheavy' || opts.hitKind==='special';
    navigator.vibrate(isBig ? 60 : 25);
  }
}

/* =================== ESPECIALES =================== */
function triggerSpecial(f, opp){
  f.meter=0;
  const type = f.def.specialType;
  const who = f.def.name || '';
  setState(f,'special',46);
  switch(type){
    case 'balones':{
      S.projectiles.push({x:f.x+(f.facing===1?f.w:0), y:GROUND_Y-f.h*0.5, vx:7*f.facing, owner:f, dmg:30, kind:'basketball', color:'#e67e22', bounce:0});
      addBanner('🏀 ¡BALONES FUERA! 🏀', f.def.color, who);
      break;
    }
    case 'queja':{
      const extra = (opp.def.id==='marcos');
      const dmg = extra ? 50 : 30;
      addBanner('😤 ¡QUEJA PERTURBADORA!', f.def.color, '"¡Esto es indignante!"'+(extra?'  (x2 con Marcos)':''));
      addParticle({type:'glitch', life:20, color:'rgba(232,67,147,0.25)'});
      opp.frozen = 40;
      applyDamage(f, opp, dmg, {meterGain:0, knock:false, color:'#e84393', text:'', hitKind:'special'});
      break;
    }
    case 'cigarro':{
      addBanner('🚬 "¿SERÉ YO MI ALMA?"', f.def.color, who);
      addParticle({x:f.x+f.w/2, y:GROUND_Y-f.h, type:'aura', life:90, color:'#bdbdbd'});
      applyDamage(f, opp, 30, {meterGain:0, knock:false, color:'#9b59b6', text:'', hitKind:'special'});
      break;
    }
    case 'voces':{
      addBanner('🗣️ "¡ESTÁS EMPANAO!"', f.def.color, who);
      applyDamage(f, opp, 30, {meterGain:0, knockDist:18, color:'#e74c3c', text:'', hitKind:'special'});
      break;
    }
    case 'multitarea':{
      addBanner('📞📧📋 ¡SALPICÓN DE MARISCO!', f.def.color, who);
      addParticle({x:f.x+f.w/2-30, y:GROUND_Y-f.h*0.8, type:'icon', life:70, icon:'📞'});
      addParticle({x:f.x+f.w/2, y:GROUND_Y-f.h*1.0, type:'icon', life:70, icon:'📧'});
      addParticle({x:f.x+f.w/2+30, y:GROUND_Y-f.h*0.6, type:'icon', life:70, icon:'📋'});
      applyDamage(f, opp, 30, {meterGain:0, knock:false, color:'#10ac84', text:'', hitKind:'special'});
      break;
    }
    case 'projectile':{
      S.projectiles.push({x:f.x+(f.facing===1?f.w:0), y:GROUND_Y-f.h*0.6, vx:6.5*f.facing, owner:f, dmg:18, kind:'papers', color:'#fdf6e3'});
      addBanner('📋 "'+f.def.special.toUpperCase()+'"', f.def.color, who);
      break;
    }
    case 'blind':{
      addParticle({x:CANVAS_W/2, y:CANVAS_H/2, type:'flash', life:30});
      addBanner('📸 ¡FLASH CEGADOR!', f.def.color, who);
      opp.reversed = 180;
      applyDamage(f, opp, 12, {meterGain:0, knock:false, color:'#fff', text:'', hitKind:'special'});
      break;
    }
    case 'smash':{
      if(facingTowards(f,opp) && dist(f,opp) < 160){
        addBanner('🦯 ¡PENSIÓN COMPLETA!', f.def.color, who);
        applyDamage(f, opp, 30, {meterGain:0, knockDist:26, popup:true, color:'#ffd23f', text:'', hitKind:'special'});
      } else {
        addBanner('🦯 ¡BASTONAZO JUBILADO!', f.def.color, who);
        f.vx_dash = f.facing*10; f.dashTimer=18;
      }
      break;
    }
    case 'rage':{
      f.buffDmg=1.6; f.buffSpeed=1.5; f.buffTimer=240;
      addBanner('⏰ "'+f.def.special.toUpperCase()+'"', f.def.color, who);
      addParticle({x:f.x+f.w/2, y:GROUND_Y-f.h, type:'aura', life:240, color:f.def.color});
      break;
    }
    case 'dash':{
      addBanner('🏃 "'+f.def.special.toUpperCase()+'"', f.def.color, who);
      f.vx_dash = f.facing*12; f.dashTimer=24;
      break;
    }
    case 'multihit':{
      addBanner('🔁 "'+f.def.special.toUpperCase()+'"', f.def.color, who);
      f.multihit=3; f.multihitTimer=10;
      break;
    }
  }
}

/* =================== FÍSICA / LÓGICA =================== */
function fireAttack(f, type, charged){
  if(type==='punch'){
    setState(f,'punch', charged ? 24 : 18);
    f.attackCharged = !!charged;
    AudioEngine.sfxPunch();
  } else {
    setState(f,'kick', charged ? 30 : 24);
    f.attackCharged = !!charged;
    AudioEngine.sfxKick();
  }
  if(charged) triggerScreenEffect('light');
}

function updateFighter(f, opp, controls){
  if(f.buffTimer>0){ f.buffTimer--; if(f.buffTimer===0){ f.buffDmg=1; f.buffSpeed=1; } }
  if(f.comboTimer>0){ f.comboTimer--; if(f.comboTimer===0){ f.combo=0; } }
  if(f.frozen>0){ f.frozen--; return; }
  if(f.stunTimer>0){
    f.stunTimer--;
    f.state = 'hit'; f.hitKind = 'light'; f.stateTimer = Math.max(f.stateTimer,1);
    f.vy += GRAVITY; f.y=(f.y||0)+f.vy; if(f.y>0){ f.y=0; f.vy=0; }
    return;
  }
  if(f.reversed>0) f.reversed--;
  if(f.dashDodgeCooldown>0) f.dashDodgeCooldown--;

  f.vy += GRAVITY;
  f.y = (f.y||0) + f.vy;
  if(f.y>0){ f.y=0; f.vy=0; }

  {
    let left = controls.left, right = controls.right;
    if(f.reversed>0){ const t=left; left=right; right=t; }
    const now = S.frame||0;
    const DTAP_WINDOW = 16;
    if(left && !f.prevDirHeld.left){
      if(now - f.lastDirTap.left <= DTAP_WINDOW && f.dashDodgeCooldown<=0 && f.dashDodgeTimer<=0 && !['punch','kick','special','hit'].includes(f.state)){
        f.dashDodgeTimer = 10; f.dashDodgeDir = -1; f.dashDodgeCooldown = 28;
        AudioEngine.sfxJump();
      }
      f.lastDirTap.left = now;
    }
    if(right && !f.prevDirHeld.right){
      if(now - f.lastDirTap.right <= DTAP_WINDOW && f.dashDodgeCooldown<=0 && f.dashDodgeTimer<=0 && !['punch','kick','special','hit'].includes(f.state)){
        f.dashDodgeTimer = 10; f.dashDodgeDir = 1; f.dashDodgeCooldown = 28;
        AudioEngine.sfxJump();
      }
      f.lastDirTap.right = now;
    }
    f.prevDirHeld.left = left; f.prevDirHeld.right = right;
  }
  if(f.dashDodgeTimer>0){
    f.dashDodgeTimer--;
    f.state = 'dash';
    f.x += f.dashDodgeDir * SPEED * 3.2;
    f.x = Math.max(10, Math.min(CANVAS_W-f.w-10, f.x));
    f.invulnerable = true;
    f.walkCycle += 0.45;
    return;
  }
  f.invulnerable = false;

  if(f.dashTimer>0){
    f.x += f.vx_dash;
    f.dashTimer--;
    if(!f.hitDone && facingTowards(f,opp) && dist(f,opp)<90){
      applyDamage(f, opp, f.def.specialType==='dash'?20:30, {meterGain:0, knockDist:24, color:'#ffd23f', text:f.def.specialType==='dash'?'¡PARA AYER!':'¡PENSIÓN COMPLETA!', hitKind:'special'});
      f.hitDone=true;
    }
    f.x = Math.max(10, Math.min(CANVAS_W-f.w-10, f.x));
    return;
  }

  if(f.multihit>0){
    f.multihitTimer--;
    if(f.multihitTimer<=0){
      if(facingTowards(f,opp) && dist(f,opp)<90){
        applyDamage(f, opp, 8, {meterGain:0, knock:false, color:'#fff', text:'¡OTRA VEZ!', hitKind:'special'});
      }
      f.multihit--; f.multihitTimer=10;
    }
    return;
  }

  const locked = ['punch','kick','special','hit'].includes(f.state) && f.stateTimer>0;

  if(!locked){
    let left = controls.left, right = controls.right;
    if(f.reversed>0){ const t=left; left=right; right=t; }

    const anyInput = controls.block || left || right || controls.jump || controls.punch || controls.kick || controls.special;
    if(anyInput) f.idleTimer = 0;
    else f.idleTimer = (f.idleTimer||0) + 1;

    if(controls.block && f.y>=0){
      f.blockFrames = (f.blockFrames||0) + 1;
      setState(f,'block',1);
    } else if(left || right){
      f.blockFrames = 0;
      const dir = left? -1:1;
      f.facing = controls.lockFacing ? f.facing : dir;
      f.x += dir*SPEED*f.buffSpeed;
      f.x = Math.max(10, Math.min(CANVAS_W-f.w-10, f.x));
      setState(f,'walk',1);
    } else {
      f.blockFrames = 0;
      setState(f,'idle',1);
    }

    if(controls.jump && f.y>=0){ f.vy = JUMP_V; AudioEngine.sfxJump(); }

    const CHARGE_THRESHOLD = 22;
    const CHARGE_MAX = 50;
    if((controls.punch || controls.kick) && !controls.block){
      const type = controls.punch ? 'punch' : 'kick';
      if(f.chargeType===type){
        f.chargeTimer = Math.min(CHARGE_MAX, (f.chargeTimer||0)+1);
        if(f.chargeTimer===CHARGE_THRESHOLD) AudioEngine.sfxBlock();
        if(f.chargeTimer>=CHARGE_MAX) fireAttack(f, type, true);
      } else {
        f.chargeType = type; f.chargeTimer = 1;
      }
    } else if(f.chargeType){
      const charged = f.chargeTimer >= CHARGE_THRESHOLD;
      fireAttack(f, f.chargeType, charged);
      f.chargeType = null; f.chargeTimer = 0;
    } else if(controls.special && f.meter>=100){
      triggerSpecial(f, opp); AudioEngine.sfxSpecial(f.def.id);
    }
  } else {
    f.stateTimer--;
    if(f.state==='punch' && f.stateTimer===10 && !f.hitDone){
      if(facingTowards(f,opp) && dist(f,opp)<85){
        if(f.attackCharged){
          applyDamage(f, opp, 13, {meterGain:22, knockDist:16, popup:true, color:'#ffd23f', text:'¡CARGADO!', hitKind:'special'});
        } else {
          applyDamage(f, opp, 6, {meterGain:14, knockDist:6, color:'#fff', text:'', hitKind:'light'});
        }
      }
      f.hitDone=true;
    }
    if(f.state==='kick' && f.stateTimer===14 && !f.hitDone){
      if(facingTowards(f,opp) && dist(f,opp)<100){
        const isJumpKick = f.y < -2;
        if(f.attackCharged){
          applyDamage(f, opp, 20, {meterGain:26, knockDist:22, popup:true, color:'#ffd23f', text:'¡CARGADO!', hitKind:'special'});
        } else {
          applyDamage(f, opp, 11, {meterGain:20, knockDist:14, color:'#fff', text:'', hitKind: isJumpKick ? 'jumpheavy' : 'heavy'});
        }
      }
      f.hitDone=true;
    }
    if(f.stateTimer<=0 && f.state!=='block'){ f.state='idle'; f.attackCharged=false; }
    if(f.state==='block' && !controls.block){ f.state='idle'; }
  }

  if(f.state==='walk') f.walkCycle += 0.25; else f.walkCycle=0;
}

/* =================== IA Y CONTROLES =================== */
function aiControls(f, opp){
  const d = (opp.x+opp.w/2) - (f.x+f.w/2);
  const ad = Math.abs(d);
  const c = {left:false,right:false,jump:false,punch:false,kick:false,special:false,block:false};
  const tier = S.mode==='1p' ? Math.min(S.enemyIndex||0, 6) : 0;
  const aggro = 1 + tier*0.18;
  const guard = 1 + tier*0.35;
  const reaction = Math.max(70, 95 - tier*4);
  if(ad>reaction){
    if(d<0) c.left=true; else c.right=true;
    if(Math.random()<0.01*aggro) c.jump=true;
  } else {
    if(Math.random()<0.045*aggro) c.punch=true;
    else if(Math.random()<0.025*aggro) c.kick=true;
    else if(f.meter>=100 && Math.random()<0.04*aggro) c.special=true;
    else if(Math.random()<0.015*guard) c.block=true;
    else if(Math.random()<0.01){ if(d<0) c.left=true; else c.right=true; }
  }
  if(f.meter>=100 && ad>150 && Math.random()<0.03*aggro) c.special=true;
  return c;
}

function p1Controls(){
  return {
    left:key('a'), right:key('d'), jump:key('w'),
    punch:key('f'), kick:key('g'), special:key('h'), block:key('s'),
  };
}
function p2Controls(){
  return {
    left:key('arrowleft'), right:key('arrowright'), jump:key('arrowup'),
    punch:key('k'), kick:key('l'), special:key('ñ','Ñ',';','/'), block:key('arrowdown'),
  };
}

/* =================== PROYECTILES Y PARTÍCULAS =================== */
function updateProjectiles(){
  for(let i=S.projectiles.length-1;i>=0;i--){
    const p=S.projectiles[i];
    p.x += p.vx;
    if(p.kind==='basketball'){ p.bounce=(p.bounce||0)+0.35; }
    const target = S.fighters.find(f=>f!==p.owner);
    const tcx=target.x+target.w/2;
    const hitboxTop = GROUND_Y - target.h + (target.y||0);
    const projY = GROUND_Y-target.h*0.6;
    if(Math.abs(p.x-tcx)<35 && projY>=hitboxTop && projY<=GROUND_Y){
      applyDamage(p.owner, target, p.dmg, {meterGain:0, knockDist:10, color:'#ffd23f', text:'¡PAPELEO!', hitKind:'special'});
      S.projectiles.splice(i,1); continue;
    }
    if(p.x<-50 || p.x>CANVAS_W+50) S.projectiles.splice(i,1);
  }
}
function updateParticles(){
  for(let i=S.particles.length-1;i>=0;i--){
    const p=S.particles[i]; p.age++;
    if(p.age>p.life) S.particles.splice(i,1);
  }
}
