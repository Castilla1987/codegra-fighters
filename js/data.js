/* =================== DATA =================== */
const CHARACTERS = [
  {id:'marcos', name:'Marcos García', role:'Oficial Mayor', img:'marcos', color:'#2e86de',
   special:'Balones Fuera', specialType:'balones', secret:false, h:240},
  {id:'magdalena', name:'Magdalena Montes', role:'Coord. de Administración', img:'magdalena', color:'#e84393',
   special:'Queja Perturbadora', specialType:'queja', secret:false, h:240},
  {id:'javier', name:'Javier Castilla', role:'Administrativo', img:'javier', color:'#10ac84',
   special:'Salpicón de Marisco', specialType:'multitarea', secret:false, h:240},
  {id:'mariajo', name:'Mariajo Aceituno', role:'Comunicación y Prensa', img:'mariajo', color:'#e74c3c',
   special:'¡Estás Empanado!', specialType:'voces', secret:false, h:240},
  {id:'angeles', name:'Mª Ángeles Armilla', role:'Resp. de Formación', img:'angeles', color:'#9b59b6',
   special:'¿Seré Yo Mi Alma?', specialType:'cigarro', secret:false, h:240},
  {id:'miguelillo', name:'Miguelillo', role:'Fotógrafo (secreto)', img:'miguelillo', color:'#f39c12',
   special:'Flash Cegador', specialType:'blind', secret:true, h:170},
  {id:'jesus', name:'Jesús Cuevas', role:'Pdte. Jubilados (secreto)', img:'jesus', color:'#95a5a6',
   special:'Bastonazo Jubilado', specialType:'smash', secret:true, h:240},
];

const ENEMIES = [
  {id:'impaciente', name:'El Impaciente', emoji:'⏰', color:'#e67e22',
   special:'¡Llevo Esperando 2 Horas!', specialType:'rage'},
  {id:'pregunton', name:'El Preguntón', emoji:'📋', color:'#3498db',
   special:'¿Y Mi Colegiación?!', specialType:'projectile'},
  {id:'moroso', name:'El Moroso', emoji:'🪙', color:'#7f8c8d',
   special:'Te Pago El Mes Que Viene', specialType:'projectile'},
  {id:'ultimahora', name:'El de Última Hora', emoji:'🏃', color:'#c0392b',
   special:'¡Para Ayer!', specialType:'dash'},
  {id:'reincidente', name:'El Reincidente', emoji:'🔁', color:'#8e44ad',
   special:'Otra Vez Yo', specialType:'multihit'},
  ...(CONFIG.CUSTOM_ENEMIES||[]),
];

const STAGES = [
  {id:'recepcion', name:'Recepción', emoji:'🛎️', desc:'El mostrador de toda la vida'},
  {id:'salajuntas', name:'Sala de Juntas', emoji:'🪑', desc:'Donde se decide (casi) todo'},
  {id:'archivo', name:'Archivo', emoji:'🗄️', desc:'Papeleo hasta el techo'},
  {id:'salonactos', name:'Salón de Actos', emoji:'🎤', desc:'Photocall de Codegra'},
];

function advanceStage(){
  if(STAGES.length<2){ return; }
  const choices = STAGES.filter(s=>s.id!==S.stageId);
  const pick = choices[Math.floor(Math.random()*choices.length)];
  S.stageId = pick.id;
}
