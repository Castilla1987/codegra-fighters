/* =================== ALMACENAMIENTO LOCAL: ESTADÍSTICAS Y LOGROS =================== */
/* Incluir este script DESPUÉS de data.js y ANTES de main.js en el HTML:
   <script src="js/storage.js"></script>
*/

const PERSISTENT_DATA = {
  getDefaults(){
    return {
      version: '1.0',
      lastPlayed: Date.now(),
      totalPlayTime: 0,
      characterStats: {},      // { charId: {wins, losses, bestCombo, totalSpecialsUsed} }
      enemyProgress: {
        currentEnemyIndex: 0,
        unlockedSecretChars: false,
        stageVictories: {},
        perfectVictories: 0,
      },
      tournamentWins: 0,        // victorias acumuladas en modo 2P
      achievements: {
        first_win:        {unlocked:false},
        combo_master:      {unlocked:false, requirement:15},
        no_damage:         {unlocked:false, requirement:1},
        all_characters:    {unlocked:false},
        special_spammer:   {unlocked:false, requirement:50},
        tournament_winner: {unlocked:false, requirement:10},
      },
    };
  },

  load(){
    const saved = localStorage.getItem('codegraFightersSave');
    if(saved){
      try{
        const parsed = JSON.parse(saved);
        return Object.assign(this.getDefaults(), parsed);
      }catch(e){
        console.error('Error al cargar partida guardada:', e);
      }
    }
    return this.getDefaults();
  },

  save(data){
    try{
      data.lastPlayed = Date.now();
      localStorage.setItem('codegraFightersSave', JSON.stringify(data));
    }catch(e){
      console.error('Error al guardar partida:', e);
    }
  },

  _ensureChar(data, charId){
    if(!data.characterStats[charId]){
      data.characterStats[charId] = {wins:0, losses:0, bestCombo:0, totalSpecialsUsed:0};
    }
    return data.characterStats[charId];
  },

  incrementWins(charId){
    const data = this.load();
    this._ensureChar(data, charId).wins++;
    this.save(data);
    this.checkAchievement('first_win');
    this.checkAchievement('all_characters');
  },

  incrementLosses(charId){
    const data = this.load();
    this._ensureChar(data, charId).losses++;
    this.save(data);
  },

  updateBestCombo(charId, combo){
    const data = this.load();
    const stats = this._ensureChar(data, charId);
    if(combo > stats.bestCombo){
      stats.bestCombo = combo;
      this.save(data);
      this.checkAchievement('combo_master');
    }
  },

  addSpecialsUsed(charId, count){
    if(!count) return;
    const data = this.load();
    const stats = this._ensureChar(data, charId);
    stats.totalSpecialsUsed = (stats.totalSpecialsUsed||0) + count;
    this.save(data);
    this.checkAchievement('special_spammer');
  },

  registerPerfectVictory(){
    const data = this.load();
    data.enemyProgress.perfectVictories++;
    this.save(data);
    this.checkAchievement('no_damage');
  },

  registerTournamentWin(){
    const data = this.load();
    data.tournamentWins = (data.tournamentWins||0) + 1;
    this.save(data);
    this.checkAchievement('tournament_winner');
  },

  checkAchievement(achievementId){
    const data = this.load();
    const achievement = data.achievements[achievementId];
    if(!achievement || achievement.unlocked) return false;

    let unlocked = false;
    switch(achievementId){
      case 'first_win': {
        const totalWins = Object.values(data.characterStats).reduce((s,c)=>s+(c.wins||0),0);
        unlocked = totalWins >= 1;
        break;
      }
      case 'combo_master': {
        const best = Math.max(0, ...Object.values(data.characterStats).map(c=>c.bestCombo||0));
        unlocked = best >= achievement.requirement;
        break;
      }
      case 'no_damage':
        unlocked = data.enemyProgress.perfectVictories >= achievement.requirement;
        break;
      case 'all_characters': {
        const played = Object.keys(data.characterStats).filter(id=>data.characterStats[id].wins>0);
        unlocked = played.length >= CHARACTERS.length;
        break;
      }
      case 'special_spammer': {
        const total = Object.values(data.characterStats).reduce((s,c)=>s+(c.totalSpecialsUsed||0),0);
        unlocked = total >= achievement.requirement;
        break;
      }
      case 'tournament_winner':
        unlocked = (data.tournamentWins||0) >= achievement.requirement;
        break;
    }

    if(unlocked){
      achievement.unlocked = true;
      achievement.date = Date.now();
      this.save(data);
      showAchievementUnlocked(achievementId, achievement);
      return true;
    }
    return false;
  },
};

const ACHIEVEMENT_META = {
  first_win:        {icon:'🏆', title:'¡Primera Victoria!',        desc:'Gana tu primera partida.'},
  combo_master:      {icon:'🔥', title:'¡Maestro de Combo!',        desc:'Alcanza un combo de 15+ golpes.'},
  no_damage:         {icon:'🛡️', title:'¡Defensa Impenetrable!',   desc:'Gana una partida sin recibir daño.'},
  all_characters:    {icon:'👥', title:'¡Colección Completa!',      desc:'Gana al menos una vez con cada personaje.'},
  special_spammer:   {icon:'💥', title:'¡Especialista!',           desc:'Usa tu especial 50 veces o más.'},
  tournament_winner: {icon:'🏅', title:'¡Campeón de Torneo!',       desc:'Gana 10 partidas en modo 2 jugadores.'},
};

function showAchievementUnlocked(id, achievement){
  const meta = ACHIEVEMENT_META[id] || {icon:'✨', title:'Logro Desbloqueado', desc:''};
  if(typeof S !== 'undefined'){
    S.particles.push({
      type:'banner',
      text: meta.icon + ' ' + meta.title,
      sub: meta.desc,
      color:'#ffd23f',
      life:180, age:0,
    });
  }
  try{ AudioEngine.sfxWin(); }catch(e){}
}

/* =================== INICIALIZACIÓN =================== */
let persistentData = PERSISTENT_DATA.load();
persistentData.sessionStart = Date.now();

window.addEventListener('beforeunload', ()=>{
  const data = PERSISTENT_DATA.load();
  data.totalPlayTime = (data.totalPlayTime||0) + (Date.now() - (persistentData.sessionStart||Date.now()));
  PERSISTENT_DATA.save(data);
});

/* =================== PANTALLA DE LOGROS (helper para render) =================== */
function loadAndDisplayAchievements(containerId){
  const data = PERSISTENT_DATA.load();
  const container = document.getElementById(containerId);
  if(!container) return;
  container.innerHTML = '';
  Object.entries(data.achievements).forEach(([id, achievement])=>{
    const meta = ACHIEVEMENT_META[id] || {icon:'✨', title:id, desc:''};
    const div = document.createElement('div');
    div.style.cssText = `display:flex;align-items:center;gap:10px;padding:10px;margin:5px 0;border-radius:8px;
      background:${achievement.unlocked ? 'rgba(0,30,0,0.35)' : 'rgba(20,0,0,0.2)'};
      border:1px solid ${achievement.unlocked ? 'var(--accent2)' : '#555'};
      opacity:${achievement.unlocked ? '1' : '0.55'};`;
    div.innerHTML = `
      <span style="font-size:22px;">${meta.icon}</span>
      <div style="flex:1;color:var(--cream);">
        <strong>${meta.title}</strong><br><small>${meta.desc}</small>
      </div>`;
    container.appendChild(div);
  });
}
