/* =================== AUDIO (sintetizado, sin archivos externos) =================== */
const AudioEngine = (function(){
  let ctx=null, master=null, pauseFilter=null, musicOn=true, musicTimer=null, step=0, isPauseFiltered=false;

  function init(){
    if(ctx) return;
    try{
      ctx = new (window.AudioContext||window.webkitAudioContext)();
      master = ctx.createGain(); master.gain.value=0.22;

      /* ── Filtro "puerta cerrada" para efecto de pausa ──
         Lowpass muy agresivo + ligero recorte de agudos para simular
         que el sonido viene amortiguado, como desde otra habitación. */
      pauseFilter = ctx.createBiquadFilter();
      pauseFilter.type = 'lowpass';
      pauseFilter.frequency.value = 22000; // abierto = sin filtrar por defecto
      pauseFilter.Q.value = 0.7;

      master.connect(pauseFilter);
      pauseFilter.connect(ctx.destination);
    }catch(e){}
  }

  /**
   * Activa/desactiva el efecto "amortiguado" (como puerta cerrada).
   * Hace una rampa suave en lugar de un corte brusco para que suene natural.
   */
  function setMuffled(muffled){
    if(!ctx || !pauseFilter) return;
    isPauseFiltered = !!muffled;
    const t0 = ctx.currentTime;
    pauseFilter.frequency.cancelScheduledValues(t0);
    pauseFilter.frequency.setValueAtTime(pauseFilter.frequency.value, t0);
    if(muffled){
      // Corta agudos drásticamente y baja un poco el volumen general
      pauseFilter.frequency.linearRampToValueAtTime(420, t0 + 0.35);
      master.gain.cancelScheduledValues(t0);
      master.gain.setValueAtTime(master.gain.value, t0);
      master.gain.linearRampToValueAtTime(0.13, t0 + 0.35);
    } else {
      pauseFilter.frequency.linearRampToValueAtTime(22000, t0 + 0.25);
      master.gain.cancelScheduledValues(t0);
      master.gain.setValueAtTime(master.gain.value, t0);
      master.gain.linearRampToValueAtTime(0.22, t0 + 0.25);
    }
  }

  function tone(freq, dur, type, vol, when){
    if(!ctx) return;
    const o=ctx.createOscillator(), g=ctx.createGain();
    o.type=type||'square'; o.frequency.value=freq;
    const t0 = ctx.currentTime+(when||0);
    g.gain.setValueAtTime(vol||0.2, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0+dur);
    o.connect(g); g.connect(master);
    o.start(t0); o.stop(t0+dur+0.02);
  }

  function noiseBurst(dur, vol){
    if(!ctx) return;
    const bufSize = Math.floor(ctx.sampleRate*dur);
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for(let i=0;i<bufSize;i++) data[i] = (Math.random()*2-1) * (1-i/bufSize);
    const src = ctx.createBufferSource(); src.buffer=buf;
    const g = ctx.createGain(); g.gain.value=vol||0.25;
    src.connect(g); g.connect(master);
    src.start();
  }

  /* ---- SFX ---- */
  /* Nota: los SFX de golpes/acciones se silencian si el juego está en pausa,
     para que solo se oiga la música amortiguada (efecto "puerta cerrada"). */
  function sfxPunch(){ if(isPauseFiltered) return; init(); tone(190,0.07,'square',0.22); }
  function sfxKick(){ if(isPauseFiltered) return; init(); tone(110,0.13,'square',0.28); noiseBurst(0.06,0.12); }
  function sfxHit(){ if(isPauseFiltered) return; init(); tone(85,0.16,'triangle',0.28); }
  function sfxBlock(){ if(isPauseFiltered) return; init(); tone(260,0.07,'triangle',0.18); }
  function sfxParry(){ if(isPauseFiltered) return; init(); tone(520,0.05,'square',0.22); setTimeout(()=>tone(720,0.09,'square',0.22),40); }
  function sfxJump(){ if(isPauseFiltered) return; init(); tone(440,0.08,'sine',0.15); }

  function sfxSpecial(charId){
    if(isPauseFiltered) return;
    init();
    const cfg = CONFIG.SPECIAL_MUSIC && CONFIG.SPECIAL_MUSIC[charId];
    if(cfg && cfg.url){
      try{ const a=new Audio(cfg.url); a.volume=0.5; a.play(); }catch(e){}
      return;
    }
    if(cfg && cfg.notes && cfg.notes.length){
      const step = cfg.step || 0.1;
      cfg.notes.forEach((freq,i)=> tone(freq, step*1.5, cfg.type||'sawtooth', 0.25, i*step));
      return;
    }
    tone(330,0.18,'sawtooth',0.25,0);
    tone(440,0.18,'sawtooth',0.25,0.08);
    tone(660,0.22,'sawtooth',0.22,0.16);
    tone(880,0.3,'sawtooth',0.2,0.26);
  }

  function sfxWin(){
    init();
    [523,659,784,1046].forEach((f,i)=> tone(f,0.22,'square',0.22, i*0.13));
  }
  function sfxLose(){
    init();
    [392,330,262,196].forEach((f,i)=> tone(f,0.28,'sawtooth',0.2, i*0.15));
  }

  /* ---- MÚSICA: temas chiptune por pantalla/escenario ---- */

  const THEMES = {
    menu: {
      melody: [392,440,494,523,494,440,392,349, 392,440,494,523,587,523,494,440],
      bass:   [ 98, 98,110,110,110,110, 98, 87,  98, 98,110,110,131,131,110,110],
      stepDur:0.19, mType:'triangle', mVol:0.08, bType:'square', bVol:0.055,
    },
    recepcion: {
      melody: [440,494,523,440,392,440,494,523, 349,392,440,392,330,349,392,440],
      bass:   [110,110,131,110, 98,110,110,131,  87, 98,110, 98, 82, 87, 98,110],
      stepDur:0.22, mType:'sine', mVol:0.09, bType:'square', bVol:0.05,
    },
    salajuntas: {
      melody: [330,311,294,330,349,330,311,294, 262,277,294,311,330,311,294,277],
      bass:   [ 82, 82, 73, 82, 87, 82, 82, 73,  65, 69, 73, 82, 82, 82, 73, 69],
      stepDur:0.25, mType:'sawtooth', mVol:0.07, bType:'square', bVol:0.06,
    },
    archivo: {
      melody: [523,587,659,698,659,587,523,494, 440,494,523,587,523,494,440,415],
      bass:   [131,131,165,175,165,131,131,123, 110,123,131,131,131,123,110,103],
      stepDur:0.16, mType:'square', mVol:0.065, bType:'triangle', bVol:0.055,
    },
    salonactos: {
      melody: [523,659,784,659,523,784,659,523, 784,880,784,659,523,659,784,880],
      bass:   [131,165,196,165,131,196,165,131, 196,220,196,165,131,165,196,220],
      stepDur:0.20, mType:'triangle', mVol:0.075, bType:'square', bVol:0.06,
    },
  };

  let currentTheme = 'menu';

  function stopMusic(){
    if(musicTimer){ clearInterval(musicTimer); musicTimer=null; }
    step = 0;
  }

  function startMusic(themeKey){
    init();
    const key = themeKey || currentTheme || 'menu';
    if(musicTimer && currentTheme === key) return;
    stopMusic();
    currentTheme = key;
    if(!musicOn) return;
    const t = THEMES[key] || THEMES.menu;
    musicTimer = setInterval(()=>{
      if(!musicOn || !ctx) return;
      const i = step % t.melody.length;
      tone(t.melody[i], t.stepDur * 0.85, t.mType, t.mVol);
      if(i % 2 === 0) tone(t.bass[i], t.stepDur * 1.7, t.bType, t.bVol);
      step++;
    }, t.stepDur * 1000);
  }

  function toggleMusic(){ musicOn=!musicOn; if(musicOn) startMusic(currentTheme); else stopMusic(); return musicOn; }

  return {
    init, startMusic, stopMusic, toggleMusic, setMuffled,
    sfxPunch, sfxKick, sfxHit, sfxBlock, sfxParry, sfxJump, sfxSpecial, sfxWin, sfxLose,
    get musicOn(){ return musicOn; },
    get currentTheme(){ return currentTheme; },
    get isMuffled(){ return isPauseFiltered; }
  };
})();
