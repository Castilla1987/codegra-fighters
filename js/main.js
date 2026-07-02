/* =================== INPUT =================== */
window.addEventListener('keydown', e=>{
  S.keys[e.key.toLowerCase()]=true;
  if(e.key==='Escape' && S.running){ togglePause(); }
});
window.addEventListener('keyup', e=>{ S.keys[e.key.toLowerCase()]=false; });
function key(...names){ return names.some(n=>S.keys[n]); }

/* =================== TOUCH =================== */
const TOUCH_CAPABLE = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
(function setupTouchControls(){
  const wrap = document.getElementById('touch-controls');
  if(!wrap) return;
  const btns = wrap.querySelectorAll('.tc-btn');
  btns.forEach(btn => {
    const k = btn.getAttribute('data-key');
    const press = (e) => { e.preventDefault(); S.keys[k] = true; btn.classList.add('tc-pressed'); };
    const release = (e) => { if(e) e.preventDefault(); S.keys[k] = false; btn.classList.remove('tc-pressed'); };
    btn.addEventListener('touchstart', press, {passive:false});
    btn.addEventListener('touchend', release, {passive:false});
    btn.addEventListener('touchcancel', release, {passive:false});
    btn.addEventListener('mousedown', press);
    btn.addEventListener('mouseup', release);
    btn.addEventListener('mouseleave', release);
  });
})();
function showTouchControls(show){
  const wrap = document.getElementById('touch-controls');
  if(!wrap) return;
  if(show && TOUCH_CAPABLE) wrap.classList.add('active');
  else wrap.classList.remove('active');
}

/* =================== PAUSA =================== */
function togglePause(){
  if(!S.running) return;
  S.paused = !S.paused;
  document.getElementById('pause-overlay').classList.toggle('hidden', !S.paused);
  // Efecto "puerta cerrada": la música sigue sonando pero amortiguada
  if(typeof AudioEngine.setMuffled === 'function') AudioEngine.setMuffled(S.paused);
}
document.getElementById('btn-pause').addEventListener('click', togglePause);
document.getElementById('btn-resume').addEventListener('click', togglePause);
document.getElementById('btn-restart-fight').addEventListener('click', ()=>{
  S.paused = false;
  document.getElementById('pause-overlay').classList.add('hidden');
  if(typeof AudioEngine.setMuffled === 'function') AudioEngine.setMuffled(false);
  startFight();
});
/* Vuelve al menú título, reanuda la música de fondo HTML y el tema chiptune del menú */
function goToMenu(){
  S.fighters=[]; S.p1Meter=0; S.p2Meter=0;
  if(typeof AudioEngine.setMuffled === 'function') AudioEngine.setMuffled(false);
  const audioBgEl = document.getElementById('audio-bg');
  if(audioBgEl && audioBgEl.paused){ audioBgEl.play().catch(()=>{}); }
  AudioEngine.startMusic('menu');
  showScreen('screen-title');
}

document.getElementById('btn-quit-fight').addEventListener('click', ()=>{
  S.paused = false; S.running = false;
  document.getElementById('pause-overlay').classList.add('hidden');
  if(typeof AudioEngine.setMuffled === 'function') AudioEngine.setMuffled(false);
  goToMenu();
});

/* =================== NAVEGACIÓN DE MENÚ =================== */
(function(){
  const ab = document.getElementById('audio-bg');
  function startBgMusic(){
    if(ab && ab.paused){ ab.load(); ab.play().catch(()=>{}); }
    AudioEngine.init();
    AudioEngine.startMusic('menu');
  }
  document.getElementById('title-btn-jugar').onclick=()=>{ startBgMusic(); showScreen('screen-mode'); };
  document.getElementById('title-btn-opciones').onclick=()=>{ startBgMusic(); showScreen('screen-mode'); };
  const btnEntrenamiento = document.getElementById('title-btn-entrenamiento');
  if(btnEntrenamiento) btnEntrenamiento.onclick=()=>{
    startBgMusic();
    buildTrainingCharSelect();
    showScreen('screen-training');
  };
  document.getElementById('title-btn-logros')?.addEventListener('click', ()=>{
    startBgMusic();
    if(typeof loadAndDisplayAchievements==='function') loadAndDisplayAchievements('achievements-list');
    showScreen('screen-achievements');
  });
  document.getElementById('btn-back-achievements')?.addEventListener('click', ()=>{
    showScreen('screen-title');
  });
  document.getElementById('title-btn-musica').onclick=()=>{
    if(ab){ if(ab.paused){ ab.load(); ab.play().catch(()=>{}); } else { ab.pause(); } }
  };
  ['title-btn-jugar','title-btn-opciones','title-btn-musica'].forEach(id=>{
    const el = document.getElementById(id);
    el.addEventListener('mouseenter',()=>{ el.style.background='rgba(0,220,255,0.12)'; el.style.borderRadius='6px'; });
    el.addEventListener('mouseleave',()=>{ el.style.background=''; });
  });
})();

document.getElementById('btn-back-mode').onclick=()=> showScreen('screen-title');

document.getElementById('btn-1p').onclick=()=>{
  S.mode='1p'; S.enemyIndex=0; S.p1Meter=0; S.p2Meter=0;
  buildStageGrid(); showScreen('screen-stage');
};
document.getElementById('btn-2p').onclick=()=>{
  S.mode='2p'; S.p1Meter=0; S.p2Meter=0;
  buildStageGrid(); showScreen('screen-stage');
};
document.getElementById('btn-back-stage').onclick=()=> showScreen('screen-mode');

function buildStageGrid(){
  const grid = document.getElementById('gridStage');
  grid.innerHTML='';
  STAGES.forEach(st=>{
    const card = document.createElement('div');
    card.className='stagecard'+(S.stageId===st.id?' selected':'');
    card.innerHTML = `<div class="thumb thumb-${st.id}">${st.emoji}</div><div class="nm">${st.name}</div><div class="ds">${st.desc}</div>`;
    card.onclick=()=>{
      S.stageId = st.id;
      buildArcadeSelect(true);
      showScreen('screen-select1');
    };
    grid.appendChild(card);
  });
}

/* =================== SELECCIÓN DE PERSONAJE =================== */
let _arcadeIsP1 = true;
let _arcadeSelected = null;
let _arcadePreviewTimer = null;

function buildArcadeSelect(isP1){
  _arcadeIsP1 = isP1;
  _arcadeSelected = null;
  const screenId = isP1 ? 'screen-select1' : 'screen-select2';
  const screen = document.getElementById(screenId);
  const badge = screen.querySelector('.arcade-player-badge');
  if(badge){
    badge.style.setProperty('--pbadge', isP1 ? '#2e86de' : '#e84393');
    badge.textContent = isP1 ? 'P1' : 'P2';
  }
  const header = screen.querySelector('#arcade-header');
  if(header) header.firstChild.textContent = isP1
    ? 'JUGADOR 1 — ELIGE TU PERSONAJE '
    : 'JUGADOR 2 — ELIGE TU PERSONAJE ';
  const roster = screen.querySelector('#arcade-roster');
  roster.innerHTML = '';
  CHARACTERS.forEach(c => {
    if(c.secret && !S.unlocked) return;
    const card = document.createElement('div');
    card.className = 'acard';
    const thumbSrc = c.id === 'javier' ? JAVIER_SEL[0] : srcFor(c.img);
    card.innerHTML = `
      <img src="${thumbSrc}" alt="${c.name}">
      <div class="ac-name">${c.name.split(' ')[0]}</div>
      <div class="ac-role">${c.role.split(' ').slice(0,2).join(' ')}</div>
      ${c.secret ? '<span class="ac-secret-tag">★</span>' : ''}
      ${c.id==='javier' ? '<span class="ac-javier-tag">📷</span>' : ''}
    `;
    card.addEventListener('mouseenter', () => previewChar(c, screen));
    card.addEventListener('click', () => selectChar(c, card, screen));
    roster.appendChild(card);
  });
  resetPreview(screen);
  const backBtn = screen.querySelector('#arcade-back-btn');
  backBtn.onclick = () => isP1 ? showScreen('screen-stage') : showScreen('screen-select1');
  const confirmBtn = screen.querySelector('#arcade-confirm-btn');
  confirmBtn.disabled = true;
  confirmBtn.onclick = () => {
    if(!_arcadeSelected) return;
    if(_arcadeIsP1){
      S.p1Def = _arcadeSelected;
      if(S.mode==='2p'){
        buildArcadeSelect(false);
        showScreen('screen-select2');
      } else {
        S.p2Def = ENEMIES[S.enemyIndex];
        S.p2IsEnemy = true;
        showVS();
      }
    } else {
      S.p2Def = _arcadeSelected;
      S.p2IsEnemy = false;
      showVS();
    }
  };
}

function resetPreview(screen){
  screen.querySelector('#arcade-char-sprite').src = '';
  screen.querySelector('#arcade-char-sprite').className = '';
  screen.querySelector('#arcade-color-bar').style.background = '';
  screen.querySelector('#arcade-preview-name').textContent = '???';
  screen.querySelector('#arcade-preview-role').textContent = '';
  screen.querySelector('#arcade-preview-special-name').textContent = '';
}

function previewChar(c, screen){
  const sprite = screen.querySelector('#arcade-char-sprite');
  const bar    = screen.querySelector('#arcade-color-bar');
  if(_arcadePreviewTimer){ clearInterval(_arcadePreviewTimer); _arcadePreviewTimer = null; }
  if(c.id === 'javier'){
    let frame = 0;
    sprite.src = JAVIER_SEL[0]; sprite.className = '';
    _arcadePreviewTimer = setInterval(() => {
      frame = (frame + 1) % JAVIER_SEL.length;
      sprite.src = JAVIER_SEL[frame];
    }, 140);
  } else {
    sprite.src = imgFor(c.img) ? imgFor(c.img).src : srcFor(c.img);
    sprite.className = 'anim-bounce';
  }
  bar.style.background = c.color;
  screen.querySelector('#arcade-preview-name').textContent = c.name.toUpperCase();
  screen.querySelector('#arcade-preview-role').textContent = c.role;
  screen.querySelector('#arcade-preview-special-name').textContent = c.special || '';
}

function selectChar(c, card, screen){
  screen.querySelectorAll('.acard').forEach(el => el.classList.remove('ac-selected'));
  card.classList.add('ac-selected');
  _arcadeSelected = c;
  previewChar(c, screen);
  screen.querySelector('#arcade-confirm-btn').disabled = false;
}

function buildGrid(gridId, isP1){ buildArcadeSelect(isP1); }

/* =================== PANTALLA VS =================== */
function showVS(){
  document.getElementById('vs-p1-img').src = srcFor(S.p1Def.img);
  document.getElementById('vs-p1-name').textContent = S.p1Def.name;
  if(S.p2IsEnemy){
    document.getElementById('vs-p2-img').src = '';
    document.getElementById('vs-p2-img').style.display='none';
    document.getElementById('vs-p2-name').textContent = S.p2Def.name + ' ' + S.p2Def.emoji;
  } else {
    document.getElementById('vs-p2-img').style.display='';
    document.getElementById('vs-p2-img').src = srcFor(S.p2Def.img);
    document.getElementById('vs-p2-name').textContent = S.p2Def.name;
  }
  const stageName = (STAGES.find(s=>s.id===S.stageId)||{}).name || '';
  document.getElementById('vs-flavor').textContent = S.p2IsEnemy
    ? `Rival ${S.enemyIndex+1}/${ENEMIES.length} — Especial: "${S.p2Def.special}" — Escenario: ${stageName}`
    : `Especiales: "${S.p1Def.special}" vs "${S.p2Def.special}"`;
  showScreen('screen-vs');
}
document.getElementById('btn-fight').onclick=()=> startFight();

/* =================== INICIO DE COMBATE =================== */
function startFight(){
  S.fighters = [
    makeFighter(S.p1Def, 160, 1, false, S.p1Meter),
    makeFighter(S.p2Def, CANVAS_W-160-110, -1, !!S.p2IsEnemy, S.p2IsEnemy),
  ];
  const [fp1, fp2] = S.fighters;
  fp1.introTargetX = fp1.x; fp1.x = -fp1.w-40;
  fp2.introTargetX = fp2.x; fp2.x = CANVAS_W+40;
  S.fightPhase = 'intro'; S.introTimer = 0;
  S.projectiles=[]; S.particles=[];
  S.timer=90; S.timerAcc=0; S.frame=0;
  document.getElementById('p1name').textContent = S.p1Def.name;
  document.getElementById('p2name').textContent = (S.p2IsEnemy?S.p2Def.name+' '+S.p2Def.emoji:S.p2Def.name);
  const hint = S.mode==='1p'
    ? 'TÚ: A/D moverte (doble toque = esquiva) · W saltar · F/G mantener = golpe cargado · H especial · S bloquear (justo a tiempo = ¡PARRY!)'
    : 'J1: A/D(x2 esquiva) · W salto · F/G(mantener=carga) · H especial · S bloqueo/parry   |   J2: ←/→(x2 esquiva) · ↑ salto · K/L(mantener=carga) · Ñ especial · ↓ bloqueo/parry';
  document.getElementById('controls-hint').textContent = hint;
  document.getElementById('controls-hint').classList.add('hidden');
  showScreen(null);
  S.running=true; S.paused=false;
  document.getElementById('pause-overlay').classList.add('hidden');
  if(typeof AudioEngine.setMuffled === 'function') AudioEngine.setMuffled(false);
  // Detener música de fondo HTML del menú (si existe) para que solo suene el tema del escenario
  const audioBgEl = document.getElementById('audio-bg');
  if(audioBgEl && !audioBgEl.paused) audioBgEl.pause();
  // Música del escenario
  AudioEngine.startMusic(S.stageId || 'menu');
}

/* =================== BUCLE PRINCIPAL =================== */
function loop(){
  if(S.running && !S.paused && S.fightPhase==='intro'){
    S.frame++;
    const [f1,f2] = S.fighters;
    S.introTimer++;
    const EASE = 0.14;
    f1.x += (f1.introTargetX - f1.x) * EASE;
    f2.x += (f2.introTargetX - f2.x) * EASE;
    f1.walkCycle += 0.25; f2.walkCycle += 0.25;
    f1.state='walk'; f2.state='walk';
    const arrived = Math.abs(f1.x-f1.introTargetX)<2 && Math.abs(f2.x-f2.introTargetX)<2;
    if(arrived || S.introTimer>70){
      f1.x = f1.introTargetX; f2.x = f2.introTargetX;
      f1.state='idle'; f2.state='idle'; f1.walkCycle=0; f2.walkCycle=0;
      S.fightPhase = 'ready'; S.introTimer = 0;
      addBanner('¡LUCHA!', '#ff5a3c');
      AudioEngine.sfxJump();
    }
  } else if(S.running && !S.paused && S.fightPhase==='ready'){
    S.introTimer++;
    if(S.introTimer>=46){
      S.fightPhase = 'fighting';
      document.getElementById('controls-hint').classList.remove('hidden');
    }
  } else if(S.running && !S.paused && S.fightPhase==='fighting'){
    S.frame++;
    const [f1,f2] = S.fighters;
    let c1 = p1Controls();
    let c2 = (S.mode==='1p') ? aiControls(f2,f1)
           : (S.mode==='training') ? getTrainingOpponentControls(f2,f1)
           : p2Controls();
    updateFighter(f1,f2,c1);
    updateFighter(f2,f1,c2);
    updateProjectiles();
    updateParticles();
    S.timerAcc++;
    if(S.timerAcc>=60){ S.timerAcc=0; S.timer--; }
    const p1pct = (f1.hp / f1.maxHp) * 100;
    const p2pct = (f2.hp / f2.maxHp) * 100;
    document.getElementById('p1hp').style.width = p1pct+'%';
    document.getElementById('p2hp').style.width = p2pct+'%';
    document.getElementById('p1chip').style.width = p1pct+'%';
    document.getElementById('p2chip').style.width = p2pct+'%';
    const LOW_HP_PCT = 25;
    document.getElementById('p1hp').classList.toggle('low-hp', f1.hp>0 && p1pct<=LOW_HP_PCT);
    document.getElementById('p2hp').classList.toggle('low-hp', f2.hp>0 && p2pct<=LOW_HP_PCT);
    document.getElementById('p1hpbg').classList.toggle('low-hp-bg', f1.hp>0 && p1pct<=LOW_HP_PCT);
    document.getElementById('p2hpbg').classList.toggle('low-hp-bg', f2.hp>0 && p2pct<=LOW_HP_PCT);
    document.getElementById('p1sp').style.width = f1.meter+'%';
    document.getElementById('p2sp').style.width = f2.meter+'%';
    document.getElementById('timer').textContent = S.mode==='training' ? '∞' : Math.max(0,S.timer);
    // En entrenamiento: resetear HP al llegar a 0, sin fin de ronda
    if(S.mode==='training'){
      if(f1.hp<=0){ f1.hp=f1.maxHp; }
      if(f2.hp<=0){ f2.hp=f2.maxHp; }
    } else {
      if(f1.hp<=0 || f2.hp<=0 || S.timer<=0) endRound(f1,f2);
    }
  } else if(S.running && !S.paused && S.fightPhase==='ko'){
    S.frame++;
    updateParticles();
    S.koTimer++;
    if(S.koTimer>=58){
      S.fightPhase = 'victory';
      if(S.lastWinner==='p1') AudioEngine.sfxWin(); else if(S.lastWinner==='p2') AudioEngine.sfxLose();
    }
  } else if(S.running && !S.paused && S.fightPhase==='victory'){
    S.frame++;
    updateParticles();
    S.victoryTimer++;
    const [f1,f2] = S.fighters;
    document.getElementById('p1hp').style.width = (f1.hp/f1.maxHp*100)+'%';
    document.getElementById('p2hp').style.width = (f2.hp/f2.maxHp*100)+'%';
    document.getElementById('p1chip').style.width = (f1.hp/f1.maxHp*100)+'%';
    document.getElementById('p2chip').style.width = (f2.hp/f2.maxHp*100)+'%';
    if(S.victoryTimer===35) S.bigBanner = { kind:S.lastWinner, age:0 };
    if(S.bigBanner) S.bigBanner.age++;
    if(S.victoryTimer>=240){
      S.fightPhase = 'done'; S.bigBanner = null;
      showResultScreen(f1,f2,S.lastWinner);
    }
  }

  ctx.clearRect(0,0,CANVAS_W,CANVAS_H);
  ctx.save();
  if(S.shake>0){
    ctx.translate((Math.random()*2-1)*S.shake, (Math.random()*2-1)*S.shake*0.6);
    S.shake *= 0.82;
    if(S.shake<0.5) S.shake=0;
  }
  drawBackground();
  if(S.fighters.length){
    S.fighters.slice().sort((a,b)=>a.x-b.x).forEach(drawFighter);
    drawProjectiles();
    drawParticles();
  }
  ctx.restore();
  if(S.fightPhase==='ko') drawKOBanner(S.koTimer);
  if(S.bigBanner) drawBigBanner(S.bigBanner);
  if(S.flash>0){
    ctx.save();
    ctx.globalAlpha = Math.min(1, S.flash);
    ctx.fillStyle = '#fff';
    ctx.fillRect(0,0,CANVAS_W,CANVAS_H);
    ctx.restore();
    S.flash *= 0.75;
    if(S.flash<0.02) S.flash=0;
  }
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

/* =================== FIN DE RONDA =================== */
function endRound(f1,f2){
  S.running=false;
  S.p1Meter = f1.meter;
  S.p2Meter = f2.meter;
  const isKO = (f1.hp<=0 || f2.hp<=0);
  let winner;
  if(f1.hp<=0 && f2.hp<=0) winner='draw';
  else if(f1.hp<=0) winner='p2';
  else if(f2.hp<=0) winner='p1';
  else winner = (f1.hp/f1.maxHp) >= (f2.hp/f2.maxHp) ? 'p1':'p2';
  S.lastWinner = winner;

  /* ── Tracking de estadísticas persistentes (Fase 6) ── */
  if(typeof PERSISTENT_DATA !== 'undefined' && winner !== 'draw' && S.mode !== 'training'){
    const winnerFighter = winner==='p1' ? f1 : f2;
    const loserFighter  = winner==='p1' ? f2 : f1;
    const winnerCharId  = winner==='p1' ? (S.p1Def && S.p1Def.id) : (S.p2Def && S.p2Def.id);
    const loserCharId   = winner==='p1' ? (S.p2Def && S.p2Def.id) : (S.p1Def && S.p1Def.id);

    if(winnerCharId){
      PERSISTENT_DATA.incrementWins(winnerCharId);
      PERSISTENT_DATA.updateBestCombo(winnerCharId, winnerFighter.maxCombo||0);
      PERSISTENT_DATA.addSpecialsUsed(winnerCharId, winnerFighter.totalSpecialsUsed||0);
      if(winnerFighter.hp >= winnerFighter.maxHp){
        PERSISTENT_DATA.registerPerfectVictory();
      }
    }
    if(loserCharId && winner==='p1' ? S.mode!=='1p' : true){
      // En modo 1P el "loser" es el enemigo genérico, no contamos sus derrotas como personaje jugable
      if(!(S.mode==='1p' && winner==='p1')) PERSISTENT_DATA.incrementLosses(loserCharId);
    }
    if(S.mode==='2p' && winner==='p1'){
      PERSISTENT_DATA.registerTournamentWin();
    }
  }
  [f1,f2].forEach(f=>{
    const isWinner = (winner==='p1' && f===f1) || (winner==='p2' && f===f2);
    if(isWinner && f.hp>0){ f.state = 'victory'; f.stateTimer = 9999; f.hitDone = true; }
  });
  S.victoryTimer = 0;
  S.running = true;
  if(isKO && winner!=='draw'){
    S.fightPhase = 'ko'; S.koTimer = 0;
    triggerScreenEffect('heavy');
    AudioEngine.sfxLose();
  } else {
    if(winner==='p1') AudioEngine.sfxWin(); else if(winner==='p2') AudioEngine.sfxLose();
    S.fightPhase = 'victory';
  }
}

/* =================== PANTALLA DE RESULTADO =================== */
function showResultScreen(f1,f2,winner){
  const title=document.getElementById('result-title');
  const text=document.getElementById('result-text');
  const buttons=document.getElementById('result-buttons');
  buttons.innerHTML='';
  if(S.mode==='2p'){
    if(winner==='draw'){ title.textContent='¡EMPATE!'; text.textContent='Ningún administrativo cede el sillón.'; }
    else {
      const w = winner==='p1'?S.p1Def:S.p2Def;
      title.textContent='¡'+w.name.toUpperCase()+' GANA!';
      text.textContent= 'Usó su especial: "'+w.special+'" para cerrar el caso.';
    }
    const again=document.createElement('button'); again.className='btn'; again.textContent='REVANCHA';
    again.onclick=()=> startFight();
    const menu=document.createElement('button'); menu.className='btn small'; menu.textContent='MENÚ';
    menu.onclick=goToMenu;
    buttons.appendChild(again); buttons.appendChild(menu);
  } else {
    if(winner==='p1'){
      title.textContent='¡VICTORIA!';
      text.textContent= '¡'+S.p1Def.name+' ha derrotado a '+S.p2Def.name+' '+S.p2Def.emoji+'!';
      const next=document.createElement('button'); next.className='btn'; next.textContent='SIGUIENTE RIVAL';
      const menu=document.createElement('button'); menu.className='btn small'; menu.textContent='MENÚ';
      menu.onclick=goToMenu;
      if(S.enemyIndex+1 < ENEMIES.length){
        next.onclick=()=>{ S.enemyIndex++; S.p2Def=ENEMIES[S.enemyIndex]; S.p2IsEnemy=true; advanceStage(); showVS(); };
        buttons.appendChild(next);
      } else {
        title.textContent='¡HAS DERROTADO A TODOS LOS COLEGIADOS!';
        text.textContent='Codegra vuelve a funcionar... por ahora. ¡Has desbloqueado a Miguelillo y Jesús Cuevas!';
        S.unlocked=true;
      }
      buttons.appendChild(menu);
    } else {
      title.textContent= winner==='draw' ? '¡EMPATE!' : '¡HAS PERDIDO!';
      text.textContent= S.p2Def.name+' '+S.p2Def.emoji+' se queda con tu silla. ¡Inténtalo de nuevo!';
      const retry=document.createElement('button'); retry.className='btn'; retry.textContent='REINTENTAR';
      retry.onclick=()=> startFight();
      const menu=document.createElement('button'); menu.className='btn small'; menu.textContent='MENÚ';
      menu.onclick=goToMenu;
      buttons.appendChild(retry); buttons.appendChild(menu);
    }
  }
  showScreen('screen-result');
}

/* =================== MODO ENTRENAMIENTO =================== */

function buildTrainingCharSelect(){
  const container = document.getElementById('training-char-select');
  if(!container) return;
  container.innerHTML = '';
  CHARACTERS.filter(c => !c.secret || S.unlocked).forEach(c => {
    const btn = document.createElement('button');
    btn.className = 'btn small';
    btn.style.cssText = 'padding:4px 8px;font-size:11px;margin:2px;';
    btn.textContent = c.name.split(' ')[0];
    btn.style.borderColor = c.color;
    if(S.p1Def && S.p1Def.id === c.id) btn.style.background = c.color + '55';
    btn.onclick = () => {
      S.p1Def = c;
      // Resaltar seleccionado
      container.querySelectorAll('button').forEach(b => b.style.background = '');
      btn.style.background = c.color + '55';
      document.getElementById('training-selected-name').textContent = c.name;
    };
    container.appendChild(btn);
  });
  // Mostrar nombre del personaje activo
  const nameEl = document.getElementById('training-selected-name');
  if(nameEl) nameEl.textContent = S.p1Def ? S.p1Def.name : CHARACTERS[0].name;
  if(!S.p1Def) S.p1Def = CHARACTERS[0];
}

function startTraining(){
  S.mode = 'training';
  // Si no hay personaje seleccionado, usar el primero por defecto
  if(!S.p1Def) S.p1Def = CHARACTERS[0];
  if(!S.p2Def) S.p2Def = CHARACTERS[1] || CHARACTERS[0];
  // En entrenamiento el P2 nunca es enemigo
  S.p2IsEnemy = false;
  S.fighters = [
    makeFighter(S.p1Def, 160, 1, false, 0),
    makeFighter(S.p2Def, CANVAS_W - 160 - 110, -1, false, 0),
  ];
  const [fp1, fp2] = S.fighters;
  fp1.introTargetX = fp1.x; fp1.x = fp1.x;
  fp2.introTargetX = fp2.x; fp2.x = fp2.x;
  S.fightPhase = 'fighting';
  S.projectiles = []; S.particles = [];
  S.timer = 999; S.timerAcc = 0; S.frame = 0;
  S.trainingConfig = {
    opponentType: document.getElementById('training-opponent')?.value || 'static',
    debugHitboxes: document.getElementById('debug-hitboxes')?.checked || false,
    debugHurtboxes: document.getElementById('debug-hurtboxes')?.checked || false,
  };
  document.getElementById('p1name').textContent = S.p1Def.name;
  document.getElementById('p2name').textContent = 'Muñeco de entrenamiento';
  document.getElementById('controls-hint').textContent =
    'ENTRENAMIENTO · A/D mover · W saltar · F/G golpe (mantener=carga) · H especial · S bloquear';
  document.getElementById('controls-hint').classList.remove('hidden');
  showScreen(null);
  S.running = true; S.paused = false;
  document.getElementById('pause-overlay').classList.add('hidden');
}

function getTrainingOpponentControls(f, opp){
  const c = {left:false,right:false,jump:false,punch:false,kick:false,special:false,block:false};
  if(!S.trainingConfig) return c;
  switch(S.trainingConfig.opponentType){
    case 'static': break;
    case 'passive':
      if(Math.random() < 0.005 && f.state !== 'block') c.block = true;
      break;
    case 'aggressive':
      if(Math.random() < 0.02) c.punch = true;
      else if(Math.random() < 0.02) c.kick = true;
      else if(Math.random() < 0.05) c.jump = true;
      break;
    case 'mirror':
      if(opp.state === 'punch' && opp.stateTimer > 8) c.punch = true;
      else if(opp.state === 'kick' && opp.stateTimer > 8) c.kick = true;
      else if(opp.state === 'jump') c.jump = true;
      break;
  }
  return c;
}

// Botones del menú de entrenamiento
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btn-training-fight')?.addEventListener('click', startTraining);
  document.getElementById('btn-back-training')?.addEventListener('click', goToMenu);
  document.getElementById('btn-refill-hp')?.addEventListener('click', () => {
    if(S.fighters && S.fighters[0]){
      S.fighters[0].hp = S.fighters[0].maxHp;
      document.getElementById('p1hp').style.width = '100%';
      document.getElementById('p1chip').style.width = '100%';
    }
  });
  document.getElementById('btn-refill-meter')?.addEventListener('click', () => {
    if(S.fighters && S.fighters[0]){
      S.fighters[0].meter = 100;
      document.getElementById('p1sp').style.width = '100%';
    }
  });
  document.getElementById('btn-reset-position')?.addEventListener('click', () => {
    if(S.fighters.length >= 2){
      S.fighters[0].x = 160; S.fighters[0].y = 0; S.fighters[0].vy = 0;
      S.fighters[1].x = CANVAS_W - 160 - 110; S.fighters[1].y = 0; S.fighters[1].vy = 0;
    }
  });
});

/* =================== ESTILO ARCADE RETRO 90s — aplicación de clases =================== */
document.addEventListener('DOMContentLoaded', () => {
  // Botones de pausa
  ['btn-resume','btn-restart-fight','btn-quit-fight'].forEach(id=>{
    const el = document.getElementById(id);
    if(el) el.classList.add('retro-btn');
  });
  // Botones de selección de modo (1P / 2P)
  ['btn-1p','btn-2p'].forEach(id=>{
    const el = document.getElementById(id);
    if(el) el.classList.add('retro-mode-card');
  });
  // Botón volver del menú de modo
  const backMode = document.getElementById('btn-back-mode');
  if(backMode) backMode.classList.add('retro-btn');
  // Botones de la pantalla de selección de personaje (volver / confirmar)
  document.querySelectorAll('#arcade-back-btn, #arcade-confirm-btn').forEach(el=>{
    el.classList.add('retro-btn');
  });
});
