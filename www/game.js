for(const k of ["abom", "agolem", "alchemist", "ancient", "archer", "axeman", "banshee", "bard", "bats", "battlenun", "bear", "bearrider", "berserk", "blade", "boar", "bomber", "bonecolossus", "bonedragon", "centaur", "colossus", "djinn", "dknight", "dragon", "dragonknight", "druid", "dryad", "dwarf", "dwarfxbow", "elfalch", "elfarcher", "enchantress", "ent", "fairydragon", "farcher", "fleshgolem", "gargoyle", "ghoul", "goblin", "goblin2", "golem", "griffin", "grunt", "hag", "harpy", "headless", "healer", "hero_banshee", "hero_druid", "hero_drummer", "hero_necro", "hero_paladin", "hero_smith", "hippo", "hunter", "icemage", "infernal", "jadeblade", "knight", "kodo", "lich", "mage", "merman", "mimic", "minib", "mummy", "necro", "ninja", "oberserk", "ogre", "ogreking", "paladin", "panther", "pikeman", "pirate", "plaguecart", "princess", "ranger", "raptor", "reaper", "repair", "rider", "rocketgob", "sapling", "sapper", "scrapgolem", "sentinel", "shadow", "shaman", "skarcher", "skel", "skmage", "skpirate", "slinger", "speardancer", "spiderbot", "spiders", "templar", "troll", "unicorn", "vampire", "vbat", "voodoo", "warboar", "warchief", "warlock", "warlord", "windrider", "wisp", "wolf", "wolf2", "wolfwhisper", "wraith", "wrider", "wyvern", "yeti", "zeppelin", "zombie"]){ if(ART_SRC[k+"_w1"]) ART_SRC[k]=ART_SRC[k+"_w1"]; if(ART_SRC["bk_"+k+"_w1"]) ART_SRC["bk_"+k]=ART_SRC["bk_"+k+"_w1"]; }
// ================= DATOS =================
const W = 18, H = 32, RT = 15, RB = 17, BRIDGES = [3.5, 9, 14.5], SIGHT = 5.5;
const ISLE = {x:9, y:16, r:1.25}, ANVIL_R = 2.4, ANVIL_BONUS = 0.3;
const TOWER_X = [3.5, 9, 14.5];
const frontY = (side, x) => side==='p' ? (x===9 ? 26.4 : 25.3) : (x===9 ? 5.6 : 6.7);
const KING_Y = {p:29.6, e:2.6};
const laneOf = x => x<6.25 ? 0 : x<11.75 ? 1 : 2;
let CBH = 0.75; const bridgeHalf = bx => bx===9 ? CBH : 0.95;
const nearestBridge = x => BRIDGES.reduce((p,c)=>Math.abs(x-c)<Math.abs(x-p)?c:p);

// rareza: 0 común, 1 rara, 2 fusión, 3 hechizo
const CARDS = {
  knight:  {name:'Caballero', cost:3, rar:0, hp:1400, dmg:170, hs:1.2, range:0.55, speed:1.05, r:0.5, count:1, targets:'any',
            desc:'Guerrero resistente cuerpo a cuerpo.'},
  archer:  {name:'Arqueras', cost:3, rar:0, hp:340, dmg:95, hs:1.0, range:5, speed:1.05, r:0.4, count:2, targets:'any', proj:'arrow',
            desc:'Dos arqueras que disparan a distancia.'},
  goblin:  {name:'Duendes', cost:2, rar:0, hp:175, dmg:95, hs:1.0, range:0.5, speed:1.75, r:0.36, count:3, targets:'any',
            desc:'Tres duendes muy rápidos.'},
  skel:    {name:'Esqueletos', cost:1, rar:0, hp:75, dmg:70, hs:1.0, range:0.45, speed:1.45, r:0.3, count:4, targets:'any',
            desc:'Cuatro esqueletos baratos para distraer.'},
  golem:   {name:'Gólem', cost:5, rar:1, hp:3300, dmg:225, hs:1.5, range:0.6, speed:0.6, r:0.8, count:1, targets:'buildings',
            desc:'Tanque enorme. Solo ataca edificios.'},
  mage:    {name:'Mago', cost:4, rar:1, hp:600, dmg:180, hs:1.5, range:5, speed:1.0, r:0.45, count:1, targets:'any', proj:'orb', splash:1.4,
            desc:'Lanza orbes con daño en área.'},
  boar:    {name:'Jabalí', cost:4, rar:1, hp:1300, dmg:255, hs:1.5, range:0.5, speed:1.95, r:0.55, count:1, targets:'buildings',
            desc:'Carga veloz contra las torres.'},
  bomber:  {name:'Bombardero', cost:3, rar:0, hp:340, dmg:190, hs:1.8, range:4.5, speed:1.0, r:0.4, count:1, targets:'any', proj:'bomb', splash:1.5,
            desc:'Lanza bombas que dañan en área.'},
  healer:  {name:'Sanadora', cost:4, rar:1, hp:650, dmg:80, hs:1.2, range:4, speed:1.0, r:0.42, count:1, targets:'any', proj:'orbg',
            heal:{amt:75, radius:3.5, every:1.0, self:true}, desc:'Cura a las tropas aliadas cercanas.'},
  bats:    {name:'Murciélagos', cost:2, rar:0, hp:85, dmg:60, hs:1.0, range:0.5, speed:2.0, r:0.3, count:4, targets:'any', air:true,
            desc:'Cuatro murciélagos voladores. El cuerpo a cuerpo no puede tocarlos.'},
  dragon:  {name:'Dragoncito', cost:4, rar:1, hp:950, dmg:115, hs:1.5, range:3.2, speed:1.2, r:0.55, count:1, targets:'any', air:true, proj:'dfire', splash:1.2,
            desc:'Vuela sobre el río y escupe fuego en área.'},
  hunter:  {name:'Cazador', cost:4, rar:1, hp:800, dmg:125, hs:1.0, range:5, speed:1.0, r:0.45, count:1, targets:'any', proj:'bolt', antiTank:3,
            desc:'Ballestero: hace daño triple a las tropas grandes (tanques).'},
  ballista:{name:'Ballesta', cost:4, rar:1, hp:1150, dmg:115, hs:0.8, range:7, speed:0, r:0.7, count:1, targets:'any', proj:'bolt', building:true, life:30,
            desc:'Edificio defensivo (30 s). Atrae a Gólems y Jabalíes y dispara lejos.'},
  frost:   {name:'Ventisca', cost:3, rar:3, spell:true, dmg:90, radius:2.8, towerMul:0.4, slowDur:4, instant:true, desc:'Daña y ralentiza a los enemigos durante 4 s.'},
  berserk: {name:'Berserker', cost:3, rar:0, hp:1000, dmg:130, hs:1.0, range:0.6, speed:1.2, r:0.5, count:1, targets:'any', rage:true,
            desc:'Guerrero salvaje: herido por debajo de la mitad, golpea y corre mucho más rápido.'},
  fireball:{name:'Bola de fuego', cost:4, rar:3, spell:true, dmg:520, radius:2.5, towerMul:0.35, desc:'Daño de área en cualquier lugar.'},
  zap:     {name:'Descarga', cost:2, rar:3, spell:true, dmg:170, radius:2.2, towerMul:0.4, stun:1.0, instant:true, desc:'Rayo instantáneo que aturde 1 s.'},
  // ===== FUSIONES =====
  agolem:  {name:'Gólem Arcano', cost:6, rar:2, hp:3900, dmg:250, hs:1.4, range:0.6, speed:0.62, r:0.85, count:1, targets:'buildings',
            stomp:{dmg:130, radius:2.2, every:2.2}, desc:'Gólem rúnico: pisotones que dañan a todo lo cercano.'},
  stampede:{name:'Estampida', cost:5, rar:2, hp:820, dmg:190, hs:1.3, range:0.5, speed:2.15, r:0.48, count:3, targets:'buildings', sprite:'minib',
            desc:'Tres jabalíes salvajes a toda velocidad.'},
  paladin: {name:'Paladín', cost:5, rar:2, hp:2100, dmg:180, hs:1.1, range:0.55, speed:1.0, r:0.55, count:1, targets:'any',
            heal:{amt:55, radius:3, every:1.0, self:true}, desc:'Tanque sagrado que cura a los aliados cercanos.'},
  farcher: {name:'Arqueras Ígneas', cost:4, rar:2, hp:360, dmg:110, hs:1.0, range:5.5, speed:1.05, r:0.4, count:2, targets:'any', proj:'firearrow', splash:1.1,
            desc:'Flechas de fuego con daño en área.'},
  necro:   {name:'Nigromante', cost:5, rar:2, hp:850, dmg:150, hs:1.4, range:5, speed:0.95, r:0.46, count:1, targets:'any', proj:'orbn',
            spawn:{key:'skel', n:2, every:3.5}, desc:'Invoca esqueletos sin parar.'},
  colossus:{name:'Coloso Bomba', cost:6, rar:2, hp:3000, dmg:200, hs:1.5, range:0.6, speed:0.6, r:0.82, count:1, targets:'buildings',
            deathBomb:{dmg:700, radius:3}, desc:'Al morir explota causando muchísimo daño.'},
  rider:   {name:'Jinete', cost:5, rar:2, hp:1800, dmg:200, hs:1.2, range:0.6, speed:1.7, r:0.6, count:1, targets:'any',
            charge:true, desc:'Caballero a lomos de jabalí. Su primer golpe hace doble daño.'},
  storm:   {name:'Tormenta', cost:5, rar:2, spell:true, dmg:420, radius:3.2, towerMul:0.35, stun:1.8, desc:'Gran área de daño que aturde 1,8 s.'},
  horde:   {name:'Horda', cost:3, rar:2, hp:190, dmg:100, hs:0.95, range:0.5, speed:1.8, r:0.36, count:6, targets:'any', sprite:'goblin2',
            desc:'Seis duendes con lanza. ¡Avalancha!'},
  bombbarr:{name:'Barril Explosivo', cost:4, rar:2, spell:true, dmg:380, radius:2.6, towerMul:0.5, spawnAfter:{key:'goblin', n:3}, desc:'Explota y suelta tres duendes.'},
  repair:  {name:'Herrero de Guardia', cost:4, rar:1, hp:600, dmg:0, hs:1, range:0.4, speed:1.35, r:0.45, count:1, targets:'any', repairer:{rate:70, dur:10}, sprite:'repair',
            desc:'Corre a tu torre más dañada y la repara 70 de vida por segundo durante 10 s.'},
  infernal:{name:'Dragón Infernal', cost:6, rar:2, hp:1450, dmg:150, hs:1.4, range:3.4, speed:1.15, r:0.7, count:1, targets:'any', air:true, proj:'dfire', splash:1.4,
            desc:'Dragón adulto: vuela y arrasa grupos enteros con fuego.'},
  mortar:  {name:'Torre de Morteros', cost:5, rar:2, hp:1250, dmg:220, hs:2.6, range:9, minRange:2.5, speed:0, r:0.75, count:1, targets:'any', proj:'bomb', splash:1.7, building:true, life:35,
            desc:'Edificio (35 s) que bombardea muy lejos. No puede disparar muy cerca.'},
  icemage: {name:'Mago de Hielo', cost:5, rar:2, hp:650, dmg:120, hs:1.4, range:5, speed:1.0, r:0.45, count:1, targets:'any', proj:'orbi', splash:1.3, slowOnHit:1.2,
            desc:'Orbes helados que dañan en área y ralentizan.'},
  warlord: {name:'Señor de la Guerra', cost:5, rar:2, hp:2100, dmg:170, hs:1.1, range:0.7, speed:1.05, r:0.6, count:1, targets:'any', splash:1.3, rage:true,
            desc:'Tanque con hacha: golpea en área y entra en furia al estar herido.'},
  // ===== ORCOS =====
  grunt:   {name:'Gruñón', cost:3, rar:0, fac:'orc', hp:1650, dmg:165, hs:1.2, range:0.6, speed:1.0, r:0.52, count:1, targets:'any',
            desc:'Guerrero orco duro y barato.'},
  axeman:  {name:'Lanzahachas', cost:3, rar:0, fac:'orc', hp:620, dmg:160, hs:1.1, range:5, speed:1.0, r:0.45, count:1, targets:'any', proj:'axe',
            desc:'Lanza hachas pesadas a media distancia.'},
  wolves:  {name:'Lobos', cost:3, rar:0, fac:'orc', hp:290, dmg:90, hs:0.9, range:0.5, speed:2.0, r:0.38, count:3, targets:'any', sprite:'wolf',
            desc:'Tres lobos rapidísimos.'},
  sapper:  {name:'Trasgos Zapadores', cost:2, rar:0, fac:'orc', hp:160, dmg:0, hs:1, range:0.3, speed:1.9, r:0.34, count:2, targets:'buildings', kamikaze:{dmg:380, radius:1.6},
            desc:'Corren hacia los edificios y explotan.'},
  shaman:  {name:'Chamán', cost:4, rar:1, fac:'orc', hp:760, dmg:95, hs:1.2, range:4.5, speed:1.0, r:0.44, count:1, targets:'any', proj:'orbr', hasteAura:{radius:3.6},
            desc:'Ansia de sangre: los aliados cercanos atacan y corren más rápido.'},
  wrider:  {name:'Jinete de Huargo', cost:4, rar:1, fac:'orc', hp:1250, dmg:250, hs:1.4, range:0.5, speed:1.85, r:0.58, count:1, targets:'buildings', leap:true,
            desc:'Salta el río por cualquier sitio y carga contra las torres.'},
  boulder: {name:'Roca de Catapulta', cost:4, rar:3, fac:'orc', spell:true, dmg:480, radius:2.2, towerMul:0.4, desc:'Una roca enorme cae del cielo.'},
  ogre:    {name:'Ogro', cost:5, rar:1, fac:'orc', hp:3150, dmg:250, hs:1.7, range:0.7, speed:0.75, r:0.82, count:1, targets:'any', splash:1.1,
            desc:'Tanque que pelea contra todo con golpes en área.'},
  totem:   {name:'Tótem de Guerra', cost:3, rar:1, fac:'orc', hp:900, dmg:0, hs:1, range:0, speed:0, r:0.6, count:1, targets:'any', building:true, life:30, dmgAura:{mul:1.45, radius:3.4}, heal:{amt:50, radius:3.4, every:1.0},
            desc:'Edificio (30 s): los aliados cercanos pegan +45% y se curan.'},
  bcry:    {name:'Grito de Guerra', cost:2, rar:3, fac:'orc', spell:true, dmg:0, radius:3.5, towerMul:0, allyBuff:{haste:5, dmg:1.3}, instant:true, desc:'Tus tropas en el área atacan más rápido y pegan +30% durante 5 s.'},
  // fusiones orcas
  warchief:{name:'Jefe de Guerra', cost:6, rar:2, fac:'orc', hp:2600, dmg:210, hs:1.15, range:0.65, speed:1.0, r:0.62, count:1, targets:'any', splash:1.0, hasteAura:{radius:3.5},
            desc:'Tanque orco con ansia de sangre para todo su ejército.'},
  ogremage:{name:'Ogro Mago', cost:6, rar:2, fac:'orc', hp:2100, dmg:170, hs:1.5, range:4.5, speed:0.8, r:0.82, count:1, targets:'any', proj:'orbr', splash:1.5,
            desc:'Ogro con magia: resistente y con daño en área a distancia.'},
  zeppelin:{name:'Zepelín Trasgo', cost:5, rar:2, fac:'orc', hp:1300, dmg:300, hs:1.8, range:1.0, speed:0.9, r:0.7, count:1, targets:'buildings', air:true, proj:'bomb', splash:1.6,
            desc:'Volador que bombardea las torres. Solo lo paran torres, distancia y hechizos.'},
  wildpack:{name:'Manada Salvaje', cost:5, rar:2, fac:'orc', hp:300, dmg:90, hs:0.85, range:0.5, speed:2.1, r:0.38, count:5, targets:'any', rage:true, sprite:'wolf2',
            desc:'Cinco lobos furiosos.'},
  catapult:{name:'Catapulta Orca', cost:5, rar:2, fac:'orc', hp:1200, dmg:260, hs:3.0, range:9.5, minRange:3, speed:0, r:0.8, count:1, targets:'any', proj:'rock', splash:1.6, building:true, life:35,
            desc:'Edificio (35 s) que lanza rocas muy lejos.'},
  warlock: {name:'Archimago', cost:6, rar:2, hp:900, dmg:220, hs:1.3, range:5.5, speed:1.0, r:0.5, count:1, targets:'any', proj:'orb', splash:1.8,
            heal:{amt:50, radius:3.5, every:1.0}, desc:'Mago y sanador a la vez. Muy poderoso.'},
  // ===== ORCOS (ampliación) =====
  troll:   {name:'Trol Lanzahachas', cost:4, rar:1, fac:'orc', hp:950, dmg:150, hs:1.1, range:5.5, speed:1.0, r:0.48, count:1, targets:'any', proj:'axe', regen:0.03,
            desc:'Lanza hachas de lejos y se regenera poco a poco (3% de vida por segundo).'},
  kodo:    {name:'Kodo de Guerra', cost:5, rar:1, fac:'orc', hp:2600, dmg:160, hs:1.4, range:0.7, speed:0.75, r:0.8, count:1, targets:'buildings', dmgAura:{mul:1.3, radius:3.2},
            desc:'Bestia enorme con tambores: solo ataca edificios y tus tropas cercanas pegan +30%.'},
  raider:  {name:'Saqueador', cost:3, rar:0, fac:'orc', hp:950, dmg:150, hs:1.2, range:0.5, speed:1.6, r:0.5, count:1, targets:'buildings', stealElixir:0.5,
            desc:'Corre a las torres. Cada golpe a un edificio te da medio elixir.'},
  wyvern:  {name:'Jinete de Wyvern', cost:4, rar:1, fac:'orc', hp:800, dmg:145, hs:1.2, range:2.5, speed:1.3, r:0.6, count:1, targets:'any', air:true, proj:'bolt',
            desc:'Orco volador que lanza jabalinas a aire y tierra.'},
  peon:    {name:'Barricada', cost:2, rar:0, fac:'orc', hp:1000, dmg:0, hs:1, range:0, speed:0, r:0.7, count:1, targets:'any', building:true, life:22,
            desc:'Un peón levanta una barricada (22 s) que atrae y frena a los enemigos.'},
  // ===== ELFOS =====
  elfarcher:{name:'Arqueras Elfas', cost:3, rar:0, fac:'elf', hp:320, dmg:100, hs:1.0, range:6.5, speed:1.15, r:0.4, count:2, targets:'any', proj:'arrow',
            desc:'Dos arqueras con el mayor alcance del juego.'},
  sentinel:{name:'Centinela', cost:3, rar:0, fac:'elf', hp:760, dmg:210, hs:1.1, range:0.55, speed:1.3, r:0.45, count:1, targets:'any', stealth:true,
            desc:'Asesina invisible: nadie puede atacarla hasta que da su primer golpe.'},
  blade:   {name:'Danzarina de Espadas', cost:3, rar:0, fac:'elf', hp:820, dmg:130, hs:0.8, range:0.6, speed:1.3, r:0.46, count:1, targets:'any', dodge:0.3,
            desc:'Muy rápida con sus dos espadas. Esquiva el 30% de los golpes.'},
  wisps:   {name:'Hadas', cost:2, rar:0, fac:'elf', hp:125, dmg:55, hs:1.0, range:2.2, speed:1.8, r:0.3, count:3, targets:'any', air:true, proj:'orbg', sprite:'wisp',
            desc:'Tres hadas voladoras que lanzan chispas a corta distancia.'},
  druid:   {name:'Druida', cost:4, rar:1, fac:'elf', hp:760, dmg:85, hs:1.2, range:4.5, speed:1.0, r:0.44, count:1, targets:'any', proj:'orbg',
            heal:{amt:45, radius:3.2, every:1.0, self:true}, transform:{at:0.4, key:'bear'},
            desc:'Cura a los aliados. Al quedar malherido se convierte en un oso enorme.'},
  bear:    {name:'Oso Druida', cost:4, rar:1, fac:'elf', hidden:true, hp:1500, dmg:190, hs:1.2, range:0.6, speed:1.0, r:0.62, count:1, targets:'any',
            desc:'Forma de oso del Druida.'},
  ent:     {name:'Ent', cost:5, rar:1, fac:'elf', hp:3200, dmg:220, hs:1.6, range:0.7, speed:0.55, r:0.82, count:1, targets:'any', rootOnHit:1.2, splash:0.9,
            desc:'Árbol viviente: cada golpe enraíza al enemigo y no le deja moverse.'},
  hippo:   {name:'Hipogrifo', cost:4, rar:1, fac:'elf', hp:920, dmg:150, hs:1.1, range:0.8, speed:1.6, r:0.6, count:1, targets:'any', air:true, hitsAir:true,
            desc:'Bestia voladora y rápida que ataca a aire y tierra.'},
  moontower:{name:'Torre Lunar', cost:4, rar:1, fac:'elf', hp:1100, dmg:120, hs:1.0, range:6.5, speed:0, r:0.7, count:1, targets:'any', proj:'orbm', building:true, life:30,
            heal:{amt:40, radius:3.5, every:1.0}, desc:'Edificio (30 s): dispara lejos y cura a tus tropas cercanas.'},
  starfall:{name:'Lluvia de Estrellas', cost:4, rar:3, fac:'elf', spell:true, dmg:480, radius:2.8, towerMul:0.35, desc:'Las estrellas caen sobre un área grande.'},
  roots:   {name:'Enredaderas', cost:3, rar:3, fac:'elf', spell:true, dmg:70, radius:2.8, towerMul:0.3, root:2.5, instant:true, desc:'Atrapa a las tropas de tierra 2,5 s: no pueden moverse.'},
  moonbless:{name:'Bendición Lunar', cost:3, rar:3, fac:'elf', spell:true, dmg:0, radius:3.5, towerMul:0, allyBuff:{heal:450}, instant:true, desc:'Cura 450 de vida a tus tropas del área.'},
  // ===== FUSIONES ÉLFICAS =====
  ancient: {name:'Ent Anciano', cost:6, rar:2, fac:'elf', hp:3700, dmg:230, hs:1.5, range:0.7, speed:0.58, r:0.88, count:1, targets:'any', rootOnHit:1.5,
            stomp:{dmg:110, radius:2.4, every:2.5, root:1.5}, desc:'Raíces que brotan del suelo: dañan y enraízan a todo lo cercano.'},
  dryad:   {name:'Reina Dríada', cost:5, rar:2, fac:'elf', hp:900, dmg:110, hs:1.2, range:4.5, speed:1.0, r:0.48, count:1, targets:'any', proj:'orbg',
            heal:{amt:50, radius:3.6, every:1.0, self:true}, spawn:{key:'wisps', n:1, every:6.5}, desc:'Gran sanadora que llama hadas sin parar.'},
  windrider:{name:'Jinete del Viento', cost:5, rar:2, fac:'elf', hp:1150, dmg:150, hs:1.1, range:4.5, speed:1.4, r:0.62, count:1, targets:'any', air:true, proj:'arrow', splash:0.9,
            desc:'Arquera a lomos de hipogrifo: vuela y dispara flechas que atraviesan grupos.'},
  shadow:  {name:'Sombra del Bosque', cost:5, rar:2, fac:'elf', hp:1300, dmg:240, hs:0.9, range:0.6, speed:1.4, r:0.5, count:1, targets:'any', stealth:true, dodge:0.35, charge:true,
            desc:'Invisible hasta atacar, esquiva el 35% y su primer golpe hace doble daño.'},
  starstorm:{name:'Cólera Estelar', cost:5, rar:2, fac:'elf', spell:true, dmg:430, radius:3.2, towerMul:0.35, root:2, desc:'Una lluvia de estrellas gigante que además enraíza 2 s.'},
};
// ===== NO MUERTOS =====
Object.assign(CARDS, {
  zombie:  {name:'Zombis', cost:3, rar:0, fac:'undead', hp:560, dmg:95, hs:1.3, range:0.5, speed:0.75, r:0.45, count:2, targets:'any',
            desc:'Dos zombis lentos pero muy duros.'},
  ghoul:   {name:'Necrófago', cost:3, rar:0, fac:'undead', hp:780, dmg:120, hs:0.9, range:0.5, speed:1.6, r:0.46, count:1, targets:'any', lifesteal:0.5,
            desc:'Rápido y hambriento: se cura la mitad del daño que hace.'},
  skarcher:{name:'Arqueros Esqueleto', cost:3, rar:0, fac:'undead', hp:210, dmg:78, hs:1.0, range:5, speed:1.1, r:0.38, count:3, targets:'any', proj:'arrow',
            desc:'Tres arqueros esqueleto frágiles que disparan a distancia.'},
  vbat:    {name:'Murciélagos Vampiro', cost:3, rar:0, fac:'undead', hp:150, dmg:70, hs:0.9, range:0.5, speed:2.0, r:0.32, count:3, targets:'any', air:true, lifesteal:0.6,
            desc:'Tres murciélagos voladores que chupan vida al morder.'},
  banshee: {name:'Banshee', cost:4, rar:1, fac:'undead', hp:620, dmg:85, hs:1.4, range:3.5, speed:1.15, r:0.45, count:1, targets:'any', air:true, proj:'orbn', splash:1.8, slowOnHit:1.0,
            desc:'Fantasma volador: su grito daña en área y ralentiza.'},
  dknight: {name:'Caballero de la Muerte', cost:5, rar:1, fac:'undead', hp:2100, dmg:190, hs:1.2, range:0.6, speed:1.0, r:0.6, count:1, targets:'any', splash:0.9, lifesteal:0.25,
            desc:'Tanque oscuro: golpea en área y roba vida.'},
  abom:    {name:'Abominación', cost:5, rar:1, fac:'undead', hp:3300, dmg:180, hs:1.6, range:0.6, speed:0.65, r:0.82, count:1, targets:'buildings', deathBomb:{dmg:380, radius:2.6, fx:'fx_veneno'},
            desc:'Montaña de carne que va a por las torres. Al morir revienta en una nube tóxica.'},
  lich:    {name:'Lich', cost:4, rar:1, fac:'undead', hp:620, dmg:165, hs:1.5, range:5, speed:1.0, r:0.45, count:1, targets:'any', proj:'orbi', splash:1.3, slowOnHit:1.3,
            desc:'Mago no muerto: orbes helados en área que ralentizan.'},
  tombstone:{name:'Lápida', cost:3, rar:1, fac:'undead', hp:900, dmg:0, hs:1, range:0, speed:0, r:0.6, count:1, targets:'any', building:true, life:30, spawn:{key:'skel', n:1, every:2.8},
            desc:'Edificio (30 s) del que salen esqueletos sin parar.'},
  plague:  {name:'Plaga', cost:4, rar:3, fac:'undead', spell:true, dmg:470, radius:2.6, towerMul:0.35, desc:'Una nube tóxica cae sobre un área.'},
  curse:   {name:'Maldición', cost:3, rar:3, fac:'undead', spell:true, dmg:80, radius:3.0, towerMul:0.3, weaken:5, instant:true, desc:'Daña y debilita: los enemigos del área pegan un 40% menos durante 5 s.'},
  gravehands:{name:'Alzar Muertos', cost:3, rar:3, fac:'undead', spell:true, dmg:60, radius:2.2, towerMul:0.3, instant:true, spawnAfter:{key:'skel', n:4}, desc:'Daña un poco y levanta cuatro esqueletos de la tierra.'},
  // fusiones no muertas
  bonedragon:{name:'Dragón de Hueso', cost:6, rar:2, fac:'undead', hp:1500, dmg:150, hs:1.4, range:3.4, speed:1.15, r:0.7, count:1, targets:'any', air:true, proj:'dfire', splash:1.4,
            desc:'Dragón esquelético que escupe fuego de almas en área.'},
  reaper:  {name:'Segador', cost:5, rar:2, fac:'undead', hp:1350, dmg:230, hs:1.1, range:0.8, speed:1.25, r:0.55, count:1, targets:'any', splash:1.3, lifesteal:0.35,
            desc:'Su guadaña barre a todo lo cercano y le devuelve vida.'},
  plaguecart:{name:'Carro de la Plaga', cost:5, rar:2, fac:'undead', hp:2300, dmg:200, hs:1.5, range:0.6, speed:0.9, r:0.75, count:1, targets:'buildings', deathBomb:{dmg:520, radius:3, fx:'fx_veneno'},
            desc:'Carro apestoso que va a por las torres y estalla en veneno al romperse.'},
  vampire: {name:'Señor Vampiro', cost:6, rar:2, fac:'undead', hp:1700, dmg:200, hs:1.0, range:0.6, speed:1.1, r:0.55, count:1, targets:'any', lifesteal:0.5, spawn:{key:'vbat', n:1, every:6},
            desc:'Roba mucha vida y llama a murciélagos vampiro.'},
  skmage:  {name:'Mago Esqueleto', cost:5, rar:2, fac:'undead', hp:850, dmg:150, hs:1.4, range:5, speed:1.0, r:0.46, count:1, targets:'any', proj:'orbn', splash:1.2, spawn:{key:'skel', n:1, every:4.5},
            desc:'Hechicero óseo: orbes de almas en área y esqueletos sin parar.'},
  soulstorm:{name:'Tormenta de Almas', cost:5, rar:2, fac:'undead', spell:true, dmg:420, radius:3.2, towerMul:0.35, weaken:4, desc:'Un remolino de almas: mucho daño en área y debilita 4 s.'},
});
// ===== TEMPORADA 2 (cartas nuevas desbloqueables) =====
Object.assign(CARDS, {
  // humanos
  pikeman: {name:'Piquero', cost:3, rar:0, s2:1, hp:900, dmg:135, hs:1.2, range:1.2, speed:1.0, r:0.48, count:1, targets:'any', antiTank:2,
            desc:'Lanza larga: golpea desde más lejos y hace doble daño a tropas grandes.'},
  battlenun:{name:'Monja Guerrera', cost:4, rar:1, s2:1, hp:1150, dmg:140, hs:1.1, range:0.6, speed:1.05, r:0.48, count:1, targets:'any', heal:{amt:40, radius:3, every:1.0, self:true},
            desc:'Pelea con su maza y cura a los aliados cercanos.'},
  gnomeeng:{name:'Torreta Gnoma', cost:3, rar:0, s2:1, hp:750, dmg:70, hs:0.55, range:5.5, speed:0, r:0.6, count:1, targets:'any', proj:'bolt', building:true, life:28,
            desc:'Una ingeniera planta una torreta (28 s) que dispara muy rápido.'},
  griffin: {name:'Jinete de Grifo', cost:5, rar:1, s2:1, hp:1150, dmg:180, hs:1.2, range:0.8, speed:1.6, r:0.62, count:1, targets:'any', air:true, hitsAir:true, charge:true,
            desc:'Vuela rápido, ataca a aire y tierra y su primer golpe hace doble daño.'},
  bard:    {name:'Bardo', cost:3, rar:1, s2:1, hp:650, dmg:60, hs:1.0, range:3.5, speed:1.0, r:0.44, count:1, targets:'any', proj:'orbg', hasteAura:{radius:3.5},
            desc:'Su música hace que los aliados cercanos ataquen y corran más rápido.'},
  bcannon: {name:'Cañón', cost:3, rar:0, s2:1, hp:850, dmg:135, hs:1.0, range:5.5, speed:0, r:0.7, count:1, targets:'any', proj:'cannon', building:true, life:30,
            desc:'Edificio (30 s) barato que dispara balas de cañón.'},
  templar: {name:'Templario', cost:4, rar:1, s2:1, hp:1550, dmg:205, hs:1.4, range:0.7, speed:0.95, r:0.52, count:1, targets:'any', splash:1.0,
            desc:'Guerrero sagrado con espadón: golpes en área.'},
  princess:{name:'Princesa Arquera', cost:3, rar:1, s2:1, hp:320, dmg:105, hs:1.0, range:8, speed:1.0, r:0.4, count:1, targets:'any', proj:'firearrow', splash:1.0,
            desc:'Dispara flechas de fuego desde muy, muy lejos.'},
  dragonknight:{name:'Caballero Dragón', cost:6, rar:2, s2:1, hp:1750, dmg:170, hs:1.3, range:3, speed:1.2, r:0.7, count:1, targets:'any', air:true, proj:'dfire', splash:1.2,
            desc:'Caballero a lomos de dragón: resistente, vuela y quema en área.'},
  // orcos
  oberserk:{name:'Berserker Orco', cost:4, rar:0, fac:'orc', s2:1, hp:1250, dmg:150, hs:0.85, range:0.6, speed:1.25, r:0.52, count:1, targets:'any', rage:true,
            desc:'Dos hachas y mucha furia: herido, pega y corre aún más.'},
  slinger: {name:'Honderos', cost:2, rar:0, fac:'orc', s2:1, hp:200, dmg:70, hs:1.0, range:4.5, speed:1.3, r:0.36, count:2, targets:'any', proj:'rock', splash:0.6,
            desc:'Dos duendes con honda baratos.'},
  raptor:  {name:'Jinete de Raptor', cost:4, rar:1, fac:'orc', s2:1, hp:1000, dmg:165, hs:1.0, range:0.6, speed:2.0, r:0.58, count:1, targets:'any', leap:true,
            desc:'Rapidísimo: salta el río por cualquier sitio.'},
  harpy:   {name:'Arpías', cost:3, rar:0, fac:'orc', s2:1, hp:300, dmg:85, hs:1.0, range:0.6, speed:1.8, r:0.42, count:2, targets:'any', air:true,
            desc:'Dos arpías voladoras con garras.'},
  voodoo:  {name:'Médico Brujo', cost:4, rar:1, fac:'orc', s2:1, hp:720, dmg:90, hs:1.2, range:4.5, speed:1.0, r:0.44, count:1, targets:'any', proj:'orbr', weakenOnHit:2, heal:{amt:45, radius:3.2, every:1.0, self:true},
            desc:'Cura a los aliados y sus maldiciones hacen que el enemigo pegue menos.'},
  rocketgob:{name:'Duende Cohete', cost:3, rar:0, fac:'orc', s2:1, hp:420, dmg:0, hs:1, range:0.3, speed:2.3, r:0.45, count:1, targets:'buildings', air:true, kamikaze:{dmg:500, radius:1.6},
            desc:'Vuela directo a un edificio y explota.'},
  scrapgolem:{name:'Gólem de Chatarra', cost:5, rar:1, fac:'orc', s2:1, hp:2900, dmg:200, hs:1.5, range:0.6, speed:0.7, r:0.8, count:1, targets:'buildings', deathBomb:{dmg:350, radius:2.2},
            desc:'Montón de chatarra que va a por las torres y explota al caer.'},
  warboar: {name:'Jabalí de Guerra', cost:5, rar:1, fac:'orc', s2:1, hp:2000, dmg:250, hs:1.5, range:0.6, speed:1.8, r:0.7, count:1, targets:'buildings', charge:true,
            desc:'Jabalí acorazado: carga contra las torres con doble daño en el primer golpe.'},
  ogreking:{name:'Rey Ogro', cost:6, rar:2, fac:'orc', s2:1, hp:3800, dmg:250, hs:1.4, range:0.8, speed:0.8, r:0.9, count:1, targets:'any', splash:1.3, rage:true, hasteAura:{radius:3},
            desc:'Dos cabezas, dos garrotes: golpes en área, furia y ansia de sangre.'},
  // elfos
  ranger:  {name:'Exploradora', cost:3, rar:0, fac:'elf', s2:1, hp:460, dmg:80, hs:0.7, range:5.5, speed:1.15, r:0.42, count:1, targets:'any', proj:'arrow',
            desc:'Dispara muy rápido con ayuda de su halcón.'},
  unicorn: {name:'Unicornio', cost:5, rar:1, fac:'elf', s2:1, hp:1800, dmg:175, hs:1.2, range:0.6, speed:1.4, r:0.62, count:1, targets:'any', charge:true, heal:{amt:50, radius:3, every:1.0, self:true},
            desc:'Carga con su cuerno y cura a los aliados cercanos.'},
  fairydragon:{name:'Dragón Hada', cost:3, rar:0, fac:'elf', s2:1, hp:380, dmg:75, hs:1.0, range:2.5, speed:1.6, r:0.42, count:1, targets:'any', air:true, proj:'orbg', splash:0.9,
            desc:'Pequeño dragón volador con chispas en área.'},
  wolfwhisper:{name:'Susurradora de Lobos', cost:5, rar:1, fac:'elf', s2:1, hp:950, dmg:110, hs:1.0, range:0.6, speed:1.1, r:0.5, count:1, targets:'any', spawn:{key:'wolves', n:2, every:7},
            desc:'Pelea junto a lobos plateados y llama a más cada poco.'},
  jadeblade:{name:'Guerrera de Jade', cost:4, rar:0, fac:'elf', s2:1, hp:1300, dmg:155, hs:1.0, range:0.9, speed:1.15, r:0.5, count:1, targets:'any', dodge:0.2, splash:0.8,
            desc:'Su guja barre en área y esquiva el 20% de los golpes.'},
  panther: {name:'Pantera Sombría', cost:3, rar:0, fac:'elf', s2:1, hp:700, dmg:165, hs:0.9, range:0.5, speed:1.9, r:0.48, count:1, targets:'any', stealth:true,
            desc:'Invisible y veloz hasta que da su primer zarpazo.'},
  sapling: {name:'Retoño', cost:2, rar:0, fac:'elf', s2:1, hp:900, dmg:70, hs:1.2, range:0.5, speed:0.8, r:0.45, count:1, targets:'any', rootOnHit:0.8,
            desc:'Arbolito barato y duro: cada golpe enraíza un momento.'},
  enchantress:{name:'Encantadora', cost:4, rar:1, fac:'elf', s2:1, hp:650, dmg:135, hs:1.3, range:5, speed:1.0, r:0.44, count:1, targets:'any', proj:'orbm', splash:1.2, weakenOnHit:2,
            desc:'Runas mágicas en área que debilitan al enemigo.'},
  speardancer:{name:'Danzarina de Lanza', cost:4, rar:1, fac:'elf', s2:1, hp:900, dmg:140, hs:0.9, range:1.3, speed:1.4, r:0.46, count:1, targets:'any', leap:true, dodge:0.25,
            desc:'Salta el río por cualquier sitio y esquiva el 25%.'},
  hawkrider:{name:'Jinete de Halcón', cost:4, rar:1, fac:'elf', s2:1, hp:760, dmg:120, hs:1.0, range:3.5, speed:1.6, r:0.55, count:1, targets:'any', air:true, proj:'arrow',
            desc:'Elfo volador que dispara a aire y tierra.'},
  elfalch: {name:'Alquimista Elfa', cost:3, rar:0, fac:'elf', s2:1, hp:450, dmg:130, hs:1.5, range:4.5, speed:1.0, r:0.42, count:1, targets:'any', proj:'bomb', splash:1.3,
            desc:'Lanza pociones que estallan en área.'},
  moonwell:{name:'Pozo Lunar', cost:4, rar:1, fac:'elf', s2:1, hp:1000, dmg:0, hs:1, range:0, speed:0, r:0.7, count:1, targets:'any', building:true, life:35, heal:{amt:60, radius:3.8, every:1.0},
            desc:'Edificio (35 s) que cura mucho a tus tropas cercanas.'},
  thornwall:{name:'Muro de Espinas', cost:3, rar:0, fac:'elf', s2:1, hp:1400, dmg:55, hs:0.8, range:1.0, speed:0, r:0.7, count:1, targets:'any', building:true, life:25, splash:1.3,
            desc:'Edificio (25 s) que atrae al enemigo y pincha a todo el que se acerca.'},
  treehouse:{name:'Casa del Árbol', cost:5, rar:1, fac:'elf', s2:1, hp:1500, dmg:110, hs:1.0, range:7, speed:0, r:0.8, count:1, targets:'any', proj:'arrow', building:true, life:40,
            desc:'Edificio (40 s) con vigía que dispara desde muy lejos.'},
  healrain:{name:'Lluvia Sanadora', cost:4, rar:3, fac:'elf', s2:1, spell:true, dmg:0, radius:4.2, towerMul:0, allyBuff:{heal:650}, instant:true, desc:'Una nube cura 650 de vida a tus tropas en un área grande.'},
  phoenix: {name:'Fénix del Bosque', cost:6, rar:2, fac:'elf', s2:1, hp:1300, dmg:140, hs:1.3, range:3, speed:1.3, r:0.65, count:1, targets:'any', air:true, proj:'dfire', splash:1.3, reborn:0.5,
            desc:'Vuela y quema en área. Al morir renace una vez con la mitad de vida.'},
  // no muertos
  gargoyle:{name:'Gárgola', cost:4, rar:1, fac:'undead', s2:1, hp:1100, dmg:135, hs:1.1, range:0.7, speed:1.3, r:0.55, count:1, targets:'any', air:true, hitsAir:true,
            desc:'Piedra voladora: ataca a aire y tierra y aguanta mucho.'},
  mummy:   {name:'Momia', cost:3, rar:0, fac:'undead', s2:1, hp:1200, dmg:105, hs:1.2, range:0.5, speed:0.8, r:0.48, count:1, targets:'any', weakenOnHit:2,
            desc:'Sus vendas malditas hacen que el enemigo pegue menos.'},
  wraith:  {name:'Espectro', cost:3, rar:0, fac:'undead', s2:1, hp:550, dmg:115, hs:1.0, range:0.6, speed:1.4, r:0.45, count:1, targets:'any', air:true, slowOnHit:1.0,
            desc:'Fantasma volador encadenado: sus golpes ralentizan.'},
  spiders: {name:'Arañas de Cripta', cost:2, rar:0, fac:'undead', s2:1, hp:160, dmg:62, hs:0.9, range:0.5, speed:1.9, r:0.34, count:3, targets:'any', slowOnHit:0.8,
            desc:'Tres arañas rápidas cuyas picaduras ralentizan.'},
  headless:{name:'Jinete sin Cabeza', cost:5, rar:1, fac:'undead', s2:1, hp:1550, dmg:225, hs:1.2, range:0.6, speed:1.8, r:0.62, count:1, targets:'any', charge:true,
            desc:'Galopa veloz: su primer golpe hace doble daño.'},
  hag:     {name:'Bruja del Caldero', cost:4, rar:1, fac:'undead', s2:1, hp:700, dmg:100, hs:1.3, range:4.5, speed:0.95, r:0.46, count:1, targets:'any', proj:'orbn', splash:1.4, slowOnHit:1.0,
            desc:'Lanza pócimas que dañan en área y ralentizan.'},
  fleshgolem:{name:'Gólem de Carne', cost:5, rar:1, fac:'undead', s2:1, hp:3400, dmg:205, hs:1.5, range:0.6, speed:0.65, r:0.82, count:1, targets:'buildings', regen:0.015,
            desc:'Tanque cosido que va a por las torres y se regenera poco a poco.'},
  skpirate:{name:'Pirata Esqueleto', cost:2, rar:0, fac:'undead', s2:1, hp:450, dmg:110, hs:1.0, range:0.5, speed:1.4, r:0.42, count:1, targets:'any',
            desc:'Barato y con mal genio.'},
  bonecolossus:{name:'Coloso de Hueso', cost:6, rar:2, fac:'undead', s2:1, hp:4000, dmg:240, hs:1.5, range:0.7, speed:0.55, r:0.9, count:1, targets:'buildings', splash:1.1, spawn:{key:'skel', n:2, every:5},
            desc:'Gigante hecho de esqueletos: va a por las torres y suelta esqueletos.'},
});
// ===== MERCENARIOS (neutrales: se contratan en la tienda, valen para cualquier bando) =====
Object.assign(CARDS, {
  pirate:  {name:'Capitán Pirata', cost:4, rar:1, fac:'merc', hp:1000, dmg:185, hs:1.4, range:3.5, speed:1.0, r:0.5, count:1, targets:'any', proj:'cannon', splash:0.9, desc:'Dispara su trabuco con daño en área.'},
  dwarf:   {name:'Enano del Martillo', cost:4, rar:1, fac:'merc', hp:1650, dmg:175, hs:1.3, range:0.6, speed:0.9, r:0.5, count:1, targets:'any', stomp:{dmg:100, radius:1.8, every:3}, desc:'Bajito y durísimo: cada poco golpea el suelo y daña a su alrededor.'},
  ninja:   {name:'Ninja', cost:3, rar:1, fac:'merc', hp:650, dmg:175, hs:0.7, range:0.5, speed:1.7, r:0.42, count:1, targets:'any', stealth:true, dodge:0.3, desc:'Invisible hasta atacar y esquiva el 30%.'},
  yeti:    {name:'Yeti', cost:5, rar:1, fac:'merc', hp:2800, dmg:215, hs:1.5, range:0.7, speed:0.8, r:0.82, count:1, targets:'any', splash:1.1, slowOnHit:1.5, desc:'Bestia de las nieves: golpes en área que congelan.'},
  merman:  {name:'Tritón', cost:3, rar:1, fac:'merc', hp:1000, dmg:140, hs:1.1, range:1.3, speed:1.1, r:0.5, count:1, targets:'any', leap:true, desc:'Cruza el río a nado por cualquier sitio.'},
  alchemist:{name:'Alquimista', cost:4, rar:1, fac:'merc', hp:600, dmg:125, hs:1.4, range:4.5, speed:1.0, r:0.44, count:1, targets:'any', proj:'bomb', splash:1.5, slowOnHit:1.0, desc:'Pociones que estallan en área y ralentizan.'},
  bearrider:{name:'Jinete de Oso', cost:5, rar:1, fac:'merc', hp:2000, dmg:205, hs:1.2, range:0.6, speed:1.3, r:0.68, count:1, targets:'any', charge:true, desc:'Carga a lomos de un oso: el primer golpe hace doble daño.'},
  mimic:   {name:'Mímico', cost:3, rar:1, fac:'merc', hp:1300, dmg:190, hs:1.2, range:0.5, speed:1.0, r:0.52, count:1, targets:'any', stealth:true, desc:'Parece un cofre… hasta que muerde.'},
  djinn:   {name:'Genio', cost:5, rar:1, fac:'merc', hp:1000, dmg:160, hs:1.4, range:4, speed:1.0, r:0.55, count:1, targets:'any', air:true, proj:'orb', splash:1.6, desc:'Flota y lanza magia con gran daño en área.'},
  dwarfxbow:{name:'Ballestero Enano', cost:3, rar:1, fac:'merc', hp:700, dmg:115, hs:1.0, range:5.5, speed:0.9, r:0.44, count:1, targets:'any', proj:'bolt', antiTank:2, desc:'Virotes que hacen doble daño a las tropas grandes.'},
  spiderbot:{name:'Araña Mecánica', cost:4, rar:1, fac:'merc', hp:1100, dmg:115, hs:1.0, range:4, speed:1.2, r:0.55, count:1, targets:'any', proj:'bolt', leap:true, desc:'Un gnomo inventor en su araña: trepa el río por cualquier sitio.'},
  centaur: {name:'Centauro Arquero', cost:4, rar:1, fac:'merc', hp:1000, dmg:120, hs:1.0, range:5, speed:1.6, r:0.6, count:1, targets:'any', proj:'arrow', desc:'Arquero rápido y resistente.'},
});
// ===== HÉROES (2 por bando; se elige uno al empezar la aventura) =====
// Cada héroe: una pasiva para toda la aventura + entrar en batalla una vez (cuesta 4 de elixir) con una habilidad al llegar.
Object.assign(CARDS, {
  h_smith:    {name:'Maestra Herrera', cost:4, rar:2, hero:'smith', hidden:true, sprite:'hero_smith', art:'por_smith', hp:1900, dmg:185, hs:1.2, range:0.6, speed:1.0, r:0.56, count:1, targets:'any', stomp:{dmg:120, radius:2.0, every:3},
               desc:'Entra con su martillo: golpea el suelo en área. Al llegar repara 350 de vida a todas tus torres.'},
  h_paladin:  {name:'Capitán Paladín', cost:4, rar:2, hero:'paladin', hidden:true, sprite:'hero_paladin', art:'por_paladin', hp:2300, dmg:165, hs:1.1, range:0.6, speed:1.0, r:0.56, count:1, targets:'any', heal:{amt:50, radius:3.2, every:1.0, self:true},
               desc:'Tanque que cura. Al llegar da un escudo de 400 a tus tropas cercanas.'},
  h_drummer:  {name:'Grom Tambor de Guerra', cost:4, rar:2, hero:'drummer', hidden:true, sprite:'hero_drummer', art:'por_drummer', hp:2100, dmg:170, hs:1.1, range:0.7, speed:1.0, r:0.6, count:1, targets:'any', splash:1.0, hasteAura:{radius:4},
               desc:'Orco con tambores de guerra. Al llegar, TODAS tus tropas pegan +30% y atacan más rápido 6 s.'},
  h_huntress: {name:'Vashka la Cazadora', cost:4, rar:2, hero:'huntress', hidden:true, sprite:'hero_huntress', art:'por_huntress', hp:1150, dmg:150, hs:1.0, range:5, speed:1.15, r:0.5, count:1, targets:'any', proj:'bolt', antiTank:2,
               desc:'Lanza jabalinas (doble daño a tropas grandes). Al llegar llama a tres lobos.'},
  h_moonarcher:{name:'Thalion Arquero Lunar', cost:4, rar:2, hero:'moonarcher', hidden:true, sprite:'hero_moonarcher', art:'por_moonarcher', hp:950, dmg:140, hs:0.8, range:7, speed:1.1, r:0.46, count:1, targets:'any', proj:'arrow',
               desc:'El mejor arquero. Al llegar lanza una lluvia de flechas (320) sobre el mayor grupo enemigo.'},
  h_druid:    {name:'Lirael la Druida', cost:4, rar:2, hero:'druid', hidden:true, sprite:'hero_druid', art:'por_druid', hp:1050, dmg:90, hs:1.2, range:4.5, speed:1.0, r:0.48, count:1, targets:'any', proj:'orbg', heal:{amt:65, radius:3.8, every:1.0, self:true},
               desc:'Gran sanadora. Al llegar enraíza 3 s a todas las tropas de tierra enemigas en tu mitad.'},
  h_necro:    {name:'Malgor el Nigromante', cost:4, rar:2, hero:'necro', hidden:true, sprite:'hero_necro', art:'por_necro', hp:1050, dmg:145, hs:1.4, range:5, speed:0.95, r:0.48, count:1, targets:'any', proj:'orbn', spawn:{key:'skel', n:2, every:4.5},
               desc:'Invoca esqueletos sin parar. Al llegar levanta cinco esqueletos.'},
  h_banshee:  {name:'Lady Vespera la Banshee', cost:4, rar:2, hero:'banshee', hidden:true, sprite:'hero_banshee', art:'por_banshee', hp:1100, dmg:110, hs:1.3, range:3.5, speed:1.2, r:0.48, count:1, targets:'any', air:true, proj:'orbn', splash:1.8,
               desc:'Vuela y grita en área. Al llegar aturde 1,5 s y debilita 4 s a los enemigos a su alrededor.'},
});
const HEROES = {
  smith:     {fac:'human',  card:'h_smith',     name:'Maestra Herrera',        hab:'hab_reparar', passive:'Tus torres tienen +20% de vida.'},
  paladin:   {fac:'human',  card:'h_paladin',   name:'Capitán Paladín',        hab:'hab_escudo',  passive:'Tus tropas tienen +10% de vida.'},
  drummer:   {fac:'orc',    card:'h_drummer',   name:'Grom Tambor de Guerra',  hab:'hab_tambor',  passive:'El elixir se recarga un 8% más rápido.'},
  huntress:  {fac:'orc',    card:'h_huntress',  name:'Vashka la Cazadora',     hab:'hab_lobos',   passive:'Tus tropas corren un 10% más.'},
  moonarcher:{fac:'elf',    card:'h_moonarcher',name:'Thalion Arquero Lunar',  hab:'hab_flechas', passive:'Tus tropas a distancia: +10% de daño y +0,5 de alcance.'},
  druid:     {fac:'elf',    card:'h_druid',     name:'Lirael la Druida',       hab:'hab_raices',  passive:'Tus tropas se curan poco a poco en tu mitad del campo.'},
  necro:     {fac:'undead', card:'h_necro',     name:'Malgor el Nigromante',   hab:'hab_alzar',   passive:'Cuando cae una tropa tuya, 25% de que se levante un esqueleto.'},
  banshee:   {fac:'undead', card:'h_banshee',   name:'Lady Vespera la Banshee',hab:'hab_grito',   passive:'Las tropas enemigas pegan un 8% menos.'},
};
const HERO_COSTS = [8, 14];   // esquirlas para subir a nivel 2 y 3
const heroLvl = id => (META.heroes && META.heroes[id]) || 1;
const MERCS = ['pirate','dwarf','ninja','yeti','merman','alchemist','bearrider','mimic','djinn','dwarfxbow','spiderbot','centaur'];
const HUMAN_BASE = ['knight','archer','goblin','skel','golem','mage','boar','bomber','healer','fireball','zap','bats','berserk','hunter','dragon','ballista','frost'];
const ORC_BASE = ['grunt','axeman','wolves','sapper','shaman','wrider','boulder','ogre','totem','bcry','troll','kodo','raider','wyvern','peon'];
const ELF_BASE = ['elfarcher','sentinel','blade','wisps','druid','ent','hippo','moontower','starfall','roots','moonbless'];
const UNDEAD_BASE = ['zombie','ghoul','skarcher','vbat','banshee','dknight','abom','lich','tombstone','plague','curse','gravehands'];
const S2 = Object.keys(CARDS).filter(k=>CARDS[k].s2 && CARDS[k].rar!==2);
HUMAN_BASE.push(...S2.filter(k=>!CARDS[k].fac)); ORC_BASE.push(...S2.filter(k=>CARDS[k].fac==='orc')); ELF_BASE.push(...S2.filter(k=>CARDS[k].fac==='elf')); UNDEAD_BASE.push(...S2.filter(k=>CARDS[k].fac==='undead'));
const BASE_CARDS = [...HUMAN_BASE, ...ORC_BASE, ...ELF_BASE, ...UNDEAD_BASE];
const STARTER_UNLOCKED = ['knight','archer','goblin','skel','golem','mage','boar','fireball','bats','berserk','hunter', 'grunt','axeman','wolves','sapper','shaman','wrider','boulder','troll','raider', 'elfarcher','sentinel','blade','wisps','druid','ent','hippo','starfall', 'zombie','ghoul','skarcher','vbat','banshee','dknight','abom','lich','plague','gravehands'];
const UNLOCKABLE = [{key:'bomber',cost:5},{key:'frost',cost:7},{key:'zap',cost:8},{key:'ballista',cost:9},{key:'healer',cost:10},{key:'dragon',cost:12},{key:'bcry',cost:6},{key:'ogre',cost:8},{key:'totem',cost:9},{key:'peon',cost:6},{key:'kodo',cost:8},{key:'wyvern',cost:9},{key:'roots',cost:7},{key:'moonbless',cost:8},{key:'moontower',cost:9},{key:'tombstone',cost:8},{key:'curse',cost:7},
  ...S2.map(k=>({key:k, cost: 5 + CARDS[k].rar*2 + (CARDS[k].cost>=5?1:0)}))];

const RECIPES = [
  ['golem','mage','agolem'], ['boar','goblin','stampede'], ['knight','healer','paladin'],
  ['archer','fireball','farcher'], ['skel','mage','necro'], ['bomber','golem','colossus'],
  ['knight','boar','rider'], ['zap','fireball','storm'], ['goblin','skel','horde'],
  ['bomber','goblin','bombbarr'], ['mage','healer','warlock'],
  ['grunt','shaman','warchief'], ['ogre','shaman','ogremage'], ['sapper','boulder','zeppelin'], ['wolves','bcry','wildpack'], ['axeman','totem','catapult'],
  ['dragon','fireball','infernal'], ['ballista','bomber','mortar'], ['frost','mage','icemage'], ['berserk','knight','warlord'],
  ['ent','druid','ancient'], ['druid','moonbless','dryad'], ['hippo','elfarcher','windrider'], ['sentinel','blade','shadow'], ['starfall','roots','starstorm'],
  ['vbat','lich','bonedragon'], ['ghoul','dknight','reaper'], ['abom','plague','plaguecart'], ['vbat','ghoul','vampire'], ['skarcher','gravehands','skmage'], ['plague','curse','soulstorm'],
  ['knight','dragon','dragonknight'], ['ogre','oberserk','ogreking'], ['fairydragon','starfall','phoenix'], ['zombie','tombstone','bonecolossus'],
];
function recipeFor(a, b){ for(const r of RECIPES){ if((r[0]===a&&r[1]===b)||(r[0]===b&&r[1]===a)) return r[2]; } return null; }

const FACTIONS = {
  human:{name:'Humanos', ic:'⚔️', base:'la Fragua', baseShort:'Fragua', desc:'Equilibrados: caballeros, magos, arqueras y la forja.',
    starter:['knight','archer','goblin','skel','fireball','mage'], cards:HUMAN_BASE,
    names:[['Guardia de Hierro','🛡️'],['Mercenarios Rojos','🗡️'],['Hechiceros Errantes','🔮'],['Hermandad del Hueso','💀'],['Legión de Piedra','🗿'],['Bandidos del Pantano','🐸']],
    elites:[['Señor de los Huesos','💀'],['Coloso Durmiente','🗿'],['La Reina Arcana','🔮'],['Capitán del Dragón','🐉']], boss:'👑 El Rey Sombrío'},
  orc:{name:'Orcos', ic:'🪓', base:'el Campamento', baseShort:'Campamento', desc:'Brutos y baratos: furia, lobos, tótems y explosivos.',
    starter:['grunt','axeman','wolves','sapper','boulder','shaman'], cards:ORC_BASE,
    names:[['Horda Colmillo Roto','🪓'],['Clan Calavera','💀'],['Jinetes de Huargo','🐺'],['Tribu del Trueno','🥁'],['Trasgos Saqueadores','💣'],['Clan Ogro','👹']],
    elites:[['Gorgash el Rompecráneos','👹'],['La Bruja de Sangre','🩸'],['Jefe Huargo','🐺'],['Maestro Zapador','💣']], boss:'🥁 Gran Jefe Gorzhak'},
  elf:{name:'Elfos', ic:'🏹', base:'el Árbol Madre', baseShort:'Árbol Madre', desc:'Ágiles y certeros: largo alcance, sigilo y savia (se curan en su mitad del campo).',
    starter:['elfarcher','sentinel','blade','wisps','starfall','druid'], cards:ELF_BASE,
    names:[['Guardianes del Roble','🌳'],['Cazadores Lunares','🌙'],['Círculo Druídico','🍃'],['Sombras del Bosque','🗡️'],['Jinetes del Viento','🦅'],['Hadas del Claro','✨']],
    elites:[['Archidruida Sylvaren','🍃'],['El Ent Milenario','🌳'],['La Dama de la Luna','🌙'],['Sombra Sin Nombre','🗡️']], boss:'🌙 Reina Elarya del Bosque'},
  undead:{name:'No Muertos', ic:'💀', base:'la Cripta', baseShort:'Cripta', desc:'Oscuros y tercos: roban vida, debilitan y las muertes cercanas levantan esqueletos (almas).',
    starter:['zombie','ghoul','skarcher','vbat','plague','lich'], cards:UNDEAD_BASE,
    names:[['Legión Podrida','🧟'],['Hermandad del Hueso','💀'],['Culto de la Cripta','⚰️'],['Bandada Vampira','🦇'],['Caballeros Caídos','⚔️'],['Coro de Lamentos','👻']],
    elites:[['El Caballero Fantasma','👻'],['Morgath el Carnicero','🧟'],['La Viuda Vampira','🦇'],['Señor de la Cripta','💀']], boss:'💀 El Rey Lich'},
};
const otherFactions = f => Object.keys(FACTIONS).filter(k=>k!==f);
const facOf = key => CARDS[key].fac || 'human';

const RELICS = {
  heart:   {name:'Corazón de Roble', ic:'heart', desc:'+500 de vida máxima de tu base (y la cura 500).'},
  swift:   {name:'Reloj de Arena', ic:'hourglass', desc:'El elixir se recarga un 12% más rápido.'},
  chalice: {name:'Cáliz Desbordante', ic:'chalice', desc:'Empiezas cada batalla con 8 de elixir.'},
  anvilR:  {name:'Martillo del Yunque', ic:'anvil2', desc:'Controlar el Yunque te da +60% de elixir en vez de +30%.'},
  bones:   {name:'Huesos Malditos', ic:'skull', desc:'Cuando muere una tropa tuya (no esqueleto), 30% de que salga un esqueleto.'},
  hammer:  {name:'Martillo de Guerra', ic:'hammer', desc:'Tus tropas cuerpo a cuerpo hacen +20% de daño.'},
  feather: {name:'Pluma de Halcón', ic:'feather', desc:'Tus tropas a distancia: +1 de alcance y +10% daño.'},
  boots:   {name:'Botas Aladas', ic:'boots', desc:'Tus tropas se mueven un 15% más rápido.'},
  wall:    {name:'Murallas de Piedra', ic:'wall', desc:'Tus torres princesa tienen +30% de vida.'},
  ballista:{name:'Ballesta Pesada', ic:'bow', desc:'Tus torres hacen +35% de daño.'},
  purse:   {name:'Bolsa Sin Fondo', ic:'purse', desc:'+30% de oro en cada batalla.'},
  phoenix: {name:'Pluma de Fénix', ic:'phoenix', desc:'Una vez por partida: si pierdes una batalla, la ganas con tu base al 30%.'},
  crystal: {name:'Cráneo de Cristal', ic:'crystal', desc:'Cada esqueleto tuyo que muere te da 0,25 de elixir.'},
  ember:   {name:'Brasa Eterna', ic:'flame', desc:'Tus hechizos hacen +40% de daño.'},
  first:   {name:'Golpe Inicial', ic:'bolt', desc:'La primera carta de cada batalla es gratis.'},
  armor:   {name:'Coraza de Mithril', ic:'shield', desc:'Tus tropas tienen +15% de vida.'},
  regen:   {name:'Fuente de Vida', ic:'drop', desc:'Tu base recupera 150 de vida tras cada victoria.'},
  forgeR:  {name:'Yunque Rúnico', ic:'anvil', desc:'Las cartas fusionadas nacen un nivel más alto.'},
  greed:   {name:'Corona del Avaro', ic:'crown', desc:'Ganas 15 de oro por cada corona conseguida.'},
  seed:    {name:'Semilla Dorada', ic:'seed', desc:'Cada 3 victorias, una carta al azar de tu mazo sube de nivel.'},
  drum:    {name:'Tambor Ancestral', ic:'drum', desc:'Al perder una torre, tus tropas pegan +25% y corren más durante 8 s.'},
  phylactery:{name:'Filacteria', ic:'phylactery', desc:'Tus fusiones y tu héroe reviven una vez por batalla con el 40% de vida.'},
};

const META_UPG = [
  {id:'hp',   name:'Muros de la Base', desc:'+200 de vida de tu base por nivel', costs:[4,8,14,20]},
  {id:'gold', name:'Tesoro Inicial', desc:'+30 de oro inicial por nivel', costs:[3,6,10]},
  {id:'elx',  name:'Elixir Inicial', desc:'+1 de elixir al empezar batallas', costs:[8,16]},
  {id:'relic',name:'Herencia', desc:'Empiezas con una reliquia aleatoria', costs:[15]},
  {id:'choice',name:'Ojo del Explorador', desc:'Recompensas: 4 cartas a elegir en vez de 3', costs:[12]},
];

const ENEMY_NAMES_OLD = [
  ['Bandidos del Pantano','🐸'],['Guardia de Hierro','⚙️'],['Clan Colmillo','🐗'],['Hermandad del Hueso','💀'],
  ['Hechiceros Errantes','🔮'],['Mercenarios Rojos','🗡️'],['Tribu Duende','👺'],['Legión de Piedra','🗿'],
];
const ELITE_NAMES_OLD = [['Señor de los Huesos','💀'],['Coloso Durmiente','🗿'],['La Reina Arcana','🔮'],['Jefe de la Estampida','🐗']];

// ===== RNG con semilla =====
function mulberry32(a){ return function(){ a|=0; a=a+0x6D2B79F5|0; let t=Math.imul(a^a>>>15,1|a); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }
let RNG = Math.random;
const rnd = () => RNG();
const rint = (a,b) => a + Math.floor(rnd()*(b-a+1));
const pick = arr => arr[Math.floor(rnd()*arr.length)];
function shuffleR(a, f=rnd){ for(let i=a.length-1;i>0;i--){ const j=Math.floor(f()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
const clamp = (v,a,b) => Math.max(a, Math.min(b, v));
const dist = (a,b) => Math.hypot(a.x-b.x, a.y-b.y);
const edge = (a,b) => dist(a,b) - a.r - b.r;
const other = s => s==='p' ? 'e' : 'p';
const $ = id => document.getElementById(id);

// ===== Guardado =====
const SAVE_KEY = 'cdt_forja_v1';
const store = {
  get(){ try{ return JSON.parse(localStorage.getItem(SAVE_KEY)) || null; }catch(e){ return null; } },
  set(v){ try{ localStorage.setItem(SAVE_KEY, JSON.stringify(v)); }catch(e){} },
};
let META = Object.assign({shards:0, wins:0, runs:0, upg:{}, unlocked:[...STARTER_UNLOCKED], recipes:[], heroes:{}, daily:{}, sound:true, run:null, bestFloor:0}, store.get() || {});
for(const k of STARTER_UNLOCKED) if(!META.unlocked.includes(k)) META.unlocked.push(k);
function saveMeta(){ store.set(META); }

// ===== Audio sintetizado =====
function buzz(p){ try{ if(META.vib!==false && navigator.vibrate) navigator.vibrate(p); }catch(e){} }
const SFX = (() => {
  let ac = null, master = null;
  function init(){ if(ac) return; try{ ac = new (window.AudioContext||window.webkitAudioContext)(); master = ac.createGain(); master.gain.value = 0.5; master.connect(ac.destination); }catch(e){ ac = null; } }
  function tone(f, d, type='sine', vol=0.3, slide=0, delay=0){
    if(!ac || !META.sound) return;
    const t = ac.currentTime + delay, o = ac.createOscillator(), g = ac.createGain();
    o.type = type; o.frequency.setValueAtTime(f, t); if(slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, f+slide), t+d);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t+0.01); g.gain.exponentialRampToValueAtTime(0.0001, t+d);
    o.connect(g); g.connect(master); o.start(t); o.stop(t+d+0.02);
  }
  function noise(d, vol=0.3, freq=800, delay=0){
    if(!ac || !META.sound) return;
    const t = ac.currentTime + delay, len = Math.floor(ac.sampleRate*d), buf = ac.createBuffer(1, len, ac.sampleRate), data = buf.getChannelData(0);
    for(let i=0;i<len;i++) data[i] = (Math.random()*2-1) * (1 - i/len);
    const s = ac.createBufferSource(); s.buffer = buf; const fl = ac.createBiquadFilter(); fl.type='lowpass'; fl.frequency.value=freq;
    const g = ac.createGain(); g.gain.value = vol; s.connect(fl); fl.connect(g); g.connect(master); s.start(t);
  }
  let lastHit = 0;
  return {
    init,
    deploy(){ tone(180,0.18,'triangle',0.35,-90); noise(0.12,0.15,500); },
    hit(){ const n=performance.now(); if(n-lastHit<45) return; lastHit=n; noise(0.06,0.12,1800); },
    arrow(){ tone(900,0.07,'square',0.04,-500); },
    magic(){ tone(520,0.2,'sine',0.12,400); },
    boom(){ noise(0.45,0.5,600); tone(90,0.4,'sine',0.4,-50); },
    zap(){ tone(1200,0.18,'sawtooth',0.12,-900); noise(0.15,0.2,4000); },
    tower(){ noise(0.9,0.6,400); tone(70,0.8,'triangle',0.5,-30); },
    crown(){ [660,880,1320].forEach((f,i)=>tone(f,0.25,'triangle',0.2,0,i*0.09)); },
    click(){ tone(700,0.05,'triangle',0.15); },
    select(){ tone(500,0.06,'sine',0.15,200); },
    bad(){ tone(200,0.15,'square',0.08,-60); },
    coin(){ tone(1200,0.08,'square',0.06); tone(1600,0.12,'square',0.06,0,0.07); },
    win(){ [523,659,784,1046].forEach((f,i)=>tone(f,0.35,'triangle',0.22,0,i*0.13)); },
    lose(){ [392,330,262].forEach((f,i)=>tone(f,0.45,'triangle',0.2,0,i*0.2)); },
    forge(){ noise(0.1,0.3,3000); tone(1500,0.6,'sine',0.15,-200,0.05); [880,1175,1568].forEach((f,i)=>tone(f,0.3,'triangle',0.15,0,0.25+i*0.08)); },
    heal(){ tone(660,0.3,'sine',0.08,300); },
  };
})();

// ================= ROMPETORRES: GALACTIC (conversión sci-fi) =================
(function(){
  const NAMES = {"knight": "Soldado de Asalto", "archer": "Fusileras", "goblin": "Mini Drones", "skel": "Reclutas", "golem": "Mecha Pesado", "mage": "Técnico de Plasma", "boar": "Moto de Asalto", "bomber": "Granadero", "healer": "Médica de Campo", "bats": "Enjambre de Drones", "dragon": "Dron Lanzallamas", "hunter": "Francotirador", "berserk": "Comando Furioso", "agolem": "Titán de Asedio", "stampede": "Escuadrón de Motos", "paladin": "Guardián Escudo", "farcher": "Fusileras Incendiarias", "necro": "Operador de Drones", "colossus": "Mecha Bomba", "rider": "Jinete de Exotraje", "horde": "Pelotón", "repair": "Ingeniero de Reparación", "infernal": "Cañonera", "icemage": "Técnico Criogénico", "warlord": "General de Hierro", "warlock": "Archicientífico", "pikeman": "Lancero de Energía", "battlenun": "Capellana de Combate", "griffin": "Jet Pack", "bard": "Trompetista de Guerra", "templar": "Espadachín Pesado", "princess": "Tiradora de Élite", "dragonknight": "Piloto de Caza", "zombie": "Robots Obreros", "ghoul": "Robot Depredador", "skarcher": "Torretas Andantes", "vbat": "Microdrones Vampiro", "banshee": "Dron Sónico", "dknight": "Caballero Mecánico", "abom": "Trituradora", "lich": "Robot Criogénico", "bonedragon": "Dragón Mecánico", "reaper": "Segador Láser", "plaguecart": "Tanque Tóxico", "vampire": "Overlord Robot", "skmage": "Robot Hechicero", "gargoyle": "Dron Gárgola", "mummy": "Robot Cableado", "wraith": "Holograma Hostil", "spiders": "Arañas Robot", "headless": "Robot Motorista", "hag": "Robot Químico", "fleshgolem": "Gólem de Chatarra", "skpirate": "Robot Pirata", "bonecolossus": "Coloso de Hierro", "grunt": "Guerrero Quitina", "elfarcher": "Androides Tiradores", "blade": "Androide Cuchilla", "ent": "Mecha Glacial", "hippo": "Nave Mantarraya", "windrider": "Dron Artillero", "ranger": "Androide Explorador", "unicorn": "Caballo Mecánico", "fairydragon": "Dragoncito Láser", "wolfwhisper": "Domador de Perros Robot", "jadeblade": "Androide Alabarda", "sapling": "Dron Reparador", "axeman": "Lanzapúas", "wolves": "Corredores", "sapper": "Bichos Bomba", "shaman": "Chamán del Enjambre", "wrider": "Saltador", "ogre": "Gólem Alienígena", "warchief": "Señor de la Colmena", "zeppelin": "Medusa Flotante", "wildpack": "Jauría Alienígena", "troll": "Escupidor", "kodo": "Behemot", "wyvern": "Jinete Volador", "oberserk": "Destripador", "harpy": "Avispas Gigantes", "rocketgob": "Bicho Cohete", "warboar": "Embestidor", "ogreking": "Reina del Enjambre", "sentinel": "Asesina Psíquica", "wisps": "Orbes Psíquicos", "druid": "Mutante", "bear": "Bestia Mutada", "dryad": "Reina Psíquica", "shadow": "Acechador del Vacío", "enchantress": "Hechicera Alien", "speardancer": "Telequinética", "elfalch": "Bioquímica", "ancient": "Cerebro Colosal", "panther": "Felino Fase", "slinger": "Lanzaácido", "raptor": "Jinete de Acechador", "voodoo": "Sanador Biológico", "scrapgolem": "Gusano de Asedio", "ninja": "Ninja Cibernético", "yeti": "Yeti de Hielo", "merman": "Anfibio", "alchemist": "Químico Loco", "bearrider": "Jinete de Oso Blindado", "mimic": "Caja Trampa", "djinn": "Espíritu del Vacío", "dwarfxbow": "Cazador de Bestias", "spiderbot": "Araña Exploradora", "centaur": "Centauro Cíborg", "pirate": "Pirata Espacial", "dwarf": "Minero de Asteroides", "h_smith": "Comandante Forja", "h_paladin": "Capitán Égida", "h_necro": "Núcleo Prime", "h_banshee": "Dama Eco", "h_drummer": "Rey de la Colmena", "h_druid": "Oráculo Psíquico", "ballista": "Torreta Láser", "mortar": "Artillería", "gnomeeng": "Torreta Rápida", "bcannon": "Cañón de Riel", "totem": "Pilón de Furia", "catapult": "Lanzaesporas", "peon": "Barricada", "moontower": "Faro Astral", "moonwell": "Pozo de Luz", "thornwall": "Muro Cristal", "treehouse": "Atalaya Etérea", "tombstone": "Fábrica de Drones", "frost": "Pulso Criogénico", "fireball": "Misil", "zap": "Descarga", "storm": "Tormenta de Iones", "bombbarr": "Cápsula de Drones", "boulder": "Meteorito", "bcry": "Rugido de la Colmena", "starfall": "Lluvia Estelar", "roots": "Prisión de Cristal", "moonbless": "Bendición de Luz", "starstorm": "Supernova", "healrain": "Lluvia Sanadora", "plague": "Nube Tóxica", "curse": "Virus", "gravehands": "Reactivar", "soulstorm": "Tormenta de Plasma"};
  const FAC = {"knight": "human", "archer": "human", "goblin": "human", "skel": "human", "golem": "human", "mage": "human", "boar": "human", "bomber": "human", "healer": "human", "bats": "human", "dragon": "human", "hunter": "human", "berserk": "human", "agolem": "human", "stampede": "human", "paladin": "human", "farcher": "human", "necro": "human", "colossus": "human", "rider": "human", "horde": "human", "repair": "human", "infernal": "human", "icemage": "human", "warlord": "human", "warlock": "human", "pikeman": "human", "battlenun": "human", "griffin": "human", "bard": "human", "templar": "human", "princess": "human", "dragonknight": "human", "fireball": "human", "zap": "human", "frost": "human", "storm": "human", "bombbarr": "human", "ballista": "human", "mortar": "human", "gnomeeng": "human", "bcannon": "human", "peon": "human", "healrain": "human", "zombie": "undead", "ghoul": "undead", "skarcher": "undead", "vbat": "undead", "banshee": "undead", "dknight": "undead", "abom": "undead", "lich": "undead", "bonedragon": "undead", "reaper": "undead", "plaguecart": "undead", "vampire": "undead", "skmage": "undead", "gargoyle": "undead", "mummy": "undead", "wraith": "undead", "spiders": "undead", "headless": "undead", "hag": "undead", "fleshgolem": "undead", "skpirate": "undead", "bonecolossus": "undead", "elfarcher": "undead", "blade": "undead", "ent": "undead", "hippo": "undead", "windrider": "undead", "ranger": "undead", "unicorn": "undead", "fairydragon": "undead", "wolfwhisper": "undead", "jadeblade": "undead", "sapling": "undead", "plague": "undead", "curse": "undead", "gravehands": "undead", "soulstorm": "undead", "tombstone": "undead", "moonbless": "undead", "moonwell": "undead", "grunt": "orc", "axeman": "orc", "wolves": "orc", "sapper": "orc", "shaman": "orc", "wrider": "orc", "ogre": "orc", "warchief": "orc", "zeppelin": "orc", "wildpack": "orc", "troll": "orc", "kodo": "orc", "wyvern": "orc", "oberserk": "orc", "harpy": "orc", "rocketgob": "orc", "warboar": "orc", "ogreking": "orc", "sentinel": "orc", "wisps": "orc", "druid": "orc", "bear": "orc", "dryad": "orc", "shadow": "orc", "enchantress": "orc", "speardancer": "orc", "elfalch": "orc", "ancient": "orc", "panther": "orc", "slinger": "orc", "raptor": "orc", "voodoo": "orc", "scrapgolem": "orc", "boulder": "orc", "bcry": "orc", "totem": "orc", "catapult": "orc", "starfall": "orc", "roots": "orc", "starstorm": "orc", "thornwall": "orc"};
  for(const k in NAMES) if(CARDS[k]) CARDS[k].name = NAMES[k];
  for(const k in FAC) if(CARDS[k]){ if(FAC[k]==='human') delete CARDS[k].fac; else CARDS[k].fac = FAC[k]; }
  for(const k of ["moontower", "hawkrider", "treehouse", "phoenix"]) if(CARDS[k]) CARDS[k].fac = 'retired';
  const pick = f => Object.keys(CARDS).filter(k => FAC[k]===f && CARDS[k].rar!==2 && !CARDS[k].hero && !CARDS[k].hidden);
  const set = (arr, f) => { arr.length = 0; arr.push(...pick(f)); };
  set(HUMAN_BASE,'human'); set(UNDEAD_BASE,'undead'); set(ORC_BASE,'orc'); ELF_BASE.length = 0;
  BASE_CARDS.length = 0; BASE_CARDS.push(...HUMAN_BASE, ...ORC_BASE, ...UNDEAD_BASE);
  Object.assign(FACTIONS.human, {name:'Resistencia', ic:'🛡️', base:'el Búnker', baseShort:'Búnker', desc:'Equilibrados: soldados, tiradores, médicos y drones.',
    names:[['Escuadrón Acero','🛡️'],['Comando Halcón','🦅'],['Brigada Plasma','⚡'],['Patrulla Nova','⭐'],['Legión Titán','🤖'],['Rangers del Páramo','🎯']],
    elites:[['Coronel Vega','🎖️'],['El Titán Dormido','🤖'],['La Científica Loca','🧪'],['Capitana Nova','⭐']], boss:'🎖️ General Hierro'});
  Object.assign(FACTIONS.undead, {name:'Voltempire', ic:'🤖', base:'la Fortaleza', baseShort:'Fortaleza', desc:'Robots: muchos cuerpo a cuerpo, drones voladores y se reparan con chatarra.',
    names:[['Legión Chatarra','⚙️'],['Enjambre de Drones','🛸'],['Guardia de Hierro','🤖'],['Arañas Mecánicas','🕷️'],['Caballeros Voltio','⚡'],['Piratas del Óxido','🏴‍☠️']],
    elites:[['El Coloso de Hierro','🤖'],['Overlord Zeta','👑'],['La Mente Colmena','🧠'],['Dragón Mecánico','🐉']], boss:'⚡ Emperador Voltio'});
  Object.assign(FACTIONS.orc, {name:'Azorks', ic:'👽', base:'la Colmena', baseShort:'Colmena', desc:'Alienígenas: bestias enormes, bichos que van a las torres y poderes psíquicos.',
    names:[['Colmena Púrpura','👾'],['Manada Roja','🐾'],['Círculo Psíquico','🔮'],['Gusanos del Abismo','🪱'],['Nido Ácido','🧪'],['Enjambre Alado','🐝']],
    elites:[['La Reina del Enjambre','👑'],['Behemot Ancestral','🪱'],['La Telequinética','🔮'],['Cerebro Colosal','🧠']], boss:'👽 Gran Señor Azork'});
  for(const f of ['human','orc','undead']){ const F = FACTIONS[f]; F.starter = F.starter.filter(k=>F.cards.includes(k)); }
  delete FACTIONS.elf;
  // el Dron Reparador cura a los robots cercanos
  if(CARDS.sapling){ CARDS.sapling.heal = {amt:45, radius:3, every:1.0}; CARDS.sapling.air = true; delete CARDS.sapling.rootOnHit; CARDS.sapling.desc = 'Dron que repara a los robots cercanos.'; }
  if(CARDS.unicorn){ delete CARDS.unicorn.heal; }
})();
// minion robot para las mecánicas de Voltempire (almas, fábrica de drones, etc.)
(function(){
  CARDS.vskel = Object.assign({}, CARDS.skel, {name:'Robot Obrero', count:1, fac:'undead', sprite:'zombie', hidden:true, rar:0});
  for(const k of ['tombstone','skmage','bonecolossus','h_necro','wolfwhisper']) if(CARDS[k] && CARDS[k].spawn) CARDS[k].spawn = Object.assign({}, CARDS[k].spawn, {key:'vskel'});
})();
// emblemas antiguos de fantasía fuera hasta tener los nuevos (se usan los emojis 🛡️ 🤖 👽)
delete ART_SRC.emb_elf;
// comandantes: hasta tener su arte, retrato = emblema de su facción y en batalla un cuerpo sci-fi
(function(){
  const M = {h_smith:['human','templar'], h_paladin:['human','paladin'], h_necro:['undead','vampire'], h_banshee:['undead','banshee'], h_drummer:['orc','warchief'], h_druid:['orc','dryad']};
  const P = {h_smith:'por_smith', h_paladin:'por_paladin', h_necro:'por_necro', h_banshee:'por_banshee', h_drummer:'por_drummer', h_druid:'por_druid'};
  for(const k in M) if(CARDS[k]){ CARDS[k].art = P[k]; }
  for(const k of ['por_huntress','por_moonarcher']) delete ART_SRC[k];
})();
// iconos de cartas de hechizo nuevos
for(const k of ['frost','fireball','zap','storm','bombbarr','gravehands','plague','curse','soulstorm','boulder','bcry','roots','starstorm','healrain','moonbless']) if(CARDS[k]) CARDS[k].art = 'ic_'+k;
// recetas: fuera las de cartas retiradas
for(let i=RECIPES.length-1;i>=0;i--){ const r=RECIPES[i]; if(r.some(k=>!CARDS[k] || CARDS[k].fac==='retired')) RECIPES.splice(i,1); }
// cartas sin arte sci-fi propio
if(CARDS.ogremage){ CARDS.ogremage.name='Bruto Psíquico'; CARDS.ogremage.sprite='troll'; CARDS.ogremage.art=null; }
if(CARDS.raider){ CARDS.raider.fac='retired'; const i=ORC_BASE.indexOf('raider'); if(i>=0) ORC_BASE.splice(i,1); const j=BASE_CARDS.indexOf('raider'); if(j>=0) BASE_CARDS.splice(j,1); }
// equilibrio de tipos: tanque para la Resistencia y reparadores para Voltempire
if(CARDS.golem) Object.assign(CARDS.golem, {targets:'any', hp:3100, dmg:210, splash:1.0, desc:'Mecha enorme y blindado: aguanta muchísimo y golpea en área a todo lo que tiene cerca.'});
if(CARDS.zombie){ Object.assign(CARDS.zombie, {dmg:70, heal:{amt:35, radius:2.6, every:1.0, self:true}, desc:'Dos robots obreros que reparan a las tropas cercanas mientras pelean.'}); }
// ajustes finos tras simular partidas
if(CARDS.slinger) CARDS.slinger.dmg = Math.round(CARDS.slinger.dmg*0.9);
if(CARDS.fairydragon) CARDS.fairydragon.hp = Math.round(CARDS.fairydragon.hp*1.15);
if(CARDS.harpy) CARDS.harpy.hp = Math.round(CARDS.harpy.hp*1.15);
if(CARDS.tombstone && CARDS.tombstone.spawn) CARDS.tombstone.spawn.every = 2.2;
// invocaciones de la facción correcta
if(CARDS.gravehands && CARDS.gravehands.spawnAfter) CARDS.gravehands.spawnAfter = Object.assign({}, CARDS.gravehands.spawnAfter, {key:'vskel'});
if(CARDS.necro && CARDS.necro.spawn) CARDS.necro.spawn = Object.assign({}, CARDS.necro.spawn, {key:'goblin'});
if(CARDS.wolfwhisper && CARDS.wolfwhisper.spawn) CARDS.wolfwhisper.spawn = Object.assign({}, CARDS.wolfwhisper.spawn, {key:'spiders', n:1});

// ================= GRÁFICOS VECTORIALES =================
const TEAM = {
  p:{main:'#3d8bff', dark:'#1a4fb8', light:'#a6ccff', glow:'#6fd0ff'},
  e:{main:'#ff4d5e', dark:'#a8162b', light:'#ffb3bb', glow:'#ff9a4a'},
};
const OL = '#1b1226';
// ===== Imágenes ilustradas (sustituyen al dibujo por código cuando existen) =====
const IMG = {};
const IMG_ALIAS = {boss_elf:'boss_elarya'};           // reutiliza imágenes para otras cartas
const imgFor = key => { const k = IMG_ALIAS[key] || key; const im = IMG[k]; return im && im.complete && im.naturalWidth ? im : null; };
function loadArt(){
  const list = Object.keys(typeof ART_SRC!=='undefined' ? ART_SRC : {}).filter(k=>!k.startsWith('_'));
  return Promise.all(list.map(k=>new Promise(res=>{ const im = new Image(); im.onload = im.onerror = ()=>res(); im.src = ART_SRC[k]; IMG[k] = im; })));
}
// cambia el azul del equipo por rojo (versión enemiga)
function recolorRed(canvas){
  const g = canvas.getContext('2d'), d = g.getImageData(0,0,canvas.width,canvas.height), p = d.data;
  for(let i=0;i<p.length;i+=4){
    if(p[i+3]<10) continue;
    const r=p[i]/255, gg=p[i+1]/255, b=p[i+2]/255, mx=Math.max(r,gg,b), mn=Math.min(r,gg,b), l=(mx+mn)/2, dd=mx-mn;
    if(dd<0.12) continue;
    const sat = dd/(1-Math.abs(2*l-1)||1);
    let h; if(mx===r) h=((gg-b)/dd)%6; else if(mx===gg) h=(b-r)/dd+2; else h=(r-gg)/dd+4; h*=60; if(h<0) h+=360;
    if(h<192 || h>245 || sat<0.3) continue;
    // nuevo tono rojo conservando luz y saturación
    const nh = 355 + (h-215)*0.15, c = (1-Math.abs(2*l-1))*Math.min(1,sat*1.05), x = c*(1-Math.abs(((nh/60)%2)-1)), m = l-c/2;
    let rr,g2,bb; const hh = ((nh%360)+360)%360;
    if(hh<60){rr=c;g2=x;bb=0;} else if(hh<120){rr=x;g2=c;bb=0;} else if(hh<180){rr=0;g2=c;bb=x;} else if(hh<240){rr=0;g2=x;bb=c;} else if(hh<300){rr=x;g2=0;bb=c;} else {rr=c;g2=0;bb=x;}
    p[i]=(rr+m)*255; p[i+1]=(g2+m)*255; p[i+2]=(bb+m)*255;
  }
  g.putImageData(d,0,0);
}
// dibuja una imagen ajustada en una caja de 100×100 con los pies abajo
function drawImgFit(g, im, box=96, bottom=95){
  const sc = Math.min(box/im.naturalWidth, box/im.naturalHeight), w = im.naturalWidth*sc, h = im.naturalHeight*sc;
  g.drawImage(im, 50-w/2, bottom-h, w, h);
}
const TAU = Math.PI*2;

function mkCanvas(w,h){ const c=document.createElement('canvas'); c.width=Math.max(1,Math.ceil(w)); c.height=Math.max(1,Math.ceil(h)); return c; }
// lienzos en alta resolución (nitidez en móviles con pantalla densa)
const SS = Math.min(2.5, Math.max(1, window.devicePixelRatio || 1));
function mkHi(w,h){ const c = mkCanvas(w*SS, h*SS); c._ss = SS; return c; }
(function(){ const P = CanvasRenderingContext2D.prototype, _di = P.drawImage;
  P.drawImage = function(img, a, b){ if(arguments.length===3 && img && img._ss && !(this.canvas && this.canvas._ss)) return _di.call(this, img, a, b, img.width/img._ss, img.height/img._ss); return _di.apply(this, arguments); }; })();
function rgrad(g,x,y,r,c1,c2,fx=-0.35,fy=-0.4){ const gr=g.createRadialGradient(x+r*fx,y+r*fy,r*0.05,x,y,r); gr.addColorStop(0,c1); gr.addColorStop(1,c2); return gr; }
function lgrad(g,x1,y1,x2,y2,...cs){ const gr=g.createLinearGradient(x1,y1,x2,y2); cs.forEach((c,i)=>gr.addColorStop(i/(cs.length-1),c)); return gr; }
function circ(g,x,y,r,fill,lw=3){ g.beginPath(); g.arc(x,y,r,0,TAU); g.fillStyle=fill; g.fill(); if(lw){ g.lineWidth=lw; g.strokeStyle=OL; g.stroke(); } }
function ell(g,x,y,rx,ry,fill,lw=3,rot=0){ g.beginPath(); g.ellipse(x,y,rx,ry,rot,0,TAU); g.fillStyle=fill; g.fill(); if(lw){ g.lineWidth=lw; g.strokeStyle=OL; g.stroke(); } }
function poly(g,pts,fill,lw=3,close=true){ g.beginPath(); g.moveTo(pts[0],pts[1]); for(let i=2;i<pts.length;i+=2) g.lineTo(pts[i],pts[i+1]); if(close) g.closePath(); if(fill){ g.fillStyle=fill; g.fill(); } if(lw){ g.lineWidth=lw; g.strokeStyle=OL; g.lineJoin='round'; g.stroke(); } }
function rr(g,x,y,w,h,r,fill,lw=3){ g.beginPath(); g.moveTo(x+r,y); g.arcTo(x+w,y,x+w,y+h,r); g.arcTo(x+w,y+h,x,y+h,r); g.arcTo(x,y+h,x,y,r); g.arcTo(x,y,x+w,y,r); g.closePath(); if(fill){ g.fillStyle=fill; g.fill(); } if(lw){ g.lineWidth=lw; g.strokeStyle=OL; g.stroke(); } }
function line(g,x1,y1,x2,y2,col,lw){ g.beginPath(); g.moveTo(x1,y1); g.lineTo(x2,y2); g.strokeStyle=col; g.lineWidth=lw; g.lineCap='round'; g.stroke(); }
function eyes(g,x,y,sp,r=3.4,col='#1b1226'){ for(const s of [-1,1]){ ell(g,x+s*sp,y,r*0.85,r*1.15,col,0); circ(g,x+s*sp-r*0.3,y-r*0.45,r*0.38,'#fff',0); } }
function skin(g,x,y,r,c1='#ffe1c2',c2='#e9a77d'){ circ(g,x,y,r,rgrad(g,x,y,r,c1,c2)); }
function shine(g,x,y,rx,ry,a=0.45){ g.save(); g.globalAlpha=a; ell(g,x,y,rx,ry,'#fff',0); g.restore(); }
function sword(g,x1,y1,x2,y2){ // hoja desde empuñadura (x1,y1) hasta punta
  const a=Math.atan2(y2-y1,x2-x1), nx=-Math.sin(a), ny=Math.cos(a);
  poly(g,[x1+nx*3.2,y1+ny*3.2, x2+nx*0.5,y2+ny*0.5, x2+(x2-x1)*0.06,y2+(y2-y1)*0.06, x2-nx*0.5,y2-ny*0.5, x1-nx*3.2,y1-ny*3.2], lgrad(g,x1+nx*3,y1+ny*3,x1-nx*3,y1-ny*3,'#ffffff','#b9c6d6','#7d8a9c'),2.5);
  line(g,x1+nx*8,y1+ny*8,x1-nx*8,y1-ny*8,OL,6.5); line(g,x1+nx*7,y1+ny*7,x1-nx*7,y1-ny*7,'#f2c24b',4);
  line(g,x1,y1,x1-(x2-x1)*0.16,y1-(y2-y1)*0.16,OL,6); line(g,x1,y1,x1-(x2-x1)*0.15,y1-(y2-y1)*0.15,'#7a4a24',3.5);
}
function boots(g,col='#4a3038'){ rr(g,38,76,10,14,4,col,2.5); rr(g,52,76,10,14,4,col,2.5); }

const SPR = {
  knight(g,T){
    boots(g,'#3d3446');
    // escudo
    poly(g,[8,50, 34,46, 34,70, 21,86, 8,70], lgrad(g,8,50,34,86,T.light,T.main,T.dark));
    line(g,21,52,21,78,'#fff',4); line(g,12,62,30,62,'#fff',4);
    // cuerpo
    rr(g,30,48,40,32,12,lgrad(g,30,48,70,80,'#f5f8fc','#a8b4c4','#6e7a8c'));
    poly(g,[38,54, 62,54, 60,82, 40,82], lgrad(g,38,54,62,82,T.light,T.main,T.dark),2.5);
    line(g,50,56,50,80,'#ffffff55',3);
    // espada
    sword(g,76,66,92,22);
    circ(g,76,66,6,rgrad(g,76,66,6,'#ffe1c2','#d99872'),2.5);
    // casco
    circ(g,50,34,20,rgrad(g,50,34,20,'#ffffff','#7f8b9c'));
    rr(g,36,32,28,7,3,'#232030',2);
    line(g,50,15,50,52,'#ffffff40',2);
    // penacho
    g.beginPath(); g.moveTo(48,15); g.bezierCurveTo(58,0,78,4,80,16); g.bezierCurveTo(70,10,60,12,52,20); g.closePath();
    g.fillStyle=lgrad(g,48,4,80,20,T.light,T.main); g.fill(); g.lineWidth=2.5; g.strokeStyle=OL; g.stroke();
    shine(g,42,24,6,4);
  },
  paladin(g,T){
    // aura
    g.save(); g.globalAlpha=0.35; circ(g,50,52,46,rgrad(g,50,52,46,'#fff7c2','#ffd84a00',0,0),0); g.restore();
    boots(g,'#6a4a1e');
    // alas del casco detrás
    for(const s of [-1,1]){ g.beginPath(); g.moveTo(50+s*14,28); g.bezierCurveTo(50+s*34,6,50+s*44,16,50+s*40,30); g.bezierCurveTo(50+s*34,26,50+s*30,34,50+s*16,38); g.closePath(); g.fillStyle='#ffffff'; g.fill(); g.lineWidth=2.5; g.strokeStyle=OL; g.stroke(); }
    poly(g,[6,48, 34,44, 34,70, 20,88, 6,70], lgrad(g,6,48,34,88,'#fff3b0','#f2c24b','#a8741c'));
    circ(g,20,62,7,T.main,2.5);
    rr(g,29,47,42,34,12,lgrad(g,29,47,71,81,'#fff8d6','#e9c45a','#9a6e1c'));
    poly(g,[38,54, 62,54, 60,84, 40,84], lgrad(g,38,54,62,84,'#ffffff',T.light,T.main),2.5);
    line(g,50,58,50,78,'#f2c24b',4); line(g,43,64,57,64,'#f2c24b',4);
    sword(g,77,66,93,20);
    circ(g,77,66,6,'#f2c24b',2.5);
    circ(g,50,34,20,rgrad(g,50,34,20,'#fffbe6','#c99a2a'));
    rr(g,36,32,28,7,3,'#2a2010',2);
    shine(g,42,24,6,4,0.6);
  },
  archer(g,T){
    // carcaj
    rr(g,62,36,12,30,4,'#7a4a24',2.5); for(let i=0;i<3;i++){ line(g,64+i*4,36,62+i*5,26,'#e8e0d0',2); poly(g,[60+i*5,24, 66+i*5,24, 63+i*5,30],'#ff6b4a',1.5); }
    boots(g,'#6a4428');
    poly(g,[34,50, 66,50, 72,84, 28,84], lgrad(g,30,50,70,84,T.light,T.main,T.dark));
    rr(g,30,66,40,6,2,'#7a4a24',2); circ(g,50,69,3.5,'#f2c24b',1.5);
    // capucha
    g.beginPath(); g.arc(50,38,22,Math.PI*0.95,Math.PI*2.05); g.lineTo(70,60); g.lineTo(30,60); g.closePath();
    g.fillStyle=lgrad(g,30,16,70,60,T.main,T.dark); g.fill(); g.lineWidth=3; g.strokeStyle=OL; g.stroke();
    skin(g,50,40,15);
    // flequillo
    poly(g,[36,34, 44,26, 52,30, 60,25, 65,34, 58,30, 50,34, 42,31],'#c46a2a',2);
    eyes(g,50,42,6,3);
    ell(g,50,50,3,1.6,'#d46a6a',0);
    // arco
    g.beginPath(); g.arc(30,62,26,Math.PI*0.62,Math.PI*1.38); g.lineWidth=7; g.strokeStyle=OL; g.stroke(); g.lineWidth=4.5; g.strokeStyle='#9a5a28'; g.stroke();
    line(g,18,39,18,85,'#f3efe4',1.5);
    circ(g,24,62,5,rgrad(g,24,62,5,'#ffe1c2','#d99872'),2.5);
  },
  farcher(g,T){
    SPR.archer(g,T);
    // flecha ardiente en el arco
    line(g,14,62,48,62,'#5a3416',3);
    g.save(); g.shadowColor='#ff8a00'; g.shadowBlur=10;
    poly(g,[8,62, 16,55, 22,62, 16,69],'#ffb020',2);
    poly(g,[2,62, 12,57, 14,62, 12,67],'#ff5a1a',0);
    g.restore();
  },
  goblin(g,T,spear=false){
    boots(g,'#5a3a20');
    poly(g,[36,56, 64,56, 68,84, 32,84], lgrad(g,32,56,68,84,'#a0703a','#6a4420'));
    poly(g,[36,60, 64,74, 64,80, 36,66], T.main, 2);
    // orejas
    for(const s of [-1,1]) poly(g,[50+s*14,36, 50+s*40,26, 50+s*16,48], lgrad(g,50,26,50+s*40,48,'#8fe06a','#3f8f2c'));
    circ(g,50,40,19,rgrad(g,50,40,19,'#a6ec80','#3f8f2c'));
    // bandana / casco
    if(spear){ g.beginPath(); g.arc(50,38,20,Math.PI,TAU); g.closePath(); g.fillStyle=lgrad(g,30,18,70,38,'#e6ecf2','#8a96a6'); g.fill(); g.lineWidth=3; g.strokeStyle=OL; g.stroke(); line(g,30,38,70,38,T.main,4); }
    else { g.beginPath(); g.arc(50,38,20,Math.PI*1.05,Math.PI*1.95); g.lineTo(66,30); g.lineTo(34,30); g.closePath(); g.fillStyle=T.main; g.fill(); g.lineWidth=2.5; g.strokeStyle=OL; g.stroke(); poly(g,[68,26, 80,20, 78,30],T.main,2); }
    for(const s of [-1,1]){ ell(g,50+s*7,42,4.5,5,'#fff23a',2); circ(g,50+s*7,43,2.2,OL,0); }
    g.beginPath(); g.arc(50,48,8,0.15*Math.PI,0.85*Math.PI); g.lineWidth=2.5; g.strokeStyle=OL; g.stroke();
    poly(g,[45,51, 47,55, 49,51],'#fff',1); poly(g,[51,51, 53,55, 55,51],'#fff',1);
    if(spear){ line(g,78,90,84,14,OL,6); line(g,78,90,84,14,'#8a5a2a',3.5); poly(g,[84,4, 89,18, 80,17],'#dfe6ee',2.5); circ(g,79,66,5.5,'#7bd35a',2.5); }
    else { sword(g,74,68,86,48); circ(g,74,68,5.5,'#7bd35a',2.5); }
  },
  goblin2(g,T){ SPR.goblin(g,T,true); },
  skel(g,T){
    // piernas huesos
    line(g,44,74,42,90,OL,6); line(g,44,74,42,90,'#efe9da',3.5); line(g,56,74,58,90,OL,6); line(g,56,74,58,90,'#efe9da',3.5);
    // costillas
    rr(g,38,52,24,24,8,'#2a2236',2.5);
    for(let i=0;i<3;i++){ g.beginPath(); g.ellipse(50,57+i*6,11-i,3,0,0,Math.PI); g.lineWidth=5; g.strokeStyle=OL; g.stroke(); g.lineWidth=2.8; g.strokeStyle='#efe9da'; g.stroke(); }
    line(g,50,52,50,76,'#efe9da',3);
    // bufanda
    poly(g,[36,50, 64,50, 62,56, 38,56],T.main,2); poly(g,[58,54, 66,68, 60,68],T.main,2);
    // espada oxidada
    sword(g,72,66,84,40);
    circ(g,72,66,4.5,'#efe9da',2.5);
    // cráneo
    circ(g,50,36,17,rgrad(g,50,36,17,'#ffffff','#c9c0aa'));
    rr(g,42,46,16,9,3,'#e7e0cc',2.5);
    for(const s of [-1,1]) ell(g,50+s*6.5,36,4.6,5.4,OL,0);
    for(const s of [-1,1]) circ(g,50+s*6.5,36,1.6,T.glow,0);
    poly(g,[48,42, 52,42, 50,45],OL,0);
    for(let i=0;i<3;i++) line(g,45+i*5,47,45+i*5,54,OL,1.5);
  },
  golemBody(g,T,c1,c2,eyeCol){
    // brazos
    for(const s of [-1,1]){ poly(g,[50+s*26,46, 50+s*44,54, 50+s*44,78, 50+s*30,84, 50+s*22,70], lgrad(g,50+s*26,46,50+s*40,84,c1,c2)); }
    // cuerpo
    poly(g,[24,40, 38,22, 62,20, 78,38, 80,70, 66,90, 34,90, 20,70], lgrad(g,24,20,76,90,c1,c2));
    // musgo
    g.save(); g.beginPath(); g.moveTo(38,22); g.lineTo(62,20); g.lineTo(78,38); g.quadraticCurveTo(66,30,54,34); g.quadraticCurveTo(40,28,24,40); g.closePath(); g.fillStyle='#5aa13a'; g.fill(); g.lineWidth=2; g.strokeStyle=OL; g.stroke(); g.restore();
    // grietas
    line(g,36,56,44,64,'#00000055',2.5); line(g,44,64,40,74,'#00000055',2.5); line(g,62,60,68,70,'#00000055',2.5);
    // ojos brillantes
    g.save(); g.shadowColor=eyeCol; g.shadowBlur=12; for(const s of [-1,1]) poly(g,[50+s*4,42, 50+s*14,40, 50+s*13,47, 50+s*5,47],eyeCol,1.5); g.restore();
    line(g,40,54,60,54,'#00000066',3);
  },
  golem(g,T){ SPR.golemBody(g,T,'#b0a69c','#5c524b',T.glow); circ(g,50,74,6,T.main,2); },
  agolem(g,T){
    SPR.golemBody(g,T,'#9c97d6','#3e386e','#b8f0ff');
    g.save(); g.shadowColor='#c084ff'; g.shadowBlur=10; g.strokeStyle='#e0b8ff'; g.lineWidth=2.5;
    g.beginPath(); g.moveTo(40,62); g.lineTo(50,70); g.lineTo(60,62); g.moveTo(50,70); g.lineTo(50,82); g.moveTo(30,58); g.lineTo(26,70); g.moveTo(70,58); g.lineTo(74,70); g.stroke(); g.restore();
    for(const s of [-1,1]) poly(g,[50+s*30,44, 50+s*36,26, 50+s*42,44],lgrad(g,0,26,0,44,'#f0d0ff','#9a4adf'),2);
    circ(g,50,74,5,T.main,2);
  },
  colossus(g,T){
    SPR.golemBody(g,T,'#a39a90','#4f4640',T.glow);
    rr(g,24,60,52,8,3,'#5a3a20',2);
    for(const x of [34,50,66]){ circ(g,x,68,8,rgrad(g,x,68,8,'#5a5a6a','#141420')); line(g,x+3,61,x+6,55,'#c9a060',2); g.save(); g.shadowColor='#ffb020'; g.shadowBlur=8; circ(g,x+6,54,2.5,'#ffd34d',0); g.restore(); }
  },
  mage(g,T){
    // bastón
    line(g,80,90,80,26,OL,7); line(g,80,90,80,26,'#8a5a2a',4);
    g.save(); g.shadowColor=T.glow; g.shadowBlur=14; circ(g,80,22,8,rgrad(g,80,22,8,'#ffffff',T.glow),2.5); g.restore();
    // túnica
    poly(g,[36,48, 64,48, 76,90, 24,90], lgrad(g,24,48,76,90,T.light,T.main,T.dark));
    line(g,50,52,50,90,'#00000030',3);
    rr(g,34,62,32,6,2,'#f2c24b',2);
    circ(g,78,58,5.5,rgrad(g,78,58,5.5,'#ffe1c2','#d99872'),2.5);
    skin(g,50,38,14);
    // barba
    g.beginPath(); g.moveTo(37,40); g.quadraticCurveTo(50,72,63,40); g.quadraticCurveTo(50,50,37,40); g.fillStyle=lgrad(g,40,40,60,66,'#ffffff','#c9cdd6'); g.fill(); g.lineWidth=2.5; g.strokeStyle=OL; g.stroke();
    eyes(g,50,38,5.5,2.6);
    // sombrero
    ell(g,50,28,24,6,T.dark,2.5);
    g.beginPath(); g.moveTo(32,28); g.quadraticCurveTo(44,14,52,0); g.quadraticCurveTo(58,8,72,6); g.quadraticCurveTo(60,12,68,28); g.closePath();
    g.fillStyle=lgrad(g,32,0,68,28,T.light,T.main,T.dark); g.fill(); g.lineWidth=3; g.strokeStyle=OL; g.stroke();
    g.save(); g.shadowColor='#ffe066'; g.shadowBlur=6; poly(g,[50,12, 52,17, 57,17, 53,20, 55,25, 50,22, 45,25, 47,20, 43,17, 48,17],'#ffe066',1.5); g.restore();
  },
  warlock(g,T){
    line(g,80,90,80,22,OL,7); line(g,80,90,80,22,'#3a2a5a',4);
    g.save(); g.shadowColor='#ffd84a'; g.shadowBlur=18; circ(g,80,18,10,rgrad(g,80,18,10,'#ffffff','#ffb020'),2.5); g.restore();
    for(const s of [-1,1]) line(g,80+s*10,8,80+s*13,4,'#ffd84a',2);
    poly(g,[34,48, 66,48, 80,90, 20,90], lgrad(g,20,48,80,90,'#7a4adf','#3a1a7a','#1c0a40'));
    poly(g,[46,48, 54,48, 58,90, 42,90], lgrad(g,46,48,54,90,T.light,T.main),2);
    rr(g,32,62,36,6,2,'#f2c24b',2);
    circ(g,78,58,5.5,rgrad(g,78,58,5.5,'#ffe1c2','#d99872'),2.5);
    skin(g,50,38,14);
    g.beginPath(); g.moveTo(37,40); g.quadraticCurveTo(50,76,63,40); g.quadraticCurveTo(50,50,37,40); g.fillStyle=lgrad(g,40,40,60,70,'#ffffff','#c9cdd6'); g.fill(); g.lineWidth=2.5; g.strokeStyle=OL; g.stroke();
    eyes(g,50,38,5.5,2.6,'#6a1a9a');
    // corona alta
    poly(g,[32,30, 34,10, 42,20, 50,4, 58,20, 66,10, 68,30],lgrad(g,0,4,0,30,'#fff3a0','#d99a1c'),2.5);
    circ(g,50,22,3.5,T.main,1.5);
  },
  healer(g,T){
    g.save(); g.globalAlpha=0.9; g.beginPath(); g.ellipse(50,14,14,4,0,0,TAU); g.lineWidth=3.5; g.strokeStyle='#ffe066'; g.shadowColor='#ffe066'; g.shadowBlur=10; g.stroke(); g.restore();
    line(g,80,90,80,30,OL,7); line(g,80,90,80,30,'#e8e0f0',4);
    g.save(); g.shadowColor='#6aff9a'; g.shadowBlur=14; poly(g,[80,14, 87,26, 80,38, 73,26],lgrad(g,73,14,87,38,'#d8ffe6','#2fcf6a'),2.5); g.restore();
    // pelo largo detrás
    g.beginPath(); g.arc(50,38,19,Math.PI,TAU); g.lineTo(70,66); g.lineTo(30,66); g.closePath(); g.fillStyle=lgrad(g,30,20,70,66,'#ffe9a0','#e0a83a'); g.fill(); g.lineWidth=2.5; g.strokeStyle=OL; g.stroke();
    poly(g,[36,50, 64,50, 74,90, 26,90], lgrad(g,26,50,74,90,'#ffffff','#e2dcf2','#b8aedc'));
    poly(g,[46,50, 54,50, 56,90, 44,90], T.main, 2);
    line(g,50,60,50,72,'#fff',3); line(g,44,66,56,66,'#fff',3);
    circ(g,78,60,5.5,rgrad(g,78,60,5.5,'#ffe1c2','#d99872'),2.5);
    skin(g,50,40,15);
    poly(g,[35,36, 42,24, 52,28, 60,24, 66,36, 58,30, 50,33, 42,30],'#f0c050',2);
    eyes(g,50,42,6,2.8,'#2a6a3a');
    g.beginPath(); g.arc(50,48,4,0.2*Math.PI,0.8*Math.PI); g.lineWidth=2; g.strokeStyle=OL; g.stroke();
  },
  necro(g,T){
    line(g,80,90,80,26,OL,7); line(g,80,90,80,26,'#4a3a4a',4);
    circ(g,80,20,8,rgrad(g,80,20,8,'#ffffff','#bdb4a0'),2.5); for(const s of [-1,1]) circ(g,80+s*3,19,2,OL,0);
    g.save(); g.globalAlpha=0.5; circ(g,80,20,14,rgrad(g,80,20,14,'#7aff9a','#00ff6a00',0,0),0); g.restore();
    poly(g,[34,46, 66,46, 78,90, 22,90], lgrad(g,22,46,78,90,'#4a3a5e','#2a1e3a','#140c20'));
    poly(g,[30,84, 70,84, 78,90, 22,90], T.main, 2);
    circ(g,78,58,5.5,'#b8d6b0',2.5);
    g.beginPath(); g.arc(50,38,22,Math.PI*0.9,Math.PI*2.1); g.lineTo(70,62); g.lineTo(30,62); g.closePath(); g.fillStyle=lgrad(g,30,16,70,62,'#3a2e4e','#140c20'); g.fill(); g.lineWidth=3; g.strokeStyle=OL; g.stroke();
    circ(g,50,42,13,'#120a1a',0);
    g.save(); g.shadowColor='#6aff9a'; g.shadowBlur=10; for(const s of [-1,1]) ell(g,50+s*5,42,2.6,3.2,'#8affb0',0); g.restore();
  },
  bomber(g,T){
    boots(g,'#3a2a20');
    rr(g,32,56,36,28,10,lgrad(g,32,56,68,84,'#8a6a4a','#4a3220'));
    rr(g,32,64,36,6,2,T.main,2);
    // barba
    g.beginPath(); g.moveTo(36,46); g.quadraticCurveTo(50,72,64,46); g.closePath(); g.fillStyle=lgrad(g,40,46,60,66,'#c46a2a','#7a3a14'); g.fill(); g.lineWidth=2.5; g.strokeStyle=OL; g.stroke();
    skin(g,50,40,14);
    // gafas
    for(const s of [-1,1]){ circ(g,50+s*7,40,6,'#5a4a3a',2.5); circ(g,50+s*7,40,4,rgrad(g,50+s*7,40,4,'#d8f4ff','#3a8ac4'),0); }
    // gorro
    g.beginPath(); g.arc(50,32,15,Math.PI,TAU); g.closePath(); g.fillStyle=lgrad(g,35,18,65,32,T.light,T.main,T.dark); g.fill(); g.lineWidth=2.5; g.strokeStyle=OL; g.stroke();
    // bomba alzada
    circ(g,74,34,13,rgrad(g,74,34,13,'#6a6a7a','#101018'));
    shine(g,69,29,4,3,0.5);
    rr(g,70,19,8,5,1.5,'#7a7a8a',2);
    g.beginPath(); g.moveTo(74,19); g.quadraticCurveTo(80,10,86,12); g.lineWidth=2; g.strokeStyle='#c9a060'; g.stroke();
    g.save(); g.shadowColor='#ffb020'; g.shadowBlur=10; circ(g,86,12,3.5,'#ffe066',0); g.restore();
    circ(g,66,46,5.5,rgrad(g,66,46,5.5,'#ffe1c2','#d99872'),2.5);
  },
  boarBody(g,T,scale=1,saddle=true,eyeCol='#1b1226'){
    g.save(); g.translate(50,60); g.scale(scale,scale); g.translate(-50,-60);
    // patas
    for(const x of [30,42,62,74]) rr(g,x-4,70,8,18,3,'#4a2a14',2.5);
    // cola
    g.beginPath(); g.moveTo(86,56); g.quadraticCurveTo(96,50,92,62); g.lineWidth=3; g.strokeStyle=OL; g.stroke();
    ell(g,56,62,34,20,lgrad(g,30,42,80,82,'#c47a46','#7a4220','#4a2410'));
    // crin
    for(let i=0;i<6;i++) poly(g,[40+i*7,44, 44+i*7,34, 48+i*7,45],'#3a1a0a',2);
    if(saddle){ rr(g,46,44,24,14,5,lgrad(g,46,44,70,58,T.light,T.main,T.dark),2.5); line(g,58,58,58,76,T.dark,3); }
    // cabeza
    ell(g,24,62,16,14,lgrad(g,10,50,36,76,'#c47a46','#6a3a1a'));
    ell(g,12,66,8,7,'#f0a0a0',2.5); circ(g,10,65,1.6,OL,0); circ(g,14,65,1.6,OL,0);
    poly(g,[18,72, 12,82, 22,74],'#fffbea',2); poly(g,[26,72, 26,84, 30,73],'#fffbea',2);
    poly(g,[28,48, 34,40, 36,52],'#6a3a1a',2);
    circ(g,22,58,3.2,eyeCol,0); circ(g,21,57,1.1,'#fff',0);
    g.restore();
  },
  boar(g,T){ SPR.boarBody(g,T,1,true); },
  minib(g,T){ SPR.boarBody(g,T,0.85,false,'#ff3030'); poly(g,[40,46, 64,46, 60,52, 44,52],T.main,2); },
  rider(g,T){
    SPR.boarBody(g,T,1,true);
    // jinete
    rr(g,46,24,22,24,8,lgrad(g,46,24,68,48,'#f5f8fc','#8d9aaa'),2.5);
    poly(g,[50,28, 64,28, 62,48, 52,48],T.main,2);
    // lanza
    line(g,30,40,92,22,OL,6); line(g,30,40,92,22,'#8a5a2a',3.5); poly(g,[92,16, 100,20, 92,28],'#dfe6ee',2);
    circ(g,57,14,12,rgrad(g,57,14,12,'#ffffff','#7f8b9c'),2.5);
    rr(g,49,12,16,5,2,'#232030',1.5);
    g.beginPath(); g.moveTo(56,3); g.bezierCurveTo(62,-6,74,-2,76,6); g.bezierCurveTo(68,2,62,4,58,8); g.closePath(); g.fillStyle=T.main; g.fill(); g.lineWidth=2; g.strokeStyle=OL; g.stroke();
  },
  repair(g,T){ drawSmithBody(g,T,false,0,false); },
  bats(g,T){
    for(const sd of [-1,1]){ g.beginPath(); g.moveTo(50,52); g.quadraticCurveTo(50+sd*24,30,50+sd*44,38); g.lineTo(50+sd*38,50); g.lineTo(50+sd*30,46); g.lineTo(50+sd*24,56); g.lineTo(50+sd*16,52); g.closePath();
      g.fillStyle=lgrad(g,50,30,50+sd*44,56,T.main,T.dark); g.fill(); g.lineWidth=2.5; g.strokeStyle=OL; g.stroke(); }
    ell(g,50,56,13,15,rgrad(g,50,56,14,'#6a5a7a','#2a1e36'));
    for(const sd of [-1,1]) poly(g,[50+sd*5,44, 50+sd*11,32, 50+sd*12,46],'#3a2e4a',2);
    for(const sd of [-1,1]){ ell(g,50+sd*5,53,3.2,3.6,'#ffe066',1.5); circ(g,50+sd*5,54,1.4,OL,0); }
    poly(g,[46,62, 48,67, 50,62],'#fff',1); poly(g,[50,62, 52,67, 54,62],'#fff',1);
  },
  dragonBody(g,T,big){
    const c1 = big ? '#5a1a1a' : T.main, c2 = big ? '#1a0606' : T.dark, belly = big ? '#ffb030' : T.light;
    // alas
    for(const sd of [1]){ g.beginPath(); g.moveTo(56,44); g.quadraticCurveTo(70,6,96,10); g.lineTo(88,24); g.lineTo(94,30); g.lineTo(80,36); g.lineTo(84,44); g.lineTo(66,52); g.closePath();
      g.fillStyle=lgrad(g,56,10,96,52,c1,c2); g.fill(); g.lineWidth=2.5; g.strokeStyle=OL; g.stroke(); line(g,58,46,90,14,'#00000040',2); }
    // cola
    g.beginPath(); g.moveTo(66,70); g.quadraticCurveTo(88,80,94,64); g.lineWidth=9; g.strokeStyle=OL; g.stroke(); g.lineWidth=5.5; g.strokeStyle=c1; g.stroke();
    poly(g,[90,58, 100,60, 94,68],big?'#ffb030':T.light,2);
    // cuerpo
    ell(g,56,64,20,16,lgrad(g,36,48,76,80,c1,c2));
    ell(g,52,70,11,9,belly,2);
    // ala delantera
    g.beginPath(); g.moveTo(50,50); g.quadraticCurveTo(30,14,6,18); g.lineTo(16,30); g.lineTo(8,38); g.lineTo(24,40); g.lineTo(20,50); g.lineTo(40,56); g.closePath();
    g.fillStyle=lgrad(g,6,14,50,56,c1,c2); g.fill(); g.lineWidth=2.5; g.strokeStyle=OL; g.stroke();
    // cabeza
    ell(g,30,46,15,12,lgrad(g,15,34,45,58,c1,c2));
    ell(g,18,50,8,6,lgrad(g,10,44,26,56,c1,c2),2.5);
    circ(g,14,48,1.4,OL,0);
    for(const x of [30,38]) poly(g,[x-3,36, x+2,24, x+4,36],big?'#e8d8c0':'#fff4d8',2);
    ell(g,30,44,4,4.5,big?'#ffe066':'#fff',1.5); circ(g,29,44.5,2,OL,0);
    if(big){ g.save(); g.shadowColor='#ff6a00'; g.shadowBlur=12; for(const [x,y] of [[56,58],[62,66],[50,64]]) circ(g,x,y,2.2,'#ffb030',0); g.restore(); }
    // patas
    rr(g,46,76,8,12,3,c2,2); rr(g,60,76,8,12,3,c2,2);
  },
  dragon(g,T){ SPR.dragonBody(g,T,false); },
  infernal(g,T){ SPR.dragonBody(g,T,true); poly(g,[44,52, 64,52, 62,58, 46,58],T.main,2); },
  hunter(g,T){
    boots(g,'#4a3020');
    poly(g,[34,50, 66,50, 70,86, 30,86], lgrad(g,30,50,70,86,'#8a6a3a','#4a3418'));
    poly(g,[34,50, 44,50, 50,86, 30,86], T.main, 2);
    rr(g,30,66,40,5,2,'#3a2410',2);
    skin(g,50,38,14);
    g.beginPath(); g.moveTo(38,42); g.quadraticCurveTo(50,62,62,42); g.quadraticCurveTo(50,48,38,42); g.fillStyle='#6a4a2a'; g.fill(); g.lineWidth=2; g.strokeStyle=OL; g.stroke();
    eyes(g,50,37,5.5,2.5);
    // sombrero con pluma
    ell(g,50,28,22,6,'#4a3418',2.5);
    g.beginPath(); g.moveTo(36,28); g.quadraticCurveTo(40,12,54,12); g.quadraticCurveTo(64,14,64,28); g.closePath(); g.fillStyle=lgrad(g,36,12,64,28,'#6a4a2a','#3a2410'); g.fill(); g.lineWidth=2.5; g.strokeStyle=OL; g.stroke();
    g.beginPath(); g.moveTo(60,24); g.quadraticCurveTo(80,4,76,0); g.quadraticCurveTo(70,12,58,22); g.fillStyle=T.main; g.fill(); g.lineWidth=2; g.strokeStyle=OL; g.stroke();
    // ballesta
    rr(g,56,56,36,7,2,'#7a4a24',2.5);
    g.beginPath(); g.moveTo(88,44); g.quadraticCurveTo(80,60,88,76); g.lineWidth=5; g.strokeStyle=OL; g.stroke(); g.lineWidth=3; g.strokeStyle='#5a3416'; g.stroke();
    line(g,88,44,88,76,'#eee',1.2); poly(g,[92,56, 100,59.5, 92,63],'#dfe6ee',1.5);
    circ(g,60,60,5,rgrad(g,60,60,5,'#ffe1c2','#d99872'),2.5);
  },
  ballista(g,T){
    ell(g,50,88,36,8,'rgba(0,0,0,0.25)',0);
    poly(g,[20,86, 80,86, 72,62, 28,62], lgrad(g,20,62,80,86,'#a87444','#5a3416'));
    for(const x of [34,50,66]) line(g,x,64,x,84,'#00000030',2);
    rr(g,44,40,12,26,3,'#6a3e1c',2.5);
    rr(g,14,34,72,10,3,lgrad(g,14,34,14,44,'#c08a52','#7a4a24'),2.5);
    g.beginPath(); g.moveTo(10,30); g.quadraticCurveTo(50,62,90,30); g.lineWidth=7; g.strokeStyle=OL; g.stroke(); g.lineWidth=4; g.strokeStyle='#5a3416'; g.stroke();
    line(g,10,30,50,48,'#eee',1.5); line(g,90,30,50,48,'#eee',1.5);
    line(g,50,50,50,12,OL,5); line(g,50,50,50,12,'#8a5a2a',3); poly(g,[44,14, 50,2, 56,14],'#dfe6ee',2);
    poly(g,[62,62, 62,46, 74,50, 62,54],T.main,1.5); line(g,62,62,62,44,OL,2);
  },
  mortar(g,T){
    ell(g,50,88,36,8,'rgba(0,0,0,0.25)',0);
    rr(g,18,60,64,28,6,lgrad(g,18,60,82,88,'#cfc7bb','#7a7268'));
    for(let i=0;i<4;i++) rr(g,20+i*16,52,12,12,2,'#b5ad9f',2);
    g.save(); g.translate(50,58); g.rotate(-0.35);
    rr(g,-15,-34,30,40,8,lgrad(g,-15,-34,15,6,'#5a5a6a','#20202a'),3);
    ell(g,0,-34,15,5,'#101018',2.5); rr(g,-17,-12,34,7,2,'#8a8a9a',2);
    g.restore();
    poly(g,[22,62, 22,40, 36,46, 22,52],T.main,1.5); line(g,22,64,22,38,OL,2.5);
    for(const x of [70,78]) circ(g,x,80,5,rgrad(g,x,80,5,'#6a6a7a','#101018'),1.5);
  },
  frost(g){
    g.save(); g.shadowColor='#9ae4ff'; g.shadowBlur=16;
    for(let i=0;i<6;i++){ g.save(); g.translate(50,50); g.rotate(i*Math.PI/3); line(g,0,0,0,-42,'#ffffff',7); line(g,0,-26,-11,-36,'#ffffff',5); line(g,0,-26,11,-36,'#ffffff',5); line(g,0,-12,-8,-20,'#ffffff',4); line(g,0,-12,8,-20,'#ffffff',4); g.restore(); }
    circ(g,50,50,10,rgrad(g,50,50,10,'#ffffff','#7fd6ff'),2.5);
    g.restore();
  },
  icemage(g,T){
    line(g,80,90,80,26,OL,7); line(g,80,90,80,26,'#d8eef8',4);
    g.save(); g.shadowColor='#7fd6ff'; g.shadowBlur=14; poly(g,[80,6, 88,20, 84,32, 76,32, 72,20],lgrad(g,72,6,88,32,'#ffffff','#5ab8f0'),2.5); g.restore();
    poly(g,[36,48, 64,48, 76,90, 24,90], lgrad(g,24,48,76,90,'#e8f6ff','#9ad0f0','#4a8ac0'));
    poly(g,[46,48, 54,48, 58,90, 42,90], T.main, 2);
    rr(g,34,62,32,6,2,'#bfe8ff',2);
    circ(g,78,58,5.5,rgrad(g,78,58,5.5,'#ffe1c2','#d99872'),2.5);
    skin(g,50,38,14);
    g.beginPath(); g.moveTo(37,40); g.quadraticCurveTo(50,72,63,40); g.quadraticCurveTo(50,50,37,40); g.fillStyle=lgrad(g,40,40,60,66,'#ffffff','#cfe6f4'); g.fill(); g.lineWidth=2.5; g.strokeStyle=OL; g.stroke();
    eyes(g,50,38,5.5,2.6,'#1a5a8a');
    ell(g,50,28,24,6,'#4a8ac0',2.5);
    g.beginPath(); g.moveTo(32,28); g.lineTo(40,12); g.lineTo(46,18); g.lineTo(52,2); g.lineTo(58,18); g.lineTo(64,12); g.lineTo(68,28); g.closePath(); g.fillStyle=lgrad(g,32,2,68,28,'#ffffff','#9ad0f0'); g.fill(); g.lineWidth=2.5; g.strokeStyle=OL; g.stroke();
  },
  berserk(g,T){
    boots(g,'#4a3020');
    // hacha
    line(g,82,90,74,22,OL,7); line(g,82,90,74,22,'#8a5a2a',4);
    g.beginPath(); g.moveTo(74,26); g.quadraticCurveTo(96,22,98,44); g.quadraticCurveTo(86,38,76,40); g.closePath(); g.fillStyle=lgrad(g,74,22,98,44,'#ffffff','#8a96a6'); g.fill(); g.lineWidth=2.5; g.strokeStyle=OL; g.stroke();
    // torso desnudo
    rr(g,28,50,44,30,14,rgrad(g,50,62,26,'#ffd9b8','#d08a5a'));
    line(g,50,56,50,72,'#b06a40',2); line(g,40,62,46,64,'#b06a40',2); line(g,60,62,54,64,'#b06a40',2);
    rr(g,30,72,40,10,3,T.main,2.5); circ(g,50,77,3,'#ffe066',1.5);
    circ(g,26,62,7,rgrad(g,26,62,7,'#ffd9b8','#d08a5a'),2.5); circ(g,76,60,7,rgrad(g,76,60,7,'#ffd9b8','#d08a5a'),2.5);
    skin(g,50,38,15,'#ffd9b8','#d08a5a');
    g.beginPath(); g.moveTo(35,42); g.quadraticCurveTo(50,74,65,42); g.quadraticCurveTo(50,52,35,42); g.fillStyle=lgrad(g,40,42,60,70,'#e0602a','#8a2a10'); g.fill(); g.lineWidth=2.5; g.strokeStyle=OL; g.stroke();
    eyes(g,50,37,6,2.8); line(g,42,31,48,34,OL,2.5); line(g,58,31,52,34,OL,2.5);
    // casco con cuernos
    g.beginPath(); g.arc(50,32,15,Math.PI,TAU); g.closePath(); g.fillStyle=lgrad(g,35,17,65,32,'#c8c8d8','#6a6a7a'); g.fill(); g.lineWidth=2.5; g.strokeStyle=OL; g.stroke();
    for(const sd of [-1,1]){ g.beginPath(); g.moveTo(50+sd*13,26); g.quadraticCurveTo(50+sd*28,22,50+sd*26,6); g.quadraticCurveTo(50+sd*22,18,50+sd*12,20); g.closePath(); g.fillStyle='#f4ecd8'; g.fill(); g.lineWidth=2; g.strokeStyle=OL; g.stroke(); }
  },
  warlord(g,T){
    boots(g,'#3a3040');
    g.beginPath(); g.moveTo(30,50); g.lineTo(70,50); g.lineTo(80,92); g.lineTo(20,92); g.closePath(); g.fillStyle=lgrad(g,20,50,80,92,T.light,T.main,T.dark); g.fill(); g.lineWidth=3; g.strokeStyle=OL; g.stroke();
    line(g,88,92,78,14,OL,8); line(g,88,92,78,14,'#6a4a2a',5);
    for(const sd of [-1,1]){ g.beginPath(); g.moveTo(78,22); g.quadraticCurveTo(78+sd*22,14,78+sd*22,40); g.quadraticCurveTo(78+sd*12,32,79,36); g.closePath(); g.fillStyle=lgrad(g,60,14,100,40,'#ffffff','#7a8696'); g.fill(); g.lineWidth=2.5; g.strokeStyle=OL; g.stroke(); }
    rr(g,28,48,44,32,12,lgrad(g,28,48,72,80,'#9aa4b4','#4a5262'));
    line(g,50,52,50,78,'#ffffff40',3);
    circ(g,24,58,9,lgrad(g,15,49,33,67,'#c8d0dc','#5a6272'),2.5); circ(g,76,58,9,lgrad(g,67,49,85,67,'#c8d0dc','#5a6272'),2.5);
    circ(g,50,34,18,rgrad(g,50,34,18,'#e8eef4','#5a6272'));
    rr(g,38,32,24,6,2,'#1a1622',2); g.save(); g.shadowColor='#ff3010'; g.shadowBlur=8; circ(g,44,35,1.8,'#ff5a2a',0); circ(g,56,35,1.8,'#ff5a2a',0); g.restore();
    for(const sd of [-1,1]){ g.beginPath(); g.moveTo(50+sd*15,26); g.quadraticCurveTo(50+sd*32,20,50+sd*30,2); g.quadraticCurveTo(50+sd*24,16,50+sd*13,18); g.closePath(); g.fillStyle='#f4ecd8'; g.fill(); g.lineWidth=2; g.strokeStyle=OL; g.stroke(); }
  },
  chest(g){
    ell(g,50,86,32,7,'rgba(0,0,0,0.3)',0);
    rr(g,18,46,64,40,6,lgrad(g,18,46,82,86,'#c48a4a','#6a3e1c'));
    g.beginPath(); g.moveTo(18,50); g.quadraticCurveTo(50,18,82,50); g.closePath(); g.fillStyle=lgrad(g,18,26,82,50,'#d89a5a','#8a5428'); g.fill(); g.lineWidth=3; g.strokeStyle=OL; g.stroke();
    for(const x of [26,74]) rr(g,x-4,30,8,56,2,'#f2c24b',2);
    line(g,18,50,82,50,OL,3);
    rr(g,43,44,14,16,3,'#f2c24b',2.5); circ(g,50,52,2.5,OL,0);
    g.save(); g.shadowColor='#ffe066'; g.shadowBlur=10; for(const [x,y] of [[34,40],[62,36],[48,30]]) poly(g,[x,y-4, x+1.5,y, x,y+4, x-1.5,y],'#fffbe0',0); g.restore();
  },
  orcHead(g,x,y,r,T,helm){
    for(const sd of [-1,1]) poly(g,[x+sd*r*0.8,y-r*0.1, x+sd*r*1.6,y-r*0.5, x+sd*r*0.9,y+r*0.4], lgrad(g,x,y-r,x+sd*r*1.6,y+r,'#9ad46a','#4a7a2a'),2.5);
    circ(g,x,y,r,rgrad(g,x,y,r,'#a8e07a','#4f8a2e'));
    line(g,x-r*0.6,y-r*0.35,x-r*0.15,y-r*0.15,OL,2.5); line(g,x+r*0.6,y-r*0.35,x+r*0.15,y-r*0.15,OL,2.5);
    for(const sd of [-1,1]){ circ(g,x+sd*r*0.38,y,r*0.16,'#ffe066',1.5); circ(g,x+sd*r*0.38,y+r*0.02,r*0.07,OL,0); }
    ell(g,x,y+r*0.5,r*0.5,r*0.22,'#3a5a20',0);
    for(const sd of [-1,1]) poly(g,[x+sd*r*0.32,y+r*0.62, x+sd*r*0.42,y+r*0.2, x+sd*r*0.18,y+r*0.55],'#fffbea',1.5);
    if(helm){ g.beginPath(); g.arc(x,y-r*0.1,r*1.02,Math.PI*1.05,Math.PI*1.95); g.lineTo(x+r*0.6,y-r*0.45); g.lineTo(x-r*0.6,y-r*0.45); g.closePath(); g.fillStyle=lgrad(g,x-r,y-r,x+r,y,'#8a7a6a','#3a3028'); g.fill(); g.lineWidth=2.5; g.strokeStyle=OL; g.stroke(); poly(g,[x-3,y-r*1.05, x,y-r*1.6, x+3,y-r*1.05],'#e8dcc0',2); }
  },
  grunt(g,T){
    boots(g,'#3a2a20');
    rr(g,28,50,44,32,12,lgrad(g,28,50,72,82,'#7a5a3a','#3a2818'));
    poly(g,[34,54, 66,54, 64,86, 36,86], lgrad(g,34,54,66,86,T.light,T.main,T.dark),2.5);
    rr(g,30,70,40,6,2,'#2a1a10',2); circ(g,50,73,3.5,'#c9c0aa',1.5);
    line(g,82,90,76,30,OL,7); line(g,82,90,76,30,'#6a4a2a',4);
    g.beginPath(); g.moveTo(76,30); g.quadraticCurveTo(98,26,96,52); g.quadraticCurveTo(86,44,78,46); g.closePath(); g.fillStyle=lgrad(g,76,26,98,52,'#ffffff','#7a8696'); g.fill(); g.lineWidth=2.5; g.strokeStyle=OL; g.stroke();
    circ(g,78,62,7,rgrad(g,78,62,7,'#a8e07a','#4f8a2e'),2.5); circ(g,22,64,7,rgrad(g,22,64,7,'#a8e07a','#4f8a2e'),2.5);
    SPR.orcHead(g,50,36,16,T,true);
  },
  axeman(g,T){
    boots(g,'#3a2a20');
    poly(g,[34,52, 66,52, 70,86, 30,86], lgrad(g,30,52,70,86,'#8a6a42','#4a3418'));
    poly(g,[34,52, 66,72, 66,78, 34,58], T.main, 2);
    for(const [x,y,a] of [[72,46,-0.4]]){ g.save(); g.translate(x,y); g.rotate(a); line(g,0,18,0,-14,OL,6); line(g,0,18,0,-14,'#6a4a2a',3.5); g.beginPath(); g.moveTo(0,-14); g.quadraticCurveTo(16,-18,14,0); g.quadraticCurveTo(8,-6,1,-4); g.closePath(); g.fillStyle=lgrad(g,0,-18,16,0,'#ffffff','#8a96a6'); g.fill(); g.lineWidth=2; g.strokeStyle=OL; g.stroke(); g.restore(); }
    circ(g,74,60,6,rgrad(g,74,60,6,'#a8e07a','#4f8a2e'),2.5);
    SPR.orcHead(g,50,38,15,T,false);
    g.beginPath(); g.arc(50,30,13,Math.PI*1.1,Math.PI*1.9); g.lineTo(62,26); g.lineTo(38,26); g.closePath(); g.fillStyle=T.main; g.fill(); g.lineWidth=2; g.strokeStyle=OL; g.stroke();
  },
  wolf(g,T,wild){
    for(const x of [30,40,62,72]) rr(g,x-3.5,70,7,18,3,'#4a4a52',2.5);
    g.beginPath(); g.moveTo(84,56); g.quadraticCurveTo(98,46,96,60); g.lineWidth=6; g.strokeStyle=OL; g.stroke(); g.lineWidth=3.5; g.strokeStyle='#7a7a86'; g.stroke();
    ell(g,56,62,30,15,lgrad(g,30,46,84,78,'#a8a8b4','#4a4a56'));
    for(let i=0;i<5;i++) poly(g,[46+i*7,48, 50+i*7,40, 54+i*7,49],'#6a6a76',1.5);
    if(!wild) poly(g,[40,56, 60,52, 62,60, 42,64],T.main,2); else poly(g,[40,56, 60,52, 62,60, 42,64],'#a8162b',2);
    ell(g,24,56,15,12,lgrad(g,10,44,38,68,'#b8b8c4','#5a5a66'));
    poly(g,[6,60, 18,54, 20,66],'#8a8a96',2.5); circ(g,7,60,2,OL,0);
    for(const x of [22,30]) poly(g,[x-4,46, x,32, x+4,46],'#8a8a96',2);
    ell(g,22,54,3,3.4,wild?'#ff3020':'#ffe066',1.5); circ(g,21.5,54.5,1.4,OL,0);
    poly(g,[12,64, 14,69, 16,64],'#fff',1);
  },
  wolf2(g,T){ SPR.wolf(g,T,true); },
  sapper(g,T){
    boots(g,'#3a2a20');
    rr(g,36,58,28,24,8,lgrad(g,36,58,64,82,'#8a6a42','#4a3418'));
    rr(g,36,64,28,5,2,T.main,2);
    // barril de pólvora a la espalda
    rr(g,58,34,26,30,8,lgrad(g,58,34,84,64,'#a8743a','#5a3416'),2.5); for(const y of [42,56]) line(g,59,y,83,y,'#4a4a52',3);
    line(g,71,34,76,22,'#c9a060',2.5); g.save(); g.shadowColor='#ffb020'; g.shadowBlur=10; circ(g,77,20,3.5,'#ffe066',0); g.restore();
    for(const sd of [-1,1]) poly(g,[50+sd*12,38, 50+sd*32,28, 50+sd*14,48], lgrad(g,50,28,50+sd*32,48,'#9ad46a','#4a7a2a'),2.5);
    circ(g,50,42,15,rgrad(g,50,42,15,'#a8e07a','#4f8a2e'));
    for(const sd of [-1,1]){ ell(g,50+sd*6,42,4,4.5,'#fff23a',1.5); circ(g,50+sd*6,43,2,OL,0); }
    g.beginPath(); g.arc(50,48,6,0.1*Math.PI,0.9*Math.PI); g.lineWidth=2.5; g.strokeStyle=OL; g.stroke();
    rr(g,36,30,28,6,3,'#5a5a66',2); for(const sd of [-1,1]) circ(g,50+sd*7,33,4,rgrad(g,50+sd*7,33,4,'#d8f4ff','#3a8ac4'),1.5);
  },
  shaman(g,T){
    line(g,80,90,80,24,OL,7); line(g,80,90,80,24,'#6a4a2a',4);
    circ(g,80,20,8,rgrad(g,80,20,8,'#ffffff','#c9c0aa'),2.5); for(const sd of [-1,1]) circ(g,80+sd*3,19,2,OL,0);
    g.save(); g.shadowColor='#ff4a2a'; g.shadowBlur=12; circ(g,80,20,3,'#ff6a3a',0); g.restore();
    for(const a of [-0.6,0,0.6]) line(g,80,28,80+Math.sin(a)*10,40,'#e8dcc0',2);
    poly(g,[34,50, 66,50, 74,90, 26,90], lgrad(g,26,50,74,90,'#8a5a3a','#3a2010'));
    poly(g,[44,50, 56,50, 58,90, 42,90], T.main, 2);
    for(const y of [60,72]) line(g,30,y,70,y,'#e8dcc0',2);
    circ(g,78,60,6,rgrad(g,78,60,6,'#a8e07a','#4f8a2e'),2.5);
    SPR.orcHead(g,50,38,15,T,false);
    for(const [x,c] of [[38,'#ff4a2a'],[50,'#ffe066'],[62,T.main]]) poly(g,[x-3,26, x,8, x+3,26],c,2);
  },
  wrider(g,T){
    SPR.wolf(g,T,false);
    rr(g,44,26,22,24,8,lgrad(g,44,26,66,50,'#7a5a3a','#3a2818'),2.5);
    poly(g,[48,30, 62,30, 60,50, 50,50],T.main,2);
    line(g,30,44,88,20,OL,6); line(g,30,44,88,20,'#6a4a2a',3.5); poly(g,[86,14, 96,18, 88,26],'#dfe6ee',2);
    SPR.orcHead(g,55,16,11,T,true);
  },
  ogreBody(g,T,mage){
    rr(g,34,78,12,14,4,'#3a2a20',2.5); rr(g,54,78,12,14,4,'#3a2a20',2.5);
    ell(g,50,62,30,24,rgrad(g,50,58,30,mage?'#9ac8e8':'#c8a878',mage?'#3a5a8a':'#6a5030'));
    poly(g,[28,66, 72,66, 70,84, 30,84], mage?lgrad(g,28,66,72,84,'#5a3a8a','#2a1a4a'):lgrad(g,28,66,72,84,'#7a5a3a','#3a2818'),2.5);
    rr(g,28,64,44,6,2,T.main,2);
    for(const sd of [-1,1]) circ(g,50+sd*30,64,10,rgrad(g,50+sd*30,64,10,mage?'#9ac8e8':'#c8a878',mage?'#3a5a8a':'#6a5030'),2.5);
    circ(g,50,30,17,rgrad(g,50,30,17,mage?'#a8d0f0':'#d8b888',mage?'#4a6a9a':'#7a6040'));
    for(const sd of [-1,1]){ circ(g,50+sd*6,28,3.5,'#fff',1.5); circ(g,50+sd*6,28.5,1.6,OL,0); }
    line(g,42,22,47,24,OL,3); line(g,58,22,53,24,OL,3);
    ell(g,50,38,7,3.5,'#3a2010',0); for(const sd of [-1,1]) poly(g,[50+sd*4,40, 50+sd*6,32, 50+sd*2,38],'#fffbea',1.5);
  },
  ogre(g,T){
    SPR.ogreBody(g,T,false);
    g.save(); g.translate(84,70); g.rotate(0.25); rr(g,-6,-38,12,44,6,lgrad(g,-6,-38,6,6,'#9a7048','#4a3018'),2.5); for(const y of [-30,-18]) circ(g,0,y,2.5,'#c9c0aa',1); g.restore();
  },
  ogremage(g,T){
    SPR.ogreBody(g,T,true);
    line(g,84,90,84,22,OL,7); line(g,84,90,84,22,'#3a2a5a',4);
    g.save(); g.shadowColor='#ff4a2a'; g.shadowBlur=16; circ(g,84,18,8,rgrad(g,84,18,8,'#ffffff','#ff4a2a'),2.5); g.restore();
    poly(g,[36,18, 40,2, 46,14, 50,0, 54,14, 60,2, 64,18],lgrad(g,0,0,0,18,'#c084ff','#5a1a9a'),2);
  },
  totem(g,T){
    ell(g,50,90,26,6,'rgba(0,0,0,0.25)',0);
    rr(g,36,14,28,76,6,lgrad(g,36,14,64,90,'#a87444','#5a3416'));
    for(const y of [24,50]){ rr(g,38,y,24,22,4,'#7a4a24',2); for(const sd of [-1,1]){ poly(g,[50+sd*4,y+6, 50+sd*10,y+6, 50+sd*7,y+10],'#ffe066',1.5); } rr(g,44,y+13,12,5,2,'#2a1a10',1.5); }
    for(const sd of [-1,1]){ g.beginPath(); g.moveTo(50+sd*12,18); g.quadraticCurveTo(50+sd*30,12,50+sd*28,-2); g.quadraticCurveTo(50+sd*24,10,50+sd*12,12); g.closePath(); g.fillStyle='#f4ecd8'; g.fill(); g.lineWidth=2; g.strokeStyle=OL; g.stroke(); }
    poly(g,[64,30, 84,34, 64,46],T.main,2); line(g,64,28,64,48,OL,2.5);
    g.save(); g.shadowColor='#ff4a2a'; g.shadowBlur=10; circ(g,50,78,4,'#ff6a3a',0); g.restore();
  },
  warchief(g,T){
    boots(g,'#2a1a10');
    g.beginPath(); g.moveTo(28,48); g.lineTo(72,48); g.lineTo(82,92); g.lineTo(18,92); g.closePath(); g.fillStyle=lgrad(g,18,48,82,92,T.light,T.main,T.dark); g.fill(); g.lineWidth=3; g.strokeStyle=OL; g.stroke();
    rr(g,28,48,44,32,12,lgrad(g,28,48,72,80,'#6a6a7a','#2a2a36'));
    for(const sd of [-1,1]){ circ(g,50+sd*24,54,10,lgrad(g,40,44,60,64,'#9a9aaa','#3a3a46'),2.5); for(const a of [-0.4,0.4]) poly(g,[50+sd*24,46, 50+sd*24+Math.sin(a)*4,36, 50+sd*24+4*Math.sign(a),46],'#e8dcc0',1.5); }
    line(g,86,92,78,18,OL,8); line(g,86,92,78,18,'#4a3018',5);
    g.beginPath(); g.moveTo(78,22); g.quadraticCurveTo(102,16,100,46); g.quadraticCurveTo(88,38,79,40); g.closePath(); g.fillStyle=lgrad(g,78,16,102,46,'#ffffff','#7a8696'); g.fill(); g.lineWidth=2.5; g.strokeStyle=OL; g.stroke();
    SPR.orcHead(g,50,32,17,T,true);
  },
  zeppelin(g,T){
    ell(g,50,30,40,22,lgrad(g,10,8,90,52,'#c8b090','#6a5030'));
    for(const x of [30,50,70]) { g.beginPath(); g.ellipse(50,30,Math.abs(x-50)+4,22,0,0,TAU); g.lineWidth=1.5; g.strokeStyle='#00000030'; g.stroke(); }
    ell(g,50,30,40,22,null,3);
    poly(g,[86,24, 98,14, 98,40, 86,34],T.main,2.5);
    rr(g,30,26,40,10,3,T.main,2);
    for(const x of [36,64]) line(g,x,50,x+2,60,OL,2);
    rr(g,30,58,40,16,4,lgrad(g,30,58,70,74,'#a87444','#5a3416'),2.5);
    circ(g,42,64,6,rgrad(g,42,64,6,'#a8e07a','#4f8a2e'),2); for(const sd of [-1,1]) circ(g,42+sd*2.4,63,1.2,OL,0);
    circ(g,58,80,6,rgrad(g,58,80,6,'#6a6a7a','#101018'),2); line(g,58,74,60,70,'#c9a060',1.5);
  },
  catapult(g,T){
    ell(g,50,88,38,8,'rgba(0,0,0,0.25)',0);
    rr(g,16,66,68,14,4,lgrad(g,16,66,84,80,'#a87444','#5a3416'));
    for(const x of [26,74]) { circ(g,x,82,8,'#4a3018',2.5); circ(g,x,82,3,'#8a8276',1.5); }
    poly(g,[30,66, 50,40, 70,66],null,0); line(g,30,66,50,42,'#6a3e1c',6); line(g,70,66,50,42,'#6a3e1c',6);
    g.save(); g.translate(50,44); g.rotate(-0.8); rr(g,-4,-40,8,46,3,'#8a5a2a',2.5); g.beginPath(); g.arc(0,-40,9,0,Math.PI); g.fillStyle='#5a3416'; g.fill(); g.lineWidth=2; g.strokeStyle=OL; g.stroke(); circ(g,0,-44,7,'#8a8276',2); g.restore();
    poly(g,[18,66, 18,44, 32,50, 18,56],T.main,1.5); line(g,18,68,18,42,OL,2.5);
  },
  boulder(g){
    g.save(); g.shadowColor='#000'; g.shadowBlur=8;
    poly(g,[24,40, 42,18, 72,22, 88,48, 78,78, 46,86, 18,70],lgrad(g,20,18,88,86,'#d6d0c6','#6e665c','#3a342e'),3); g.restore();
    line(g,40,40,52,52,'#00000040',3); line(g,60,34,66,48,'#00000040',3); shine(g,42,30,8,4,0.35);
    for(const [x,y] of [[10,20],[90,14],[16,92]]) poly(g,[x-4,y, x,y-5, x+4,y, x,y+4],'#a39a8e',1.5);
  },
  bcry(g){
    g.save(); g.translate(50,52); g.rotate(-0.4);
    g.beginPath(); g.moveTo(-34,8); g.quadraticCurveTo(-10,14,20,-4); g.lineTo(30,-20); g.quadraticCurveTo(40,-8,32,8); g.quadraticCurveTo(0,30,-34,18); g.closePath();
    g.fillStyle=lgrad(g,-34,-20,40,30,'#f4ecd8','#a89878'); g.fill(); g.lineWidth=3; g.strokeStyle=OL; g.stroke();
    for(const x of [-18,-2,12]) line(g,x,4+x*0.1,x+3,20+x*0.2,'#8a5a2a',3);
    g.restore();
    for(const [r,a] of [[20,0.5],[30,0.35],[40,0.2]]){ g.beginPath(); g.arc(82,30,r,-0.7,0.7); g.lineWidth=4; g.strokeStyle=`rgba(255,120,40,${a+0.3})`; g.stroke(); }
  },
  // ===== Hechizos (arte de carta) =====
  fireball(g){
    g.save(); g.shadowColor='#ff7a00'; g.shadowBlur=18;
    g.beginPath(); g.moveTo(30,40); g.quadraticCurveTo(80,10,96,4); g.quadraticCurveTo(84,30,66,72); g.closePath(); g.fillStyle=lgrad(g,30,40,96,4,'#ff7a1a00','#ff9a2acc','#ffe066'); g.fill();
    circ(g,40,62,26,rgrad(g,40,62,26,'#fff6b0','#ff5a0a'),3); g.restore();
    circ(g,34,56,9,'#fffbe0',0);
  },
  zap(g){
    g.save(); g.shadowColor='#6fd0ff'; g.shadowBlur=18;
    poly(g,[58,4, 26,52, 46,52, 34,96, 76,40, 54,40, 70,4],lgrad(g,30,4,70,96,'#ffffff','#9ae4ff','#2a8aff'),3); g.restore();
  },
  storm(g){
    g.save(); g.shadowColor='#9ae4ff'; g.shadowBlur=14;
    poly(g,[50,40, 34,70, 46,70, 38,96, 66,60, 54,60, 64,40],lgrad(g,30,40,70,96,'#ffffff','#9ae4ff','#2a8aff'),2.5); g.restore();
    for(const [x,y,r] of [[28,34,16],[50,24,20],[72,34,16],[40,40,14],[62,40,14]]) circ(g,x,y,r,rgrad(g,x,y,r,'#8a84a8','#3a3456'),0);
    g.beginPath(); g.moveTo(12,40); g.lineTo(88,40); g.lineWidth=0;
    shine(g,46,18,10,4,0.3);
  },
  bombbarr(g){
    rr(g,26,30,48,56,14,lgrad(g,26,30,74,86,'#c48a4a','#7a4a20'));
    for(const y of [40,58,76]) line(g,27,y,73,y,'#5a5a66',4);
    line(g,50,30,58,14,'#c9a060',3);
    g.save(); g.shadowColor='#ffb020'; g.shadowBlur=12; circ(g,58,12,5,'#ffe066',0); g.restore();
    circ(g,50,58,9,'#7bd35a',2.5); for(const s of [-1,1]) circ(g,50+s*3.5,57,1.5,OL,0);
  },
};

// ---- caché de sprites ----
const SPRITE_CACHE = new Map();
function spriteKey(cardKey){ return CARDS[cardKey].sprite || cardKey; }
function getSprite(key, side, px){
  px = Math.max(8, Math.round(px));
  const k = key+'|'+side+'|'+px;
  let c = SPRITE_CACHE.get(k);
  if(c) return c;
  const pad = 0.25, full = px*(1+pad*2);
  const normal = mkHi(full, full), g = normal.getContext('2d');
  g.scale(SS, SS); g.translate(px*pad, px*pad); g.scale(px/100, px/100);
  const im = imgFor(key);
  if(im){ g.imageSmoothingQuality = 'high'; drawImgFit(g, im); g.setTransform(1,0,0,1,0,0); if(side==='e') recolorRed(normal); }
  else if(SPR[key]) SPR[key](g, TEAM[side]);
  const white = mkHi(full, full), w = white.getContext('2d');
  w.drawImage(normal,0,0); w.globalCompositeOperation='source-atop'; w.fillStyle='#fff'; w.fillRect(0,0,white.width,white.height);
  c = {normal, white, px, pad:px*pad};
  SPRITE_CACHE.set(k, c);
  if(SPRITE_CACHE.size > 400) SPRITE_CACHE.delete(SPRITE_CACHE.keys().next().value);
  return c;
}

// ---- arte de cartas ----
const ART_CACHE = {};
function cardArt(key){
  if(ART_CACHE[key]) return ART_CACHE[key];
  const S = 160, c = mkCanvas(S,S), g = c.getContext('2d');
  const card = CARDS[key], sk = spriteKey(key);
  const im = imgFor(card.art || sk);
  const draw = (x,y,s) => { g.save(); g.translate(x,y); g.scale(s/100,s/100); if(im){ g.imageSmoothingQuality='high'; drawImgFit(g, im, 98, 99); } else if(SPR[sk]) SPR[sk](g, TEAM.p); g.restore(); };
  g.lineCap='round'; g.lineJoin='round';
  if(card.art) draw(0,0,160);
  else if(card.spell) draw(10,10,140);
  else if(card.count>=4){ draw(4,26,82); draw(74,26,82); draw(39,50,96); }
  else if(card.count===3){ draw(6,20,86); draw(68,20,86); draw(34,46,100); }
  else if(card.count===2){ draw(4,22,108); draw(48,34,112); }
  else draw(6,6,148);
  ART_CACHE[key] = c.toDataURL();
  return ART_CACHE[key];
}

// ---- torres ----
function drawTowerSprite(g, side, king, fac){
  const T = TEAM[side];
  if(fac==='orc'){ drawOrcTower(g, T, king); return; }
  if(fac==='elf'){ drawElfTower(g, T, king); return; }
  // g en coordenadas: ancho 100, alto 130, base en y=118
  g.lineCap='round'; g.lineJoin='round';
  if(king){
    // fragua: edificio de piedra con chimenea y horno encendido
    rr(g,64,4,18,52,3,lgrad(g,64,4,82,56,'#b5ad9f','#6e665c'));
    rr(g,61,2,24,8,2,'#8a8276',2.5);
    rr(g,8,44,84,74,10,lgrad(g,8,44,92,118,'#d9d2c8','#a39a8e','#6e665c'));
    g.save(); rr(g,10,46,80,70,8,null,0); g.clip();
    for(let r=0;r<5;r++) for(let i=-1;i<5;i++){ const off=r%2?10:0; g.strokeStyle='#00000026'; g.lineWidth=2; g.strokeRect(10+off+i*20,50+r*14,20,14); }
    g.restore();
    // horno
    g.beginPath(); g.moveTo(32,118); g.lineTo(32,92); g.arc(50,92,18,Math.PI,TAU); g.lineTo(68,118); g.closePath();
    g.fillStyle='#2a1a10'; g.fill(); g.lineWidth=3.5; g.strokeStyle=OL; g.stroke();
    g.save(); g.beginPath(); g.moveTo(36,118); g.lineTo(36,93); g.arc(50,93,14,Math.PI,TAU); g.lineTo(64,118); g.closePath(); g.clip();
    const fg = g.createRadialGradient(50,112,2,50,104,26); fg.addColorStop(0,'#fff6b0'); fg.addColorStop(0.35,'#ffb020'); fg.addColorStop(0.75,'#e0400a'); fg.addColorStop(1,'#3a1008');
    g.fillStyle=fg; g.fillRect(30,74,40,46);
    for(const [x,h] of [[42,16],[50,24],[58,14]]) poly(g,[x-6,118, x,118-h, x+6,118],'#ffe066',0);
    g.restore();
    for(let i=0;i<7;i++){ const a=Math.PI+i*Math.PI/6; rr(g,50+Math.cos(a)*20-3,92+Math.sin(a)*20-3,6,6,1.5,'#8a8276',1.5); }
    // estandartes
    for(const x of [18,82]){ poly(g,[x-7,54, x+7,54, x+7,80, x,74, x-7,80], lgrad(g,x,54,x,80,T.light,T.main,T.dark),2.5); line(g,x-3,62,x+3,68,'#ffe066',2.5); line(g,x+3,62,x-3,68,'#ffe066',2.5); }
    // tejado / almenas
    rr(g,4,34,62,14,4,lgrad(g,4,34,4,48,'#ece6dc','#a39a8e'));
    for(let i=0;i<4;i++) rr(g,6+i*15,23,11,13,3,'#cfc7bb',2.5);
    return;
  }
  // torre princesa redonda
  ell(g,50,112,40,12,'#6e665c',3);
  g.beginPath(); g.moveTo(14,60); g.lineTo(14,110); g.ellipse(50,110,36,11,0,Math.PI,0,true); g.lineTo(86,60); g.closePath();
  g.fillStyle=lgrad(g,14,0,86,0,'#8a8276','#ddd6cc','#b5ad9f','#6e665c'); g.fill(); g.lineWidth=3; g.strokeStyle=OL; g.stroke();
  for(let r=0;r<3;r++){ g.beginPath(); g.ellipse(50,74+r*14,36,10,0,0.1,Math.PI-0.1); g.strokeStyle='#00000024'; g.lineWidth=2; g.stroke(); }
  // estandarte
  poly(g,[40,66, 60,66, 60,98, 50,90, 40,98], lgrad(g,50,66,50,98,T.light,T.main,T.dark),2.5);
  circ(g,50,77,4,'#ffe066',1.5);
  // plataforma
  ell(g,50,58,42,13,lgrad(g,8,45,92,71,'#ece6dc','#a39a8e'),3);
  for(let i=0;i<6;i++){ const a=Math.PI*(0.08+i*0.168), x=50-Math.cos(a)*40, y=60+Math.sin(a)*11; rr(g,x-6,y-16,12,14,3,'#cfc7bb',2.5); }
}
function drawOrcTower(g, T, king){
  g.lineCap='round'; g.lineJoin='round';
  if(king){
    // gran choza de guerra con tambor
    ell(g,50,116,44,8,'rgba(0,0,0,0.3)',0);
    for(let i=0;i<9;i++){ const x=10+i*10; rr(g,x,50,10,66,3,lgrad(g,x,50,x+10,116,'#b07a44','#5a3416'),2); poly(g,[x,50, x+5,40, x+10,50],'#c08a52',2); }
    g.beginPath(); g.moveTo(4,56); g.quadraticCurveTo(50,-10,96,56); g.closePath(); g.fillStyle=lgrad(g,4,8,96,56,'#c8b090','#6a5030'); g.fill(); g.lineWidth=3; g.strokeStyle=OL; g.stroke();
    for(const x of [30,50,70]) line(g,x,56-Math.abs(x-50)*0.3,50,14,'#00000030',2);
    g.beginPath(); g.moveTo(36,116); g.lineTo(36,92); g.arc(50,92,14,Math.PI,TAU); g.lineTo(64,116); g.closePath(); g.fillStyle='#2a1a10'; g.fill(); g.lineWidth=3; g.strokeStyle=OL; g.stroke();
    g.save(); g.beginPath(); g.rect(38,96,24,20); g.clip(); const fg=g.createRadialGradient(50,114,2,50,108,16); fg.addColorStop(0,'#fff6b0'); fg.addColorStop(0.5,'#ff8a20'); fg.addColorStop(1,'#3a1008'); g.fillStyle=fg; g.fillRect(36,92,28,26); g.restore();
    for(const x of [18,82]){ poly(g,[x-7,62, x+7,62, x+7,88, x,82, x-7,88], lgrad(g,x,62,x,88,T.light,T.main,T.dark),2.5); circ(g,x,72,3.5,'#e8dcc0',1.5); }
    for(const x of [8,92]){ line(g,x,60,x,20,OL,4); circ(g,x,18,6,'#f4ecd8',2); for(const sd of [-1,1]) circ(g,x+sd*2,17,1.4,OL,0); }
    return;
  }
  // torre de vigía de madera con pinchos
  ell(g,50,114,38,9,'rgba(0,0,0,0.3)',0);
  for(const [x1,x2] of [[18,30],[82,70]]){ line(g,x1,116,x2,54,OL,8); line(g,x1,116,x2,54,'#7a4a24',5); }
  line(g,24,96,76,80,'#5a3416',4); line(g,76,96,24,80,'#5a3416',4);
  rr(g,26,50,48,14,3,lgrad(g,26,50,74,64,'#b07a44','#5a3416'));
  for(let i=0;i<6;i++){ const x=22+i*11.2; rr(g,x,30,9,24,2,lgrad(g,x,30,x+9,54,'#c08a52','#6a3e1c'),2); poly(g,[x,30, x+4.5,20, x+9,30],'#d8dee6',2); }
  poly(g,[42,64, 58,64, 58,92, 50,86, 42,92], lgrad(g,50,64,50,92,T.light,T.main,T.dark),2.5);
  circ(g,50,74,3.5,'#e8dcc0',1.5);
}
const TOWER_CACHE = new Map();
function getTower(side, king, w, fac){
  w = Math.round(w); const k = side+king+w+(fac||'human');
  if(TOWER_CACHE.has(k)) return TOWER_CACHE.get(k);
  const h = w*1.3, c = mkHi(w, h), g = c.getContext('2d'); g.scale(SS*w/100, SS*w/100);
  const tk = (king?'base_':'tower_') + (fac||'human'), im = (side==='p' && imgFor('bk_'+tk)) || imgFor(tk);
  if(im){ const maxW = king ? (fac==='elf' ? 100 : 112) : 96, maxH = king ? 112 : 124, sc = Math.min(maxW/im.naturalWidth, maxH/im.naturalHeight), iw = im.naturalWidth*sc, ih = im.naturalHeight*sc;
    g.imageSmoothingQuality='high'; g.drawImage(im, 50-iw/2, (king?121:120)-ih, iw, ih); g.setTransform(1,0,0,1,0,0); if(side==='e') recolorRed(c); }
  else drawTowerSprite(g, side, king, fac);
  const white = mkHi(w,h), wg = white.getContext('2d'); wg.drawImage(c,0,0); wg.globalCompositeOperation='source-atop'; wg.fillStyle='#fff'; wg.fillRect(0,0,white.width,white.height);
  const o = {normal:c, white, w, h}; TOWER_CACHE.set(k, o); return o;
}
function drawRubble(g, x, y, s){
  const im = imgFor('ruinas_torre'); if(im){ const w = s*1.25, h = w*im.naturalHeight/im.naturalWidth; g.drawImage(im, x-w/2, y-h*0.8, w, h); return; }
  const r = mulberry32(Math.round(x*100+y));
  for(let i=0;i<9;i++){ const a=r()*TAU, d=r()*s*0.45, sz=s*(0.12+r()*0.14);
    poly(g,[x+Math.cos(a)*d-sz, y+Math.sin(a)*d*0.5, x+Math.cos(a)*d, y+Math.sin(a)*d*0.5-sz*0.8, x+Math.cos(a)*d+sz, y+Math.sin(a)*d*0.5, x+Math.cos(a)*d+sz*0.3, y+Math.sin(a)*d*0.5+sz*0.5], ['#a39a8e','#8a8276','#cfc7bb'][i%3], 1.5); }
}

// ---- yunque central ----
const ANVIL_CACHE = {};
function getAnvil(w){
  w = Math.round(w); if(ANVIL_CACHE[w]) return ANVIL_CACHE[w];
  const c = mkCanvas(w, w), g = c.getContext('2d'); g.scale(w/100, w/100); g.lineCap='round'; g.lineJoin='round';
  ell(g,50,88,34,8,'rgba(0,0,0,0.3)',0);
  poly(g,[34,62, 66,62, 72,86, 28,86], lgrad(g,28,62,72,86,'#6a6a78','#2a2a33'));
  poly(g,[40,50, 60,50, 58,64, 42,64], lgrad(g,40,50,60,64,'#7a7a88','#3a3a44'));
  g.beginPath(); g.moveTo(8,36); g.quadraticCurveTo(22,46,34,46); g.lineTo(80,46); g.lineTo(90,34); g.lineTo(84,30); g.lineTo(20,30); g.quadraticCurveTo(12,30,8,36); g.closePath();
  g.fillStyle = lgrad(g,8,30,90,46,'#b8b8c8','#6a6a7a','#3a3a48'); g.fill(); g.lineWidth=3; g.strokeStyle=OL; g.stroke();
  line(g,22,32,84,32,'#ffffff80',2.5);
  g.save(); g.shadowColor='#ff9a30'; g.shadowBlur=10; line(g,40,38,62,38,'#ffb040',2.5); g.restore();
  ANVIL_CACHE[w] = c; return c;
}

// ---- herrero sobre la fragua ----
function drawSmith(g, side, s, sleeping, t, striking){ g.save(); g.scale(s/100, s/100); drawSmithBody(g, TEAM[side], sleeping, t, striking); g.restore(); }
function drawSmithBody(g, T, sleeping, t, striking){
  g.save(); g.lineCap='round'; g.lineJoin='round';
  g.translate(0, Math.sin(t*2)*1.2);
  // brazo y martillo
  const ang = sleeping ? 0.3 : striking ? 0.9 : -0.5 + Math.sin(t*3)*0.25;
  g.save(); g.translate(72,60); g.rotate(ang);
  line(g,0,0,0,-30,OL,7); line(g,0,0,0,-30,'#8a5a2a',4);
  rr(g,-12,-42,24,14,3,lgrad(g,-12,-42,12,-28,'#c8c8d8','#5a5a6a'),2.5);
  g.restore();
  // cuerpo
  rr(g,26,56,48,40,14,rgrad(g,50,70,30,'#ffd9b8','#d98f62'),3);
  poly(g,[32,62, 68,62, 66,98, 34,98], lgrad(g,32,62,68,98,T.light,T.main,T.dark),2.5);
  line(g,36,64,64,64,'#5a3a1a',3);
  circ(g,72,60,7,rgrad(g,72,60,7,'#ffd9b8','#d98f62'),2.5);
  // cabeza
  skin(g,50,42,17,'#ffd9b8','#d98f62');
  g.beginPath(); g.moveTo(33,46); g.quadraticCurveTo(50,78,67,46); g.quadraticCurveTo(50,56,33,46); g.fillStyle=lgrad(g,40,46,60,70,'#a0522d','#5a2a10'); g.fill(); g.lineWidth=2.5; g.strokeStyle=OL; g.stroke();
  if(sleeping){ line(g,42,40,47,40,OL,2.5); line(g,53,40,58,40,OL,2.5); } else eyes(g,50,40,6,2.8);
  line(g,41,34,47,35,'#5a2a10',3); line(g,53,35,59,34,'#5a2a10',3);
  // pañuelo
  g.beginPath(); g.arc(50,36,17,Math.PI*1.08,Math.PI*1.92); g.lineTo(64,30); g.lineTo(36,30); g.closePath(); g.fillStyle=T.main; g.fill(); g.lineWidth=2.5; g.strokeStyle=OL; g.stroke();
  g.restore();
}

// ---- jefe orco sobre el campamento ----
function drawOrcChief(g, side, s, sleeping, t, striking){
  const T = TEAM[side];
  g.save(); g.scale(s/100, s/100); g.lineCap='round'; g.lineJoin='round'; g.translate(0, Math.sin(t*2)*1.2);
  // tambor de guerra con mazas
  const ang = sleeping ? 0.4 : striking ? 1.0 : -0.4 + Math.sin(t*3)*0.3;
  g.save(); g.translate(72,62); g.rotate(ang); line(g,0,0,0,-24,OL,6); line(g,0,0,0,-24,'#6a4a2a',3.5); circ(g,0,-26,5,'#e8dcc0',2); g.restore();
  rr(g,26,58,48,38,14,rgrad(g,50,72,30,'#a8e07a','#4f8a2e'),3);
  poly(g,[32,64, 68,64, 66,98, 34,98], lgrad(g,32,64,68,98,T.light,T.main,T.dark),2.5);
  for(const sd of [-1,1]){ circ(g,50+sd*22,60,9,lgrad(g,40,50,60,70,'#9a9aaa','#3a3a46'),2.5); }
  circ(g,72,62,6,rgrad(g,72,62,6,'#a8e07a','#4f8a2e'),2.5);
  SPR.orcHead(g,50,40,16,T,true);
  if(sleeping){ g.fillStyle='rgba(0,0,0,0.0)'; }
  g.restore();
}

// ---- rey sobre su torre ----
function drawKing(g, side, s, sleeping, t){
  const T = TEAM[side];
  g.save(); g.scale(s/100, s/100); g.lineCap='round'; g.lineJoin='round';
  const bob = Math.sin(t*2)*1.5;
  g.translate(0,bob);
  poly(g,[28,60, 72,60, 80,96, 20,96], lgrad(g,20,60,80,96,T.light,T.main,T.dark));
  poly(g,[30,60, 70,60, 64,70, 36,70],'#fff',2);
  skin(g,50,46,18);
  g.beginPath(); g.moveTo(34,50); g.quadraticCurveTo(50,80,66,50); g.quadraticCurveTo(50,58,34,50); g.fillStyle=lgrad(g,40,50,60,70,'#ffffff','#c9cdd6'); g.fill(); g.lineWidth=2.5; g.strokeStyle=OL; g.stroke();
  if(sleeping){ line(g,40,46,46,46,OL,2.5); line(g,54,46,60,46,OL,2.5); }
  else eyes(g,50,45,7,3);
  poly(g,[32,36, 32,18, 41,27, 50,12, 59,27, 68,18, 68,36], lgrad(g,0,12,0,36,'#fff3a0','#e0a020'),2.5);
  circ(g,50,30,3,T.main,1.2);
  g.restore();
}

// ---- escenario lateral (rellena la pantalla a los lados del campo) ----
function renderBackdrop(TS, dpr, CW, OX, arena, bio='grass'){
  const BI = BIOMES[bio] || BIOMES.grass;
  const Hh = H*TS, c = mkCanvas(CW*dpr, Hh*dpr), g = c.getContext('2d'); g.scale(dpr,dpr);
  const R = mulberry32(77);
  const FULLB = arenaImg((typeof B!=='undefined' && B && B.terrain) || 'river', bio);
  if(OX > 0.5 && FULLB){ const sc = W*TS/(FULLB.naturalWidth*864/1024), dw = FULLB.naturalWidth*sc, dx = OX - FULLB.naturalWidth*80/1024*sc;
    g.imageSmoothingQuality='high'; g.drawImage(FULLB, 0, 0, FULLB.naturalWidth, FULLB.naturalHeight, dx, 0, dw, Hh);
    if(dx > 0){ g.drawImage(FULLB, 0, 0, FULLB.naturalWidth*0.05, FULLB.naturalHeight, 0, 0, dx+1, Hh); g.drawImage(FULLB, FULLB.naturalWidth*0.95, 0, FULLB.naturalWidth*0.05, FULLB.naturalHeight, dx+dw-1, 0, CW-(dx+dw)+1, Hh); }
    g.fillStyle='rgba(0,0,0,0.18)'; g.fillRect(0,0,OX,Hh); g.fillRect(OX+W*TS,0,CW-OX-W*TS,Hh);
    return c; }
  if(OX > 0.5){
    const c0 = Math.floor(-OX/TS)-1, c1 = Math.ceil((CW-OX)/TS)+1;
    const TG = imgFor(BI.tex) || imgFor('tex_grass');
    if(TG){ const pat = g.createPattern(TG,'repeat'); pat.setTransform(new DOMMatrix().translate(OX,0).scale(TS*6/TG.naturalWidth)); g.fillStyle = pat; g.fillRect(0,0,OX,Hh); g.fillRect(OX+W*TS,0,CW-OX-W*TS,Hh); g.fillStyle='rgba(20,60,20,0.18)'; g.fillRect(0,0,OX,Hh); g.fillRect(OX+W*TS,0,CW-OX-W*TS,Hh); }
    else for(let y=0;y<H;y++) for(let cx=c0;cx<c1;cx++){ if(cx>=0&&cx<W) continue; g.fillStyle = ((cx+y)%2+2)%2 ? '#5fae45' : '#67b64c'; g.fillRect(OX+cx*TS, y*TS, TS+0.6, TS+0.6); }
    if(!TG) for(let i=0;i<260;i++){ const side = i%2, x = side ? OX+W*TS + R()*OX : R()*OX, y = R()*Hh; g.fillStyle = R()<0.5?'rgba(40,110,30,0.2)':'rgba(200,255,150,0.12)'; g.beginPath(); g.ellipse(x,y,TS*(0.1+R()*0.25),TS*(0.06+R()*0.1),R()*3,0,TAU); g.fill(); }
    // río continuo
    const ry1 = RT*TS, ry2 = RB*TS;
    const TR = imgFor(BI.river) || imgFor('tex_river');
    if(TR){ const big = TR.naturalHeight/TR.naturalWidth > 0.25, hT = (big?4:3.1)*TS, wT = hT*TR.naturalWidth/TR.naturalHeight; for(const [xa,xb] of [[0,OX],[OX+W*TS,CW]]){ g.save(); g.beginPath(); g.rect(xa,0,xb-xa,Hh); g.clip(); for(let x=xa-wT*0.3; x<xb; x+=wT-2) g.drawImage(TR, x, ry1-(big?TS:TS*0.55), wT, hT); g.restore(); } }
    else for(const [xa,xb] of [[0,OX],[OX+W*TS,CW]]){
      g.fillStyle = '#6b4a2a'; g.fillRect(xa, ry1-TS*0.22, xb-xa, ry2-ry1+TS*0.44);
      const wg = g.createLinearGradient(0,ry1,0,ry2); wg.addColorStop(0,'#2f7fd0'); wg.addColorStop(0.5,'#3d9cf0'); wg.addColorStop(1,'#2a6fc0');
      g.fillStyle = wg; g.fillRect(xa, ry1, xb-xa, ry2-ry1);
      g.fillStyle='rgba(255,255,255,0.22)'; g.fillRect(xa,ry1,xb-xa,TS*0.12);
      for(let x=xa;x<xb;x+=TS*0.5) for(const yy of [RT-0.12, RB+0.12]){ g.fillStyle=['#8a8276','#a39a8e','#6e665c'][Math.floor(R()*3)]; g.beginPath(); g.ellipse(x+R()*TS*0.4,yy*TS,TS*0.3,TS*0.17,0,0,TAU); g.fill(); }
    }
    // árboles y rocas en los márgenes
    const tree = (x,y,s) => { g.fillStyle='rgba(0,0,0,0.22)'; g.beginPath(); g.ellipse(x+s*0.15,y+s*0.55,s*0.75,s*0.28,0,0,TAU); g.fill();
      g.fillStyle='#6a4424'; g.fillRect(x-s*0.12,y,s*0.24,s*0.55);
      for(const [dx,dy,r] of [[-0.35,0,0.55],[0.35,0,0.55],[0,-0.38,0.62]]){ const gr=g.createRadialGradient(x+dx*s-s*0.15,y+dy*s-s*0.2,1,x+dx*s,y+dy*s,r*s); gr.addColorStop(0,'#86d860'); gr.addColorStop(1,'#2a6e22'); g.fillStyle=gr; g.beginPath(); g.arc(x+dx*s,y+dy*s,r*s,0,TAU); g.fill(); g.strokeStyle='#1d4a18'; g.lineWidth=Math.max(1,TS*0.06); g.stroke(); } };
    const rockS = (x,y,s) => { g.fillStyle='rgba(0,0,0,0.2)'; g.beginPath(); g.ellipse(x,y+s*0.2,s*0.5,s*0.2,0,0,TAU); g.fill(); const gr=g.createLinearGradient(x-s,y-s,x+s,y); gr.addColorStop(0,'#d6d0c6'); gr.addColorStop(1,'#7a7268'); g.fillStyle=gr; g.beginPath(); g.moveTo(x-s*0.5,y+s*0.15); g.lineTo(x-s*0.3,y-s*0.3); g.lineTo(x+s*0.15,y-s*0.42); g.lineTo(x+s*0.5,y-s*0.05); g.lineTo(x+s*0.4,y+s*0.2); g.closePath(); g.fill(); g.strokeStyle='#3a342e'; g.lineWidth=Math.max(1,TS*0.05); g.stroke(); };
    const items = [];
    for(const side of [0,1]){ const xa = side ? OX+W*TS : 0, wdt = OX;
      for(let y=TS*1.2; y<Hh; y+=TS*(2.4+R()*1.8)){ if(y>ry1-TS*1.6 && y<ry2+TS*1.2) continue; items.push([xa + wdt*(0.25+R()*0.5), y, R()<0.75?'t':'r']); } }
    items.sort((a,b)=>a[1]-b[1]);
    for(const [x,y,t] of items){ const s = TS*Math.min(1.6, Math.max(0.7, OX/TS*0.55));
      const key = t==='t' ? BI.side[Math.floor(R()*BI.side.length)] : BI.sideRock[Math.floor(R()*BI.sideRock.length)], im = imgFor(key);
      if(im){ const w = t==='t' ? s*(key.startsWith('arbol')?2.0:1.35) : s*1.1, h = w*im.naturalHeight/im.naturalWidth; g.drawImage(im, x-w/2, y+s*0.6-h, w, h); }
      else t==='t' ? tree(x,y,s) : rockS(x,y,s*0.7); }
    // sombra que separa el campo del escenario
    for(const [xa,dir] of [[OX,-1],[OX+W*TS,1]]){ const sg = g.createLinearGradient(xa,0,xa+dir*TS*1.2,0); sg.addColorStop(0,'rgba(0,0,0,0.35)'); sg.addColorStop(1,'rgba(0,0,0,0)'); g.fillStyle = sg; g.fillRect(Math.min(xa,xa+dir*TS*1.2),0,TS*1.2,Hh); }
    g.fillStyle='rgba(10,20,10,0.12)'; g.fillRect(0,0,OX,Hh); g.fillRect(OX+W*TS,0,CW-OX-W*TS,Hh);
  }
  g.drawImage(arena, OX, 0, W*TS, Hh);
  return c;
}

// ---- arena pre-renderizada ----
function arenaImg(ter, bio){ if(ter==='swamp') bio='grass'; if(ter==='river' && bio==='desert' && (typeof B!=='undefined' && B && B.seed||0)%2) return imgFor('arena_river_grave_b'); const k='arena_'+ter+'_'+bio, v=(typeof B!=='undefined' && B && B.seed||0)%2; return (v && imgFor(k+'_b')) || imgFor(k) || null; }
function renderArena(TS, dpr, mode, ter='river', broken=false, bio='grass'){
  const BI = BIOMES[bio] || BIOMES.grass;
  const c = mkCanvas(W*TS*dpr, H*TS*dpr), g = c.getContext('2d');
  g.scale(dpr,dpr);
  const X = v => v*TS, R = mulberry32(1234);
  // mapa pintado completo (si existe): sustituye suelo, río, puentes y caminos
  const FULL = mode!=='treasure' && arenaImg(ter, bio);
  if(FULL){ const sx = FULL.naturalWidth*80/1024, sw = FULL.naturalWidth - 2*sx; g.imageSmoothingQuality='high'; g.drawImage(FULL, sx, 0, sw, FULL.naturalHeight, 0, 0, X(W), X(H)); return c; }
  const TEXG = imgFor(BI.tex) || imgFor('tex_grass'), TEXP = imgFor('tex_path'), grassTex = !!TEXG;
  if(grassTex){
    const pat = g.createPattern(TEXG, 'repeat'); pat.setTransform(new DOMMatrix().scale(TS*6/TEXG.naturalWidth));
    g.fillStyle = pat; g.fillRect(0, 0, X(W), X(H));
    if(ter==='forest'){ g.fillStyle='rgba(10,50,10,0.18)'; g.fillRect(0,0,X(W),X(H)); }
    if(ter==='swamp'){ g.fillStyle='rgba(70,80,30,0.25)'; g.fillRect(0,0,X(W),X(H)); }
  } else
  for(let y=0;y<H;y++) for(let x=0;x<W;x++){
    g.fillStyle = (TERRAIN_PAL[ter]||TERRAIN_PAL.river)[(x+y)%2];
    g.fillRect(X(x),X(y),TS+0.6,TS+0.6);
  }
  // matices
  if(!grassTex) for(let i=0;i<700;i++){ const x=R()*W, y=R()*H; g.fillStyle = R()<0.5 ? 'rgba(40,110,30,0.18)' : 'rgba(200,255,150,0.12)'; g.beginPath(); g.ellipse(X(x),X(y),X(0.08+R()*0.25),X(0.05+R()*0.12),R()*3,0,TAU); g.fill(); }
  if(!grassTex) for(let i=0;i<500;i++){ const x=R()*W, y=R()*H; g.strokeStyle='rgba(40,100,30,0.35)'; g.lineWidth=Math.max(1,TS*0.05); g.beginPath(); g.moveTo(X(x),X(y)); g.lineTo(X(x+(R()-0.5)*0.15),X(y-0.2-R()*0.15)); g.stroke(); }
  // caminos de tierra
  const pathCol = '#d9b77a', pathDark = '#b8925a';
  function blob(x,y,rx,ry,col){ g.fillStyle=col; g.beginPath(); g.ellipse(X(x),X(y),X(rx),X(ry),0,0,TAU); g.fill(); }
  const pathSeg = (x1,y1,x2,y2,w) => { const len = Math.hypot(x2-x1,y2-y1), dw = X(w*1.45), th = dw*TEXP.naturalHeight/TEXP.naturalWidth;
    g.save(); g.translate(X(x1),X(y1)); g.rotate(Math.atan2(y2-y1,x2-x1)-Math.PI/2);
    for(let y=-X(0.3); y<X(len+0.3); y+=th*0.92){ const rem = Math.min(th, X(len+0.3)-y); g.drawImage(TEXP, 0, 0, TEXP.naturalWidth, TEXP.naturalHeight*rem/th, -dw/2, y, dw, rem); }
    g.restore(); };
  if(TEXP){
    const sand = '#efcc8a';
    if(mode!=='treasure'){ for(const side of ['p','e']) for(const x of TOWER_X) blob(x, frontY(side,x), 1.9, 1.4, sand); blob(9,KING_Y.e,2.6,2.1,sand); blob(9,KING_Y.p,2.6,2.1,sand); }
    if(ter==='winding'){ for(const pl of windingPaths()) for(let k=0;k<pl.length-1;k++) pathSeg(pl[k][0], pl[k][1], pl[k+1][0], pl[k+1][1], 1.6); }
    else { pathSeg(3.5,6.0,3.5,26.0,2.1); pathSeg(14.5,6.0,14.5,26.0,2.1); pathSeg(9,2.6,9,29.6,1.4); }
  } else
  for(const pass of [0,1]){
    const col = pass ? pathCol : pathDark, grow = pass ? 0 : 0.18;
    if(ter==='winding'){
      for(const pl of windingPaths()) for(let k=0;k<pl.length-1;k++){ const [x1,y1]=pl[k], [x2,y2]=pl[k+1], n=Math.ceil(Math.hypot(x2-x1,y2-y1)/0.22); for(let j=0;j<=n;j++){ const f=j/n; blob(x1+(x2-x1)*f, y1+(y2-y1)*f, 0.85+grow, 0.6+grow, col); } }
    } else {
    for(const bx of [3.5,14.5]){ for(let y=6.2;y<=25.8;y+=0.25) blob(bx+Math.sin(y*1.3)*0.08, y, 1.05+grow, 0.6+grow, col); }
    for(let y=2.6;y<=29.6;y+=0.25) blob(9+Math.sin(y*1.7)*0.06, y, 0.7+grow, 0.5+grow, col);
    }
    if(mode!=='treasure'){ for(const side of ['p','e']) for(const x of TOWER_X) blob(x, frontY(side,x), 1.9+grow, 1.4+grow, col);
    blob(9,KING_Y.e,2.6+grow,2.1+grow,col); blob(9,KING_Y.p,2.6+grow,2.1+grow,col); }
  }
  for(let i=0;i<260;i++){ const bx=[3.5,14.5][i%2], x=bx+(R()-0.5)*1.8, y=6+R()*20; if(y>RT-0.4&&y<RB+0.4) continue; g.fillStyle='rgba(120,80,40,0.25)'; g.beginPath(); g.arc(X(x),X(y),X(0.04+R()*0.06),0,TAU); g.fill(); }
  const bandKind = drawTerrainBand(g, X, R, ter, broken, bio);
  // puentes
  // isla central
  const ISL = imgFor('isla_yunque');
  if(ISL){ const w = X(3.0), h = w*ISL.naturalHeight/ISL.naturalWidth; g.fillStyle='rgba(0,0,0,0.25)'; g.beginPath(); g.ellipse(X(ISLE.x+0.08), X(ISLE.y+0.2), w*0.46, h*0.36, 0, 0, TAU); g.fill(); g.drawImage(ISL, X(ISLE.x)-w/2, X(ISLE.y+0.05)-h*0.62, w, h); }
  else { const ix=X(ISLE.x), iy=X(ISLE.y), ir=X(ISLE.r);
    g.fillStyle='rgba(0,0,0,0.25)'; g.beginPath(); g.ellipse(ix+X(0.08),iy+X(0.12),ir+X(0.15),ir*0.82+X(0.12),0,0,TAU); g.fill();
    g.fillStyle='#8a8276'; g.beginPath(); g.ellipse(ix,iy,ir+X(0.14),ir*0.82+X(0.12),0,0,TAU); g.fill();
    const IC = {clearing:['#9ad070','#5a9a3a'], gravel:['#d8c4a0','#a88e68'], mud:['#a89a6a','#6e6440'], stone:['#7a6e66','#4a403a']}[bandKind] || (ter==='ice'&&!broken ? ['#ffffff','#c8e0ea'] : ['#f0d79a','#c9a564']);
    const ig=g.createRadialGradient(ix-ir*0.3,iy-ir*0.3,1,ix,iy,ir); ig.addColorStop(0,IC[0]); ig.addColorStop(1,IC[1]); g.fillStyle=ig;
    g.beginPath(); g.ellipse(ix,iy,ir,ir*0.82,0,0,TAU); g.fill(); g.strokeStyle='#6b5a3a'; g.lineWidth=Math.max(1,TS*0.06); g.stroke();
    for(let i=0;i<14;i++){ const a=R()*TAU, d=R()*ir*0.8; g.fillStyle='rgba(120,90,50,0.35)'; g.beginPath(); g.arc(ix+Math.cos(a)*d, iy+Math.sin(a)*d*0.8, X(0.05), 0, TAU); g.fill(); } }
  const BW = bandKind==='stone' ? ['#4a403a','#7a6e66','#8a7e76','#2e2622'] : ['#6a3e1c','#a56e3a','#b8804a','#4a2a10'];
  const TEXB = bandKind==='wood' || bandKind==='stone' ? imgFor(ter==='volcano' ? 'bridge_lava' : ter==='ice' ? 'bridge_stone' : BI.bridge) || (bandKind==='wood' ? imgFor('tex_bridge') : null) : null;
  if(TEXB) for(const bx of BRIDGES){
    const parts = bx===9 ? [[RT-0.7, ISLE.y-ISLE.r*0.6],[ISLE.y+ISLE.r*0.6, RB+0.7]] : [[RT-0.95, RB+0.95]];
    const asp = TEXB.naturalWidth/TEXB.naturalHeight, maxW = bx===9 ? 1.5 : 2.6;
    for(const [ya,yb] of parts){ const h = yb-ya; let w = h*asp, hh = h;
      if(w>maxW){ w = maxW; }                                   // muy ancho: se estrecha un poco, sin recortar
      // sombra suave con la forma del puente
      g.save(); g.globalAlpha = 0.28; g.filter = 'brightness(0)'; g.drawImage(TEXB, X(bx-w/2+0.12), X(ya+0.14), X(w), X(hh)); g.restore(); g.filter = 'none';
      g.drawImage(TEXB, X(bx-w/2), X(ya), X(w), X(hh)); }
  }
  else if(bandKind==='wood' || bandKind==='stone') for(const bx of BRIDGES){
    if(bx===9){ for(const [ya,yb] of [[RT-0.6, ISLE.y-ISLE.r*0.7],[ISLE.y+ISLE.r*0.7, RB+0.6]]){
        const x0=X(bx-0.62), w=X(1.24), y0=X(ya), h=X(yb-ya);
        g.fillStyle='rgba(0,0,0,0.3)'; g.fillRect(x0+X(0.1), y0+X(0.12), w, h);
        g.fillStyle=BW[0]; g.fillRect(x0, y0, w, h);
        const n=4; for(let i=0;i<n;i++){ const yy=y0+i*h/n; g.fillStyle=i%2?BW[1]:BW[2]; g.fillRect(x0+X(0.08), yy+1, w-X(0.16), h/n-2); }
        for(const sx of [x0, x0+w-X(0.12)]){ g.fillStyle=BW[3]; g.fillRect(sx, y0-X(0.06), X(0.12), h+X(0.12)); } }
      continue; }
    const x0 = X(bx-1.15), w = X(2.3), y0 = X(RT-0.55), h = X(RB-RT+1.1);
    g.fillStyle='rgba(0,0,0,0.3)'; g.fillRect(x0+X(0.12), y0+X(0.15), w, h);
    g.fillStyle=BW[0]; g.fillRect(x0, y0, w, h);
    for(let i=0;i<9;i++){ const yy=y0+i*h/9; g.fillStyle = i%2 ? BW[1] : BW[2]; g.fillRect(x0+X(0.12), yy+1, w-X(0.24), h/9-2); g.fillStyle='rgba(0,0,0,0.2)'; g.fillRect(x0+X(0.12), yy+h/9-2, w-X(0.24), 1.5); }
    for(const s of [x0, x0+w-X(0.2)]){ g.fillStyle=BW[3]; g.fillRect(s, y0-X(0.1), X(0.2), h+X(0.2)); for(const yy of [y0-X(0.15), y0+h/2-X(0.1), y0+h-X(0.05)]){ g.fillStyle=BW[3]; g.fillRect(s-X(0.06), yy, X(0.32), X(0.3)); } }
  }
  if(ter==='winding') drawWindingRows(g, X, R);
  // bases de torres
  if(mode!=='treasure') for(const [x,y,k] of [...TOWER_X.map(x=>[x,frontY('e',x),0]), ...TOWER_X.map(x=>[x,frontY('p',x),0]), [9,KING_Y.e,1], [9,KING_Y.p,1]]){
    const rx = k?1.95:1.55, side = y>16 ? 'p' : 'e', pf = side==='p' ? (typeof RUN!=='undefined' && RUN && RUN.faction || 'human') : (typeof B!=='undefined' && B && B.enc && B.enc.faction || 'orc'), PI = imgFor((k?'platK_':'plat_')+pf);
    if(PI){ const w = X(rx*2+0.5), h = w*PI.naturalHeight/PI.naturalWidth; g.fillStyle='rgba(0,0,0,0.22)'; g.beginPath(); g.ellipse(X(x+0.06),X(y+0.42),w*0.47,h*0.45,0,0,TAU); g.fill(); g.drawImage(PI, X(x)-w/2, X(y+0.25)-h/2, w, h); continue; }
    g.fillStyle='rgba(0,0,0,0.25)'; g.beginPath(); g.ellipse(X(x),X(y+0.35),X(rx+0.15),X(rx*0.72),0,0,TAU); g.fill();
    g.fillStyle='#9a9286'; g.beginPath(); g.ellipse(X(x),X(y+0.2),X(rx),X(rx*0.68),0,0,TAU); g.fill();
    g.strokeStyle='#5e574e'; g.lineWidth=Math.max(1.5,TS*0.08); g.stroke();
    for(let i=0;i<10;i++){ const a=i/10*TAU; g.strokeStyle='#00000025'; g.lineWidth=1; g.beginPath(); g.moveTo(X(x+Math.cos(a)*rx*0.55),X(y+0.2+Math.sin(a)*rx*0.37)); g.lineTo(X(x+Math.cos(a)*rx),X(y+0.2+Math.sin(a)*rx*0.68)); g.stroke(); }
  }
  // decoración: rocas, arbustos, flores en los bordes
  function bush(x,y,s){ for(const [dx,dy,r] of [[-0.3,0.05,0.42],[0.3,0.05,0.42],[0,-0.2,0.5]]){ g.fillStyle='rgba(0,0,0,0.2)'; g.beginPath(); g.ellipse(X(x+dx),X(y+dy+0.25*s),X(r*s),X(r*s*0.4),0,0,TAU); g.fill(); }
    for(const [dx,dy,r] of [[-0.3,0.05,0.42],[0.3,0.05,0.42],[0,-0.2,0.5]]){ const gr=g.createRadialGradient(X(x+dx-0.1*s),X(y+dy-0.15*s),1,X(x+dx),X(y+dy),X(r*s)); gr.addColorStop(0,'#7fd65a'); gr.addColorStop(1,'#2f7a24'); g.fillStyle=gr; g.beginPath(); g.arc(X(x+dx),X(y+dy),X(r*s),0,TAU); g.fill(); g.strokeStyle='#1d4a18'; g.lineWidth=Math.max(1,TS*0.05); g.stroke(); } }
  function rock(x,y,s){ g.fillStyle='rgba(0,0,0,0.22)'; g.beginPath(); g.ellipse(X(x),X(y+0.18*s),X(0.45*s),X(0.18*s),0,0,TAU); g.fill();
    const gr=g.createLinearGradient(X(x-0.4*s),X(y-0.4*s),X(x+0.4*s),X(y+0.2*s)); gr.addColorStop(0,'#d6d0c6'); gr.addColorStop(1,'#7a7268'); g.fillStyle=gr;
    g.beginPath(); g.moveTo(X(x-0.45*s),X(y+0.15*s)); g.lineTo(X(x-0.3*s),X(y-0.25*s)); g.lineTo(X(x+0.1*s),X(y-0.38*s)); g.lineTo(X(x+0.45*s),X(y-0.05*s)); g.lineTo(X(x+0.38*s),X(y+0.18*s)); g.closePath(); g.fill(); g.strokeStyle='#3a342e'; g.lineWidth=Math.max(1,TS*0.05); g.stroke(); }
  function flower(x,y){ const cols=['#fff','#ffe066','#ff8ad8','#9ad0ff']; const col=cols[Math.floor(R()*4)]; for(let i=0;i<5;i++){ const a=i/5*TAU; g.fillStyle=col; g.beginPath(); g.arc(X(x+Math.cos(a)*0.08),X(y+Math.sin(a)*0.08),X(0.065),0,TAU); g.fill(); } g.fillStyle='#ffb020'; g.beginPath(); g.arc(X(x),X(y),X(0.05),0,TAU); g.fill(); }
  const deco = [[0.6,1,'b'],[17.3,1.2,'b'],[0.7,11,'r'],[17.2,10,'b'],[0.6,21,'b'],[17.4,22,'r'],[0.8,31,'b'],[17.2,30.8,'b'],[6.4,14.2,'r'],[11.6,17.8,'r'],[0.5,15.9,'r'],[17.5,16.1,'r']];
  for(const [x,y,t] of deco){
    if(bio!=='grass'){ const im = imgFor(BI.deco[Math.floor(R()*BI.deco.length)]); if(im){ const w = 1.15, h = w*im.naturalHeight/im.naturalWidth; g.drawImage(im, X(x-w/2), X(y+0.35-h), X(w), X(h)); continue; } }
    if(t==='b' && imgFor('arbusto')){ const im = imgFor('arbusto'), w = 1.25, h = w*im.naturalHeight/im.naturalWidth; g.drawImage(im, X(x-w/2), X(y+0.35-h), X(w), X(h)); }
    else if(t==='r' && ter==='ice' && imgFor('wx_crystal')){ const im = imgFor('wx_crystal'), w = 0.95, h = w*im.naturalHeight/im.naturalWidth; g.drawImage(im, X(x-w/2), X(y+0.3-h), X(w), X(h)); }
    else if(t==='r' && imgFor('roca1')){ const im = imgFor(['roca1','roca2','roca3'][Math.floor(R()*3)]), w = 1.05, h = w*im.naturalHeight/im.naturalWidth; g.drawImage(im, X(x-w/2), X(y+0.3-h), X(w), X(h)); }
    else if(t==='b') bush(x,y,0.9); else if(t==='r') rock(x,y,0.8); }
  for(let i=0;i<55;i++){ const x=R()*W, y=R()*H; const nearPath = BRIDGES.some(b=>Math.abs(x-b)<1.6) || (y>RT-0.8&&y<RB+0.8) || Math.hypot(x-9,y-3)<3.2 || Math.hypot(x-9,y-29)<3.2 || Math.abs(x-9)<1.2 || TOWER_X.some(tx=>Math.hypot(x-tx,y-6.8)<2.2||Math.hypot(x-tx,y-25)<2.2); if(!nearPath && bio==='grass') flower(x,y); }
  if(mode==='treasure'){
    for(let i=0;i<40;i++){ const x=0.5+R()*17, y=0.6+R()*30.8; if(y>RT-0.8&&y<RB+0.8) continue;
      g.fillStyle='rgba(0,0,0,0.2)'; g.beginPath(); g.ellipse(X(x),X(y+0.06),X(0.16),X(0.07),0,0,TAU); g.fill();
      const cg=g.createRadialGradient(X(x-0.05),X(y-0.05),1,X(x),X(y),X(0.15)); cg.addColorStop(0,'#fff6b0'); cg.addColorStop(1,'#d99a1c'); g.fillStyle=cg; g.beginPath(); g.ellipse(X(x),X(y),X(0.15),X(0.1),0,0,TAU); g.fill(); g.strokeStyle='#8a5a08'; g.lineWidth=1; g.stroke(); }
    const tg=g.createRadialGradient(X(9),X(16),X(2),X(9),X(16),X(16)); tg.addColorStop(0,'rgba(255,210,90,0.10)'); tg.addColorStop(1,'rgba(255,210,90,0.0)'); g.fillStyle=tg; g.fillRect(0,0,X(W),X(H));
  }
  // viñeta
  const vg = g.createRadialGradient(X(W/2),X(H/2),X(6),X(W/2),X(H/2),X(19)); vg.addColorStop(0,'rgba(0,0,0,0)'); vg.addColorStop(1,'rgba(0,0,0,0.32)');
  g.fillStyle=vg; g.fillRect(0,0,X(W),X(H));
  return c;
}

// ================= DIBUJOS: ELFOS Y ORCOS NUEVOS (provisionales hasta tener imágenes) =================
const ELF_SKIN = ['#fff0e2','#e8bfa0'];
function elfHead(g, x, y, r, hair='#e8e4d0', hood=null){
  for(const sd of [-1,1]) poly(g,[x+sd*r*0.85,y-r*0.05, x+sd*r*1.75,y-r*0.75, x+sd*r*0.95,y+r*0.35], rgrad(g,x,y,r*1.7,ELF_SKIN[0],ELF_SKIN[1]),2.5);
  if(hood){ g.beginPath(); g.arc(x,y,r*1.25,Math.PI*0.9,Math.PI*2.1); g.lineTo(x+r*1.2,y+r*1.1); g.lineTo(x-r*1.2,y+r*1.1); g.closePath(); g.fillStyle=hood; g.fill(); g.lineWidth=3; g.strokeStyle=OL; g.stroke(); }
  else { g.beginPath(); g.moveTo(x-r*1.05,y+r*1.4); g.quadraticCurveTo(x-r*1.3,y-r*1.3,x,y-r*1.15); g.quadraticCurveTo(x+r*1.3,y-r*1.3,x+r*1.05,y+r*1.4); g.closePath(); g.fillStyle=hair; g.fill(); g.lineWidth=2.5; g.strokeStyle=OL; g.stroke(); }
  skin(g,x,y,r,ELF_SKIN[0],ELF_SKIN[1]);
  if(!hood) poly(g,[x-r*0.95,y-r*0.2, x-r*0.4,y-r*0.95, x+r*0.2,y-r*0.6, x+r*0.95,y-r*0.95, x+r*0.95,y-r*0.15, x+r*0.3,y-r*0.45, x-r*0.3,y-r*0.4],hair,2);
  for(const sd of [-1,1]){ ell(g,x+sd*r*0.38,y+r*0.1,r*0.14,r*0.2,'#2a7a4a',0); circ(g,x+sd*r*0.38-r*0.05,y+r*0.02,r*0.06,'#fff',0); }
  line(g,x-r*0.18,y+r*0.55,x+r*0.18,y+r*0.55,'#b0605a',2);
}
function leaf(g,x,y,s,a,col='#5ab84a'){ g.save(); g.translate(x,y); g.rotate(a); g.beginPath(); g.moveTo(0,0); g.quadraticCurveTo(s*0.5,-s*0.45,s,0); g.quadraticCurveTo(s*0.5,s*0.45,0,0); g.fillStyle=col; g.fill(); g.lineWidth=1.8; g.strokeStyle=OL; g.stroke(); g.restore(); }
function elfBow(g, cx, cy, r){ g.beginPath(); g.arc(cx,cy,r,Math.PI*0.6,Math.PI*1.4); g.lineWidth=7; g.strokeStyle=OL; g.stroke(); g.lineWidth=4.5; g.strokeStyle='#e8e0c8'; g.stroke();
  const a1=Math.PI*0.6, a2=Math.PI*1.4; line(g,cx+Math.cos(a1)*r,cy+Math.sin(a1)*r,cx+Math.cos(a2)*r,cy+Math.sin(a2)*r,'#f3efe4',1.5); leaf(g,cx-r*0.98,cy,8,Math.PI,'#7ad06a'); }
function elfRobe(g,T,x1,x2,top,bot,flare=6){ poly(g,[x1,top, x2,top, x2+flare,bot, x1-flare,bot], lgrad(g,x1,top,x2,bot,T.light,T.main,T.dark)); line(g,(x1+x2)/2,top+2,(x1+x2)/2,bot-2,'#d8d0b0',2); }

function crescent(g,x,y,r,fill){ const a=Math.PI*0.32, ex=x+Math.cos(a)*r, ey=y+Math.sin(a)*r, sy=y-Math.sin(a)*r;
  g.beginPath(); g.moveTo(ex,sy); g.arc(x,y,r,-a,a,true); g.quadraticCurveTo(x+r*0.05,y,ex,sy); g.closePath(); g.fillStyle=fill; g.fill(); g.lineWidth=2.2; g.strokeStyle=OL; g.stroke(); }
Object.assign(SPR, {
  elfarcher(g,T){
    boots(g,'#4a6a3a');
    poly(g,[30,40, 46,46, 40,90, 24,86], lgrad(g,24,40,46,90,'#4a8a4a','#24502a'),2.5);
    elfRobe(g,T,36,64,50,86,5);
    rr(g,34,66,32,5,2,'#8a6a3a',2); circ(g,50,68.5,3,'#e8e4d0',1.5);
    elfHead(g,50,36,14,'#f0ecd8');
    leaf(g,46,22,9,-0.4,'#7ad06a');
    elfBow(g,74,58,28);
    circ(g,68,58,5,rgrad(g,68,58,5,ELF_SKIN[0],ELF_SKIN[1]),2.5);
  },
  sentinel(g,T){
    boots(g,'#2a2a38');
    poly(g,[30,48, 70,48, 76,88, 24,88], lgrad(g,24,48,76,88,'#3a3a4a','#1a1a26'));
    poly(g,[40,50, 60,50, 58,86, 42,86], lgrad(g,40,50,60,86,T.light,T.main,T.dark),2.5);
    for(const [x,y,a] of [[74,58,-0.6],[26,62,0.7]]){ g.save(); g.translate(x,y); g.rotate(a); line(g,0,6,0,-2,OL,5); line(g,0,6,0,-2,'#4a2a1a',3); g.beginPath(); g.moveTo(-2.5,-2); g.quadraticCurveTo(6,-12,1,-22); g.quadraticCurveTo(0,-10,-2.5,-2); g.fillStyle=lgrad(g,0,-22,0,0,'#ffffff','#9aa6b6'); g.fill(); g.lineWidth=2; g.strokeStyle=OL; g.stroke(); g.restore(); }
    elfHead(g,50,36,14,null,lgrad(g,30,16,70,52,'#4a4a5a','#22222e'));
    rr(g,38,40,24,7,3,'#1a1a26',0); for(const sd of [-1,1]) circ(g,50+sd*6,38,2,'#e8f8ff',0);
  },
  blade(g,T){
    boots(g,'#5a3a4a');
    poly(g,[36,50, 64,50, 70,84, 30,84], lgrad(g,30,50,70,84,T.light,T.main,T.dark));
    g.beginPath(); g.moveTo(64,56); g.quadraticCurveTo(84,62,88,80); g.quadraticCurveTo(78,70,64,64); g.fillStyle=T.light; g.fill(); g.lineWidth=2; g.strokeStyle=OL; g.stroke();
    rr(g,34,64,32,5,2,'#c0a050',2);
    for(const [x,y,a] of [[78,44,0.5],[22,48,-0.9]]){ g.save(); g.translate(x,y); g.rotate(a); line(g,0,10,0,4,OL,5); line(g,0,10,0,4,'#c0a050',3); g.beginPath(); g.moveTo(-2,4); g.quadraticCurveTo(10,-14,2,-34); g.quadraticCurveTo(4,-14,2,4); g.closePath(); g.fillStyle=lgrad(g,0,-34,0,4,'#ffffff','#a8b6c6'); g.fill(); g.lineWidth=2; g.strokeStyle=OL; g.stroke(); g.restore(); }
    elfHead(g,50,36,14,'#e0a050');
    line(g,62,26,74,20,'#e0a050',5); circ(g,74,20,4,'#e0a050',2);
  },
  wisp(g,T){
    g.save(); g.globalAlpha=0.5; circ(g,50,52,26,rgrad(g,50,52,26,'#fffbe0','rgba(255,240,160,0)',0,0),0); g.restore();
    for(const sd of [-1,1]){ ell(g,50+sd*16,44,14,9,'rgba(255,255,255,0.75)',2,sd*0.5); ell(g,50+sd*13,58,9,6,'rgba(230,255,240,0.75)',2,-sd*0.4); }
    ell(g,50,56,7,12,lgrad(g,44,44,56,68,'#fff4c0','#e8b040'),2.5);
    skin(g,50,40,9,'#fff8e8','#f0c8a0');
    for(const sd of [-1,1]){ poly(g,[50+sd*7,38, 50+sd*14,32, 50+sd*8,42],'#fff0e0',1.5); circ(g,50+sd*3.5,41,1.6,OL,0); }
    poly(g,[44,64, 56,64, 50,72],T.main,1.5);
    for(let i=0;i<5;i++){ const a=i*1.3; circ(g,50+Math.cos(a)*24,50+Math.sin(a)*20,1.8,'#fffbe0',0); }
  },
  druid(g,T){
    boots(g,'#5a4428');
    poly(g,[32,48, 68,48, 76,90, 24,90], lgrad(g,24,48,76,90,'#5aa04a','#2a5a2a'));
    poly(g,[38,50, 62,50, 60,90, 40,90], lgrad(g,38,50,62,90,T.light,T.main,T.dark),2.5);
    for(let i=0;i<6;i++) leaf(g,30+i*8,52+(i%2)*4,9,1.2+i*0.3,i%2?'#7ad06a':'#4aa04a');
    line(g,80,94,74,24,OL,7); line(g,80,94,74,24,'#7a5a2a',4); circ(g,74,22,7,rgrad(g,74,22,7,'#e0ffe0','#3fdc7a'),2.5);
    elfHead(g,50,36,14,'#a07a4a');
    for(const sd of [-1,1]){ line(g,50+sd*8,24,50+sd*18,8,'#7a5a2a',4); line(g,50+sd*14,16,50+sd*22,14,'#7a5a2a',3); }
    circ(g,76,62,6,rgrad(g,76,62,6,ELF_SKIN[0],ELF_SKIN[1]),2.5);
  },
  bear(g,T){
    for(const x of [30,42,60,72]) rr(g,x-6,68,12,22,5,'#5a3a22',2.5);
    ell(g,50,62,32,22,rgrad(g,50,58,32,'#a0724a','#5a3a22'));
    rr(g,28,56,10,8,3,T.main,2);
    for(const [x,y] of [[42,58],[56,64],[62,54]]) line(g,x,y,x+5,y-3,'#7affa8',2.5);
    circ(g,78,46,15,rgrad(g,78,46,15,'#b08050','#5a3a22'));
    for(const sd of [-1,1]) circ(g,78+sd*9,33,5,'#8a5a32',2.5);
    ell(g,88,50,7,5,'#d8b088',2); circ(g,92,48,2.2,OL,0);
    circ(g,80,42,2.4,'#7affa8',0); line(g,84,56,90,56,OL,2);
  },
  ent(g,T){
    for(const sd of [-1,1]) poly(g,[50+sd*8,72, 50+sd*20,72, 50+sd*24,92, 50+sd*4,92],lgrad(g,40,72,60,92,'#8a6a42','#4a3418'),2.5);
    poly(g,[30,30, 70,30, 74,76, 26,76], lgrad(g,26,30,74,76,'#9a7a4a','#5a4020'));
    for(let i=0;i<4;i++) line(g,34+i*10,34,32+i*11,72,'#00000030',2.5);
    rr(g,30,56,40,6,2,T.main,2);
    for(const sd of [-1,1]){ line(g,50+sd*22,40,50+sd*36,62,OL,9); line(g,50+sd*22,40,50+sd*36,62,'#7a5a32',6); for(let i=0;i<3;i++) line(g,50+sd*36,62,50+sd*(32+i*5),70,'#7a5a32',3); }
    for(let i=0;i<9;i++){ const a=Math.PI*(1.05+i*0.11); circ(g,50+Math.cos(a)*24,30+Math.sin(a)*16,9,i%2?'#5ab84a':'#3a8a3a',2.5); }
    circ(g,50,20,12,'#4aa04a',2.5);
    for(const sd of [-1,1]){ circ(g,50+sd*8,44,4,'#ffc04a',2); circ(g,50+sd*8,44,1.6,OL,0); }
    line(g,42,54,58,54,'#3a2410',3);
  },
  hippo(g,T){
    for(const x of [34,44,60,70]) rr(g,x-3,66,6,20,3,'#8a6a4a',2);
    ell(g,52,60,24,14,rgrad(g,52,56,24,'#d8c0a0','#8a6a4a'));
    rr(g,40,50,22,8,3,T.main,2);
    g.beginPath(); g.moveTo(44,52); g.quadraticCurveTo(20,10,8,22); g.quadraticCurveTo(24,30,22,40); g.quadraticCurveTo(32,44,44,56); g.closePath(); g.fillStyle=lgrad(g,8,10,44,56,'#ffffff','#c8b8a0'); g.fill(); g.lineWidth=2.5; g.strokeStyle=OL; g.stroke();
    for(let i=0;i<3;i++) line(g,22+i*6,24+i*4,34+i*3,46,'#00000030',2);
    poly(g,[28,62, 16,70, 22,62, 12,60, 26,56],'#e8dcc8',2);
    circ(g,76,40,12,rgrad(g,76,40,12,'#ffffff','#d0c8b8'));
    poly(g,[84,38, 98,44, 86,48],'#f2c24b',2);
    circ(g,79,36,2.6,OL,0); circ(g,78,35,1,'#fff',0);
    poly(g,[68,30, 72,22, 76,30],'#e8dcc8',1.5);
  },
  moontower(g,T){
    ell(g,50,92,26,7,'rgba(0,0,0,0.25)',0);
    rr(g,30,80,40,12,4,lgrad(g,30,80,70,92,'#f0ece4','#a8a49c'));
    poly(g,[38,80, 62,80, 58,34, 42,34], lgrad(g,38,34,62,80,'#ffffff','#c8c4bc','#9a968e'));
    for(let i=0;i<3;i++) line(g,40,46+i*12,60,46+i*12,'#00000020',2);
    poly(g,[44,50, 56,50, 56,68, 50,64, 44,68], lgrad(g,44,50,56,68,T.light,T.main,T.dark),2);
    rr(g,36,30,28,6,2,'#e8e4dc',2);
    g.save(); g.globalAlpha=0.45; circ(g,50,16,16,rgrad(g,50,16,16,'#ffffff','rgba(220,210,255,0)',0,0),0); g.restore();
    crescent(g,50,16,11,lgrad(g,40,6,60,26,'#ffffff','#d8d0ff'));
    for(const [x,y] of [[30,44],[70,40],[34,66],[68,64]]) leaf(g,x,y,8,x<50?2.6:0.4,'#6ac05a');
  },
  starfall(g){
    for(let i=0;i<5;i++){ const x=24+i*13, y=20+((i*37)%30); line(g,x+14,y-16,x,y,'rgba(255,240,180,0.9)',4); g.save(); g.translate(x,y);
      g.beginPath(); for(let k=0;k<10;k++){ const r=k%2?4:10, a=k*Math.PI/5-Math.PI/2; g.lineTo(Math.cos(a)*r,Math.sin(a)*r); } g.closePath(); g.fillStyle=k2(i); g.fill(); g.lineWidth=2; g.strokeStyle=OL; g.stroke(); g.restore(); }
    function k2(i){ return i%2 ? '#fff6c0' : '#ffe080'; }
    for(let i=0;i<8;i++) circ(g,20+i*9,80-(i%3)*6,2,'#fffbe0',0);
  },
  roots(g){
    ell(g,50,84,36,9,'#6a4a2a',2.5);
    for(let i=0;i<5;i++){ const x=22+i*14, h=40+(i%2)*18; g.beginPath(); g.moveTo(x-6,84); g.bezierCurveTo(x-14,84-h*0.5,x+12,84-h*0.7,x,84-h); g.bezierCurveTo(x+8,84-h*0.6,x-4,84-h*0.4,x+6,84); g.closePath(); g.fillStyle=lgrad(g,x,84-h,x,84,'#7ad06a','#2a6a2a'); g.fill(); g.lineWidth=2.2; g.strokeStyle=OL; g.stroke();
      for(let k=0;k<3;k++) poly(g,[x-2+k*2,84-h*(0.3+k*0.2), x-8,84-h*(0.35+k*0.2), x-2+k*2,84-h*(0.38+k*0.2)],'#c8e8a0',1.2); leaf(g,x,84-h,8,-1.2,'#9ae07a'); }
  },
  moonbless(g){
    g.save(); g.globalAlpha=0.5; circ(g,50,50,40,rgrad(g,50,50,40,'#ffffff','rgba(220,220,255,0)',0,0),0); g.restore();
    crescent(g,48,38,22,lgrad(g,30,20,66,60,'#ffffff','#d8d0ff'));
    for(let i=0;i<5;i++){ const x=30+i*10, y=66+(i%2)*8; line(g,x,y-6,x,y+6,'#7affa8',4); line(g,x-6,y,x+6,y,'#7affa8',4); }
  },
  ancient(g,T){
    SPR.ent(g,T);
    for(let i=0;i<4;i++) line(g,40+i*6,60,42+i*5,78,'#e8f0e0',3);
    for(const [x,y] of [[36,40],[62,48],[44,66]]){ line(g,x,y,x+6,y+4,'#7affa8',3); }
    for(const sd of [-1,1]) poly(g,[50+sd*24,92, 50+sd*36,96, 50+sd*20,96],'#6a4a2a',2);
  },
  dryad(g,T){
    boots(g,'#6a5a3a');
    poly(g,[30,50, 70,50, 80,90, 20,90], lgrad(g,20,50,80,90,'#e8a8c8','#a85a8a'));
    poly(g,[40,50, 60,50, 58,88, 42,88], lgrad(g,40,50,60,88,T.light,T.main,T.dark),2.5);
    for(let i=0;i<7;i++) leaf(g,22+i*9,86-(i%2)*4,8,-1.6+i*0.2,i%2?'#ffb0d0':'#7ad06a');
    line(g,82,94,76,22,OL,7); line(g,82,94,76,22,'#8a6a3a',4); circ(g,76,20,8,rgrad(g,76,20,8,'#e0ffe0','#3fdc7a'),2.5);
    elfHead(g,50,36,14,'#5aa04a');
    for(let i=0;i<5;i++) circ(g,38+i*6,22-(i%2)*3,3.4,i%2?'#ffb0d0':'#fff0f6',1.5);
    circ(g,78,60,6,rgrad(g,78,60,6,ELF_SKIN[0],ELF_SKIN[1]),2.5);
  },
  windrider(g,T){
    SPR.hippo(g,T);
    poly(g,[46,30, 60,30, 62,52, 44,52], lgrad(g,44,30,62,52,T.light,T.main,T.dark),2.5);
    elfHead(g,53,22,9,'#f0ecd8');
    elfBow(g,70,32,16);
  },
  shadow(g,T){
    g.save(); g.globalAlpha=0.5; for(let i=0;i<5;i++) circ(g,30+i*10,80+(i%2)*4,8,'#2a2236',0); g.restore();
    SPR.sentinel(g,T);
    for(const sd of [-1,1]) circ(g,50+sd*6,38,2.6,'#ffffff',0);
  },
  starstorm(g){ SPR.starfall(g); g.save(); g.translate(0,8); g.scale(1,0.6); g.translate(0,58); SPR.roots(g); g.restore(); },
  // ----- orcos nuevos -----
  troll(g,T){
    boots(g,'#3a2a20');
    poly(g,[38,46, 62,46, 64,86, 36,86], lgrad(g,36,46,64,86,'#7a5a3a','#3a2818'));
    poly(g,[40,66, 60,66, 62,86, 38,86], lgrad(g,38,66,62,86,T.light,T.main,T.dark),2.5);
    g.save(); g.translate(76,40); g.rotate(-0.5); line(g,0,18,0,-14,OL,6); line(g,0,18,0,-14,'#6a4a2a',3.5); g.beginPath(); g.moveTo(0,-14); g.quadraticCurveTo(16,-18,14,0); g.quadraticCurveTo(8,-6,1,-4); g.closePath(); g.fillStyle=lgrad(g,0,-18,16,0,'#ffffff','#8a96a6'); g.fill(); g.lineWidth=2; g.strokeStyle=OL; g.stroke(); g.restore();
    circ(g,76,58,6,rgrad(g,76,58,6,'#8ad8c0','#3a8a7a'),2.5);
    for(const sd of [-1,1]) poly(g,[50+sd*10,30, 50+sd*26,18, 50+sd*14,38],'#6ac0a8',2.5);
    circ(g,50,34,14,rgrad(g,50,34,14,'#9ae0c8','#3a8a7a'));
    poly(g,[50,30, 64,38, 52,40],'#7ac8b0',2);
    for(const sd of [-1,1]){ circ(g,50+sd*5,30,2.6,'#ffe066',1.5); poly(g,[50+sd*4,44, 50+sd*5,38, 50+sd*7,44],'#fffbea',1.2); }
    for(let i=0;i<5;i++) poly(g,[42+i*4,22, 44+i*4,10-(i%2)*4, 46+i*4,22],'#e04a3a',1.5);
  },
  kodo(g,T){
    for(const x of [26,40,60,74]) rr(g,x-6,66,12,24,5,'#6a5a4a',2.5);
    ell(g,50,58,36,24,rgrad(g,50,52,36,'#c8b090','#6a5a42'));
    rr(g,32,32,36,20,6,lgrad(g,32,32,68,52,'#b08050','#5a3a20'));
    for(const x of [38,56]){ ell(g,x+4,34,8,10,'#d8c8a8',2); line(g,x+4,26,x+4,42,'#8a6a3a',2); }
    rr(g,30,50,40,6,2,T.main,2);
    circ(g,86,54,13,rgrad(g,86,54,13,'#b8a080','#6a5a42'));
    poly(g,[92,48, 102,34, 96,52],'#f4ecd8',2); poly(g,[94,58, 104,62, 94,64],'#f4ecd8',2);
    circ(g,88,50,2.4,OL,0);
  },
  raider(g,T){
    boots(g,'#3a2a20');
    poly(g,[36,50, 64,50, 68,84, 32,84], lgrad(g,32,50,68,84,'#8a6a42','#4a3418'));
    poly(g,[36,62, 64,62, 64,68, 36,68],T.main,2);
    ell(g,30,46,13,15,lgrad(g,18,32,42,60,'#c8a870','#7a5a30'),2.5); circ(g,30,36,3,'#ffe066',1.5);
    g.save(); g.translate(76,50); g.rotate(0.5); line(g,0,10,0,4,OL,5); line(g,0,10,0,4,'#6a4a2a',3); g.beginPath(); g.moveTo(-3,4); g.quadraticCurveTo(10,-10,0,-24); g.quadraticCurveTo(2,-8,3,4); g.closePath(); g.fillStyle=lgrad(g,0,-24,0,4,'#ffffff','#8a96a6'); g.fill(); g.lineWidth=2; g.strokeStyle=OL; g.stroke(); g.restore();
    circ(g,74,60,6,rgrad(g,74,60,6,'#a8e07a','#4f8a2e'),2.5);
    SPR.orcHead(g,50,36,14,T,false);
    g.beginPath(); g.arc(50,30,13,Math.PI*1.1,Math.PI*1.9); g.lineTo(62,26); g.lineTo(38,26); g.closePath(); g.fillStyle=T.main; g.fill(); g.lineWidth=2; g.strokeStyle=OL; g.stroke();
  },
  wyvern(g,T){
    g.beginPath(); g.moveTo(40,54); g.quadraticCurveTo(14,10,4,30); g.quadraticCurveTo(16,34,14,46); g.quadraticCurveTo(26,46,40,60); g.closePath(); g.fillStyle=lgrad(g,4,10,40,60,'#e0705a','#8a2a1a'); g.fill(); g.lineWidth=2.5; g.strokeStyle=OL; g.stroke();
    ell(g,52,62,22,12,rgrad(g,52,58,22,'#e8806a','#8a2a1a'));
    g.beginPath(); g.moveTo(32,64); g.quadraticCurveTo(14,74,12,60); g.lineWidth=6; g.strokeStyle=OL; g.stroke(); g.lineWidth=3.5; g.strokeStyle='#c0503a'; g.stroke(); poly(g,[10,56, 6,62, 14,62],'#f4ecd8',1.5);
    g.beginPath(); g.moveTo(68,58); g.quadraticCurveTo(80,44,86,40); g.lineWidth=10; g.strokeStyle=OL; g.stroke(); g.lineWidth=7; g.strokeStyle='#d0604a'; g.stroke();
    ell(g,90,40,9,6,'#e0705a',2.5); circ(g,92,38,1.8,'#ffe066',0);
    rr(g,46,48,14,6,2,T.main,2);
    poly(g,[46,32, 60,32, 60,50, 46,50], lgrad(g,46,32,60,50,'#8a6a42','#4a3418'),2);
    SPR.orcHead(g,53,24,9,T,true);
    line(g,66,14,72,46,OL,4); line(g,66,14,72,46,'#8a6a3a',2.2); poly(g,[64,8, 66,16, 70,14],'#d8dee6',1.5);
  },
  peon(g,T){
    for(let i=0;i<6;i++){ const x=14+i*13; rr(g,x,40,11,50,3,lgrad(g,x,40,x+11,90,'#c08a52','#6a3e1c'),2); poly(g,[x,40, x+5.5,28, x+11,40],'#e0c8a0',2); }
    line(g,10,58,92,52,'#5a3416',5); line(g,10,78,92,72,'#5a3416',5);
    poly(g,[62,44, 76,44, 76,62, 69,58, 62,62], lgrad(g,62,44,76,62,T.light,T.main,T.dark),2);
    SPR.orcHead(g,38,30,10,T,false);
    line(g,26,40,18,26,OL,5); line(g,26,40,18,26,'#6a4a2a',3); rr(g,12,20,12,7,2,'#8a96a6',2);
  },
  elfkeeper(g,T){
    poly(g,[30,52, 70,52, 78,96, 22,96], lgrad(g,22,52,78,96,T.light,T.main,T.dark));
    line(g,50,54,50,94,'#e8e0c0',2.5);
    for(let i=0;i<5;i++) leaf(g,30+i*10,56,8,1.4,i%2?'#7ad06a':'#4aa04a');
    circ(g,74,48,6,rgrad(g,74,48,6,ELF_SKIN[0],ELF_SKIN[1]),2.5); leaf(g,74,40,10,-1.4,'#9ae07a');
    elfHead(g,50,36,15,'#f4f0e0');
    g.beginPath(); g.arc(50,28,14,Math.PI*1.1,Math.PI*1.9); g.lineWidth=3; g.strokeStyle='#e8e8f0'; g.stroke(); circ(g,50,15,3,'#ffffff',1.5);
  },
});

// ---- torres élficas ----
function drawElfTower(g, T, king){
  g.lineCap='round'; g.lineJoin='round';
  if(king){
    // Árbol Madre
    ell(g,50,116,44,8,'rgba(0,0,0,0.3)',0);
    for(const sd of [-1,1]){ g.beginPath(); g.moveTo(50+sd*10,104); g.quadraticCurveTo(50+sd*30,108,50+sd*42,118); g.lineTo(50+sd*24,118); g.closePath(); g.fillStyle='#7a5a32'; g.fill(); g.lineWidth=2.5; g.strokeStyle=OL; g.stroke(); }
    poly(g,[34,118, 66,118, 62,40, 38,40], lgrad(g,34,40,66,118,'#a07a4a','#7a5a32','#4a3418'));
    for(let i=0;i<4;i++) line(g,40+i*6,48,38+i*7,114,'#00000028',2.5);
    g.beginPath(); g.moveTo(42,118); g.lineTo(42,98); g.arc(50,98,8,Math.PI,TAU); g.lineTo(58,118); g.closePath(); g.fillStyle=rgrad(g,50,108,14,'#fffbe0','#e0b040',0,0.2); g.fill(); g.lineWidth=2.5; g.strokeStyle=OL; g.stroke();
    for(const x of [24,76]){ poly(g,[x-7,62, x+7,62, x+7,88, x,82, x-7,88], lgrad(g,x,62,x,88,T.light,T.main,T.dark),2.5); circ(g,x,72,3,'#f0ecd8',1.5); line(g,x,56,x,62,OL,2); }
    for(let i=0;i<11;i++){ const a=Math.PI*(1.0+i*0.1), r=i%2?32:36; circ(g,50+Math.cos(a)*r,46+Math.sin(a)*r*0.7,11,i%3?'#5ab84a':'#3a8a3a',2.5); }
    for(let i=0;i<5;i++) circ(g,28+i*11,24-(i%2)*6,11,i%2?'#7ad06a':'#4aa04a',2.5);
    ell(g,50,42,26,7,lgrad(g,24,35,76,49,'#f0ecd8','#b8b4a8'),2.5);
    for(const x of [22,78]){ line(g,x,46,x,56,'#c0b8a0',1.5); circ(g,x,58,3.4,'#fffbe0',1.5); }
    return;
  }
  // torre élfica de piedra blanca abrazada por un tronco
  ell(g,50,114,36,9,'rgba(0,0,0,0.28)',0);
  poly(g,[26,112, 74,112, 66,54, 34,54], lgrad(g,26,54,74,112,'#ffffff','#d8d4cc','#a8a49c'));
  for(let r=0;r<4;r++) line(g,30,64+r*12,70,64+r*12,'#00000018',2);
  g.beginPath(); g.moveTo(28,110); g.bezierCurveTo(46,96,30,80,52,70); g.bezierCurveTo(66,62,58,58,66,54); g.lineWidth=9; g.strokeStyle=OL; g.stroke(); g.lineWidth=6; g.strokeStyle='#8a6a3a'; g.stroke();
  for(const [x,y,a] of [[34,96,2.6],[56,68,0.3],[46,82,-0.5],[64,58,0.8]]) leaf(g,x,y,10,a,'#5ab84a');
  poly(g,[42,74, 58,74, 58,98, 50,92, 42,98], lgrad(g,50,74,50,98,T.light,T.main,T.dark),2.5);
  crescent(g,50,82,4.5,'#ffffff');
  ell(g,50,52,30,10,lgrad(g,20,42,80,62,'#ffffff','#c8c4bc'),3);
  for(let i=0;i<5;i++){ const a=Math.PI*(0.1+i*0.2), x=50-Math.cos(a)*28, y=54+Math.sin(a)*8; poly(g,[x-4,y, x,y-12, x+4,y],'#f0ecd8',2); }
  for(const x of [24,76]) leaf(g,x,52,9,x<50?2.8:0.3,'#6ac05a');
}

// ================= TERRENOS (mapas de batalla) =================
// Cada terreno define qué barreras hay para las tropas de tierra, por dónde se cruzan y su mecánica propia.
const TERRAINS = {
  river:  {name:'Río',         ic:'🌊', tip:'El clásico: tres puentes, una torre por puente.'},
  forest: {name:'Bosque',      ic:'🌲', tip:'Las tropas que cruzan la franja de árboles quedan ocultas al rival: ¡emboscadas!'},
  canyon: {name:'Cañón',       ic:'⛰️', tip:'Una roca gigante tapa el paso central. Quien la rompa gana +2 de elixir.'},
  winding:{name:'Senderos',    ic:'🐍', extra:30, tip:'Caminos en zigzag entre rocas: recorridos más largos (+30 s de batalla), los ataques a distancia brillan.'},
  ice:    {name:'Lago helado', ic:'🧊', tip:'Cruza el hielo por donde quieras… En el último minuto se rompe y solo quedan los puentes.'},
  volcano:{name:'Volcán',      ic:'🌋', tip:'Río de lava. Cada poco cae lava en una zona marcada: ¡aparta a tus tropas!'},
  swamp:  {name:'Pantano',     ic:'🐸', tip:'Sin río, pero el barro del centro frena a las tropas de tierra. Voladores y saltadores van mejor.'},
};
const TERRAIN_KEYS = Object.keys(TERRAINS);
// ---- biomas: suelo, río, puentes y decoración según la zona del mapa ----
const BIOMES = {
  grass:   {name:'Pradera',     tex:'tex_grass',    river:'tex_river',       bridge:'tex_bridge',   deco:['arbusto','roca1','roca2','roca3'], side:['arbol1','arbol2','arbol3','arbol1'], sideRock:['roca1','roca2','roca3']},
  snow:    {name:'Nieve',       tex:'tex_snow',     river:'tex_river',       bridge:'bridge_ice',   deco:['pino_nieve','wx_crystal','pino_nieve','roca1'], side:['pino_nieve'], sideRock:['wx_crystal','roca1']},
  desert:  {name:'Desierto',    tex:'tex_sand',     river:'tex_river',       bridge:'bridge_stone', deco:['cactus','roca2','cactus','roca3'], side:['cactus'], sideRock:['roca2','roca3']},
  volcanic:{name:'Volcán',      tex:'tex_volcanic', river:'tex_river',       bridge:'bridge_stone', deco:['roca_lava','roca3','roca_lava','roca1'], side:['roca_lava'], sideRock:['roca_lava','roca3']},
  grave:   {name:'Ruinas',  tex:'tex_grave',    river:'tex_river_swamp', bridge:'bridge_bone',  deco:['lapida','huesos','lapida','roca3'], side:['lapida','arbol3'], sideRock:['huesos','roca3']},
};
// algunos mapas fijan el bioma (el lago helado siempre es nevado, etc.)
function biomeFor(ter, b){ return ter==='ice' ? 'snow' : ter==='volcano' ? 'volcanic' : ter==='canyon' ? 'desert' : ter==='forest' ? 'grass' : ter==='swamp' ? (b==='grave' ? 'grave' : 'grass') : (BIOMES[b] ? b : 'grass'); }
const WIND_ROWS = [{y0:20.2, y1:21.2}, {y0:10.8, y1:11.8}], WIND_GAPS = [6.25, 11.75], WIND_HALF = 1.0;
const MUD = {y0:11.5, y1:20.5, mul:0.6};
const BOULDER_HP = 2400, LAVA_DMG = 220, LAVA_R = 1.8;
const terrain = () => (B && B.terrain) || 'river';
const boulderUp = () => !!(B && B.boulder && B.boulder.hp > 0);

// barreras activas: {y0,y1, gaps (para planificar ruta), phys (huecos físicos)}
function obstacles(){
  const t = terrain(), list = [];
  if(t!=='swamp' && !(t==='ice' && !B.iceBroken)){
    const phys = BRIDGES.map(x=>({x, h:bridgeHalf(x)}));
    list.push({id:'r', y0:RT, y1:RB, river:true, phys, gaps: boulderUp() ? phys.filter(g=>g.x!==9) : phys});
  }
  if(t==='winding') WIND_ROWS.forEach((r,i)=>{ const g = WIND_GAPS.map(x=>({x, h:WIND_HALF})); list.push({id:'w'+i, y0:r.y0, y1:r.y1, gaps:g, phys:g}); });
  return list;
}
// a dónde debe caminar una tropa de tierra para llegar a su objetivo
function routeTarget(u, t){
  if(isAir(u) || u.c.leap || t.type==='rock') return [t.x, t.y];
  let best = null, bd = 1e9;
  for(const ob of obstacles()){ const mid = (ob.y0+ob.y1)/2; if((u.y-mid)*(t.y-mid) >= 0) continue; const d = Math.abs(u.y-mid); if(d<bd){ bd = d; best = ob; } }
  if(!best) return [t.x, t.y];
  u.gaps = u.gaps || {};
  let g = u.gaps[best.id];
  if(g==null || !best.gaps.some(o=>o.x===g) || Math.abs(u.x-g) > 3.2){ g = best.gaps.reduce((p,c)=>Math.abs(u.x-c.x)<Math.abs(u.x-p.x)?c:p).x; u.gaps[best.id] = g; }
  const h = best.gaps.find(o=>o.x===g).h, mid = (best.y0+best.y1)/2, above = u.y < mid;
  if(Math.abs(u.x-g) < Math.min(0.4, h-0.1) && u.y >= best.y0-0.7 && u.y <= best.y1+0.7) return [g, above ? best.y1+0.8 : best.y0-0.8];
  return [g, above ? best.y0-0.6 : best.y1+0.6];
}
// no dejar a las tropas de tierra dentro de una barrera
function clampObstacles(a){
  for(const ob of obstacles()){
    if(a.y <= ob.y0-0.1 || a.y >= ob.y1+0.1) continue;
    if(ob.river && Math.hypot(a.x-ISLE.x, a.y-ISLE.y) <= ISLE.r) continue;
    const g = ob.phys.reduce((p,c)=>Math.abs(a.x-c.x)<Math.abs(a.x-p.x)?c:p);
    if(Math.abs(a.x-g.x) > g.h) a.x = g.x + Math.sign(a.x-g.x)*g.h;
  }
}
function terrainSpeed(u){
  if(terrain()==='swamp' && !isAir(u) && !u.c.leap && u.y>MUD.y0 && u.y<MUD.y1) return MUD.mul;
  return 1;
}
function terrainDropOk(x, y){
  if(terrain()==='winding' && WIND_ROWS.some(r=>y>r.y0-0.25 && y<r.y1+0.25) && !WIND_GAPS.some(g=>Math.abs(x-g)<WIND_HALF-0.2)) return false;
  return true;
}
// ---- inicio y bucle ----
function setupTerrain(enc){
  B.terrain = enc.mode==='treasure' ? 'river' : (TERRAINS[enc.terrain] ? enc.terrain : 'river');
  B.biome = enc.mode==='treasure' ? 'grass' : biomeFor(B.terrain, enc.biome);
  B.time += (TERRAINS[B.terrain].extra || 0);
  B.iceBroken = false; B.iceWarn = false; B.eruptT = 20; B.boulder = null;
  if(B.terrain==='canyon'){ B.boulder = {type:'rock', side:'n', x:ISLE.x, y:ISLE.y, r:1.05, hp:BOULDER_HP, maxHp:BOULDER_HP, flash:0, stun:0}; B.ents.push(B.boulder); }
}
function updTerrain(dt){
  const t = terrain();
  if(t==='ice' && !B.iceBroken){
    if(!B.iceWarn && B.time <= DOUBLE_AT+4 && !B.overtime){ B.iceWarn = true; banner('🧊 ¡El hielo cruje!', 'Sal del lago: se rompe en 4 s', 1.6); }
    if(B.time <= DOUBLE_AT || B.overtime) breakIce();
  }
  if(t==='volcano'){
    B.eruptT -= dt;
    if(B.eruptT <= 0){
      B.eruptT = 15 + B.rng()*6;
      const us = B.ents.filter(e=>e.type==='unit' && e.hp>0 && !isAir(e) && !e.c.building);
      let x, y;
      if(us.length && B.rng()<0.65){ const u = us[Math.floor(B.rng()*us.length)]; x = u.x + (B.rng()-0.5)*1.5; y = u.y + (B.rng()-0.5)*1.5; }
      else { x = 1.5 + B.rng()*15; y = 5 + B.rng()*22; }
      x = clamp(x, 1, W-1); y = clamp(y, 4, H-4);
      B.fx.push({k:'warn', x, y, r:LAVA_R, t:0, life:1.4});
      setTimeoutB(1.4, ()=>lavaHit(x, y));
    }
  }
}
function lavaHit(x, y){
  for(const e of B.ents){ if(e.type!=='unit' || e.hp<=0 || isAir(e)) continue; if(dist(e,{x,y}) - e.r <= LAVA_R) hit(e, LAVA_DMG, 'n', true); }
  SFX.boom(); B.shake = Math.max(B.shake, 0.35);
  B.fx.push({k:'flash', x, y, r:LAVA_R*1.2, t:0, life:0.45, col:'#ff6a10'}); B.fx.push({k:'img', key:'burbuja_lava', x, y, r:LAVA_R, t:0, life:0.55}); B.fx.push({k:'ring', x, y, r0:0.3, r1:LAVA_R, t:0, life:0.4, col:'#ffd070'});
  for(let i=0;i<26;i++) part('ember', x, y, {sp:6, life:0.8}); for(let i=0;i<8;i++) part('smoke', x, y, {sp:1.6, life:1.0, size:0.45});
}
function breakIce(){
  B.iceBroken = true;
  let n = 0;
  for(const e of B.ents){
    if(e.type!=='unit' || e.hp<=0 || isAir(e) || e.c.leap) continue;
    if(e.y <= RT-0.1 || e.y >= RB+0.1) continue;
    if(Math.hypot(e.x-ISLE.x, e.y-ISLE.y) <= ISLE.r) continue;
    const bx = nearestBridge(e.x); if(Math.abs(e.x-bx) <= bridgeHalf(bx)) continue;
    e.hp = 0; n++;
    for(let i=0;i<8;i++) part('spark', e.x, e.y, {sp:3, col:'#e8f8ff', life:0.6});
  }
  for(let i=0;i<40;i++) part('spark', B.rng()*W, RT+B.rng()*(RB-RT), {sp:2, col:'#ffffff', life:0.8, size:0.12});
  SFX.zap(); B.shake = Math.max(B.shake, 0.5);
  banner('🧊 ¡El hielo se ha roto!', n ? `${n} tropa${n>1?'s':''} al agua · ahora solo valen los puentes` : 'Ahora solo valen los puentes', 1.8);
  if(typeof arenaKey!=='undefined'){ arenaKey = ''; if(curScreen==='battle') resizeBattle(); }
}
function boulderBroken(e){
  const s = (e.lastHit==='p' || e.lastHit==='e') ? e.lastHit : null;
  if(s){ B[s].elixir = Math.min(10, B[s].elixir + 2); part('text', e.x, e.y-1.2, {txt:'+2 elixir', col: s==='p' ? '#e070ff' : '#ff9a9a', life:1.2}); }
  for(let i=0;i<30;i++) part('debris', e.x+(B.rng()-0.5)*1.4, e.y, {sp:3.5, col:['#9a8a78','#c8b8a4','#6e6252'][i%3], life:1.3, size:0.2});
  for(let i=0;i<12;i++) part('smoke', e.x, e.y-0.3, {sp:2, life:1.2, size:0.6});
  SFX.tower(); B.shake = Math.max(B.shake, 0.7);
  banner('⛰️ ¡Paso central abierto!', s==='p' ? 'Ganas +2 de elixir' : s==='e' ? 'El rival gana +2 de elixir' : '', 1.5);
}
// ---- dibujo dinámico ----
function drawRockE(e, now){
  const k = e.hp/e.maxHp, s = X(e.r*2.3), x = X(e.x), y = X(e.y+0.45);
  const rim = imgFor(k < 0.5 ? 'roca_gigante_rota' : 'roca_gigante');
  if(rim){ const w = X(2.5), h = w*rim.naturalHeight/rim.naturalWidth, sh = e.flash>0 ? (Math.random()-0.5)*X(0.08) : 0;
    ctx.fillStyle='rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.ellipse(x, y, w*0.42, w*0.14, 0, 0, TAU); ctx.fill();
    ctx.drawImage(rim, x - w/2 + sh, y - h*0.92, w, h);
    if(e.hp < e.maxHp) hpBar(e.x, e.y - 2.0, 1.8, k, 'n', false);
    return; }
  ctx.save(); ctx.translate(x + (e.flash>0 ? (Math.random()-0.5)*X(0.08) : 0), y);
  ctx.fillStyle='rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.ellipse(0, 0, s*0.52, s*0.18, 0, 0, TAU); ctx.fill();
  const g = ctx.createLinearGradient(-s*0.5, -s, s*0.5, 0); g.addColorStop(0, e.flash>0 ? '#ffffff' : '#c8bca8'); g.addColorStop(1, '#6e6252');
  ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(-s*0.5, -s*0.05); ctx.lineTo(-s*0.42, -s*0.62); ctx.lineTo(-s*0.08, -s*0.9); ctx.lineTo(s*0.35, -s*0.78); ctx.lineTo(s*0.52, -s*0.3); ctx.lineTo(s*0.45, 0); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#2e2620'; ctx.lineWidth = Math.max(1.5, TS*0.08); ctx.stroke();
  ctx.strokeStyle = 'rgba(40,30,20,0.7)'; ctx.lineWidth = Math.max(1, TS*0.05);
  const cracks = Math.floor((1-k)*5);
  for(let i=0;i<cracks;i++){ const a = -0.4 + i*0.35; ctx.beginPath(); ctx.moveTo(Math.cos(a)*s*0.1, -s*0.45); ctx.lineTo(Math.cos(a)*s*0.32, -s*0.45 + Math.sin(a*3)*s*0.25); ctx.lineTo(Math.cos(a)*s*0.42, -s*0.2); ctx.stroke(); }
  ctx.fillStyle='rgba(255,255,255,0.25)'; ctx.beginPath(); ctx.ellipse(-s*0.15, -s*0.68, s*0.14, s*0.06, -0.4, 0, TAU); ctx.fill();
  ctx.restore();
  if(e.hp < e.maxHp) hpBar(e.x, e.y - 2.0, 1.8, k, 'n', false);
}
function drawTerrainAnim(now){
  const t = terrain();
  const water = t==='river' || t==='winding' || (t==='ice' && B.iceBroken);
  if(water || t==='volcano'){
    ctx.save(); ctx.beginPath(); ctx.rect(0, X(RT), X(W), X(RB-RT)); ctx.clip();
    if(water){
      ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = Math.max(1, TS*0.07); ctx.lineCap = 'round';
      for(let i=0;i<14;i++){ const ph = (now*0.35 + i*0.37)%1, x = ((i*5.3 + now*0.9) % (W+2)) - 1, y = RT + 0.35 + (i%3)*0.55;
        ctx.globalAlpha = Math.sin(ph*Math.PI)*0.8; ctx.beginPath(); ctx.moveTo(X(x),X(y)); ctx.quadraticCurveTo(X(x+0.3),X(y-0.12),X(x+0.6),X(y)); ctx.stroke(); }
    } else {
      for(let i=0;i<16;i++){ const ph = (now*0.5 + i*0.29)%1, x = (i*1.13 + Math.sin(i*7)*0.4) % W, y = RT + 0.3 + ((i*0.61)%1.4);
        ctx.globalAlpha = Math.sin(ph*Math.PI)*0.9; ctx.fillStyle = i%2 ? '#ffe08a' : '#ffb040'; ctx.beginPath(); ctx.arc(X(x), X(y), X(0.08 + ph*0.12), 0, TAU); ctx.fill(); }
    }
    ctx.restore(); ctx.globalAlpha = 1;
  } else if(t==='ice'){
    for(let i=0;i<6;i++){ const ph = (now*0.4 + i*0.37)%1, x = (i*3.1 + 1) % W, y = RT + 0.4 + (i%3)*0.6;
      ctx.globalAlpha = Math.sin(ph*Math.PI)*0.9; ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(X(x), X(y), X(0.07), 0, TAU); ctx.fill(); }
    if(B.iceWarn){ ctx.globalAlpha = 0.5 + 0.4*Math.sin(now*14); ctx.strokeStyle = '#ffffff'; ctx.lineWidth = Math.max(1, TS*0.06);
      for(let i=0;i<7;i++){ const x = 1 + i*2.6; ctx.beginPath(); ctx.moveTo(X(x), X(RT+0.2)); ctx.lineTo(X(x+0.6), X(RT+1)); ctx.lineTo(X(x+0.2), X(RB-0.2)); ctx.stroke(); } }
    ctx.globalAlpha = 1;
  } else if(t==='swamp'){
    for(let i=0;i<10;i++){ const ph = (now*0.3 + i*0.41)%1, x = (i*1.9 + 0.7) % W, y = MUD.y0 + 1 + ((i*2.3)%(MUD.y1-MUD.y0-2));
      ctx.globalAlpha = Math.sin(ph*Math.PI)*0.6; ctx.strokeStyle = '#d8e8b0'; ctx.lineWidth = Math.max(1, TS*0.05); ctx.beginPath(); ctx.arc(X(x), X(y), X(0.1 + ph*0.25), 0, TAU); ctx.stroke(); }
    ctx.globalAlpha = 1;
  }
}

// ---- dibujo estático del terreno (dentro de la arena pre-renderizada) ----
const TERRAIN_PAL = {
  river:  ['#6cbc4e','#74c455'], winding:['#6cbc4e','#74c455'], forest:['#55a043','#5daa49'], canyon:['#c9b27a','#d2bb84'],
  ice:    ['#e4eef2','#eef5f8'], volcano:['#6a5a52','#72625a'], swamp:['#6f8a4a','#779252'],
};
function windingPaths(){
  const P = [];
  const lane = (x, gx) => [[x,25.8],[x,23.2],[gx,21.9],[gx,19.4],[x,18.2],[x,17.2]];
  P.push(lane(3.5, 6.25), lane(14.5, 11.75));
  P.push([[9,29.6],[9,24.2],[6.25,21.9]], [[9,24.2],[11.75,21.9]], [[6.25,19.4],[9,17.6]], [[11.75,19.4],[9,17.6]]);
  const mir = P.map(pl=>pl.map(([x,y])=>[x, 32-y]));
  return [...P, ...mir];
}
function drawProp(g, X, key, x, yb, w){ const im = imgFor(key); if(!im) return false; const h = w*im.naturalHeight/im.naturalWidth; g.drawImage(im, X(x-w/2), X(yb-h), X(w), X(h)); return true; }
function drawTerrainBand(g, X, R, t, broken, bio='grass'){
  const tree = (x, y, s, dark) => {
    g.fillStyle='rgba(0,0,0,0.25)'; g.beginPath(); g.ellipse(X(x+0.1), X(y+0.35*s), X(0.55*s), X(0.22*s), 0, 0, TAU); g.fill();
    g.fillStyle='#6a4a2a'; g.fillRect(X(x-0.1*s), X(y), X(0.2*s), X(0.4*s));
    for(const [dx,dy,r] of [[-0.25,-0.1,0.42],[0.25,-0.1,0.42],[0,-0.42,0.46]]){ const gr = g.createRadialGradient(X(x+dx-0.1*s), X(y+dy*s-0.15*s), 1, X(x+dx*s), X(y+dy*s), X(r*s)); gr.addColorStop(0, dark ? '#4a9a3a' : '#6cc04e'); gr.addColorStop(1, dark ? '#1e5a1a' : '#2a7a24'); g.fillStyle = gr; g.beginPath(); g.arc(X(x+dx*s), X(y+dy*s), X(r*s), 0, TAU); g.fill(); g.strokeStyle='#143c12'; g.lineWidth = Math.max(1, X(0.05)); g.stroke(); }
  };
  const stone = (x, y, s, c1, c2) => {
    g.fillStyle='rgba(0,0,0,0.25)'; g.beginPath(); g.ellipse(X(x), X(y+0.2*s), X(0.5*s), X(0.2*s), 0, 0, TAU); g.fill();
    const gr = g.createLinearGradient(X(x-0.5*s), X(y-0.5*s), X(x+0.5*s), X(y+0.2*s)); gr.addColorStop(0, c1); gr.addColorStop(1, c2); g.fillStyle = gr;
    g.beginPath(); g.moveTo(X(x-0.5*s), X(y+0.15*s)); g.lineTo(X(x-0.35*s), X(y-0.35*s)); g.lineTo(X(x+0.05*s), X(y-0.5*s)); g.lineTo(X(x+0.48*s), X(y-0.15*s)); g.lineTo(X(x+0.42*s), X(y+0.2*s)); g.closePath(); g.fill(); g.strokeStyle='#2e2620'; g.lineWidth = Math.max(1, X(0.05)); g.stroke();
  };
  const inGap = (x, gaps, pad) => gaps.some(([gx,h])=>Math.abs(x-gx) < h+pad);
  const bridgeGaps = BRIDGES.map(b=>[b, bridgeHalf(b)]);
  if(t==='forest'){
    g.fillStyle='rgba(20,60,20,0.35)'; g.fillRect(0, X(RT-0.3), X(W), X(RB-RT+0.6));
    for(const [b,h] of bridgeGaps){ g.fillStyle='#c8a86a'; g.fillRect(X(b-h-0.05), X(RT-0.6), X((h+0.05)*2), X(RB-RT+1.2)); }
    if(imgFor('arboleda1')){
      const rows = [RT+0.55, RT+1.35, RB+0.45, RB+1.15];
      rows.forEach((yb,row)=>{ for(let x=0.55 + (row%2)*0.6; x<W; x+=1.2){ if(inGap(x, bridgeGaps, 0.6)) continue; if(Math.hypot(x-ISLE.x, yb-0.6-ISLE.y) < ISLE.r+0.8) continue; drawProp(g, X, (row+Math.floor(x))%2 ? 'arboleda1' : 'arboleda2', x, yb, 1.75 + R()*0.25); } });
      return 'clearing';
    }
    for(let row=0; row<4; row++){ const y = RT - 0.15 + row*0.75; for(let x=0.3; x<W; x+=0.62){ const xx = x + (row%2)*0.31 + (R()-0.5)*0.12; if(inGap(xx, bridgeGaps, 0.35)) continue; if(Math.hypot(xx-ISLE.x, y-ISLE.y) < ISLE.r+0.4) continue; tree(xx, y, 0.85 + R()*0.25, row%2===1); } }
    return 'clearing';
  }
  if(t==='canyon'){
    const ry1 = X(RT-0.25), ry2 = X(RB+0.25);
    const cg = g.createLinearGradient(0, ry1, 0, ry2); cg.addColorStop(0, '#8a7058'); cg.addColorStop(0.5, '#5a4636'); cg.addColorStop(1, '#8a7058');
    g.fillStyle = cg; g.fillRect(0, ry1, X(W), ry2-ry1);
    for(const [b,h] of bridgeGaps){ g.fillStyle='#b8a07a'; g.fillRect(X(b-h), X(RT-0.5), X(h*2), X(RB-RT+1)); for(let i=0;i<10;i++){ g.fillStyle='rgba(90,70,50,0.4)'; g.beginPath(); g.arc(X(b+(R()-0.5)*h*1.6), X(RT+R()*(RB-RT)), X(0.05), 0, TAU); g.fill(); } }
    if(imgFor('pared_canon')){
      for(let row=0; row<2; row++){ const yb = RT + 1.1 + row*1.0; for(let x=0.45 + (row%2)*0.45; x<W; x+=0.9){ if(inGap(x, bridgeGaps, 0.45)) continue; if(Math.hypot(x-ISLE.x, yb-0.5-ISLE.y) < ISLE.r+0.5) continue; drawProp(g, X, 'pared_canon', x, yb, 1.05); } }
      return 'gravel';
    }
    for(let row=0; row<3; row++){ const y = RT + 0.15 + row*0.85; for(let x=0.35; x<W; x+=0.75){ const xx = x + (row%2)*0.37; if(inGap(xx, bridgeGaps, 0.4)) continue; if(Math.hypot(xx-ISLE.x, y-ISLE.y) < ISLE.r+0.5) continue; stone(xx, y, 1.0 + R()*0.35, '#c8b49a', '#6a5644'); } }
    return 'gravel';
  }
  if(t==='swamp'){
    g.fillStyle = 'rgba(70,60,30,0.45)'; g.beginPath(); g.moveTo(0, X(MUD.y0)); for(let x=0;x<=W;x+=0.5) g.lineTo(X(x), X(MUD.y0 + Math.sin(x*1.3)*0.25)); for(let x=W;x>=0;x-=0.5) g.lineTo(X(x), X(MUD.y1 + Math.sin(x*1.1)*0.25)); g.closePath(); g.fill();
    for(let i=0;i<26;i++){ const x = R()*W, y = MUD.y0 + 0.6 + R()*(MUD.y1-MUD.y0-1.2); g.fillStyle = 'rgba(60,80,50,0.55)'; g.beginPath(); g.ellipse(X(x), X(y), X(0.4+R()*0.6), X(0.2+R()*0.25), 0, 0, TAU); g.fill(); }
    for(let i=0;i<30;i++){ const x = R()*W, y = MUD.y0 + R()*(MUD.y1-MUD.y0); if(TOWER_X.some(b=>Math.abs(x-b)<1.1)) continue; g.strokeStyle = '#4a6a2a'; g.lineWidth = Math.max(1, X(0.05)); for(let k=0;k<3;k++){ g.beginPath(); g.moveTo(X(x+k*0.08), X(y)); g.lineTo(X(x+k*0.08+(R()-0.5)*0.2), X(y-0.4-R()*0.3)); g.stroke(); } }
    if(imgFor('charco_barro')) for(let i=0;i<14;i++){ const x = 0.8 + R()*16.4, y = MUD.y0 + 1 + R()*(MUD.y1-MUD.y0-1.5); if(TOWER_X.some(b=>Math.abs(x-b)<1.3) || Math.hypot(x-ISLE.x,y-ISLE.y)<2) continue; drawProp(g, X, i%2 ? 'charco_barro' : 'nenufares', x, y, 1.1 + R()*0.4); }
    for(let i=0;i<10;i++){ const x = R()*W, y = MUD.y0 + R()*(MUD.y1-MUD.y0); g.fillStyle = '#4a8a3a'; g.beginPath(); g.ellipse(X(x), X(y), X(0.22), X(0.12), 0, 0.3, TAU-0.3); g.fill(); }
    return 'mud';
  }
  // agua, hielo o lava con orillas
  const strip = (key, kind) => { const T = imgFor(key); if(!T) return false; const hT = 3.1, wT = hT*T.naturalWidth/T.naturalHeight; for(let x=-0.2; x<W; x+=wT-0.05) g.drawImage(T, X(x), X(RT-0.55), X(wT), X(hT)); return kind; };
  if(t==='ice' && !broken && imgFor('tex_river_ice')){ strip('tex_river_ice'); if(imgFor('wx_ice')) for(let i=0;i<6;i++){ const x = 0.8 + i*2.9 + R()*0.8, yb = RT + 1.3 + R()*0.5; if(BRIDGES.some(bx=>Math.abs(x-bx)<1.4)) continue; drawProp(g, X, 'wx_ice', x, yb, 1.1); } return 'wood'; }
  if(t==='volcano' && imgFor('tex_river_lava')){ strip('tex_river_lava'); return 'stone'; }
  const RK = (BIOMES[bio]||BIOMES.grass).river;
  if(RK!=='tex_river' && (t==='river' || t==='winding' || (t==='ice' && broken)) && imgFor(RK)){ strip(RK); return 'wood'; }
  const TEXR = imgFor('tex_river');
  if(TEXR && (t==='river' || t==='winding' || (t==='ice' && broken))){
    const hT = 4, wT = hT*TEXR.naturalWidth/TEXR.naturalHeight;
    for(let x=-0.2; x<W; x+=wT-0.05) g.drawImage(TEXR, X(x), X(RT-1), X(wT), X(hT));
    if(t==='ice'){ for(let i=0;i<16;i++){ const x = R()*W, y = RT + 0.2 + R()*(RB-RT-0.4); g.fillStyle='rgba(230,246,252,0.85)'; g.beginPath(); g.moveTo(X(x),X(y)); g.lineTo(X(x+0.4),X(y-0.15)); g.lineTo(X(x+0.55),X(y+0.2)); g.lineTo(X(x+0.1),X(y+0.25)); g.closePath(); g.fill(); } }
    return 'wood';
  }
  const ry1 = X(RT), ry2 = X(RB);
  g.fillStyle = t==='volcano' ? '#2a1e1a' : '#6b4a2a'; g.fillRect(0, ry1-X(0.22), X(W), ry2-ry1+X(0.44));
  for(let x=0;x<W;x+=0.5){ for(const y of [RT-0.12, RB+0.12]){ g.fillStyle = t==='volcano' ? ['#3a302c','#4a3e38','#2a2220'][Math.floor(R()*3)] : t==='ice' ? ['#c8d4dc','#e8eef2','#a8b4bc'][Math.floor(R()*3)] : ['#8a8276','#a39a8e','#6e665c'][Math.floor(R()*3)]; g.beginPath(); g.ellipse(X(x+R()*0.4),X(y+(R()-0.5)*0.1),X(0.3),X(0.17),0,0,TAU); g.fill(); g.strokeStyle='#00000040'; g.lineWidth=1; g.stroke(); } }
  let wg = g.createLinearGradient(0,ry1,0,ry2);
  if(t==='volcano'){ wg.addColorStop(0,'#e04a10'); wg.addColorStop(0.5,'#ffa020'); wg.addColorStop(1,'#d03a08'); }
  else if(t==='ice' && !broken){ wg.addColorStop(0,'#bfe4f2'); wg.addColorStop(0.5,'#e6f6fc'); wg.addColorStop(1,'#b0d8ea'); }
  else { wg.addColorStop(0,'#2f7fd0'); wg.addColorStop(0.5,'#3d9cf0'); wg.addColorStop(1,'#2a6fc0'); }
  g.fillStyle = wg; g.fillRect(0, ry1, X(W), ry2-ry1);
  if(t==='ice' && !broken && imgFor('wx_ice')){ for(let i=0;i<7;i++){ const x = 0.8 + i*2.6 + R()*0.8, yb = RT + 1.3 + R()*0.6; if(BRIDGES.some(bx=>Math.abs(x-bx)<1.3)) continue; drawProp(g, X, 'wx_ice', x, yb, 1.3); } }
  if(t==='ice' && !broken){ g.strokeStyle='rgba(120,170,200,0.6)'; g.lineWidth = Math.max(1, X(0.04)); for(let i=0;i<22;i++){ const x = R()*W, y = RT + R()*(RB-RT); g.beginPath(); g.moveTo(X(x), X(y)); g.lineTo(X(x+0.4+R()*0.5), X(y+(R()-0.5)*0.5)); g.lineTo(X(x+0.7+R()*0.6), X(y+(R()-0.5)*0.6)); g.stroke(); } }
  if(t==='ice' && broken){ for(let i=0;i<16;i++){ const x = R()*W, y = RT + 0.2 + R()*(RB-RT-0.4); g.fillStyle='rgba(230,246,252,0.85)'; g.beginPath(); g.moveTo(X(x),X(y)); g.lineTo(X(x+0.4),X(y-0.15)); g.lineTo(X(x+0.55),X(y+0.2)); g.lineTo(X(x+0.1),X(y+0.25)); g.closePath(); g.fill(); } }
  if(t==='volcano'){ for(let i=0;i<30;i++){ g.fillStyle='rgba(60,20,10,0.45)'; g.beginPath(); g.ellipse(X(R()*W), X(RT+R()*(RB-RT)), X(0.3+R()*0.5), X(0.1+R()*0.15), 0, 0, TAU); g.fill(); } }
  g.fillStyle='rgba(255,255,255,0.22)'; g.fillRect(0,ry1,X(W),X(0.12)); g.fillStyle='rgba(0,0,40,0.2)'; g.fillRect(0,ry2-X(0.15),X(W),X(0.15));
  return t==='volcano' ? 'stone' : 'wood';
}
function drawWindingRows(g, X, R){
  if(imgFor('fila_piedras')){ for(const r of WIND_ROWS){ for(let x=0.6; x<W; x+=1.05){ if(WIND_GAPS.some(gx=>Math.abs(x-gx) < WIND_HALF+0.35)) continue; drawProp(g, X, 'fila_piedras', x, r.y1+0.3, 1.35); } } return; }
  for(const r of WIND_ROWS){ const y = (r.y0+r.y1)/2;
    for(let x=0.35; x<W; x+=0.62){ if(WIND_GAPS.some(gx=>Math.abs(x-gx) < WIND_HALF+0.2)) continue;
      const s = 0.9 + R()*0.3; g.fillStyle='rgba(0,0,0,0.22)'; g.beginPath(); g.ellipse(X(x), X(y+0.25*s), X(0.45*s), X(0.18*s), 0, 0, TAU); g.fill();
      const gr = g.createLinearGradient(X(x-0.4*s), X(y-0.5*s), X(x+0.4*s), X(y+0.2*s)); gr.addColorStop(0,'#dcd4c8'); gr.addColorStop(1,'#7a7268'); g.fillStyle = gr;
      g.beginPath(); g.moveTo(X(x-0.45*s), X(y+0.2*s)); g.lineTo(X(x-0.32*s), X(y-0.35*s)); g.lineTo(X(x+0.08*s), X(y-0.5*s)); g.lineTo(X(x+0.45*s), X(y-0.12*s)); g.lineTo(X(x+0.4*s), X(y+0.22*s)); g.closePath(); g.fill(); g.strokeStyle='#3a342e'; g.lineWidth = Math.max(1, X(0.05)); g.stroke(); } }
}

// ================= MOTOR DE BATALLA =================
let B = null;               // estado de la batalla actual
const BATTLE_TIME = 180, DOUBLE_AT = 60, OT_TIME = 45;
const lvlMul = lvl => 1 + 0.12*(lvl-1);

function hasRelic(id){ return RUN && RUN.relics.includes(id); }

// ---------- creación ----------
function startBattle(enc, onEnd){
  const pm = {
    melee: hasRelic('hammer')?1.2:1, rangeAdd: hasRelic('feather')?1:0, rangedDmg: hasRelic('feather')?1.1:1,
    speed: hasRelic('boots')?1.15:1, hp: hasRelic('armor')?1.15:1, spell: hasRelic('ember')?1.4:1,
    towerDmg: hasRelic('ballista')?1.35:1, princessHp: hasRelic('wall')?1.3:1, regen: hasRelic('swift')?1.12:1,
  };
  const em = {melee:1, rangeAdd:0, rangedDmg:1, speed:1, hp:enc.mult, dmg:enc.mult, spell:enc.mult, towerDmg:enc.towerDmg||1, princessHp:enc.towerMul, regen:enc.regen};
  pm.dmg = 1;
  const HERO = RUN && RUN.hero && HEROES[RUN.hero];
  if(HERO){ const id = RUN.hero;
    if(id==='smith') pm.princessHp *= 1.2; if(id==='paladin') pm.hp *= 1.1; if(id==='drummer') pm.regen *= 1.08; if(id==='huntress') pm.speed *= 1.1;
    if(id==='moonarcher'){ pm.rangedDmg *= 1.1; pm.rangeAdd += 0.5; } if(id==='druid') pm.savia = 0.008; if(id==='necro') pm.bones = 0.25; if(id==='banshee') em.dmg *= 0.92; }
  const startElx = hasRelic('chalice') ? 8 : 5 + (META.upg.elx||0);
  const seed = enc.seed!=null ? enc.seed : (Math.random()*2**31)>>>0;
  const brng = mulberry32(seed);
  B = {
    enc, onEnd, time:BATTLE_TIME, overtime:false, over:false, t:0, ents:[], projs:[], parts:[], fx:[], shake:0, bossCd:18,
    p:{elixir:Math.min(10,startElx), hand:[], queue:[], crowns:0, mods:pm, free:hasRelic('first'), fury:0, heroCard: HERO && enc.mode!=='treasure' ? {key:HERO.card, lvl:1+2*(heroLvl(RUN.hero)-1)} : null},
    e:{elixir:5, hand:[], queue:[], crowns:0, mods:em, think:2.5, fury:0},
    seed, rng:brng, tick:0, acc:0, log:[], weather:enc.weather||'clear', firstLoss:null, stats:{deployed:0, kills:0}, banners:[], doubleShown:false, anvil:{ctrl:null, t:0, lastBanner:-9, check:0}, smokeT:0,
  };
  setupTerrain(enc);
  const pd = shuffleR(RUN.deck.map(c=>({...c})), brng);
  B.p.hand = pd.slice(0,4); B.p.queue = pd.slice(4);
  const ed = shuffleR(enc.deck.map(c=>({...c})), brng);
  B.e.hand = ed.slice(0,4); B.e.queue = ed.slice(4);
  // torres
  const ph = 1000*pm.princessHp;
  if(enc.mode==='treasure'){
    B.time = 60; B.gold = {p:0, e:0}; B.chestT = 1.0; B.bigT = 12; B.p.elixir = 7; B.e.elixir = 7;
  } else {
  for(const x of TOWER_X) addTower('p',x,frontY('p',x),false,ph,ph);
  addTower('p',9,KING_Y.p,true,RUN.hp,RUN.maxHp);
  const eh = 1000*enc.towerMul, ek = 2400*enc.towerMul;
  for(const x of TOWER_X) addTower('e',x,frontY('e',x),false,eh,eh);
  addTower('e',9,KING_Y.e,true,ek,ek);
  }
  $('pCrowns').innerHTML = $('eCrowns').innerHTML = '<i></i><i></i><i></i>';
  sel = -1; ptr = null;
  showScreen('battle');
  renderHand();
  resizeBattle();
  requestAnimationFrame(()=>{ if(curScreen==='battle') resizeBattle(); });
  setCrowns();
  const WTXT = {rain:['🌧️ Lluvia','Tropas más lentas · fuego −30% · rayos +30%'], fog:['🌫️ Niebla','Solo ves al enemigo cerca de tus tropas'], snow:['❄️ Nevada','Tropas más lentas · la escarcha y el hielo congelan un 40% más de tiempo']};
  banner(enc.name, enc.subtitle + (B.terrain!=='river' ? ' · '+TERRAINS[B.terrain].ic+' '+TERRAINS[B.terrain].name : '') + (WTXT[B.weather] ? ' · '+WTXT[B.weather][0] : ''), 1.8);
  const TT = B.terrain!=='river' ? TERRAINS[B.terrain] : null;
  const tips = [WTXT[B.weather] ? WTXT[B.weather][0]+': '+WTXT[B.weather][1] : null, TT ? TT.ic+' '+TT.name+': '+TT.tip : null].filter(Boolean);
  tips.forEach((tx,i)=>{ const wb = B; setTimeout(()=>{ if(B===wb && !B.over) toast(tx, 3200); }, 1900 + i*3400); });
  rainDrops = null;
  $('hint').style.display = META.tutDone ? 'none' : 'block';
  lastT = performance.now();
}
function addTower(side,x,y,king,hp,maxHp){
  const m = B[side].mods;
  const fac = side==='p' ? (RUN && RUN.faction || 'human') : (B.enc.faction || 'orc');
  B.ents.push({type:'tower', side, x, y, king, r:king?1.65:1.2, hp, maxHp, dmg:(king?70:55)*m.towerDmg, hs:king?1.0:0.8,
    range:king?7:7, cd:0, active:!king, lane:laneOf(x), fac, target:null, flash:0, stun:0, recoil:0});
}

// ---------- utilidades ----------
function towersOf(side){ return B.ents.filter(e=>e.type==='tower'&&e.side===side&&e.hp>0); }
function princessAlive(side,lane){ return B.ents.some(t=>t.type==='tower'&&!t.king&&t.side===side&&t.lane===lane&&t.hp>0); }
function validDrop(side,key,x,y){
  if(x<0.5||x>W-0.5||y<0.5||y>H-0.5) return false;
  if(CARDS[key].spell) return true;
  if(!terrainDropOk(x, y)) return false;
  if(B.enc.mode==='treasure') return side==='p' ? y>=RB+0.5 : y<=RT-0.5;
  const lane = laneOf(x);
  if(side==='p'){ if(y>=RB+0.5) return true; return !princessAlive('e',lane) && y>=10.5 && y<RT-0.2; }
  if(y<=RT-0.5) return true; return !princessAlive('p',lane) && y<=21.5 && y>RB+0.2;
}
function handCard(i){ return i===4 ? B.p.heroCard : B.p.hand[i]; }
function cardCost(side, card){ return (side==='p' && B.p.free) ? 0 : CARDS[card.key].cost; }

// ---------- jugar cartas ----------
function playCard(side, idx, x, y){
  const S = B[side], card = idx===4 ? S.heroCard : S.hand[idx]; if(!card) return false; const c = CARDS[card.key], cost = cardCost(side, card);
  if(S.elixir < cost) return false;
  S.elixir -= cost;
  if(side==='p'){ B.p.free = false; B.stats.deployed++; if(!META.tutDone){ META.tutDone = true; saveMeta(); $('hint').style.display='none'; } }
  if(idx===4){ S.heroCard = null; S.heroUsed = true; } else { S.queue.push(card); S.hand[idx] = S.queue.shift(); }
  B.log.push({tick:B.tick, side, key:card.key, lvl:card.lvl, x:+x.toFixed(2), y:+y.toFixed(2)});
  spawnCard(side, card, x, y);
  if(side==='p') renderHand();
  return true;
}
function spawnCard(side, card, x, y){
  const c = CARDS[card.key], m = B[side].mods, L = lvlMul(card.lvl);
  if(c.spell && c.allyBuff && c.allyBuff.heal){
    SFX.heal(); fxImg('fx_cura', x, y, c.radius*0.8, 0.7); const amt = c.allyBuff.heal*L*(m.spell||1);
    for(const u of B.ents){ if(u.type!=='unit'||u.side!==side||u.hp<=0) continue; if(Math.hypot(u.x-x,u.y-y)<=c.radius){ u.hp = Math.min(u.maxHp, u.hp+amt); for(let i=0;i<3;i++) part('heal', u.x+(Math.random()-0.5)*0.6, u.y-0.5, {life:0.9}); } }
    B.fx.push({k:'ring', x, y, r0:0.4, r1:c.radius, t:0, life:0.6, col:'#e8f0ff'}); B.fx.push({k:'flash', x, y, r:c.radius, t:0, life:0.5, col:'#dfe8ff'});
    for(let i=0;i<24;i++) part('spark', x+(Math.random()-0.5)*c.radius*1.6, y+(Math.random()-0.5)*c.radius, {sp:0.6, col:'#ffffff', life:1.0, size:0.09});
    return;
  }
  if(c.spell && c.allyBuff){
    SFX.crown();
    for(const u of B.ents){ if(u.type!=='unit'||u.side!==side||u.hp<=0) continue; if(Math.hypot(u.x-x,u.y-y)<=c.radius){ u.haste = Math.max(u.haste||0, c.allyBuff.haste*L); u.dmgBuff = Math.max(u.dmgBuff||0, c.allyBuff.haste*L); u.dmgBuffMul = Math.max(u.dmgBuffMul||1, c.allyBuff.dmg); part('text', u.x, u.y-1, {txt:'¡GRR!', col:'#ff8a3a', life:0.7}); } }
    B.fx.push({k:'ring', x, y, r0:0.4, r1:c.radius, t:0, life:0.55, col:'#ff6a2a'}); B.fx.push({k:'flash', x, y, r:c.radius, t:0, life:0.4, col:'#ff8a3a'});
    return;
  }
  if(c.spell){
    let dmg = c.dmg * L * m.spell;
    if(B.weather==='rain'){ if(card.key==='zap'||card.key==='storm') dmg *= 1.3; else dmg *= 0.7; }
    if(c.instant){ castSpell(side, card, x, y, dmg); return; }
    if(card.key==='starfall' || card.key==='starstorm'){ B.fx.push({k:'stars', x, y, t:0, life:0.75, r:c.radius, seed:Math.random()}); setTimeoutB(0.6, ()=>castSpell(side, card, x, y, dmg)); return; }
    if(card.key==='storm'){ B.fx.push({k:'cloud', x, y, t:0, life:0.6, r:c.radius}); setTimeoutB(0.55, ()=>castSpell(side, card, x, y, dmg)); return; }
    if(card.key==='plague' || card.key==='soulstorm'){ fxImg(card.key==='plague'?'plague':'fx_soulorb', x, y-0.6, c.radius*0.6, 0.6); B.fx.push({k:'flash', x, y, r:c.radius*0.6, t:0, life:0.6, col:'#7aff8a'}); setTimeoutB(0.5, ()=>castSpell(side, card, x, y, dmg)); return; }
    const k = B.ents.find(t=>t.type==='tower'&&t.king&&t.side===side) || {x:9, y:side==='p'?29:3};
    B.projs.push({kind:card.key==='bombbarr'?'barrel':'fireball', x:k.x, y:k.y-1, sx:k.x, sy:k.y-1, tx:x, ty:y, target:null, side, speed:12, t:0, card, dmg});
    SFX.magic();
    return;
  }
  SFX.deploy();
  if(c.hero){ const u = spawnUnit(side, card.key, card.lvl, x, y, 0.9); heroArrive(side, u, c.hero, L); B.fx.push({k:'ring', x, y, r0:0.3, r1:2.4, t:0, life:0.6, col:'#ffe066'}); return; }
  for(let i=0;i<c.count;i++){
    const a = i/c.count*TAU + 0.4, off = c.count>1 ? 0.35 + c.count*0.07 : 0;
    spawnUnit(side, card.key, card.lvl, x+Math.cos(a)*off, y+Math.sin(a)*off*0.8, 0.9);
  }
  B.fx.push({k:'ring', x, y, r0:0.3, r1:1.6, t:0, life:0.45, col:TEAM[side].light});
}
function spawnUnit(side, key, lvl, x, y, deploy=0.9){
  const c = CARDS[key], m = B[side].mods, L = lvlMul(lvl);
  const ranged = c.range > 1.5;
  const hp = c.hp * L * m.hp;
  const dmg = c.dmg * L * (m.dmg||1) * (ranged ? m.rangedDmg : m.melee);
  const u = {type:'unit', key, lvl, c, side, x:clamp(x,0.4,W-0.4), y:clamp(y,0.4,H-0.4), r:c.r, hp, maxHp:hp, dmg,
    range: c.range + (ranged ? m.rangeAdd : 0), speed: c.speed * m.speed * (B.weather==='rain'||B.weather==='snow' ? 0.85 : 1), cd:0.4, deploy, deployMax:deploy, target:null, retarget:0,
    locked:false, flash:0, stun:0, face: side==='p'?1:-1, walk:Math.random()*10, atk:0, healCd:0.5, stompCd:1, spawnCd:(c.spawn?c.spawn.every*0.6:0),
    moved:0, charged:!!c.charge, sprite: spriteKey(key), hidden:!!c.stealth, root:0};
  B.ents.push(u);
  return u;
}
function fxImg(key, x, y, r, life=0.5, grow=true){ if(imgFor(key)) B.fx.push({k:'img', key, x, y, r, t:0, life, still:!grow}); }
function castSpell(side, card, x, y, dmg){
  const c = CARDS[card.key];
  const tm = c.towerMul;
  for(const e of B.ents){
    if(e.side===side || e.hp<=0) continue;
    if(dist(e,{x,y}) - e.r <= c.radius){
      hit(e, (e.type==='tower'||e.type==='rock') ? dmg*tm : dmg, side, true);
      if(c.root && e.type==='unit' && !isAir(e)){ e.root = Math.max(e.root||0, c.root); }
      if(c.stun){ e.stun = Math.max(e.stun||0, c.stun); }
      if(c.slowDur && e.type==='unit'){ e.slow = Math.max(e.slow||0, c.slowDur*(B.weather==='snow'?1.4:1)); }
      if(c.weaken && e.type==='unit'){ e.weak = Math.max(e.weak||0, c.weaken); }
      if(e.type==='unit' && !c.root){ const a=Math.atan2(e.y-y,e.x-x); e.x+=Math.cos(a)*0.25; e.y+=Math.sin(a)*0.25; }
    }
  }
  if(card.key==='curse' || card.key==='soulstorm' || card.key==='plague' || card.key==='gravehands'){
    SFX.magic(); if(card.key!=='gravehands') SFX.boom();
    const fk = card.key==='curse' ? 'fx_maldicion' : card.key==='plague' ? 'fx_veneno' : card.key==='gravehands' ? 'gravehands' : 'soulstorm', col = card.key==='curse' ? '#c070ff' : '#7aff8a';
    fxImg(fk, x, y, c.radius*0.9, 0.8); B.fx.push({k:'flash', x, y, r:c.radius, t:0, life:0.5, col}); B.fx.push({k:'ring', x, y, r0:0.3, r1:c.radius, t:0, life:0.5, col});
    for(let i=0;i<24;i++) part('spark', x+(Math.random()-0.5)*c.radius*1.6, y+(Math.random()-0.5)*c.radius, {sp:1.2, col:i%2?col:'#e8ffe0', life:0.9, size:0.1});
    if(card.key!=='curse' && card.key!=='gravehands') B.shake = Math.max(B.shake, 0.4);
  } else if(card.key==='roots'){
    SFX.magic(); fxImg('fx_raices', x, y, c.radius*0.9, 0.8); B.fx.push({k:'flash', x, y, r:c.radius, t:0, life:0.5, col:'#5ad06a'}); B.fx.push({k:'ring', x, y, r0:0.3, r1:c.radius, t:0, life:0.5, col:'#a8ff9a'});
    for(let i=0;i<22;i++) part('spark', x+(Math.random()-0.5)*c.radius*1.6, y+(Math.random()-0.5)*c.radius, {sp:0.8, col:i%2?'#5ad06a':'#a8ff9a', life:0.9, size:0.1});
  } else if(card.key==='starfall' || card.key==='starstorm'){
    SFX.boom(); SFX.magic();
    B.fx.push({k:'flash', x, y, r:c.radius, t:0, life:0.45, col:'#fff2b0'}); B.fx.push({k:'ring', x, y, r0:0.5, r1:c.radius*1.1, t:0, life:0.5, col:'#ffffff'});
    for(let i=0;i<30;i++) part('spark', x+(Math.random()-0.5)*c.radius*1.4, y+(Math.random()-0.5)*c.radius, {sp:4, col:i%3?'#fff6c8':'#d8c8ff', life:0.7, size:0.12});
    if(c.root) for(let i=0;i<14;i++) part('spark', x+(Math.random()-0.5)*c.radius*1.6, y+(Math.random()-0.5)*c.radius, {sp:0.6, col:'#5ad06a', life:1.0, size:0.1});
    B.shake = Math.max(B.shake, 0.4);
  } else if(c.slowDur){
    SFX.magic(); fxImg('fx_hielo', x, y, c.radius*0.85, 0.6); fxImg('wx_frostring', x, y+0.2, c.radius*1.0, 0.9, false); B.fx.push({k:'flash', x, y, r:c.radius, t:0, life:0.5, col:'#bfe8ff'}); B.fx.push({k:'ring', x, y, r0:0.4, r1:c.radius, t:0, life:0.5, col:'#ffffff'});
    for(let i=0;i<26;i++) part('spark', x+(Math.random()-0.5)*c.radius*1.6, y+(Math.random()-0.5)*c.radius, {sp:1, col:'#e8f8ff', life:0.9, size:0.1});
  } else if(card.key==='zap' || card.key==='storm'){
    SFX.zap();
    const n = card.key==='storm' ? 4 : 1;
    for(let i=0;i<n;i++){ const ox = n>1 ? (Math.random()-0.5)*c.radius*1.2 : 0, oy = n>1 ? (Math.random()-0.5)*c.radius*1.2 : 0; if(imgFor('fx_rayo')) B.fx.push({k:'img', key:'fx_rayo', x:x+ox, y:y+oy-0.8, r:1.3, t:0, life:0.35, still:true}); else B.fx.push({k:'bolt', x:x+ox, y:y+oy, t:0, life:0.3, seed:Math.random()}); }
    B.fx.push({k:'flash', x, y, r:c.radius, t:0, life:0.3, col:'#bfe8ff'});
    B.fx.push({k:'ring', x, y, r0:0.5, r1:c.radius, t:0, life:0.35, col:'#e6f6ff'});
    for(let i=0;i<20;i++) part('spark', x, y, {sp:6, col:'#c8f0ff', life:0.4});
    B.shake = Math.max(B.shake, card.key==='storm'?0.5:0.2);
  } else {
    SFX.boom(); fxImg('fx_explosion2', x, y, c.radius*0.9, 0.5);
    B.fx.push({k:'flash', x, y, r:c.radius, t:0, life:0.35, col:'#ffb030'});
    B.fx.push({k:'ring', x, y, r0:0.5, r1:c.radius*1.1, t:0, life:0.45, col:'#ffdd88'});
    for(let i=0;i<28;i++) part('ember', x, y, {sp:7, life:0.7});
    for(let i=0;i<10;i++) part('smoke', x, y, {sp:2, life:1.0, size:0.5});
    B.shake = Math.max(B.shake, 0.45);
  }
  if(c.spawnAfter){ for(let i=0;i<c.spawnAfter.n;i++){ const a=i/c.spawnAfter.n*TAU; spawnUnit(side, c.spawnAfter.key, card.lvl, x+Math.cos(a)*0.6, y+Math.sin(a)*0.6, 0.3); } }
}
function heroArrive(side, u, id, L){
  const H = HEROES[id], foes = B.ents.filter(e=>e.type==='unit'&&e.side!==side&&e.hp>0), mine = B.ents.filter(e=>e.type==='unit'&&e.side===side&&e.hp>0&&e!==u);
  fxImg(H.hab, u.x, u.y-1.6, 1.0, 1.2, false); part('text', u.x, u.y-2.4, {txt:H.name, col:'#ffe066', life:1.4}); SFX.crown();
  if(id==='smith'){ for(const t of B.ents) if(t.type==='tower'&&t.side===side&&t.hp>0){ t.hp = Math.min(t.maxHp, t.hp+350*L); part('heal', t.x, t.y-1.5, {life:1}); fxImg('hab_reparar', t.x, t.y-2, 0.6, 0.8, false); } }
  if(id==='paladin'){ for(const a of mine) if(dist(a,u)<=4){ a.shield = 400*L; part('text', a.x, a.y-1, {txt:'🛡', col:'#ffe066', life:0.8}); } B.fx.push({k:'ring', x:u.x, y:u.y, r0:0.4, r1:4, t:0, life:0.6, col:'#ffe066'}); }
  if(id==='drummer'){ for(const a of mine){ a.haste = Math.max(a.haste||0, 6); a.dmgBuff = Math.max(a.dmgBuff||0, 6); a.dmgBuffMul = Math.max(a.dmgBuffMul||1, 1.3); part('text', a.x, a.y-1, {txt:'¡GRR!', col:'#ff8a3a', life:0.7}); } B.shake = Math.max(B.shake, 0.3); }
  if(id==='huntress'){ for(let i=0;i<3;i++){ const a = i/3*TAU; spawnUnit(side, 'wolves', u.lvl, u.x+Math.cos(a)*0.9, u.y+Math.sin(a)*0.7, 0.5); } }
  if(id==='moonarcher' && foes.length){ let best = foes[0], bs = 0; for(const f of foes){ const sc = foes.filter(o=>dist(o,f)<2.8).reduce((a,o)=>a+o.hp,0); if(sc>bs){ bs=sc; best=f; } }
    const bx = best.x, by = best.y; B.fx.push({k:'stars', x:bx, y:by, t:0, life:0.6, r:2.8, seed:Math.random()}); fxImg('hab_flechas', bx, by-0.8, 1.4, 0.7);
    setTimeoutB(0.5, ()=>{ for(const e of B.ents){ if(e.side===side||e.hp<=0||e.type!=='unit') continue; if(dist(e,{x:bx,y:by})-e.r<=2.8) hit(e, 320*L, side, true); } SFX.arrow(); B.fx.push({k:'flash', x:bx, y:by, r:2.8, t:0, life:0.4, col:'#e8f0ff'}); }); }
  if(id==='druid'){ for(const f of foes){ if(isAir(f)) continue; if(side==='p' ? f.y>RT-1 : f.y<RB+1){ f.root = Math.max(f.root||0, 3); fxImg('fx_raices', f.x, f.y, 0.8, 0.8); } } }
  if(id==='necro'){ for(let i=0;i<5;i++){ const a = i/5*TAU; spawnUnit(side, 'vskel', u.lvl, u.x+Math.cos(a)*1.0, u.y+Math.sin(a)*0.8, 0.4); } fxImg('gravehands', u.x, u.y, 1.6, 0.8); }
  if(id==='banshee'){ for(const f of foes) if(dist(f,u)<=4){ f.stun = Math.max(f.stun||0, 1.5); f.weak = Math.max(f.weak||0, 4); } B.fx.push({k:'ring', x:u.x, y:u.y-1, r0:0.4, r1:4, t:0, life:0.6, col:'#9affd0'}); B.fx.push({k:'flash', x:u.x, y:u.y, r:4, t:0, life:0.5, col:'#9affd0'}); SFX.zap(); }
}
const SAVIA = 0.013; // elfos: % de vida por segundo en su mitad del campo
function transformUnit(u){
  const nk = u.c.transform.key, nc = CARDS[nk], L = lvlMul(u.lvl), m = B[u.side].mods, frac = 0.75;
  u.key = nk; u.c = nc; u.sprite = spriteKey(nk); u.r = nc.r; u.range = nc.range; u.speed = nc.speed*m.speed*(B.weather==='rain'||B.weather==='snow'?0.85:1);
  u.maxHp = nc.hp*L*m.hp; u.hp = u.maxHp*frac; u.dmg = nc.dmg*L*(m.dmg||1)*m.melee; u.cd = 0.5; u.target = null; u.locked = false;
  B.fx.push({k:'ring', x:u.x, y:u.y, r0:0.3, r1:1.6, t:0, life:0.5, col:'#7affa8'}); B.fx.push({k:'flash', x:u.x, y:u.y, r:1.4, t:0, life:0.4, col:'#5ad06a'});
  for(let i=0;i<14;i++) part('spark', u.x, u.y-0.4, {sp:3, col:'#a8ff9a', life:0.6}); part('text', u.x, u.y-1.4, {txt:'¡GRRR!', col:'#a8ff9a', life:0.9}); SFX.deploy();
}
const timers = [];
function setTimeoutB(t, fn){ timers.push({t, fn}); }

// ---------- daño ----------
function hit(e, amt, bySide, spell){
  if(e.hp<=0) return;
  if(!spell && e.c && e.c.dodge && B.rng() < e.c.dodge){ part('text', e.x, e.y-1.0, {txt:'¡Esquiva!', col:'#d8f8ff', life:0.6}); return; }
  if(e.shield>0){ const ab = Math.min(e.shield, amt); e.shield -= ab; amt -= ab; }
  e.hp -= amt; e.flash = 0.09; e.lastHit = bySide;
  if(amt>0 && !(typeof META!=='undefined' && META.noDmgNum)){ e._dacc=(e._dacc||0)+amt; if(spell || (B.t-(e._dt||-9))>=0.35){ const v=Math.round(e._dacc); e._dacc=0; e._dt=B.t; if(v>=1) part('text', e.x+(Math.random()-0.5)*0.5, e.y-(e.type==='tower'?1.8:1.1), {txt:'-'+v, col: bySide==='p' ? '#ffe066' : '#ff8a8a', life:0.7, dmg:1, big: spell||v>=300}); } }
  if(e.type==='tower' && e.king && !e.active){ e.active = true; }
  if(e.type==='tower') e.shakeT = 0.15;
}

// ---------- partículas ----------
function part(kind, x, y, o={}){
  if(B.parts.length > 420) return;
  const a = Math.random()*TAU, sp = (o.sp||2)*(0.3+Math.random()*0.7);
  const p = {kind, x, y, vx:Math.cos(a)*sp, vy:Math.sin(a)*sp*0.7, z:o.z||0, vz:o.vz!=null?o.vz:(kind==='debris'?4+Math.random()*4:0),
    t:0, life:(o.life||0.6)*(0.7+Math.random()*0.6), size:o.size||0.15, col:o.col, txt:o.txt, dmg:o.dmg, big:o.big};
  if(kind==='heal'||kind==='text'){ p.vx=(Math.random()-0.5)*0.4; p.vy=-1.3; }
  if(kind==='smoke'){ p.vy -= 0.6; }
  B.parts.push(p);
}

// ---------- bucle de lógica ----------
function updateBattle(dt){
  if(B.over){ for(const p of B.parts){ p.t+=dt; p.x+=p.vx*dt; p.y+=p.vy*dt; } B.parts=B.parts.filter(p=>p.t<p.life); for(const f of B.fx) f.t+=dt; B.fx=B.fx.filter(f=>f.t<f.life); B.shake=Math.max(0,B.shake-dt*1.6); return; }
  B.t += dt;
  for(let i=timers.length-1;i>=0;i--){ timers[i].t -= dt; if(timers[i].t<=0){ const f=timers[i].fn; timers.splice(i,1); f(); } }
  B.time -= dt;
  const dbl = B.enc.mode==='treasure' ? true : (B.overtime || B.time <= DOUBLE_AT);
  if(dbl && !B.doubleShown){ B.doubleShown = true; if(!B.overtime && B.enc.mode!=='treasure') banner('¡Elixir doble!', '', 1.4); }
  const reg = dt/2.8 * (dbl?2:1);
  updAnvil(dt);
  if(B.enc.mode!=='treasure') updTerrain(dt);
  const ab = s => B.anvil.ctrl===s ? 1 + (s==='p' && hasRelic('anvilR') ? ANVIL_BONUS*2 : ANVIL_BONUS) : 1;
  B.p.elixir = Math.min(10, B.p.elixir + reg*B.p.mods.regen*ab('p'));
  B.e.elixir = Math.min(10, B.e.elixir + reg*B.e.mods.regen*ab('e'));
  aiThink(dt);
  if(B.enc.boss){ B.bossCd -= dt; if(B.bossCd<=0){ B.bossCd = 20; bossPower(); } }
  for(const e of B.ents){ if(e.hp<=0) continue; if(e.flash>0) e.flash -= dt; if(e.shakeT>0) e.shakeT -= dt;
    if(e.stun>0){ e.stun -= dt; continue; }
    if(e.type==='unit') updUnit(e,dt); else if(e.type==='tower') updTower(e,dt); }
  if(B.enc.mode==='treasure') updTreasure(dt);
  separate();
  updProjs(dt);
  B.smokeT -= dt; if(B.smokeT<=0){ B.smokeT = 0.35; for(const t of B.ents) if(t.type==='tower'&&t.king&&t.hp>0){ const p = {kind:'smoke', x:t.x+0.8, y:t.y-3.0, vx:0.15+Math.random()*0.1, vy:-0.7, z:0, vz:0, t:0, life:1.6, size:0.28}; B.parts.push(p); } }
  for(const p of B.parts){ p.t += dt; p.x += p.vx*dt; p.y += p.vy*dt;
    if(p.kind==='debris'){ p.vz -= 18*dt; p.z += p.vz*dt; if(p.z<0){ p.z=0; p.vz*=-0.3; p.vx*=0.6; p.vy*=0.6; } }
    else { p.vx *= (1-2*dt); p.vy *= (1-2*dt); } }
  B.parts = B.parts.filter(p=>p.t<p.life);
  for(const f of B.fx) f.t += dt; B.fx = B.fx.filter(f=>f.t<f.life);
  B.shake = Math.max(0, B.shake - dt*1.6);
  handleDeaths();
  if(B.over) return;
  if(B.enc.mode==='treasure'){ if(B.time<=0) endBattle(B.gold.p >= B.gold.e); return; }
  if(B.overtime && B.p.crowns !== B.e.crowns) return endBattle(B.p.crowns > B.e.crowns);
  if(B.time <= 0){
    if(!B.overtime && B.p.crowns === B.e.crowns){ B.overtime = true; B.time = OT_TIME; banner('¡Prórroga!', 'Muerte súbita', 1.6); }
    else if(B.p.crowns !== B.e.crowns) endBattle(B.p.crowns > B.e.crowns);
    else { const sc = s => towersOf(s).reduce((a,t)=>a+t.hp/t.maxHp,0); endBattle(sc('p') >= sc('e'), true); }
  }
}
function spawnChest(big){
  let x, y, tries = 0;
  do { x = 1.5 + B.rng()*15; y = 9 + B.rng()*14; tries++; } while(tries<30 && ((y>13.8&&y<18.2) || B.ents.some(e=>e.type==='chest'&&Math.hypot(e.x-x,e.y-y)<3)));
  if(big){ x = ISLE.x; y = ISLE.y; }
  const hp = (big?1300:420) * (0.9 + 0.08*(B.enc.row||0));
  B.ents.push({type:'chest', side:'n', x, y, r:big?0.75:0.6, hp, maxHp:hp, value:big?45:15, big, flash:0, born:B.t});
  B.fx.push({k:'ring', x, y, r0:0.2, r1:1.4, t:0, life:0.5, col:'#ffe066'}); for(let i=0;i<10;i++) part('spark', x, y-0.3, {sp:3, col:'#ffe066', life:0.5});
}
function updTreasure(dt){
  B.chestT -= dt; B.bigT -= dt;
  if(B.chestT<=0){ B.chestT = 4.5; if(B.ents.filter(e=>e.type==='chest'&&!e.big).length<4) spawnChest(false); }
  if(B.bigT<=0){ B.bigT = 20; if(!B.ents.some(e=>e.type==='chest'&&e.big)){ spawnChest(true); banner('¡Cofre dorado!', 'En la isla central · 45 de oro', 1.2); } }
}
function updAnvil(dt){
  const A = B.anvil; A.check -= dt; if(A.ctrl) A.t += dt;
  if(A.check>0) return; A.check = 0.25;
  const hp = {p:0, e:0};
  for(const u of B.ents) if(u.type==='unit' && u.hp>0 && u.deploy<=0 && Math.hypot(u.x-ISLE.x, u.y-ISLE.y) < ANVIL_R) hp[u.side] += u.hp;
  const nc = hp.p > hp.e*1.2 && hp.p>0 ? 'p' : hp.e > hp.p*1.2 && hp.e>0 ? 'e' : (hp.p===0 && hp.e===0 ? A.ctrl : null);
  if(nc !== A.ctrl){
    A.ctrl = nc; A.t = 0;
    if(nc){ B.fx.push({k:'ring', x:ISLE.x, y:ISLE.y, r0:0.5, r1:2.6, t:0, life:0.6, col:TEAM[nc].light}); for(let i=0;i<14;i++) part('spark', ISLE.x, ISLE.y-0.3, {sp:4, col:'#ffcf4a', life:0.5}); SFX.forge && SFX.click(); }
    if(nc && B.t - A.lastBanner > 5){ A.lastBanner = B.t; banner(nc==='p' ? '¡Yunque tuyo!' : 'El rival tiene el Yunque', nc==='p' ? '+30% de elixir' : '¡Recupéralo!', 1.2); }
  }
}
function handleDeaths(){
  for(const e of B.ents){
    if(e.hp>0 || e.dead) continue;
    if(e.type==='unit' && !e.reborned && (e.c.reborn || (e.side==='p' && hasRelic('phylactery') && (e.c.rar===2 || e.c.hero)))){ e.reborned = true; e.hp = e.maxHp*(e.c.reborn || 0.4); B.fx.push({k:'ring', x:e.x, y:e.y, r0:0.3, r1:1.8, t:0, life:0.6, col:'#ffd040'}); B.fx.push({k:'flash', x:e.x, y:e.y, r:1.6, t:0, life:0.5, col:'#ffb020'}); for(let i=0;i<20;i++) part('ember', e.x, e.y-0.5, {sp:5, life:0.7}); part('text', e.x, e.y-1.5, {txt:'¡Renace!', col:'#ffd040', life:1}); continue; }
    e.dead = true;
    if(e.type==='rock'){ boulderBroken(e); continue; }
    if(e.type==='chest'){
      const s = e.lastHit==='p'||e.lastHit==='e' ? e.lastHit : null;
      if(s){ B.gold[s] += e.value; part('text', e.x, e.y-0.9, {txt:'+'+e.value+' oro', col: s==='p' ? '#ffe066' : '#ff9a9a', life:1.1}); if(s==='p') SFX.coin(); }
      fxImg('fx_monedas', e.x, e.y-0.3, e.big?1.4:1.0, 0.7);
      for(let i=0;i<18;i++) part('debris', e.x, e.y, {sp:3, col:i%2?'#f2c24b':'#a8743a', life:1.0, size:0.12});
      for(let i=0;i<12;i++) part('spark', e.x, e.y-0.3, {sp:4, col:'#ffe066', life:0.5});
      continue;
    }
    if(e.type==='unit'){
      if(e.side==='e') B.stats.kills++;
      if(!e.c.building) B.fx.push({k:'img', key:'fx_death', x:e.x, y:e.y-0.4, r:0.32+e.r*0.4, t:0, life:0.7, still:true, rise:1}); for(let i=0;i<4;i++) part('smoke', e.x, e.y, {sp:1.5, life:0.6, size:0.3*e.r/0.4});
      for(let i=0;i<5;i++) part('spark', e.x, e.y-0.3, {sp:3, col:'#fff', life:0.3});
      if(!e.c.building && e.key!=='vskel') soulRaise(e);
      if(e.c.deathBomb){ const d=e.c.deathBomb; const dmg = d.dmg*lvlMul(e.lvl)*(B[e.side].mods.dmg||1);
        for(const o of B.ents){ if(o.side===e.side||o.hp<=0) continue; if(dist(o,e)-o.r<=d.radius) hit(o, o.type==='tower'?dmg*0.5:dmg, e.side); }
        fxImg(d.fx||'fx_explosion2', e.x, e.y, d.radius*0.9, 0.5); B.fx.push({k:'flash', x:e.x, y:e.y, r:d.radius, t:0, life:0.4, col:d.fx?'#7aff8a':'#ffb030'}); B.fx.push({k:'ring', x:e.x, y:e.y, r0:0.5, r1:d.radius, t:0, life:0.5, col:'#ffe0a0'});
        for(let i=0;i<30;i++) part('ember', e.x, e.y, {sp:8, life:0.8}); B.shake = Math.max(B.shake, 0.6); SFX.boom(); }
      if(e.side==='p'){
        if(e.key==='vskel' && hasRelic('crystal')){ B.p.elixir = Math.min(10, B.p.elixir+0.25); part('text', e.x, e.y-0.6, {txt:'+¼', col:'#e070ff', life:0.9}); }
        if(e.key!=='vskel' && hasRelic('bones') && B.rng()<0.3) spawnUnit('p','vskel',1,e.x,e.y,0.2);
        else if(e.key!=='vskel' && !e.c.building && B.p.mods.bones && B.rng()<B.p.mods.bones) spawnUnit('p','vskel',1,e.x,e.y,0.2);
      }
    } else {
      const att = other(e.side);
      SFX.tower(); setTimeout(()=>SFX.crown(), 350);
      B.shake = 1.0;
      for(let i=0;i<26;i++) part('debris', e.x+(Math.random()-0.5)*2, e.y, {sp:3, col:['#a39a8e','#cfc7bb','#6e665c'][i%3], life:1.4, size:0.18});
      fxImg('fx_collapse', e.x, e.y-0.6, e.king?2.4:1.9, 1.1, false); for(let i=0;i<10;i++) part('smoke', e.x, e.y-0.5, {sp:2.2, life:1.4, size:0.7});
      B.fx.push({k:'ring', x:e.x, y:e.y, r0:1, r1:3.5, t:0, life:0.6, col:'#fff'}); fxImg('fx_explosion2', e.x, e.y-1, 2.2, 0.6); fxImg('fx_humo', e.x, e.y-1.6, 2.4, 1.2);
      B[att].crowns = e.king ? 3 : Math.min(3, B[att].crowns+1);
      if(e.king) B.slowmo = 1.1; buzz(e.king ? [60,40,120] : 70);
      if(!e.king){
        if(B.firstLoss==null) B.firstLoss = e.side;
        const L = B[e.side];
        if(L.fury<2){ L.fury++; L.elixir = Math.min(10, L.elixir+3); L.mods.regen *= 1.25; B.furyFlash = {side:e.side, t:0};
          if(e.side==='p' && hasRelic('drum')){ for(const a of B.ents) if(a.type==='unit'&&a.side==='p'&&a.hp>0){ a.dmgBuff = Math.max(a.dmgBuff||0, 8); a.dmgBuffMul = Math.max(a.dmgBuffMul||1, 1.25); a.haste = Math.max(a.haste||0, 8); } }
          { const fb = B; setTimeout(()=>{ if(B===fb && !B.over) banner(e.side==='p' ? '🔥 ¡FURIA!' : '¡El rival entra en Furia!', e.side==='p' ? '+3 de elixir y recarga más rápida' : '', 1.5); }, 900); } }
      }
      const k = B.ents.find(t=>t.king&&t.side===e.side&&t.hp>0); if(k && !k.active){ k.active = true; }
      setCrowns();
      if(e.king){ B.ents.forEach(o=>{ if(o.side===e.side && o.hp>0 && o.type==='tower'){ o.hp=0; } }); endBattle(att==='p'); return; }
      B.rubble = B.rubble || []; B.rubble.push({x:e.x, y:e.y, s:e.r*2});
    }
  }
  B.ents = B.ents.filter(e=>!e.dead);
}

// No Muertos: cuando cae una tropa cerca de un no muerto, su alma puede levantar un esqueleto
const SOUL_R = 3.0, SOUL_P = 0.35;
function soulRaise(e){
  let best = null, bd = SOUL_R;
  for(const o of B.ents){ if(o===e || o.type!=='unit' || o.hp<=0 || o.c.fac!=='undead' || o.c.building) continue; const d = Math.hypot(o.x-e.x, o.y-e.y); if(d<bd){ bd=d; best=o; } }
  if(!best || B.rng()>=SOUL_P) return;
  if(B.ents.filter(o=>o.type==='unit'&&o.side===best.side&&o.key==='vskel'&&o.hp>0).length>=10) return;
  spawnUnit(best.side, 'vskel', best.lvl, e.x, e.y, 0.5); fxImg('fx_alma', e.x, e.y-0.5, 0.7, 0.6); part('text', e.x, e.y-1.0, {txt:'¡Alma!', col:'#8affb0', life:0.7});
}
function visibleTo(side, e){
  if(!B || e.side===side || e.type!=='unit') return true;
  if(B.terrain==='forest' && !isAir(e) && e.y>RT-1.2 && e.y<RB+1.2){ for(const o of B.ents){ if(o.side!==side || o.hp<=0) continue; if(Math.hypot(o.x-e.x, o.y-e.y) < 2.4) return true; } return false; }
  if(B.weather!=='fog') return true;
  if(side==='p' ? e.y>16.2 : e.y<15.8) return true;
  for(const o of B.ents){ if(o.side!==side || o.hp<=0) continue; if(o.type==='unit' && o.deploy>0) continue; const r = o.type==='tower' ? 4.6 : 4.2; if(Math.hypot(o.x-e.x, o.y-e.y) < r) return true; }
  return false;
}
const isBuilding = e => e.type==='tower' || e.type==='chest' || e.type==='rock' || !!(e.c && e.c.building);
const isAir = e => !!(e.c && e.c.air);
function canHit(a, e){
  if(e.type==='chest') return !(a.c && a.c.building);
  if(isAir(e)) return a.type==='tower' || !!(a.c && (a.c.air || a.c.range>1.5 || a.c.hitsAir));
  return true;
}
function findTarget(u){
  let best=null, bd=1e9;
  const minR = u.c.minRange || 0;
  for(const e of B.ents){ if(e.side===u.side||e.hp<=0||e.hidden) continue; if(u.c.targets==='buildings'&&!isBuilding(e)) continue; if(!canHit(u,e)) continue;
    const d = edge(u,e); if(u.c.building && (d>u.range || d<minR)) continue;
    if(e.type==='rock' && (Math.abs(u.x-9)>2.3 || d>3.6 || u.c.building)) continue; if(d<=SIGHT && d<bd){ bd=d; best=e; } }
  if(best || u.c.building) return best;
  for(const e of B.ents){ if(e.side===u.side||e.hp<=0||(e.type!=='tower'&&e.type!=='chest')) continue; const d = edge(u,e); if(d<bd){ bd=d; best=e; } }
  return best;
}
function updUnit(u, dt){
  if(u.deploy>0){ u.deploy -= dt; if(u.deploy<=0 && !isAir(u)){ fxImg('fx_dust', u.x, u.y+0.25, 0.5+u.r*0.9, 0.45); for(let i=0;i<3;i++) part('dust', u.x, u.y+0.2, {sp:1.8, life:0.45, size:0.22}); } return; }
  if(u.c.building && u.c.life){ u.hp -= u.maxHp/u.c.life*dt; }
  if(u.c.transform && u.hp < u.maxHp*u.c.transform.at) transformUnit(u);
  if(u.root>0) u.root -= dt;
  if(!u.c.building && u.hp < u.maxHp){ let rg = u.c.regen || 0; if(u.c.fac==='elf' && (u.side==='p' ? u.y>RB : u.y<RT)) rg += SAVIA; if(u.side==='p' && B.p.mods.savia && u.y>RB) rg += B.p.mods.savia; if(rg){ u.hp = Math.min(u.maxHp, u.hp + u.maxHp*rg*dt); if(Math.random()<dt*1.5) part('heal', u.x+(Math.random()-0.5)*0.5, u.y-0.6, {life:0.6}); } }
  if(u.weak>0){ u.weak -= dt; if(Math.random()<0.06) part('spark', u.x+(Math.random()-0.5)*0.5, u.y-0.6, {sp:0.4, col:'#c070ff', life:0.5, size:0.07}); }
  if(u.slow>0){ u.slow -= dt; dt *= 0.55; if(Math.random()<0.1) part('spark', u.x+(Math.random()-0.5)*0.5, u.y-0.5, {sp:0.5, col:'#bfe8ff', life:0.5, size:0.07}); }
  if(u.haste>0){ u.haste -= dt; u.cd = Math.max(0, u.cd - dt*0.6); if(Math.random()<0.08) part('spark', u.x+(Math.random()-0.5)*0.4, u.y-0.6, {sp:0.8, col:'#ff6a2a', life:0.4, size:0.08}); }
  if(u.dmgBuff>0){ u.dmgBuff -= dt; if(u.dmgBuff<=0) u.dmgBuffMul = 1; }
  if(u.c.hasteAura || u.c.dmgAura){ u.auraCd = (u.auraCd||0) - dt; if(u.auraCd<=0){ u.auraCd = 0.5; const A = u.c.hasteAura || u.c.dmgAura;
    for(const a of B.ents){ if(a.type!=='unit'||a.side!==u.side||a.hp<=0||a.c.building) continue; if(Math.hypot(a.x-u.x,a.y-u.y)<=A.radius){ if(u.c.hasteAura) a.haste = Math.max(a.haste||0, 0.7); if(u.c.dmgAura){ a.dmgBuff = Math.max(a.dmgBuff||0, 0.7); a.dmgBuffMul = Math.max(a.dmgBuffMul||1, u.c.dmgAura.mul); } } } } }
  if(u.c.rage){ const was = u.raging; u.raging = u.hp < u.maxHp*0.5; if(u.raging){ u.cd = Math.max(0, u.cd - dt*0.9); if(!was){ B.fx.push({k:'ring', x:u.x, y:u.y, r0:0.3, r1:1.2, t:0, life:0.4, col:'#ff4020'}); part('text', u.x, u.y-1.2, {txt:'¡FURIA!', col:'#ff6a3a', life:0.9}); } } }
  u.cd = Math.max(0, u.cd-dt); u.retarget -= dt; u.atk = Math.max(0, u.atk-dt);
  const c = u.c, L = lvlMul(u.lvl), m = B[u.side].mods;
  if(c.repairer){
    const own = B.ents.filter(t=>t.type==='tower'&&t.side===u.side&&t.hp>0&&t.hp<t.maxHp);
    const t = own.length ? own.reduce((a,b)=>a.hp/a.maxHp<b.hp/b.maxHp?a:b) : B.ents.find(t=>t.type==='tower'&&t.king&&t.side===u.side);
    if(!t){ return; }
    u.target = t; if(Math.abs(t.x-u.x)>0.15) u.face = t.x>u.x?1:-1;
    if(edge(u,t) > 0.4){ u.locked=false; moveToward(u,t,dt); return; }
    u.locked = true;
    if(own.length){ u.work = (u.work||0) + dt; t.hp = Math.min(t.maxHp, t.hp + c.repairer.rate*L*dt);
      if(u.cd<=0){ u.cd = 0.5; u.atk = 0.28; SFX.hit(); for(let i=0;i<3;i++) part('spark', (u.x+t.x)/2, (u.y+t.y)/2-0.4, {sp:3, col:'#ffcf4a', life:0.3}); part('heal', t.x+(Math.random()-0.5), t.y-1, {life:0.8}); }
      if(u.work >= c.repairer.dur){ u.hp = 0; } }
    return;
  }
  // habilidades pasivas
  if(c.heal){ u.healCd -= dt; if(u.healCd<=0){ u.healCd = c.heal.every; let any=false;
    for(const a of B.ents){ if(a.type!=='unit'||a.side!==u.side||a.hp<=0||a.hp>=a.maxHp) continue; if(a===u&&!c.heal.self) continue; if(dist(a,u)<=c.heal.radius){ a.hp=Math.min(a.maxHp,a.hp+c.heal.amt*L); any=true; part('heal', a.x+(Math.random()-0.5)*0.4, a.y-0.5, {life:0.8}); } }
    if(any) B.fx.push({k:'ring', x:u.x, y:u.y, r0:0.4, r1:c.heal.radius, t:0, life:0.5, col:'#7affa8'}); } }
  if(c.spawn){ u.spawnCd -= dt; if(u.spawnCd<=0){ u.spawnCd = c.spawn.every; for(let i=0;i<c.spawn.n;i++){ const a=B.rng()*TAU; spawnUnit(u.side, c.spawn.key, u.lvl, u.x+Math.cos(a)*0.8, u.y+Math.sin(a)*0.8, 0.35); }
    B.fx.push({k:'ring', x:u.x, y:u.y, r0:0.3, r1:1.2, t:0, life:0.4, col:'#8affb0'}); for(let i=0;i<8;i++) part('spark',u.x,u.y,{sp:2,col:'#8affb0',life:0.5}); } }
  if(c.stomp) u.stompCd -= dt;
  let t = u.target;
  if(!t || t.hp<=0 || t.hidden) t = null;
  if(!t || (!u.locked && u.retarget<=0)){ u.retarget = 0.3; t = findTarget(u); }
  u.target = t; if(!t) return;
  if(Math.abs(t.x-u.x)>0.15) u.face = t.x>u.x ? 1 : -1;
  const d0 = edge(u,t);
  if(d0 <= u.range && d0 >= (c.minRange||0)){
    u.locked = true;
    if(u.cd<=0){ u.cd = c.hs; u.atk = 0.28; attack(u, t); }
  } else if(c.building){ u.locked = false; u.target = null; }
  else { u.locked = false; moveToward(u, t, dt); }
}
function moveToward(u, t, dt){
  if(u.root>0) return;
  const [tx, ty] = routeTarget(u, t);
  let spd = u.speed * (u.raging ? 1.3 : 1) * (u.haste>0 ? 1.2 : 1) * terrainSpeed(u);
  if(u.r>=0.6 && Math.abs(u.x-9)<1 && u.y>RT-0.7 && u.y<RB+0.7) spd *= 0.55;
  let dx=tx-u.x, dy=ty-u.y; const d=Math.hypot(dx,dy), step=spd*dt;
  // rodear torres, edificios y rocas que estén en medio (sin esquivar el propio objetivo)
  if(!isAir(u) && d>0.01){ let ax=dx/d, ay=dy/d, sx=0, sy=0;
    for(const o of B.ents){ if(o===t || o===u || o.hp<=0) continue; const solid = o.type==='tower' || o.type==='rock' || (o.type==='unit' && o.c.building); if(!solid) continue;
      const ox=o.x-u.x, oy=o.y-u.y, od=Math.hypot(ox,oy), rr=o.r+u.r+0.15; if(od > rr+1.2 || od > d+o.r) continue;
      const along = ox*ax+oy*ay; if(along <= 0) continue; const lat = ox*ay-oy*ax; if(Math.abs(lat) > rr) continue;
      let side = Math.sign(lat) || (u.x<9 ? 1 : -1); if(Math.abs(lat)<0.05) side = (u.x + (u.side==='p'?0.01:-0.01)) < W/2 ? 1 : -1;
      const w = (rr - Math.abs(lat))/rr * 2.2; sx += -ay*side*w; sy += ax*side*w; }
    if(sx||sy){ ax += sx; ay += sy; const n=Math.hypot(ax,ay)||1; dx = ax/n*d; dy = ay/n*d; } }
  if(Math.abs(dx)>0.05) u.face = dx>0 ? 1 : -1;
  if(d<=step){ u.x=tx; u.y=ty; } else { u.x+=dx/d*step; u.y+=dy/d*step; }
  u.walk += dt*u.speed*6; u.moved += step;
  if(u.c.charge && u.moved>2 && !u.charged){ u.charged = true; }
  if(u.c.charge && u.charged && Math.random()<dt*12) part('dust', u.x-u.face*0.3, u.y+0.2, {sp:0.6, life:0.4, size:0.18});
}
function attack(u, t){
  const c = u.c;
  if(u.hidden){ u.hidden = false; B.fx.push({k:'ring', x:u.x, y:u.y, r0:0.2, r1:1.0, t:0, life:0.35, col:'#e0e8ff'}); for(let i=0;i<8;i++) part('smoke', u.x, u.y-0.3, {sp:1.2, life:0.5, size:0.25}); }
  if(c.proj){
    const kind = c.proj;
    const wet = B.weather==='rain' && (kind==='bomb'||kind==='firearrow') ? 0.75 : 1;
    const at = c.antiTank && t.type==='unit' && t.maxHp>=1200 ? c.antiTank : 1;
    const sy0 = u.y - (isAir(u) ? 1.2 : 0.4);
    B.projs.push({kind, x:u.x, y:sy0, sx:u.x, sy:sy0, tx:t.x, ty:t.y, target:t, dmg:u.dmg*wet*at*(u.dmgBuff>0 ? (u.dmgBuffMul||1) : 1)*(u.weak>0 ? 0.6 : 1), weakenOnHit:c.weakenOnHit||0, splash:c.splash||0, side:u.side, speed:kind==='bomb'||kind==='rock'?(c.building?6:7):11, t:0, slowOnHit:c.slowOnHit||0, src:u});
    if(at>1) part('text', t.x, t.y-1.3, {txt:'×'+at, col:'#ffcf4a', life:0.7});
    kind==='arrow'||kind==='firearrow' ? SFX.arrow() : SFX.magic();
  } else if(c.kamikaze){
    const kd = c.kamikaze.dmg*lvlMul(u.lvl)*(B[u.side].mods.dmg||1);
    for(const o of B.ents){ if(o.side===u.side||o.hp<=0||isAir(o)) continue; if(dist(o,u)-o.r<=c.kamikaze.radius) hit(o, o.type==='tower'||o.type==='chest' ? kd : kd*0.6, u.side); }
    u.hp = 0; SFX.boom(); B.shake = Math.max(B.shake, 0.3);
    fxImg('fx_explosion', u.x, u.y, c.kamikaze.radius*0.9, 0.4); B.fx.push({k:'flash', x:u.x, y:u.y, r:c.kamikaze.radius, t:0, life:0.35, col:'#ffb030'}); B.fx.push({k:'ring', x:u.x, y:u.y, r0:0.3, r1:c.kamikaze.radius, t:0, life:0.4, col:'#ffe0a0'});
    for(let i=0;i<18;i++) part('ember', u.x, u.y, {sp:6, life:0.6});
  } else {
    let dmg = u.dmg * (u.dmgBuff>0 ? (u.dmgBuffMul||1) : 1) * (u.weak>0 ? 0.6 : 1);
    if(c.antiTank && t.type==='unit' && t.maxHp>=1200){ dmg *= c.antiTank; part('text', t.x, t.y-1.3, {txt:'×'+c.antiTank, col:'#ffcf4a', life:0.7}); }
    if(c.charge && u.charged){ dmg *= 2; u.charged = false; u.moved = 0; B.fx.push({k:'ring', x:t.x, y:t.y, r0:0.2, r1:1.2, t:0, life:0.3, col:'#fff'}); B.shake=Math.max(B.shake,0.2); }
    hit(t, dmg, u.side); SFX.hit(); if(Math.random()<0.6) fxImg('fx_hit', t.x+(Math.random()-0.5)*0.3, t.y-0.5, 0.42, 0.18);
    if(c.lifesteal && u.hp>0){ u.hp = Math.min(u.maxHp, u.hp + dmg*c.lifesteal); if(Math.random()<0.5) part('heal', u.x, u.y-0.7, {life:0.6}); }
    if(t.type==='unit'){ if(c.slowOnHit) t.slow = Math.max(t.slow||0, c.slowOnHit); if(c.weakenOnHit) t.weak = Math.max(t.weak||0, c.weakenOnHit); }
    if(c.stealElixir && t.type==='tower'){ const S = B[u.side]; S.elixir = Math.min(10, S.elixir + c.stealElixir); part('text', t.x, t.y-1.6, {txt:'+½', col:'#e070ff', life:0.8}); }
    if(c.rootOnHit && t.type==='unit' && !isAir(t)){ t.root = Math.max(t.root||0, c.rootOnHit); }
    if(c.splash){ for(const o of B.ents){ if(o===t||o.side===u.side||o.hp<=0||o.type==='tower'||!canHit(u,o)) continue; if(dist(o,t)-o.r<=c.splash) hit(o, dmg*0.8, u.side); } B.fx.push({k:'ring', x:t.x, y:t.y, r0:0.2, r1:c.splash, t:0, life:0.25, col:'#ffd0a0'}); }
    const hx=(u.x+t.x)/2, hy=(u.y+t.y)/2-0.3;
    for(let i=0;i<4;i++) part('spark', hx, hy, {sp:3.5, col:'#fff7c0', life:0.25});
    if(c.stomp && u.stompCd<=0){ u.stompCd = c.stomp.every; const sd = c.stomp.dmg*lvlMul(u.lvl)*(B[u.side].mods.dmg||1);
      for(const o of B.ents){ if(o.side===u.side||o.hp<=0||o===t||isAir(o)) continue; if(dist(o,u)-o.r<=c.stomp.radius){ hit(o, o.type==='tower'?sd*0.5:sd, u.side); if(c.stomp.root && o.type==='unit') o.root = Math.max(o.root||0, c.stomp.root); } }
      B.fx.push({k:'ring', x:u.x, y:u.y+0.3, r0:0.5, r1:c.stomp.radius, t:0, life:0.4, col:'#d6a8ff'}); for(let i=0;i<12;i++) part('dust', u.x, u.y+0.3, {sp:4, life:0.5, size:0.3}); B.shake=Math.max(B.shake,0.25); }
  }
}
function updTower(t, dt){
  if(t.recoil>0) t.recoil -= dt;
  if(!t.active) return;
  t.cd = Math.max(0, t.cd-dt);
  let tg = t.target;
  if(!tg || tg.hp<=0 || tg.hidden || dist(t,tg)-tg.r > t.range) tg = null;
  if(!tg){ let bd=1e9; for(const e of B.ents){ if(e.type!=='unit'||e.side===t.side||e.hp<=0||e.deploy>0||e.hidden) continue; const d=dist(t,e)-e.r; if(d<=t.range&&d<bd){ bd=d; tg=e; } } }
  t.target = tg;
  if(tg && t.cd<=0){ t.cd = t.hs; t.recoil = 0.22;
    const sy = t.y - (t.king?2.6:2.2);
    B.projs.push({kind:t.king?'cannon':'tarrow', x:t.x, y:sy, sx:t.x, sy, tx:tg.x, ty:tg.y, target:tg, dmg:t.dmg, splash:0, side:t.side, speed:t.king?12:14, t:0});
    SFX.arrow(); }
}
function updProjs(dt){
  for(const p of B.projs){
    p.t += dt;
    if(p.target && p.target.hp>0){ p.tx = p.target.x; p.ty = p.target.y; }
    const dx=p.tx-p.x, dy=p.ty-p.y, d=Math.hypot(dx,dy), step=p.speed*dt;
    p.ang = Math.atan2(dy,dx);
    if(p.kind==='fireball' && Math.random()<0.9) part('ember', p.x, p.y, {sp:1, life:0.4});
    if(p.kind==='firearrow' && Math.random()<0.6) part('ember', p.x, p.y, {sp:0.5, life:0.25, size:0.1});
    if(d<=step){
      p.done = true; p.x=p.tx; p.y=p.ty;
      if(p.kind==='fireball' || p.kind==='barrel'){ castSpell(p.side, p.card, p.tx, p.ty, p.dmg); continue; }
      if(p.splash){
        for(const e of B.ents){ if(e.side===p.side||e.hp<=0) continue; if(dist(e,{x:p.tx,y:p.ty})-e.r<=p.splash){ hit(e, p.dmg, p.side); if(p.slowOnHit && e.type==='unit') e.slow = Math.max(e.slow||0, p.slowOnHit); if(p.weakenOnHit && e.type==='unit') e.weak = Math.max(e.weak||0, p.weakenOnHit); } }
        const col = p.kind==='rock' ? '#c9b89a' : p.kind==='orbr' ? '#ff6a3a' : p.kind==='bomb' ? '#ffb030' : (p.kind==='firearrow'||p.kind==='dfire') ? '#ff8a30' : p.kind==='orbi' ? '#9ae4ff' : '#c47bff';
        B.fx.push({k:'flash', x:p.tx, y:p.ty, r:p.splash, t:0, life:0.28, col}); B.fx.push({k:'ring', x:p.tx, y:p.ty, r0:0.2, r1:p.splash, t:0, life:0.3, col:'#fff'});
        for(let i=0;i<10;i++) part(p.kind==='bomb'||p.kind==='firearrow'||p.kind==='dfire'?'ember':'spark', p.tx, p.ty, {sp:4, col, life:0.4});
        if(p.kind==='bomb' || p.kind==='rock'){ SFX.boom(); B.shake=Math.max(B.shake,0.15); fxImg('fx_explosion', p.tx, p.ty, p.splash*0.9, 0.4); }
      } else if(p.target && p.target.hp>0){
        hit(p.target, p.dmg, p.side); SFX.hit();
        if(p.target.type==='unit'){ if(p.slowOnHit) p.target.slow = Math.max(p.target.slow||0, p.slowOnHit); if(p.weakenOnHit) p.target.weak = Math.max(p.target.weak||0, p.weakenOnHit); }
        const col = p.kind==='orbg'?'#7affa8':p.kind==='orbn'?'#8affb0':'#fff';
        for(let i=0;i<3;i++) part('spark', p.tx, p.ty-0.3, {sp:2.5, col, life:0.22});
      }
    } else { p.x += dx/d*step; p.y += dy/d*step; }
  }
  B.projs = B.projs.filter(p=>!p.done);
}
function separate(){
  const us = B.ents.filter(e=>e.type==='unit'&&e.hp>0&&e.deploy<=0.5);
  for(let i=0;i<us.length;i++){
    const a = us[i];
    for(let j=i+1;j<us.length;j++){
      const b = us[j]; if(isAir(a)!==isAir(b)) continue;
      const dx=b.x-a.x, dy=b.y-a.y, d=Math.hypot(dx,dy)||0.01, ov=a.r+b.r-d;
      if(ov>0){ let wa=b.r*b.r/(a.r*a.r+b.r*b.r), wb=1-wa; if(a.c.building){ wa=0; wb=1; } if(b.c.building){ wb=0; wa=a.c.building?0:1; } const nx=dx/d, ny=dy/d; a.x-=nx*ov*wa*0.5; a.y-=ny*ov*wa*0.5; b.x+=nx*ov*wb*0.5; b.y+=ny*ov*wb*0.5; }
    }
    if(isAir(a)||a.c.building){ a.x = clamp(a.x,0.3,W-0.3); a.y = clamp(a.y,0.3,H-0.3); continue; }
    for(const t of B.ents){ if((t.type!=='tower'&&t.type!=='chest'&&t.type!=='rock')||t.hp<=0) continue; const dx=a.x-t.x, dy=a.y-t.y, d=Math.hypot(dx,dy)||0.01, ov=a.r+t.r-d; if(ov>0){ a.x+=dx/d*ov; a.y+=dy/d*ov; } }
    a.x = clamp(a.x,0.3,W-0.3); a.y = clamp(a.y,0.3,H-0.3);
    // no caminar sobre el agua fuera de los puentes
    if(!a.c.leap) clampObstacles(a);
  }
}

// ---------- IA ----------
function aiThink(dt){
  const S = B.e; S.think -= dt; if(S.think>0) return;
  S.think = B.enc.think * (0.7 + B.rng()*0.6);
  if(B.enc.mode==='treasure'){
    S.think *= 1.25;
    const aff = S.hand.map((card,i)=>({card, i, c:CARDS[card.key]})).filter(o=>o.c.cost<=S.elixir && !o.c.spell);
    const chests = B.ents.filter(e=>e.type==='chest');
    if(!aff.length || !chests.length || S.elixir<4) return;
    const ch = chests.reduce((a,b)=> (b.big?-6:0)+b.y < (a.big?-6:0)+a.y ? b : a);
    const o = aff[Math.floor(B.rng()*aff.length)];
    const x = clamp(ch.x + (B.rng()-0.5)*1.5, 1, W-1), y = clamp(ch.y - 2.5, 1, RT-0.6);
    if(!o.c.building) playCard('e', o.i, x, y);
    return;
  }
  const aff = S.hand.map((card,i)=>({card, i, c:CARDS[card.key]})).filter(o=>o.c.cost<=S.elixir);
  if(!aff.length) return;
  const spell = aff.filter(o=>o.c.spell && !o.c.allyBuff);
  const buff = aff.find(o=>o.c.allyBuff);
  if(buff){ const mine = B.ents.filter(e=>e.type==='unit'&&e.side==='e'&&e.locked&&e.hp>0);
    for(const u of mine){ const n = mine.filter(o=>dist(o,u)<=buff.c.radius).length; if(n>=3 || (n>=2 && u.y>15)){ playCard('e', buff.i, u.x, u.y); return; } } }
  // rematar torres
  for(const sp of spell){ const dmg = sp.c.dmg*lvlMul(sp.card.lvl)*S.mods.spell*sp.c.towerMul; const weak = towersOf('p').find(t=>t.hp<=dmg); if(weak){ playCard('e', sp.i, weak.x, weak.y); return; } }
  const threats = B.ents.filter(e=>e.type==='unit'&&e.side==='p'&&e.y<21&&e.deploy<=0.6&&visibleTo('e',e));
  if(threats.length){
    const t = threats.reduce((a,b)=>a.y<b.y?a:b);
    for(const sp of spell){ const near = threats.filter(e=>dist(e,t)<=sp.c.radius*0.9); const hp = near.reduce((a,e)=>a+e.hp,0);
      if(near.length>=3 || (hp>=900 && near.length>=2) || (sp.c.stun && hp>=1500)){ playCard('e', sp.i, t.x, t.y-0.4); return; } }
    const airThreat = isAir(t);
    const opts = aff.filter(o=>!o.c.spell && o.c.targets==='any' && (!airThreat || o.c.range>1.5 || o.c.air));
    if(!opts.length){ const tank = aff.find(o=>!o.c.spell); if(tank && S.elixir>=8){ playCard('e', tank.i, t.x<9?3.5:14.5, 12); } return; }
    const swarm = threats.length>=3, tankThreat = threats.some(e=>e.maxHp>=1300);
    opts.forEach(o=>{ const c=o.c; o.score = (tankThreat ? c.dmg*c.count/c.hs/50 : 0) + (swarm && (c.splash||c.count>=3) ? 6 : 0) + c.cost*0.6 + B.rng()*3; });
    opts.sort((a,b)=>b.score-a.score);
    const o = opts[0], ranged = o.c.range>2;
    const x = clamp(t.x + (B.rng()-0.5)*1.6, 1, W-1), y = clamp(t.y - (o.c.building?3.5:ranged?4.2:1.8), 1, RT-0.6);
    aiDrop(o, x, y);
    return;
  }
  if(B.anvil.ctrl==='p' && B.anvil.t>3 && S.elixir>=4 && B.rng()<0.6){
    const o = aff.filter(o=>!o.c.spell && o.c.targets==='any').sort((a,b)=>a.c.cost-b.c.cost)[0];
    if(o){ playCard('e', o.i, 9 + (B.rng()-0.5)*1.5, 13.8); return; }
  }
  const need = B.enc.aggro;
  if(S.elixir >= need || (S.elixir>=6 && B.rng()<0.1)){
    const opts = aff.filter(o=>!o.c.spell && !o.c.building); if(!opts.length) return;
    // prefiere empujar con tanque + apoyo
    opts.sort((a,b)=>(b.c.hp*b.c.count) - (a.c.hp*a.c.count) + (B.rng()-0.5)*1500);
    const o = opts[0];
    const towers = towersOf('p').filter(t=>!t.king);
    let lane = Math.floor(B.rng()*3);
    if(towers.length && B.rng()<0.65){ const w = towers.reduce((a,b)=>a.hp<b.hp?a:b); lane = w.lane; }
    if(B.anvil.ctrl==='p' && B.rng()<0.4 && o.c.speed>=0.8) lane = 1;
    let bx = TOWER_X[lane];
    let x = bx + (B.rng()-0.5)*(bx===9?0.4:1), y = 13.6;
    if(o.c.speed<0.8){ y = 2.6; x = bx===9 ? 9 : (bx<9 ? 5.5 : 12.5); }
    else if(o.c.range>2) y = 10;
    if(!princessAlive('p',lane) && o.c.targets==='buildings'){ y = 19.5; x = bx; }
    aiDrop(o, x, y);
  }
}
function aiDrop(o, x, y){ for(const dy of [0,-1.4,1.4,-2.6]){ const yy = clamp(y+dy, 1, H-1); if(validDrop('e', o.card.key, x, yy)){ playCard('e', o.i, x, yy); return true; } } return false; }
function bossPower(){
  const us = B.ents.filter(e=>e.type==='unit'&&e.side==='p'&&e.hp>0);
  if(!us.length) return;
  let best = us[0], bs = 0;
  for(const u of us){ const s = us.filter(o=>dist(o,u)<2.5).reduce((a,o)=>a+o.hp,0); if(s>bs){ bs=s; best=u; } }
  banner('¡Ira de '+B.enc.name.replace(/^\S+\s/,'')+'!', '', 1.0);
  const k = B.ents.find(t=>t.king&&t.side==='e') || {x:9,y:3};
  B.projs.push({kind:'fireball', x:k.x, y:k.y-1, sx:k.x, sy:k.y-1, tx:best.x, ty:best.y, target:null, side:'e', speed:10, t:0, card:{key:'fireball', lvl:1}, dmg:420*B.enc.mult});
}

function endBattle(win, tiebreak=false){
  if(B.over) return;
  B.over = true;
  const king = B.ents.find(t=>t.king&&t.side==='p'&&t.hp>0);
  const res = {win, gold:B.gold, crowns:B.p.crowns, eCrowns:B.e.crowns, kingHp: king ? Math.ceil(king.hp) : 0, tiebreak, stats:B.stats, comeback: win && B.firstLoss==='p', log:B.log, seed:B.seed};
  if(B.enc.mode==='treasure') banner(win ? '¡Botín ganado!' : 'El rival se llevó más', `Tú ${B.gold.p} · Rival ${B.gold.e} de oro`, 2.2);
  else banner(win ? '¡VICTORIA!' : 'DERROTA', tiebreak ? 'Desempate por vida de torres' : '', 2.2);
  win ? SFX.win() : SFX.lose();
  setTimeout(()=>{ running = false; B.onEnd(res); }, window.QA_FAST ? 0 : 2300);
}

// ================= RENDER DE BATALLA =================
const MBOSS_IMG = {human:'boss_irongolem', orc:'boss_ogre2', elf:'boss_stag', undead:'boss_ghostknight'};
const cv = $('cv'), ctx = cv.getContext('2d');
let TS = 20, DPR = 1, arenaCache = null, bgCache = null, arenaKey = '', OX = 0, CW = 360;
function resizeBattle(){
  DPR = Math.min(2.5, window.devicePixelRatio || 1);
  const scr = $('battle'), sh = scr.clientHeight || window.innerHeight;
  const cs = getComputedStyle(scr), padV = (parseFloat(cs.paddingTop)||0) + (parseFloat(cs.paddingBottom)||0);
  const used = ($('hud').offsetHeight||100) + ($('ebarWrap').offsetHeight||26) + 14 + padV;
  const avail = sh - used;
  TS = Math.max(8, Math.min(window.innerWidth/W, avail/H, 34));
  CW = window.innerWidth <= 700 ? window.innerWidth : Math.min(window.innerWidth, TS*W + TS*8);
  OX = Math.max(0, (CW - TS*W)/2);
  cv.style.width = CW+'px'; cv.style.height = (TS*H)+'px';
  cv.width = Math.round(CW*DPR); cv.height = Math.round(TS*H*DPR);
  const mode = B && B.enc && B.enc.mode || 'std';
  const ter = B && B.terrain || 'river', brk = !!(B && B.iceBroken);
  const bio = B && B.biome || 'grass';
  const k = TS.toFixed(2)+'_'+DPR+'_'+mode+'_'+Math.round(CW)+'_'+ter+'_'+brk+'_'+bio+'_'+(RUN&&RUN.faction)+'_'+(B&&B.enc&&B.enc.faction)+'_'+((B&&B.seed||0)%2);
  if(k !== arenaKey){ arenaKey = k; arenaCache = renderArena(TS, DPR, mode, ter, brk, bio); bgCache = renderBackdrop(TS, DPR, CW, OX, arenaCache, bio); SPRITE_CACHE.clear(); TOWER_CACHE.clear(); }
  $('enum').style.left = (($('ebar').getBoundingClientRect().left || 10) - 4) + 'px';
}
const X = v => v*TS;
function drawBattle(){
  if(!B) return;
  const now = performance.now()/1000;
  ctx.setTransform(DPR,0,0,DPR,0,0);
  ctx.clearRect(0,0,CW,X(H));
  ctx.save();
  if(B.shake>0){ const s = B.shake*TS*0.35; ctx.translate((Math.random()-0.5)*s, (Math.random()-0.5)*s); }
  ctx.drawImage(bgCache, 0, 0, CW, X(H));
  ctx.translate(OX, 0);
  drawTerrainAnim(now);
  drawAnvil(now);
  // zona de despliegue
  if(sel>=0 && !B.over){
    const card = handCard(sel);
    if(card && !CARDS[card.key].spell){
      ctx.fillStyle = 'rgba(255,40,60,0.20)';
      for(let y=0;y<H;y++) for(let x=0;x<W;x++) if(!validDrop('p', card.key, x+0.5, y+0.5)) ctx.fillRect(X(x),X(y),TS+0.5,TS+0.5);
      ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.setLineDash([X(0.3),X(0.2)]); ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(0,X(RB+0.5)); ctx.lineTo(X(W),X(RB+0.5)); ctx.stroke(); ctx.setLineDash([]);
    }
  }
  // escombros
  if(B.rubble) for(const r of B.rubble) drawRubble(ctx, X(r.x), X(r.y+0.3), X(r.s));
  // sombras y anillos de equipo
  for(const e of B.ents){ if(e.type!=='unit') continue; if(e.side==='e' && !visibleTo('p',e)) continue; const dep = e.deploy>0 ? 1-e.deploy/e.deployMax : 1;
    ctx.globalAlpha = 0.28*dep; ctx.fillStyle = '#000'; ctx.beginPath(); ctx.ellipse(X(e.x),X(e.y+0.05),X(e.r*1.05),X(e.r*0.45),0,0,TAU); ctx.fill();
    ctx.globalAlpha = 0.75*dep; ctx.strokeStyle = TEAM[e.side].main; ctx.lineWidth = Math.max(1.5,TS*0.09); ctx.beginPath(); ctx.ellipse(X(e.x),X(e.y+0.05),X(e.r*1.0),X(e.r*0.42),0,0,TAU); ctx.stroke(); }
  ctx.globalAlpha = 1;
  // entidades ordenadas por profundidad
  const list = B.ents.slice().sort((a,b)=>(a.y+(a.type==='tower'?0.6:0)+(isAir(a)?100:0))-(b.y+(b.type==='tower'?0.6:0)+(isAir(b)?100:0)));
  if(B.enc.boss || B.enc.mboss){ const bk = B.enc.boss ? 'boss_'+(B.enc.faction||'orc') : (B.enc.faction==='elf' && B.seed%2 ? 'boss_owl' : MBOSS_IMG[B.enc.faction||'orc']), bim = imgFor(bk); const king = B.ents.find(t=>t.type==='tower'&&t.king&&t.side==='e'&&t.hp>0); if(bim && king){ const sp = getSprite(bk, 'e', X(3.4)); const bob = Math.sin(now*1.6)*X(0.06); ctx.drawImage(sp.normal, X(king.x+3.0) - sp.pad - sp.px*0.5, X(king.y+1.2) - sp.pad - sp.px*0.95 + bob); } }
  for(const e of list){ if(e.type==='tower') drawTowerE(e, now); else if(e.type==='chest') drawChestE(e, now); else if(e.type==='rock') drawRockE(e, now); else drawUnitE(e, now); }
  // proyectiles
  for(const p of B.projs) drawProj(p);
  // efectos
  for(const f of B.fx) drawFx(f);
  // partículas
  for(const p of B.parts) drawPart(p);
  // barras de vida encima de todo
  drawWeather(now);
  for(const e of B.ents){ if(e.type==='unit' && e.hp<e.maxHp && e.deploy<=0 && (e.side==='p'||visibleTo('p',e))) hpBar(e.x, e.y - e.r - 0.95 - (e.r>0.7?0.5:0) - (isAir(e)?1.0:0), Math.max(0.9,e.r*2), e.hp/e.maxHp, e.side, false); }
  for(const e of B.ents){ if(e.type==='tower') towerHud(e); }
  // fantasma de colocación
  if(sel>=0 && ptr && !B.over){
    const card = handCard(sel); if(card){ const c = CARDS[card.key], ok = validDrop('p',card.key,ptr.x,ptr.y) && B.p.elixir>=cardCost('p',card);
      if(c.spell){ ctx.fillStyle = ok?'rgba(255,220,120,0.18)':'rgba(255,60,60,0.18)'; ctx.strokeStyle = ok?'#ffe08a':'#ff5050'; ctx.lineWidth = 2.5; ctx.setLineDash([6,5]);
        ctx.beginPath(); ctx.arc(X(ptr.x),X(ptr.y),X(c.radius),0,TAU); ctx.fill(); ctx.stroke(); ctx.setLineDash([]); }
      else { ctx.globalAlpha = 0.55; const sp = getSprite(spriteKey(card.key),"p",TS*(1.05+c.r*2.1)*1.15); const img = ok ? sp.normal : sp.white;
        if(!ok){ ctx.filter = 'none'; }
        ctx.drawImage(img, X(ptr.x)-sp.pad-sp.px*0.5, X(ptr.y)-sp.pad-sp.px*0.88);
        ctx.globalAlpha = 0.9; ctx.strokeStyle = ok?'#fff':'#ff5050'; ctx.lineWidth=2; ctx.beginPath(); ctx.ellipse(X(ptr.x),X(ptr.y),X(0.8),X(0.35),0,0,TAU); ctx.stroke(); ctx.globalAlpha = 1; }
    } }
  ctx.restore();
}
let fogC = null, rainDrops = null;
function drawWeather(now){
  const Wp = X(W), Hp = X(H);
  if(B.weather==='rain'){
    ctx.fillStyle = 'rgba(20,40,80,0.16)'; ctx.fillRect(-OX,0,CW,Hp);
    if(!rainDrops){ rainDrops = []; for(let i=0;i<150;i++) rainDrops.push({x:Math.random()*W, y:Math.random()*H, s:0.7+Math.random()*0.6}); }
    ctx.strokeStyle = 'rgba(200,225,255,0.55)'; ctx.lineWidth = Math.max(1, TS*0.05); ctx.lineCap='round';
    ctx.beginPath();
    const span = CW/TS, x0 = -OX/TS;
    for(const d of rainDrops){ const y = (d.y + now*14*d.s) % (H+2) - 1, x = x0 + ((d.x/W*span + now*2.5*d.s) % span); ctx.moveTo(X(x),X(y)); ctx.lineTo(X(x-0.12),X(y-0.7*d.s)); }
    ctx.stroke();
    if(Math.random()<0.5){ const x=Math.random()*W, y=Math.random()*H; if(imgFor('wx_splash')) B.fx.push({k:'img', key:'wx_splash', x, y:y+0.2, r:0.35, t:0, life:0.4}); else B.fx.push({k:'ring', x, y, r0:0.05, r1:0.35, t:0, life:0.35, col:'rgba(220,235,255,0.8)'}); }
    if(!B.puddles && imgFor('wx_puddle')){ const r = mulberry32(B.seed||1); B.puddles = []; for(let i=0;i<9;i++){ const x = 1+r()*16, y = 3+r()*26; if(Math.abs(y-16)<2.2 || TOWER_X.some(t=>Math.abs(x-t)<1.4)) continue; B.puddles.push([x,y,0.9+r()*0.6]); } }
    if(B.puddles){ const pim = imgFor('wx_puddle'); ctx.globalAlpha = 0.75; for(const [x,y,s] of B.puddles){ const w = X(s), h = w*pim.naturalHeight/pim.naturalWidth; ctx.drawImage(pim, X(x)-w/2, X(y)-h/2, w, h); } ctx.globalAlpha = 1; }
  } else if(B.weather==='snow'){
    ctx.fillStyle = 'rgba(225,238,255,0.13)'; ctx.fillRect(-OX,0,CW,Hp);
    if(!B.drifts){ const r = mulberry32((B.seed||1)+7); B.drifts = []; for(let i=0;i<10;i++){ const x = r()<0.5 ? 0.3+r()*1.6 : 16.1+r()*1.6, y = 2+r()*28; if(Math.abs(y-16)<2.2) continue; B.drifts.push([x,y,0.9+r()*0.7, r()<0.5?'wx_drift':'wx_snowpile']); } }
    for(const [x,y,s,k] of B.drifts){ const im = imgFor(k); if(!im) continue; const w = X(s), h = w*im.naturalHeight/im.naturalWidth; ctx.globalAlpha = 0.9; ctx.drawImage(im, X(x)-w/2, X(y)-h/2, w, h); } ctx.globalAlpha = 1;
    if(!rainDrops || !rainDrops.snow){ rainDrops = []; rainDrops.snow = true; for(let i=0;i<110;i++) rainDrops.push({x:Math.random()*W, y:Math.random()*H, s:0.5+Math.random()*0.8, p:Math.random()*TAU}); }
    const span = CW/TS, x0 = -OX/TS, gustK = Math.max(0, Math.sin(now*0.55))**8, FL = imgFor('wx_flake');
    for(const d of rainDrops){ const y = (d.y + now*1.6*d.s) % (H+2) - 1, x = x0 + (((d.x/W*span + Math.sin(now*0.8+d.p)*0.5 + now*(0.3+gustK*6)*d.s) % span) + span) % span, rr = 0.07+0.09*d.s;
      if(FL && d.s>1.0){ const w = X(rr*2.6); ctx.globalAlpha = 0.85; ctx.drawImage(FL, X(x)-w/2, X(y)-w/2, w, w); ctx.globalAlpha = 1; }
      else { ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.beginPath(); ctx.arc(X(x), X(y), X(rr), 0, TAU); ctx.fill(); } }
    const GU = imgFor('wx_gust'); if(GU && gustK>0.05){ for(let i=0;i<3;i++){ const y = 5 + i*9 + Math.sin(i*2.3)*2, x = x0 + ((now*9 + i*7) % (span+8)) - 4, w = X(6), h = w*GU.naturalHeight/GU.naturalWidth; ctx.globalAlpha = 0.6*gustK; ctx.drawImage(GU, X(x)-w/2, X(y)-h/2, w, h); } ctx.globalAlpha = 1; }
  } else if(B.weather==='fog'){
    const cw = Math.round(CW*DPR), ch = Math.round(Hp*DPR);
    if(!fogC || fogC.width!==cw || fogC.height!==ch){ fogC = mkCanvas(cw, ch); }
    const g = fogC.getContext('2d'); g.setTransform(DPR,0,0,DPR,0,0); g.globalCompositeOperation='source-over'; g.clearRect(0,0,CW,Hp); g.translate(OX,0);
    const fg = g.createLinearGradient(0, X(RB-0.5), 0, X(RB+1.6)); fg.addColorStop(0,'rgba(214,222,236,0.93)'); fg.addColorStop(1,'rgba(214,222,236,0)');
    g.fillStyle = 'rgba(214,222,236,0.93)'; g.fillRect(-OX,0,CW,X(RB-0.5)); g.fillStyle = fg; g.fillRect(-OX,X(RB-0.5),CW,X(2.1));
    const f1 = imgFor('wx_fog1'), f2 = imgFor('wx_fog2');
    for(let i=0;i<7;i++){ const x = ((i*3.1 + now*0.25*(i%2?1:-1)) % (W+6) + W+6) % (W+6) - 3, y = 1.5 + i*2.1; const fim = i%2 ? f2 : f1;
      if(fim){ const w = X(i%2 ? 6.5 : 4.5), h = w*fim.naturalHeight/fim.naturalWidth; g.globalAlpha = 0.55; g.drawImage(fim, X(x)-w/2, X(y)-h/2, w, h); g.globalAlpha = 1; }
      else { g.fillStyle='rgba(255,255,255,0.22)'; g.beginPath(); g.ellipse(X(x),X(y),X(3.2),X(0.9),0,0,TAU); g.fill(); } }
    g.globalCompositeOperation='destination-out';
    for(const o of B.ents){ if(o.side!=='p'||o.hp<=0) continue; if(o.type==='unit'&&o.deploy>0) continue; const r = o.type==='tower'?4.6:4.2;
      const rg = g.createRadialGradient(X(o.x),X(o.y),X(r*0.45),X(o.x),X(o.y),X(r)); rg.addColorStop(0,'rgba(0,0,0,1)'); rg.addColorStop(1,'rgba(0,0,0,0)');
      g.fillStyle = rg; g.beginPath(); g.arc(X(o.x),X(o.y),X(r),0,TAU); g.fill(); }
    ctx.drawImage(fogC, -OX, 0, CW, Hp);
  }
  if(B.furyFlash){ B.furyFlash.t += 1/60; const k = B.furyFlash.t; if(k>1.2) B.furyFlash = null; else if(B.furyFlash.side==='p'){ ctx.fillStyle = `rgba(255,60,20,${0.28*(1-k/1.2)})`; ctx.fillRect(-OX,0,CW,Hp); } }
  if(B.p.fury>0){ for(const t of B.ents){ if(t.type!=='tower'||t.side!=='p') continue; ctx.globalAlpha = 0.25+0.15*Math.sin(now*6); ctx.fillStyle='#ff5a1a'; ctx.beginPath(); ctx.ellipse(X(t.x),X(t.y+0.4),X(t.r*1.3),X(t.r*0.6),0,0,TAU); ctx.fill(); } ctx.globalAlpha = 1; }
}
function drawAnvil(now){
  const A = B.anvil, cx = X(ISLE.x), cy = X(ISLE.y);
  // anillo de control
  const col = A.ctrl ? TEAM[A.ctrl].main : 'rgba(255,255,255,0.5)';
  ctx.save();
  ctx.globalAlpha = A.ctrl ? 0.75 + 0.25*Math.sin(now*4) : 0.45;
  ctx.strokeStyle = col; ctx.lineWidth = Math.max(2.5, TS*0.17); ctx.setLineDash([X(0.35), X(0.25)]); ctx.lineDashOffset = -now*X(0.6);
  ctx.beginPath(); ctx.ellipse(cx, cy, X(ANVIL_R), X(ANVIL_R*0.62), 0, 0, TAU); ctx.stroke(); ctx.setLineDash([]);
  if(A.ctrl){ ctx.globalAlpha = 0.26; ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(cx, cy, X(ANVIL_R), X(ANVIL_R*0.62), 0, 0, TAU); ctx.fill(); }
  ctx.restore();
  if(!imgFor('isla_yunque')){ const s = X(1.7), sp = getAnvil(s); ctx.drawImage(sp, cx - s/2, cy - s*0.62); }
  if(A.ctrl && Math.random()<0.15) part('spark', ISLE.x+(Math.random()-0.5)*0.4, ISLE.y-0.45, {sp:2.5, col:Math.random()<0.5?'#ffcf4a':'#ff8a30', life:0.35, size:0.08});
}
function drawUnitE(u, now){
  if(u.side==='e' && !visibleTo('p',u)) return;
  const px = TS*((u.c && u.c.vpx && !u.grp) ? u.c.vpx : (1.12 + u.r*2.2)*0.95);
  // tus tropas se ven de espaldas mientras avanzan hacia arriba; de frente al pelear
  const bk = 'bk_'+u.sprite, t = u.target, fighting = u.locked || u.atk>0 || (t && t.type==='unit' && dist(u,t) < u.range + u.r + (t.r||0) + 1.2);
  const want = u.side==='p' && !u.c.building && !fighting && (!t || t.y < u.y - 0.2) && !!imgFor(bk);
  if(u.bk===undefined) u.bk = want;
  if(want!==u.bk){ if(!u.bkAt) u.bkAt = now; if(now-u.bkAt > 0.25){ u.bk = want; u.bkAt = 0; } } else u.bkAt = 0;   // evita parpadeos
  const useBack = u.bk && imgFor(bk);
  const sp = getSprite(useBack ? bk : u.sprite, u.side, px);
  let ox = 0, oy = 0, sx = 1, sy = 1, rot = 0, alpha = 1;
  if(u.deploy>0){ const k = 1 - u.deploy/u.deployMax; const e = 1-Math.pow(1-Math.min(1,k*1.4),2); oy = -X(3)*(1-e) - (isAir(u)?X(1.0):0); alpha = Math.min(1,k*2.5); if(k>0.7){ const b=(k-0.7)/0.3; sy = 1 - Math.sin(b*Math.PI)*0.18; sx = 1 + Math.sin(b*Math.PI)*0.12; } }
  else {
    const moving = !u.locked && u.target && u.stun<=0;
    if(isAir(u)){ oy = -X(1.0) + Math.sin(now*5+u.walk)*X(0.12); rot = Math.sin(now*3+u.walk)*0.05; }
    else if(u.c.leap && u.y>RT-0.6 && u.y<RB+0.6){ const k = (u.y-(RT-0.6))/(RB-RT+1.2); oy = -Math.sin(clamp(k,0,1)*Math.PI)*X(1.3); }
    else if(moving){ oy = -Math.abs(Math.sin(u.walk))*px*0.06; rot = Math.sin(u.walk)*0.07; }
    if(u.c.building){ oy = 0; rot = 0; }
    else { sy = 1 + Math.sin(now*3 + u.walk)*0.02; }
    if(u.atk>0 && u.target){ const k = 1 - u.atk/0.28, s = Math.sin(k*Math.PI); const a = Math.atan2(u.target.y-u.y, u.target.x-u.x);
      if(u.c.proj){ ox -= Math.cos(a)*px*0.05*s; oy -= Math.sin(a)*px*0.05*s; sy *= 1 - s*0.06; }
      else { ox += Math.cos(a)*px*0.16*s; oy += Math.sin(a)*px*0.16*s; rot += u.face*0.25*s; } }
  }
  if(u.hidden && u.deploy<=0) alpha *= u.side==='p' ? 0.45 : 0.22 + 0.08*Math.sin(now*6);
  if(u.root>0 && !isAir(u) && imgFor('fx_raices')){ const im = imgFor('fx_raices'), w = X(u.r*2.6); ctx.globalAlpha = Math.min(1, u.root*2); ctx.drawImage(im, X(u.x)-w/2, X(u.y+0.1)-w*0.35, w, w*0.7); ctx.globalAlpha = 1; }
  else if(u.root>0 && !isAir(u)){ ctx.strokeStyle='#3f9a3a'; ctx.lineWidth=Math.max(1.5,X(0.09)); for(let i=0;i<5;i++){ const a=i/5*TAU+u.x; ctx.beginPath(); ctx.moveTo(X(u.x+Math.cos(a)*u.r*1.1),X(u.y+0.15+Math.sin(a)*u.r*0.4)); ctx.quadraticCurveTo(X(u.x+Math.cos(a)*u.r*0.3),X(u.y-0.6),X(u.x+Math.cos(a+1)*u.r*0.5),X(u.y-0.2)); ctx.stroke(); } }
  if(u.evo) drawEvoAura(u, now);
  if(u.haste>0 && imgFor('fx_haste') && u.deploy<=0){ const im = imgFor('fx_haste'), w = X(u.r*2.4), h = w*im.naturalHeight/im.naturalWidth; ctx.globalAlpha = 0.55; ctx.drawImage(im, X(u.x)-w/2, X(u.y+0.15)-h/2, w, h); ctx.globalAlpha = 1; }
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(X(u.x)+ox, X(u.y)+oy);
  ctx.rotate(rot);
  const leftFacing = !imgFor(u.sprite) && (u.sprite==='boar'||u.sprite==='minib'||u.sprite==='rider'||u.sprite==='dragon'||u.sprite==='infernal');
  const flip = leftFacing ? -u.face : (u.c.building ? 1 : (u.face<0 ? -1 : 1));
  ctx.scale(sx*flip, sy);
  const img = (u.flash>0) ? sp.white : sp.normal;
  if(u.raging){ ctx.shadowColor = '#ff3010'; ctx.shadowBlur = X(0.4); }
  if(u.slow>0){ ctx.shadowColor = '#9ae4ff'; ctx.shadowBlur = X(0.4); }
  ctx.drawImage(img, -sp.pad - sp.px*0.5, -sp.pad - sp.px*0.88);
  ctx.shadowBlur = 0;
  ctx.restore();
  if(u.shield>0 && imgFor('fx_shield')){ const im = imgFor('fx_shield'), w = X(u.r*2.9); ctx.globalAlpha = 0.55 + 0.1*Math.sin(now*4); ctx.drawImage(im, X(u.x)-w/2, X(u.y - u.r*1.1)-w/2, w, w); ctx.globalAlpha = 1; }
  if(u.weak>0 && imgFor('fx_weak')){ const im = imgFor('fx_weak'), w = X(0.55); ctx.globalAlpha = 0.85; ctx.drawImage(im, X(u.x + u.r*0.9)-w/2, X(u.y - u.r*2.3)-w/2, w, w); ctx.globalAlpha = 1; }
  if(u.stun>0 && imgFor('fx_aturdido')){ const im = imgFor('fx_aturdido'), w = X(0.9), h = w*im.naturalHeight/im.naturalWidth; ctx.save(); ctx.translate(X(u.x), X(u.y - u.r*2.4)); ctx.rotate(now*3); ctx.drawImage(im, -w/2, -h/2, w, h); ctx.restore(); }
  else if(u.stun>0){ ctx.fillStyle='#ffe066'; for(let i=0;i<3;i++){ const a=now*5+i*TAU/3; ctx.beginPath(); ctx.arc(X(u.x+Math.cos(a)*0.35), X(u.y - u.r*2.4 + Math.sin(a)*0.1), X(0.08),0,TAU); ctx.fill(); } }
  if(u.lvl>1 && u.deploy<=0 && u.c.count===1){ ctx.font = `900 ${Math.max(8,X(0.38))}px Nunito`; ctx.textAlign='center'; ctx.fillStyle = '#ffe066'; ctx.strokeStyle='#000'; ctx.lineWidth=2.5; const ty = X(u.y - u.r - 0.55 - (u.r>0.7?0.5:0)); ctx.strokeText('★'+u.lvl, X(u.x), ty); ctx.fillText('★'+u.lvl, X(u.x), ty); }
}
function drawChestE(e, now){
  const px = X(e.big ? 2.0 : 1.5), sp = getSprite(e.big && imgFor('chest_gold') ? 'chest_gold' : 'chest', 'p', px);
  const k = Math.min(1, (B.t - e.born)*3), s = 0.6 + 0.4*k;
  ctx.save(); ctx.translate(X(e.x), X(e.y) + Math.sin(now*3+e.x)*X(0.04)); ctx.scale(s, s);
  if(e.big){ ctx.shadowColor = '#ffe066'; ctx.shadowBlur = X(0.6); }
  ctx.drawImage(e.flash>0 ? sp.white : sp.normal, -sp.pad - sp.px*0.5, -sp.pad - sp.px*0.8); ctx.shadowBlur = 0; ctx.restore();
  if(e.hp < e.maxHp){ const w = e.big?1.6:1.2, y = e.y - (e.big?1.6:1.2); ctx.fillStyle='rgba(0,0,0,0.65)'; roundRect(X(e.x-w/2)-1, X(y)-1, X(w)+2, X(0.22)+2, 3); ctx.fill(); ctx.fillStyle='#ffd34d'; roundRect(X(e.x-w/2), X(y), X(w*Math.max(0,e.hp/e.maxHp)), X(0.22), 3); ctx.fill(); }
}
function drawTowerE(t, now){
  const w = X(t.king ? 3.5 : t.mini ? 2.25 : 2.8), tw = getTower(t.side, t.king, w, (t.mini && imgFor('tower_mini_'+t.fac)) ? 'mini_'+t.fac : t.fac);
  let ox = 0; if(t.shakeT>0) ox = (Math.random()-0.5)*X(0.12);
  const baseY = X(t.y + (t.king?0.95:0.75));
  const top = baseY - tw.h*118/130;
  ctx.drawImage(t.flash>0 ? tw.white : tw.normal, X(t.x)-tw.w/2+ox, top);
  if(t.king){
    const F = t.fac==='orc' ? {im:'orcchief', px:2.0, fx:0, fy:imgFor('gun_orc')?0.16:0.70, draw:drawOrcChief} : t.fac==='elf' ? {im:'elfkeeper', px:1.65, fx:0, fy:0.39, draw:null} : t.fac==='undead' ? {im:'cryptlord', px:1.75, fx:0.02, fy:0.36, draw:null} : {im:'smith', px:2.0, fx:-0.24, fy:0.42, draw:drawSmith};
    if(t.fac==='elf' || t.fac==='undead' || (imgFor(F.im) && imgFor('base_'+t.fac))){
      const hasImg = !!imgFor('base_'+t.fac), px = X(F.px), sp = getSprite(((k)=> (t.recoil>0 && imgFor(k+'_a1')) ? k+'_a1' : k)((t.side==='p' && imgFor('bk_'+F.im)) ? 'bk_'+F.im : F.im), t.side, px), bob = Math.sin(now*2)*X(0.05) + (t.recoil>0 ? -X(0.12) : 0);
      const fx = X(t.x) + tw.w*F.fx, fy = top + tw.h*(t.fac==='elf' && !hasImg ? 0.30 : F.fy);
      ctx.drawImage(sp.normal, fx - sp.pad - sp.px*0.5 + ox, fy - sp.pad - sp.px*0.95 + bob);
    } else { const s = X(1.8); ctx.save(); ctx.translate(X(t.x)-s*0.72+ox, top + tw.h*0.02 - s*0.5); F.draw(ctx, t.side, s, !t.active, now, t.recoil>0); ctx.restore(); }
    if(!t.active){ ctx.font = `900 ${X(0.55)}px Nunito`; ctx.fillStyle='#fff'; ctx.globalAlpha = 0.5+0.5*Math.sin(now*3); ctx.fillText('z', X(t.x-0.2), top - X(1.0) - (now*10%10)); ctx.globalAlpha=1; }
  } else {
    const px = X(t.mini ? 1.35 : 1.55), sp = t.gar ? getSprite(spriteKey(t.gar.key), t.side, X(1.5)) : getSprite(((k)=> (t.recoil>0 && imgFor(k+'_a1')) ? k+'_a1' : k)(((k)=> (t.side==='p' && imgFor('bk_'+k)) ? 'bk_'+k : k)(imgFor('gun_'+t.fac) ? 'gun_'+t.fac : t.fac==='orc' ? 'axeman' : t.fac==='elf' ? 'elfarcher' : t.fac==='undead' ? 'skarcher' : 'archer')), t.side, px);
    const rec = t.recoil>0 ? -X(0.08) : 0;
    const hasImg = !!imgFor('tower_'+t.fac);
    const topF = (t.mini && imgFor('tower_mini_'+t.fac)) ? 0.42 : hasImg ? (t.fac==='orc' ? (imgFor('gun_orc')?0.14:0.34) : t.fac==='elf' ? 0.12 : t.fac==='undead' ? 0.21 : 0.20) : (t.fac==='elf' ? 0.30 : 0.36);
    ctx.save(); ctx.translate(X(t.x)+ox, top + tw.h*topF + rec);
    let face = 1; if(t.target) face = t.target.x < t.x ? -1 : 1; ctx.scale(face,1);
    if(t.mini || !imgFor('gun_'+t.fac) || t.gar) ctx.drawImage(sp.normal, -sp.pad - sp.px*0.5, -sp.pad - sp.px*0.88); ctx.restore();
  }
}
function towerHud(t){
  const bw = t.king ? 3.2 : 2.5, frac = Math.max(0, t.hp/t.maxHp);
  const top = t.y + (t.king?0.95:0.75) - (t.king?3.5:2.8)*1.3*118/130 - (t.king?1.1:0.3);
  const y = (t.side==='e' || t.king) ? t.y + (t.king?1.15:0.95) : top - 0.25;
  hpBar(t.x, y, bw, frac, t.side, true);
  ctx.font = `900 ${Math.max(9,X(0.42))}px Nunito`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.lineWidth = 3; ctx.strokeStyle = '#000a'; ctx.fillStyle = '#fff';
  const txt = Math.ceil(Math.max(0,t.hp)); ctx.strokeText(txt, X(t.x), X(y+0.2)); ctx.fillText(txt, X(t.x), X(y+0.2));
}
function hpBar(x, y, w, frac, side, big){
  const h = big ? 0.42 : 0.2;
  ctx.fillStyle = 'rgba(0,0,0,0.65)'; roundRect(X(x-w/2)-1, X(y)-1, X(w)+2, X(h)+2, X(h/2)); ctx.fill();
  const gr = ctx.createLinearGradient(0, X(y), 0, X(y+h));
  if(side==='p'){ gr.addColorStop(0,'#9ad0ff'); gr.addColorStop(1,'#2f78e8'); } else if(side==='n'){ gr.addColorStop(0,'#e8dcc8'); gr.addColorStop(1,'#9a8a70'); } else { gr.addColorStop(0,'#ffa0a8'); gr.addColorStop(1,'#d8283a'); }
  ctx.fillStyle = gr; roundRect(X(x-w/2), X(y), X(w*frac), X(h), X(h/2)); ctx.fill();
}
function roundRect(x,y,w,h,r){ r = Math.min(r, w/2, h/2); ctx.beginPath(); if(w<=0){ return; } ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r); ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath(); }
function drawProj(p){
  const total = Math.hypot(p.tx-p.sx, p.ty-p.sy) || 1, k = clamp(1 - Math.hypot(p.tx-p.x,p.ty-p.y)/total, 0, 1);
  const PIMG = {arrow:'px_arrow', tarrow:'px_arrow', firearrow:'px_firearrow', bolt:'px_bolt', cannon:'px_cannon', bomb:'px_bomb', orb:'px_orb', axe:'px_axe', dfire:'px_dfire', orbn:'px_orbn', orbi:'px_orbi', orbg:'px_orbg', orbr:'px_orbr', orbm:'px_orbm', rock:'px_rock'}[p.kind], pim = PIMG && imgFor(PIMG);
  if(pim){
    const round = /^orb/.test(p.kind), lob = p.kind==='bomb' ? Math.sin(k*Math.PI)*2.2 : p.kind==='rock' ? Math.sin(k*Math.PI)*2.6 : 0, len = X(p.kind==='bomb'||round ? 0.6 : p.kind==='axe' ? 0.6 : p.kind==='cannon' ? 0.5 : p.kind==='dfire' ? 1.0 : p.kind==='rock' ? 0.7 : p.kind==='firearrow' ? 1.0 : 0.85);
    if(lob){ ctx.globalAlpha=0.3; ctx.fillStyle='#000'; ctx.beginPath(); ctx.ellipse(X(p.x),X(p.y),X(0.2),X(0.08),0,0,TAU); ctx.fill(); ctx.globalAlpha=1; }
    ctx.save(); ctx.translate(X(p.x), X(p.y-lob));
    if(p.kind==='axe') ctx.rotate(p.t*18); else if(p.kind!=='bomb' && !round) ctx.rotate(p.ang);
    const h = len*pim.naturalHeight/pim.naturalWidth; ctx.drawImage(pim, -len/2, -h/2, len, h);
    ctx.restore(); ctx.globalAlpha = 1;
  }
  else if(p.kind==='arrow' || p.kind==='tarrow' || p.kind==='firearrow' || p.kind==='bolt'){
    const len = X(p.kind==='tarrow'||p.kind==='bolt'?0.75:0.6);
    ctx.save(); ctx.translate(X(p.x),X(p.y)); ctx.rotate(p.ang);
    ctx.strokeStyle = '#5a3416'; ctx.lineWidth = Math.max(1.5,TS*0.07); ctx.beginPath(); ctx.moveTo(-len,0); ctx.lineTo(0,0); ctx.stroke();
    ctx.fillStyle = p.kind==='firearrow' ? '#ffb020' : '#e8eef4'; ctx.beginPath(); ctx.moveTo(X(0.18),0); ctx.lineTo(-X(0.02),-X(0.08)); ctx.lineTo(-X(0.02),X(0.08)); ctx.fill();
    ctx.fillStyle = TEAM[p.side].main; ctx.fillRect(-len, -X(0.05), X(0.14), X(0.1));
    if(p.kind==='firearrow'){ ctx.globalAlpha=0.6; ctx.fillStyle='#ff7a00'; ctx.beginPath(); ctx.arc(X(0.1),0,X(0.16),0,TAU); ctx.fill(); }
    ctx.restore();
  } else if(p.kind==='axe'){
    ctx.save(); ctx.translate(X(p.x),X(p.y)); ctx.rotate(p.t*18); const s=X(0.28);
    ctx.strokeStyle='#5a3416'; ctx.lineWidth=Math.max(1.5,TS*0.07); ctx.beginPath(); ctx.moveTo(-s,0); ctx.lineTo(s,0); ctx.stroke();
    ctx.fillStyle='#d8dee6'; ctx.beginPath(); ctx.moveTo(s*0.4,-s*0.1); ctx.quadraticCurveTo(s*1.2,-s*0.9,s*1.1,s*0.6); ctx.closePath(); ctx.fill(); ctx.restore();
  } else if(p.kind==='rock'){
    const h = Math.sin(k*Math.PI)*3;
    ctx.globalAlpha=0.3; ctx.fillStyle='#000'; ctx.beginPath(); ctx.ellipse(X(p.x),X(p.y),X(0.3),X(0.12),0,0,TAU); ctx.fill(); ctx.globalAlpha=1;
    circS(X(p.x),X(p.y-h),X(0.32),'#8a8276','#3a342e');
  } else if(p.kind==='cannon'){
    circS(X(p.x),X(p.y),X(0.2),'#2a2a33','#000');
  } else if(p.kind==='bomb'){
    const h = Math.sin(k*Math.PI)*2.2;
    ctx.globalAlpha=0.3; ctx.fillStyle='#000'; ctx.beginPath(); ctx.ellipse(X(p.x),X(p.y),X(0.2),X(0.08),0,0,TAU); ctx.fill(); ctx.globalAlpha=1;
    circS(X(p.x),X(p.y-h),X(0.24),'#3a3a48','#000'); ctx.fillStyle='#ffd34d'; ctx.beginPath(); ctx.arc(X(p.x+0.15),X(p.y-h-0.22),X(0.07),0,TAU); ctx.fill();
  } else if(p.kind==='fireball' || p.kind==='barrel'){
    const h = Math.sin(k*Math.PI)*3;
    ctx.globalAlpha=0.3; ctx.fillStyle='#000'; ctx.beginPath(); ctx.ellipse(X(p.x),X(p.y),X(0.5*(0.5+k*0.5)),X(0.2*(0.5+k*0.5)),0,0,TAU); ctx.fill(); ctx.globalAlpha=1;
    if(p.kind==='barrel'){ ctx.save(); ctx.translate(X(p.x),X(p.y-h)); ctx.rotate(p.t*8); const s=X(1.1); const bim = imgFor('bombbarr'); if(bim) ctx.drawImage(bim, -s/2, -s/2, s, s); else { ctx.translate(-s/2,-s/2); ctx.scale(s/100,s/100); SPR.bombbarr(ctx); } ctx.restore(); }
    else { const g = ctx.createRadialGradient(X(p.x-0.15),X(p.y-h-0.15),1,X(p.x),X(p.y-h),X(0.65)); g.addColorStop(0,'#fffbe0'); g.addColorStop(0.4,'#ffb020'); g.addColorStop(1,'rgba(255,60,0,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(X(p.x),X(p.y-h),X(0.65),0,TAU); ctx.fill(); }
  } else {
    if(p.kind==='dfire'){ for(let i=0;i<2;i++) part('ember', p.x, p.y, {sp:0.6, life:0.3, size:0.13}); }
    const col = p.kind==='orbr' ? ['#fff0e0','#ff4a2a'] : p.kind==='dfire' ? ['#fff6b0','#ff7a1a'] : p.kind==='orbi' ? ['#ffffff','#7fd6ff'] : p.kind==='orbg' ? ['#e8fff0','#3fdc7a'] : p.kind==='orbn' ? ['#eaffef','#2bb35a'] : p.kind==='orbm' ? ['#ffffff','#d8d0ff'] : (p.side==='p' ? ['#ffffff','#6fd0ff'] : ['#ffffff','#ff9a4a']);
    const g = ctx.createRadialGradient(X(p.x),X(p.y),1,X(p.x),X(p.y),X(0.38)); g.addColorStop(0,col[0]); g.addColorStop(0.45,col[1]); g.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(X(p.x),X(p.y),X(0.38),0,TAU); ctx.fill();
  }
}
function circS(x,y,r,fill,stroke){ ctx.fillStyle=fill; ctx.beginPath(); ctx.arc(x,y,r,0,TAU); ctx.fill(); ctx.strokeStyle=stroke; ctx.lineWidth=1.5; ctx.stroke(); }
function drawFx(f){
  const k = f.t/f.life;
  if(f.k==='ring'){ ctx.globalAlpha = (1-k)*0.9; ctx.strokeStyle = f.col; ctx.lineWidth = Math.max(1.5, X(0.14)*(1-k)); ctx.beginPath(); ctx.ellipse(X(f.x),X(f.y),X(f.r0+(f.r1-f.r0)*k),X((f.r0+(f.r1-f.r0)*k)*0.6),0,0,TAU); ctx.stroke(); }
  else if(f.k==='flash'){ ctx.globalAlpha = (1-k)*0.55; const g=ctx.createRadialGradient(X(f.x),X(f.y),1,X(f.x),X(f.y),X(f.r)); g.addColorStop(0,'#fff'); g.addColorStop(0.4,f.col); g.addColorStop(1,'rgba(0,0,0,0)'); ctx.fillStyle=g; ctx.beginPath(); ctx.ellipse(X(f.x),X(f.y),X(f.r),X(f.r*0.7),0,0,TAU); ctx.fill(); }
  else if(f.k==='bolt'){ const r = mulberry32(Math.floor(f.seed*1e6)+Math.floor(f.t*30)); ctx.globalAlpha = 1-k; ctx.strokeStyle='#fff'; ctx.shadowColor='#6fd0ff'; ctx.shadowBlur=12; ctx.lineWidth=Math.max(2,X(0.12));
    ctx.beginPath(); let x=f.x+(r()-0.5)*2, y=f.y-9; ctx.moveTo(X(x),X(y)); while(y<f.y){ y+=0.9; x+=(r()-0.5)*0.9; if(y>f.y){ y=f.y; x=f.x; } ctx.lineTo(X(x),X(y)); } ctx.stroke(); ctx.shadowBlur=0; }
  else if(f.k==='stars'){ const r = mulberry32(Math.floor(f.seed*1e6)); ctx.globalAlpha = Math.min(1,(1-k)*2);
    for(let i=0;i<9;i++){ const ox=(r()-0.5)*f.r*1.6, oy=(r()-0.5)*f.r, d=clamp(k*1.6-r()*0.6,0,1), sx=f.x+ox+3*(1-d), sy=f.y+oy-7*(1-d);
      ctx.strokeStyle='rgba(255,246,200,0.7)'; ctx.lineWidth=Math.max(1.5,X(0.08)); ctx.beginPath(); ctx.moveTo(X(sx+1.2),X(sy-2.6)); ctx.lineTo(X(sx),X(sy)); ctx.stroke();
      const sim = imgFor('fx_estrella'); if(sim){ const w = X(0.9), h = w*sim.naturalHeight/sim.naturalWidth; ctx.drawImage(sim, X(sx)-w*0.8, X(sy)-h*0.7, w, h); } else { ctx.fillStyle='#fffbe0'; ctx.beginPath(); ctx.arc(X(sx),X(sy),X(0.16),0,TAU); ctx.fill(); } } }
  else if(f.k==='seq'){ const n=f.keys.length, i=Math.min(n-1, Math.floor(k*n)), im=imgFor(f.keys[i]); if(im){ ctx.globalAlpha = i===n-1 ? Math.min(1,(1-k)*n) : 1; const w=X(f.r*2), h=w*im.naturalHeight/im.naturalWidth; ctx.drawImage(im, X(f.x)-w/2, X(f.y)-h*(f.ay||0.6), w, h); } }
  else if(f.k==='img'){ const im = imgFor(f.key); if(im){ ctx.globalAlpha = f.still ? Math.min(1,(1-k)*2) : 1-k; const w = X(f.r*2*(f.still ? 1 : 0.6+k*0.6)), h = w*im.naturalHeight/im.naturalWidth; ctx.drawImage(im, X(f.x)-w/2, X(f.y - (f.rise||0)*k)-h*0.6, w, h); } }
  else if(f.k==='warn'){ ctx.globalAlpha = 0.35 + 0.35*Math.sin(f.t*18); ctx.fillStyle = '#ff5010'; ctx.beginPath(); ctx.ellipse(X(f.x),X(f.y),X(f.r),X(f.r*0.6),0,0,TAU); ctx.fill(); ctx.globalAlpha = 0.9; ctx.strokeStyle='#ffe070'; ctx.lineWidth = Math.max(1.5,X(0.08)); ctx.setLineDash([X(0.25),X(0.15)]); ctx.stroke(); ctx.setLineDash([]); }
  else if(f.k==='cloud'){ ctx.globalAlpha = Math.min(1,k*3)*0.6; ctx.fillStyle='#2a2440'; ctx.beginPath(); ctx.ellipse(X(f.x),X(f.y),X(f.r),X(f.r*0.6),0,0,TAU); ctx.fill(); }
  ctx.globalAlpha = 1;
}
function drawPart(p){
  const k = p.t/p.life;
  if(p.kind==='spark'){ ctx.globalAlpha=1-k; ctx.fillStyle=p.col||'#fff'; ctx.beginPath(); ctx.arc(X(p.x),X(p.y),X(p.size*(1-k*0.5)),0,TAU); ctx.fill(); }
  else if(p.kind==='ember'){ ctx.globalAlpha=1-k; ctx.fillStyle = k<0.3?'#fff4b0':k<0.6?'#ffb020':'#ff4a10'; ctx.beginPath(); ctx.arc(X(p.x),X(p.y),X((p.size||0.15)*(1.2-k)),0,TAU); ctx.fill(); }
  else if(p.kind==='smoke'||p.kind==='dust'){ ctx.globalAlpha=(1-k)*(p.kind==='smoke'?0.45:0.55); ctx.fillStyle=p.kind==='smoke'?'#e8e4f0':'#e8d8b0'; ctx.beginPath(); ctx.arc(X(p.x),X(p.y),X(p.size*(0.6+k)),0,TAU); ctx.fill(); }
  else if(p.kind==='debris'){ ctx.globalAlpha=Math.min(1,(1-k)*3); ctx.fillStyle=p.col; ctx.save(); ctx.translate(X(p.x),X(p.y-p.z*0.25)); ctx.rotate(p.t*6); ctx.fillRect(-X(p.size),-X(p.size),X(p.size*2),X(p.size*2)); ctx.restore(); }
  else if(p.kind==='heal'){ ctx.globalAlpha=1-k; ctx.fillStyle='#5aff8f'; const s=X(0.12); ctx.fillRect(X(p.x)-s/2,X(p.y)-s*1.5,s,s*3); ctx.fillRect(X(p.x)-s*1.5,X(p.y)-s/2,s*3,s); }
  else if(p.kind==='text'){ ctx.globalAlpha=1-k; ctx.font=`900 ${X(p.dmg?(p.big?0.5:0.36):0.5)}px Nunito`; ctx.textAlign='center'; ctx.fillStyle=p.col; ctx.strokeStyle='#000'; ctx.lineWidth=3; ctx.strokeText(p.txt,X(p.x),X(p.y)); ctx.fillText(p.txt,X(p.x),X(p.y)); }
  ctx.globalAlpha = 1;
}

// ================= INTERFAZ DE BATALLA =================
let sel = -1, ptr = null, dragging = false, moved = false, downXY = null, toggleOff = false, running = false, lastT = 0;
// Símbolos de carta: a qué ataca y cómo se mueve
function cardTags(c){
  let atk;
  if(c.spell) atk = c.allyBuff ? (c.allyBuff.heal ? {i:'💚', t:'Cura a tus tropas'} : {i:'💪', t:'Refuerza a tus tropas'}) : {i:'✨', t:'Hechizo: daña en un área, aire y tierra'};
  else if(c.building && c.dmg<=0 && !c.dmgAura && !c.heal) atk = {i:'🛡️', t:'No ataca: atrae y frena a los enemigos'};
  else if(c.repairer) atk = {i:'🔧', t:'No ataca: repara tus torres'};
  else if(c.dmg<=0 && !c.kamikaze) atk = {i:'💚', t:'No ataca: apoya a tus tropas'};
  else if(c.targets==='buildings') atk = {i:'🏰', t:'Ataca solo edificios y torres'};
  else if(c.range>1.5 || c.air) atk = {i:'🎯', t:'Ataca a tropas de aire y tierra'};
  else atk = {i:'⚔️', t:'Ataca solo a tropas de tierra'};
  let mov = null;
  if(c.air) mov = {i:'🪽', t:'Vuela: cruza el río por donde quiere y el cuerpo a cuerpo no le alcanza'};
  else if(c.leap) mov = {i:'🦘', t:'Salta el río por cualquier sitio'};
  else if(c.building) mov = {i:'🧱', t:'Edificio: no se mueve'};
  else if(c.stealth) mov = {i:'👻', t:'Invisible: nadie la ataca hasta que golpea'};
  return {atk, mov};
}
const TAG_IMG = {'⚔️':'tag_cuerpo','🎯':'tag_distancia','🏰':'tag_edificios','🪽':'tag_aire','🦘':'tag_salto','🧱':'tag_edificio','✨':'tag_hechizo','💪':'tag_refuerzo','🔧':'tag_repair'};
function artHtml(key, fallback, size='1.15em'){ const src = typeof ART_SRC!=='undefined' && ART_SRC[key]; return src ? `<img src="${src}" alt="" style="width:${size};height:${size};object-fit:contain;vertical-align:middle">` : fallback; }
const tagIc = (i, size) => TAG_IMG[i] ? artHtml(TAG_IMG[i], i, size) : i;
function cardEl(card, opts={}){
  const c = CARDS[card.key], d = document.createElement('div');
  d.className = 'card ' + (c.spell && c.rar!==2 ? 'sp' : c.rar===2 ? 'r2' : c.rar===1 ? 'r1' : '') + (opts.mini?' mini':'') + (opts.big?' big':'');
  const tg = cardTags(c);
  d.innerHTML = `<div class="cost">${c.cost}</div><div class="art"><img src="${cardArt(card.key)}" alt=""></div><div class="nm">${c.name}</div>${card.lvl>1?`<div class="lv">Nv${card.lvl}</div>`:''}`
    + `<div class="tags">${tg.mov?`<span title="${tg.mov.t}">${tagIc(tg.mov.i)}</span>`:''}<span title="${tg.atk.t}">${tagIc(tg.atk.i)}</span></div>`;
  return d;
}
function renderHand(){
  const h = $('hand'); h.innerHTML = ''; h.classList.toggle('h5', !!B.p.heroCard);
  B.p.hand.forEach((card,i)=>{
    const d = cardEl(card); d.dataset.i = i;
    const ib = document.createElement('div'); ib.className = 'ibtn'; ib.textContent = 'i';
    ib.addEventListener('pointerdown', ev=>{ ev.stopPropagation(); ev.preventDefault(); dragging = false; SFX.click(); cardInfo(card); });
    d.appendChild(ib);
    d.addEventListener('pointerdown', ev=>{ ev.preventDefault(); if(!running||B.over) return; SFX.select();
      toggleOff = sel===i; sel = i; dragging = true; moved = false; downXY = [ev.clientX, ev.clientY]; refreshCards(); });
    h.appendChild(d);
  });
  if(B.p.heroCard){ const card = B.p.heroCard, d = cardEl(card); d.dataset.i = 4; d.classList.add('hero');
    const ib = document.createElement('div'); ib.className = 'ibtn'; ib.textContent = 'i';
    ib.addEventListener('pointerdown', ev=>{ ev.stopPropagation(); ev.preventDefault(); dragging = false; SFX.click(); cardInfo(card); }); d.appendChild(ib);
    d.addEventListener('pointerdown', ev=>{ ev.preventDefault(); if(!running||B.over) return; SFX.select(); toggleOff = sel===4; sel = 4; dragging = true; moved = false; downXY = [ev.clientX, ev.clientY]; refreshCards(); });
    h.appendChild(d); }
  const n = $('nextCard'); n.innerHTML = ''; if(B.p.queue[0]) n.appendChild(cardEl(B.p.queue[0], {mini:true}));
  refreshCards();
}
let lastCostKey = '';
function refreshCards(){
  const els = $('hand').children;
  for(let i=0;i<els.length;i++){ const card = handCard(+els[i].dataset.i); if(!card) continue; const cost = cardCost('p', card);
    els[i].classList.toggle('off', B.p.elixir < cost); els[i].classList.toggle('sel', i===sel);
    const ce = els[i].querySelector('.cost'); if(ce.textContent != cost) ce.textContent = cost; }
}
function toTile(ev){ const r = cv.getBoundingClientRect(); const x=(ev.clientX-r.left-OX)/TS, y=(ev.clientY-r.top)/TS; return (x>=0&&y>=-1&&x<=W&&y<=H) ? {x, y:Math.max(0.5,y)} : null; }
function tryPlay(pt){
  const card = handCard(sel); if(!card) return;
  if(!validDrop('p', card.key, pt.x, pt.y)){ toast('Solo en tu mitad del campo'); SFX.bad(); return; }
  if(B.p.elixir < cardCost('p',card)){ toast('¡Falta elixir!'); SFX.bad(); return; }
  playCard('p', sel, pt.x, pt.y); sel = -1; refreshCards();
}
window.addEventListener('pointermove', ev=>{ if(!running) return; ptr = toTile(ev); if(dragging && downXY && Math.hypot(ev.clientX-downXY[0], ev.clientY-downXY[1])>12) moved = true; });
window.addEventListener('pointerup', ev=>{
  if(!dragging) return; dragging = false;
  const pt = toTile(ev);
  if(moved && pt && sel>=0 && running && !B.over && pt.y<=H) tryPlay(pt);
  else if(!moved && toggleOff){ sel = -1; refreshCards(); }
  if(ev.pointerType!=='mouse') ptr = null;
});
cv.addEventListener('pointerdown', ev=>{ if(!running||dragging||B.over) return; const pt = toTile(ev); ptr = pt; if(sel>=0 && pt) tryPlay(pt); });
function setCrowns(){
  const svg = c => 'url("data:image/svg+xml,' + encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 22'><path d='M2 17 L2 5 L7 10 L12 2 L17 10 L22 5 L22 17 Z' fill='${c}' stroke='black' stroke-width='1.5' stroke-linejoin='round'/><rect x='2' y='16' width='20' height='5' rx='1' fill='${c}' stroke='black' stroke-width='1.5'/></svg>`) + '")';
  for(const [id,side,col] of [['pCrowns','p','#5aa7ff'],['eCrowns','e','#ff5a6a']]){ const is = $(id).children; const ck = side==='p' ? 'ui_crown_p' : 'ui_crown_e'; for(let i=0;i<3;i++){ is[i].style.backgroundImage = ART_SRC[ck] ? `url("${ART_SRC[ck]}")` : svg(col); const on = B[side].crowns>i; if(on && !is[i].classList.contains('on')) is[i].classList.add('on'); if(!on) is[i].classList.remove('on'); } }
}
let bannerT = 0;
function banner(txt, sub, dur){ const b = $('banner'); b.innerHTML = txt + (sub?`<small>${sub}</small>`:''); b.classList.add('on'); clearTimeout(bannerT); bannerT = setTimeout(()=>b.classList.remove('on'), dur*1000); }
let toastT = 0;
function toast(m, ms=1200){ const t=$('toast'); t.textContent=m; t.style.opacity=1; clearTimeout(toastT); toastT=setTimeout(()=>t.style.opacity=0,ms); }
function updHUD(){
  const el = B.p.elixir; $('efill').style.width = (el*10)+'%'; $('enum').textContent = Math.floor(el);
  const t = Math.max(0, Math.ceil(B.time)); $('timer').textContent = `${t/60|0}:${String(t%60).padStart(2,'0')}`;
  $('timer').style.color = (B.overtime || B.time<=DOUBLE_AT) ? '#ffcf4a' : '#fff';
  $('tlabel').textContent = B.enc.mode==='treasure' ? 'CÁMARA DEL TESORO' : B.overtime ? 'MUERTE SÚBITA' : B.time<=DOUBLE_AT ? 'ELIXIR ×2' : '';
  if(B.enc.mode==='treasure'){ const pt=`🪙 ${B.gold.p}`, et=`🪙 ${B.gold.e}`; if($('pCrowns').textContent!==pt){ $('pCrowns').textContent=pt; } if($('eCrowns').textContent!==et){ $('eCrowns').textContent=et; } }
  refreshCards();
}

// ================= CAPA ROGUELITE =================
let RUN = null;
const ROWS = 15, MID_ROW = 7;
const nRows = () => (RUN && RUN.map) ? RUN.map.length : ROWS;
const diffRow = r => r * 9 / (nRows()-1);   // escala la dificultad al largo del mapa
const NODE_T = {
  battle:{ic:'⚔️', col:'#5b6fc0', name:'Batalla'},
  elite: {ic:'💀', col:'#b0384a', name:'Élite'},
  rest:  {ic:'🔥', col:'#d9822b', name:'Hoguera'},
  shop:  {ic:'🛒', col:'#2f9e6a', name:'Tienda'},
  event: {ic:'❓', col:'#7a5ac4', name:'Evento'},
  boss:  {ic:'👑', col:'#c49a1a', name:'Jefe'},
  mboss: {ic:'👹', col:'#8a2a5a', name:'Jefe intermedio'},
  treasure:{ic:'💰', col:'#d9a520', name:'Tesoro'},
};
const RELIC_EMOJI = {heart:'❤️',hourglass:'⏳',chalice:'🏆',skull:'☠️',hammer:'🔨',feather:'🪶',boots:'👢',wall:'🧱',bow:'🏹',purse:'💰',phoenix:'🔥',crystal:'💎',flame:'☄️',bolt:'⚡',shield:'🛡️',drop:'💧',anvil:'⚒️',crown:'👑',anvil2:'🔱'};
const relicIc = id => artHtml('rel_'+RELICS[id].ic, RELIC_EMOJI[RELICS[id].ic] || '✨', '1.35em');
const facIc = (fk, size='1em') => artHtml('emb_'+fk, (FACTIONS[fk]||{ic:'⚔️'}).ic, size);
const nodeIc = (type, size) => artHtml('nodo_'+type, NODE_T[type].ic, size);
const FUSIONS = Object.keys(CARDS).filter(k=>CARDS[k].rar===2);
const facFusions = f => FUSIONS.filter(k=>facOf(k)===f);
const myFac = () => (RUN && RUN.faction) || 'human';
const baseName = () => FACTIONS[myFac()].base;
const BaseName = () => { const s = baseName(); return s.charAt(0).toUpperCase()+s.slice(1); };
const todayStr = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
function seeded(salt){ return mulberry32((RUN.seed*2654435761 + salt*97 + 12345)>>>0); }

// ---------- nueva partida ----------
function newRun(daily, faction='human', hero=null){
  const seed = daily ? hashStr('daily'+todayStr()) : (Math.random()*2**31)>>>0;
  const maxHp = 2400 + 200*(META.upg.hp||0);
  RUN = {seed, daily, faction, date: daily?todayStr():null, pos:null, map:null, hp:maxHp, maxHp, gold:40 + 30*(META.upg.gold||0),
    deck:FACTIONS[faction].starter.map(k=>({key:k,lvl:1})),
    hero: hero || Object.keys(HEROES).find(h=>HEROES[h].fac===faction), relics:[], phoenixUsed:false, stats:{battles:0, elites:0, crowns:0, fusions:0, floors:0, kills:0}, over:false};
  RNG = seeded(1);
  RUN.map = genMap();
  if(META.upg.relic){ RNG = seeded(2); addRelic(pick(Object.keys(RELICS).filter(r=>r!=='phoenix'))); }
  META.runs++; saveRun();
  showMap();
}
function hashStr(s){ let h=2166136261; for(let i=0;i<s.length;i++){ h^=s.charCodeAt(i); h=Math.imul(h,16777619); } return h>>>0; }
function saveRun(){ META.run = RUN && !RUN.over ? RUN : null; saveMeta(); }

function genMap(){
  const rows = [];
  const Z2 = rnd()<0.5 ? 'snow' : 'desert', Z3 = rnd()<0.5 ? 'grave' : 'volcanic';
  for(let r=0;r<ROWS;r++){
    const n = r===0 ? 3 : (r===ROWS-1 || r===MID_ROW) ? 1 : rint(2,4);
    const row = [];
    for(let i=0;i<n;i++){
      let type;
      if(r===0) type='battle'; else if(r===ROWS-1) type='boss'; else if(r===MID_ROW) type='mboss'; else if(r===ROWS-2 || r===MID_ROW-1 && i===0) type='rest';
      else { const w = [['battle',42],['event',15],['rest',r>=2?12:0],['shop',r>=2?11:0],['elite',r>=3?14:0],['treasure',r>=3&&r<=ROWS-3?8:0]]; let tot=w.reduce((a,b)=>a+b[1],0), x=rnd()*tot; type=w.find(e=>(x-=e[1])<0)[0]; }
      const x = n===1 ? 0.5 : 0.14 + 0.72*(i/(n-1)) + (rnd()-0.5)*0.08;
      let weather = 'clear';
      if((type==='battle'||type==='elite'||type==='mboss') && r>=2){ const w = rnd(); weather = w<0.22 ? 'rain' : w<0.4 ? 'fog' : 'clear'; }
      let ter = 'river';
      if((type==='battle'||type==='elite'||type==='mboss') && r>=2){ const pool = ['river','river','forest','canyon','ice','volcano','swamp']; ter = pool[Math.floor(rnd()*pool.length)]; }
      const biome = r<5 ? 'grass' : r<10 ? Z2 : Z3;
      if(biome==='snow' && (weather==='rain' || (weather==='clear' && (type==='battle'||type==='elite'||type==='mboss') && rnd()<0.3))) weather = 'snow';
      row.push({type, x, links:[], done:false, weather, terrain:ter, biome});
    }
    rows.push(row);
  }
  for(let r=0;r<ROWS-1;r++){
    const a = rows[r], b = rows[r+1];
    a.forEach((nd,i)=>{
      const target = b.length===1 ? 0 : Math.round(i/(Math.max(1,a.length-1))*(b.length-1));
      nd.links.push(target);
      if(b.length>1 && rnd()<0.45){ const alt = clamp(target + (rnd()<0.5?-1:1), 0, b.length-1); if(!nd.links.includes(alt)) nd.links.push(alt); }
    });
    b.forEach((nd,j)=>{ if(!a.some(n=>n.links.includes(j))){ let bi=0, bd=9; a.forEach((n,i)=>{ const d=Math.abs(n.x-nd.x); if(d<bd){ bd=d; bi=i; } }); a[bi].links.push(j); } });
  }
  // asegura variedad: si una fila intermedia solo tiene batallas, convierte una en evento
  for(let r=2;r<ROWS-2;r++) if(r!==MID_ROW && rows[r].every(n=>n.type==='battle')) rows[r][rint(0,rows[r].length-1)].type = r%2?'shop':'event';
  return rows;
}

// ---------- mapa ----------
function availableNodes(){
  if(!RUN.pos) return RUN.map[0].map((_,i)=>[0,i]);
  const cur = RUN.map[RUN.pos[0]][RUN.pos[1]];
  if(RUN.pos[0]>=nRows()-1) return [];
  return cur.links.map(j=>[RUN.pos[0]+1, j]);
}
function showMap(){
  { const lg = document.querySelector('.legend'); if(lg) lg.innerHTML = [['battle','Batalla'],['elite','Élite'],['rest','Hoguera'],['shop','Tienda'],['event','Evento'],['treasure','Tesoro'],['mboss','Jefe int.'],['boss','Jefe']].map(([t,n])=>`<span>${nodeIc(t,'1.3em')} ${n}</span>`).join(''); }
  showScreen('map');
  $('mHp').innerHTML = `❤️ ${Math.ceil(RUN.hp)}<span style="opacity:.6;font-size:12px">/${RUN.maxHp}</span>`;
  $('mGold').textContent = `🪙 ${RUN.gold}`;
  $('mDeckN').textContent = `(${RUN.deck.length})`;
  renderRelicBar($('mRelics'));
  const fl = RUN.pos ? RUN.pos[0]+2 : 1;
  const NR = nRows();
  $('mInfo').innerHTML = (RUN.hero ? `<span style="vertical-align:middle">${heroPortrait(RUN.hero,26)}</span> ` : '') + (fl>NR ? '' : `Piso <b style="color:var(--gold)">${Math.min(fl,NR)}</b> de ${NR} · Toca un punto brillante para avanzar`);
  if(!META.mapTut){ META.mapTut = true; saveMeta(); setTimeout(()=>{ if(curScreen==='map') mapHelp(); }, 350); }
  const inner = $('mapInner'), sc = $('mapScroll');
  const rowH = 96, Hh = NR*rowH + 70;
  inner.style.height = Hh+'px';
  if(ART_SRC._map_bg){ sc.style.backgroundSize = `auto ${Hh}px`; sc.style.backgroundRepeat = 'no-repeat'; sc.style.backgroundPosition = 'center top'; }
  inner.querySelectorAll('.node').forEach(n=>n.remove());
  const Wd = sc.clientWidth || 360;
  const pos = (r,i) => { const nd = RUN.map[r][i]; return [nd.x*Wd, Hh - 50 - r*rowH]; };
  // líneas
  let svg = '';
  const avail = availableNodes(), isAvail = (r,i) => avail.some(a=>a[0]===r&&a[1]===i);
  const path = RUN.path || [];
  for(let r=0;r<NR-1;r++) RUN.map[r].forEach((nd,i)=>{ nd.links.forEach(j=>{
    const [x1,y1] = pos(r,i), [x2,y2] = pos(r+1,j);
    const taken = path.some((p,k)=>p[0]===r&&p[1]===i && path[k+1] && path[k+1][0]===r+1 && path[k+1][1]===j);
    const next = RUN.pos && RUN.pos[0]===r && RUN.pos[1]===i;
    svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${taken?'#ffcf4a':next?'#ffffffcc':'#ffffff40'}" stroke-width="${taken?5:next?4:3}" stroke-dasharray="${taken?'':'7 7'}" stroke-linecap="round"/>`;
  }); });
  $('mapSvg').innerHTML = svg;
  $('mapSvg').setAttribute('viewBox', `0 0 ${Wd} ${Hh}`);
  for(let r=0;r<NR;r++) RUN.map[r].forEach((nd,i)=>{
    const [x,y] = pos(r,i), T = NODE_T[nd.type], el = document.createElement('div');
    const isCur = RUN.pos && RUN.pos[0]===r && RUN.pos[1]===i;
    el.className = 'node' + (nd.done?' done':'') + (isAvail(r,i)?' avail':'') + (!nd.done&&!isAvail(r,i)?' locked':'') + (isCur?' cur':'');
    el.style.left = x+'px'; el.style.top = y+'px'; el.style.setProperty('--nc', T.col);
    if(nd.type==='boss'||nd.type==='mboss'){ el.style.width = el.style.height = nd.type==='boss'?'76px':'66px'; el.style.margin = nd.type==='boss'?'-38px 0 0 -38px':'-33px 0 0 -33px'; }
    const wIc = nd.weather==='rain' ? '🌧️' : nd.weather==='fog' ? '🌫️' : nd.weather==='snow' ? artHtml('wx_snowicon','❄️','1em') : '';
    const TR = nd.terrain && nd.terrain!=='river' ? TERRAINS[nd.terrain] : null;
    el.innerHTML = `<span style="font-size:${nd.type==='boss'?36:nd.type==='mboss'?31:26}px">${nodeIc(nd.type,'1.25em')}</span>` + (wIc?`<span class="wbadge">${wIc}</span>`:'') + (TR?`<span class="wbadge tbadge">${TR.ic}</span>`:'') + (isAvail(r,i)?`<span class="lbl">${T.name}${TR?' · '+TR.name:''}${wIc?' · '+(nd.weather==='rain'?'Lluvia':'Niebla'):''}</span>`:'');
    el.onclick = () => { if(isAvail(r,i)){ SFX.click(); enterNode(r,i); } };
    inner.appendChild(el);
  });
  const focusRow = RUN.pos ? RUN.pos[0]+1 : 0;
  requestAnimationFrame(()=>{ sc.scrollTop = Math.max(0, Hh - 50 - focusRow*rowH - sc.clientHeight*0.6); });
  saveRun();
}
function renderRelicBar(el){
  el.innerHTML = '';
  RUN.relics.forEach(id=>{ const d = document.createElement('div'); d.className='relic sm'; d.innerHTML = `<span style="font-size:17px">${relicIc(id)}</span>`;
    d.onclick = () => infoModal(`<div class="relic"><span style="font-size:32px">${relicIc(id)}</span></div><h2 class="f">${RELICS[id].name}</h2><div class="sub">${RELICS[id].desc}</div>`);
    el.appendChild(d); });
}
function enterNode(r,i,resume=false){
  if(!resume){ RUN.pos = [r,i]; RUN.path = (RUN.path||[]); RUN.path.push([r,i]); }
  RUN.inNode = [r,i];
  const nd = RUN.map[r][i];
  RNG = seeded(1000 + r*31 + i);
  saveRun();
  if(nd.type==='battle'||nd.type==='elite'||nd.type==='boss'||nd.type==='mboss') goBattle(nd.type, r, {weather: nd.weather||'clear', terrain: nd.terrain||'river', biome: nd.biome||'grass'});
  else if(nd.type==='rest') showRest();
  else if(nd.type==='shop') showShop(nd);
  else if(nd.type==='event') showEvent();
  else if(nd.type==='treasure') goBattle('battle', r, {mode:'treasure', name:'💰 Cámara del Tesoro', subtitle:'¡Rompe más cofres que el rival!', weather:'clear'});
}
function completeNode(){
  const nd = RUN.map[RUN.pos[0]][RUN.pos[1]]; nd.done = true; RUN.inNode = null;
  RUN.stats.floors = Math.max(RUN.stats.floors, RUN.pos[0]+1);
  saveRun(); showMap();
}

// ---------- encuentros ----------
function makeEncounter(type, r0){
  const mboss = type==='mboss', elite = type==='elite' || mboss, boss = type==='boss';
  const r = diffRow(r0);
  let mult = 0.8 + 0.055*r, towerMul = 0.85 + 0.04*r, regen = 0.95 + 0.012*r, think = Math.max(0.55, 1.35 - 0.07*r), aggro = 9 - 0.15*r;
  if(elite){ mult *= 1.12; towerMul += 0.15; regen += 0.05; think *= 0.88; }
  if(mboss){ towerMul += 0.1; }
  if(boss){ mult = 1.22; towerMul = 1.3; regen = 1.12; think = 0.55; aggro = 7.5; }
  const lvl = boss ? 3 : mboss ? 2 : 1 + Math.floor(r/4) + (elite?1:0);

  const nFus = boss ? 3 : elite ? 2 : r>=4 ? 1 : 0;
  const ef = pick(otherFactions(myFac())), F = FACTIONS[ef];
  const base = shuffleR(F.cards.filter(k=>!CARDS[k].s2 || r0>=6));   // las cartas de temporada 2 aparecen en el rival a partir del piso 7
  const deck = [];
  shuffleR(facFusions(ef)).slice(0,nFus).forEach(k=>deck.push({key:k, lvl:Math.max(1,lvl-1)}));
  for(const k of base){ if(deck.length>=8) break; deck.push({key:k, lvl}); }
  let name, subtitle;
  if(boss){ name = F.boss; subtitle = '¡Jefe final!'; }
  else if(mboss){ const n = pick(F.elites); name = n[1]+' '+n[0]; subtitle = '¡Jefe intermedio! · Piso '+(r0+1); }
  else if(elite){ const n = pick(F.elites); name = n[1]+' '+n[0]; subtitle = 'Élite · Piso '+(r0+1); }
  else { const n = pick(F.names); name = n[1]+' '+n[0]; subtitle = 'Piso '+(r0+1); }
  return {type, row:r0, faction:ef, elite, mboss, boss, mult, towerMul, regen, think, aggro, deck, name, subtitle, towerDmg: boss?1.25:elite?1.1:1};
}
function goBattle(type, r, extra={}){
  const enc = Object.assign(makeEncounter(type, r), {seed:(rnd()*2**31)>>>0}, extra);
  running = true;
  startBattle(enc, res => afterBattle(enc, res));
}
function afterBattle(enc, res){
  if(enc.mode==='treasure') return showTreasureReward(enc, res);
  RUN.stats.crowns += res.crowns; RUN.stats.kills += res.stats.kills;
  let win = res.win, hp = res.kingHp;
  if(!win && hasRelic('phoenix') && !RUN.phoenixUsed){ RUN.phoenixUsed = true; win = true; hp = Math.ceil(RUN.maxHp*0.3); infoModal(`<div style="font-size:52px">🔥</div><h2 class="f">¡La Pluma de Fénix arde!</h2><div class="sub">Tu base renace con el 30% de vida.</div>`); }
  if(!win){ RUN.hp = 0; return endRun(false); }
  RUN.hp = Math.min(RUN.maxHp, Math.max(1,hp) + (hasRelic('regen')?150:0));
  RUN.stats.battles++; if(enc.elite) RUN.stats.elites++;
  if(hasRelic('seed')){ RUN.seedWins = (RUN.seedWins||0)+1; if(RUN.seedWins%3===0){ const up = RUN.deck.filter(c=>c.lvl<5); if(up.length){ const c = up[Math.floor(rnd()*up.length)]; c.lvl++; setTimeout(()=>toast('🌱 '+CARDS[c.key].name+' sube a nivel '+c.lvl), 800); } } }
  if(enc.boss){ RUN.stats.floors = nRows(); RUN.lastBoss = enc.name; return endRun(true); }
  if(enc.mboss){ const h = Math.round(RUN.maxHp*0.3); RUN.hp = Math.min(RUN.maxHp, RUN.hp + h); RUN.stats.mbosses = (RUN.stats.mbosses||0)+1; }
  showReward(enc, res);
}

// ---------- recompensas ----------
function showTreasureReward(enc, res){
  showScreen('reward');
  let gold = res.gold.p + (res.win ? 25 : 0); if(hasRelic('purse')) gold = Math.round(gold*1.3);
  RUN.gold += gold; RUN.stats.treasures = (RUN.stats.treasures||0) + 1;
  $('rwTitle').textContent = res.win ? '¡Botín ganado!' : 'Botín conseguido';
  $('rwSub').textContent = `Cofres: tú ${res.gold.p} de oro · rival ${res.gold.e}` + (res.win ? ' · +25 por ganar' : '');
  $('rwLoot').innerHTML = `<span class="pill">🪙 +${gold}</span><span class="pill">❤️ ${Math.ceil(RUN.hp)}/${RUN.maxHp}</span>`;
  setTimeout(()=>SFX.coin(), 200);
  $('rwRelicBox').style.display = 'none';
  const box = $('rwCards'); box.innerHTML = ''; let done = false;
  box.previousElementSibling.style.display = res.win ? '' : 'none';
  if(res.win){ rollCards(3, 0.3, enc.row).forEach(card=>{ const d = document.createElement('div'); d.className='choice'; d.appendChild(cardEl(card,{big:true}));
    const desc = document.createElement('div'); desc.className='desc'; desc.textContent = CARDS[card.key].desc; d.appendChild(desc);
    d.onclick = () => { if(done) return; done = true; RUN.deck.push(card); SFX.coin(); completeNode(); }; box.appendChild(d); }); }
  $('rwSkip').textContent = res.win ? 'Saltar carta' : 'Continuar';
  $('rwSkip').onclick = () => { if(!done){ done = true; completeNode(); } };
}
function cardPool(){ return FACTIONS[myFac()].cards.filter(k=>META.unlocked.includes(k)); }
function rollCards(n, fusionChance, r){
  const out = [], pool = cardPool();
  while(out.length<n){
    let key;
    if(rnd()<0.07) key = 'repair';
    else if(rnd()<fusionChance) key = pick(facFusions(myFac()).filter(f=>RECIPES.some(rc=>rc[2]===f && META.unlocked.includes(rc[0]) && META.unlocked.includes(rc[1]))));
    else { key = pick(pool); if(CARDS[key].rar===1 && rnd()<0.35) key = pick(pool); }
    if(!key || out.some(o=>o.key===key)) continue;
    out.push({key, lvl: 1 + (r>=5 && rnd()<0.3 ? 1 : 0)});
  }
  return out;
}
function showReward(enc, res){
  showScreen('reward');
  $('rwTitle').innerHTML = artHtml('emb_victoria','', '1.4em') + ' ¡Victoria!'; $('rwSkip').textContent = 'Saltar carta'; $('rwCards').previousElementSibling.style.display = '';
  let gold = rint(14,22) + Math.round(diffRow(enc.row)*2); if(enc.elite) gold *= 2; if(enc.mboss) gold = Math.round(gold*1.4);
  if(hasRelic('purse')) gold = Math.round(gold*1.3);
  if(hasRelic('greed')) gold += 15*res.crowns;
  if(res.comeback){ gold = Math.round(gold*1.5); RUN.stats.comebacks = (RUN.stats.comebacks||0)+1; }
  RUN.gold += gold;
  $('rwSub').textContent = `${enc.name} derrotados · ${res.crowns} ${res.crowns===1?'corona':'coronas'}` + (enc.mboss ? ' · ❤️ +30% de vida' : '');
  $('rwLoot').innerHTML = (res.comeback?`<span class="pill" style="border-color:#ff8a30;color:#ffb070">🔥 ¡Remontada épica! ×1,5</span>`:'') + `<span class="pill">🪙 +${gold}</span><span class="pill">❤️ ${Math.ceil(RUN.hp)}/${RUN.maxHp}</span>`;
  $('rwLoot').style.flexWrap='wrap';
  setTimeout(()=>SFX.coin(), 200);
  // reliquias en élites
  const rb = $('rwRelicBox'), rl = $('rwRelics');
  rl.innerHTML = ''; rb.style.display = 'none';
  let relicPicked = !enc.elite;
  if(enc.elite){
    const opts = shuffleR(Object.keys(RELICS).filter(k=>!RUN.relics.includes(k))).slice(0, enc.mboss ? 3 : 2);
    if(!opts.length) relicPicked = true;
    if(opts.length){ rb.style.display = 'block'; relicPicked = false;
      opts.forEach(id=>{ const d = document.createElement('div'); d.className='choice';
        d.innerHTML = `<div class="relic"><span style="font-size:30px">${relicIc(id)}</span></div><b style="font-size:12px">${RELICS[id].name}</b><div class="desc">${RELICS[id].desc}</div>`;
        d.onclick = () => { if(relicPicked) return; relicPicked = true; addRelic(id); SFX.forge(); d.style.transform='scale(1.1)'; [...rl.children].forEach(c=>{ if(c!==d) c.style.opacity=0.25; }); };
        rl.appendChild(d); }); } }
  const n = META.upg.choice ? 4 : 3;
  const cards = rollCards(n, enc.mboss?0.6:enc.elite?0.35:0.12, diffRow(enc.row));
  const box = $('rwCards'); box.innerHTML = '';
  let done = false;
  const finish = () => { if(!relicPicked){ toast('Elige primero una reliquia'); SFX.bad(); return false; } done = true; completeNode(); return true; };
  cards.forEach(card=>{ const d = document.createElement('div'); d.className='choice';
    const ce = cardEl(card,{big:true}); d.appendChild(ce);
    const desc = document.createElement('div'); desc.className='desc'; desc.textContent = CARDS[card.key].desc; d.appendChild(desc);
    d.onclick = () => { if(done) return; if(!relicPicked){ toast('Elige primero una reliquia'); SFX.bad(); return; } RUN.deck.push(card); SFX.coin(); finish(); };
    box.appendChild(d); });
  $('rwSkip').onclick = () => { if(!done) finish(); };
}
function addRelic(id){
  if(RUN.relics.includes(id)) return;
  RUN.relics.push(id);
  if(id==='heart'){ RUN.maxHp += 500; RUN.hp = Math.min(RUN.maxHp, RUN.hp+500); }
}

// ---------- forja ----------
function fusionResult(a, b){
  if(a.key===b.key){ if(Math.max(a.lvl,b.lvl)>=5) return null; return {key:a.key, lvl:Math.max(a.lvl,b.lvl)+1, kind:'up'}; }
  const k = recipeFor(a.key, b.key);
  if(!k) return null;
  return {key:k, lvl:Math.max(a.lvl,b.lvl) + (hasRelic('forgeR')?1:0), kind:'fuse'};
}
function forgeUI(container, onDone){
  let A = -1, Bi = -1;
  const draw = () => {
    container.innerHTML = '';
    const box = document.createElement('div'); box.className = 'fuseBox';
    const slot = (idx, which) => { const s = document.createElement('div'); s.className = 'slot';
      if(idx>=0){ s.style.border='none'; s.appendChild(cardEl(RUN.deck[idx])); s.onclick = () => { if(which==='A') A=-1; else Bi=-1; SFX.click(); draw(); }; } else s.textContent = '+';
      return s; };
    box.appendChild(slot(A,'A'));
    box.insertAdjacentHTML('beforeend','<span class="f" style="font-size:26px">+</span>');
    box.appendChild(slot(Bi,'B'));
    box.insertAdjacentHTML('beforeend','<span class="f" style="font-size:26px">=</span>');
    const res = (A>=0&&Bi>=0) ? fusionResult(RUN.deck[A], RUN.deck[Bi]) : null;
    const rs = document.createElement('div'); rs.className = 'slot';
    if(res){ rs.style.border='none'; const known = res.kind==='up' || META.recipes.includes(res.key);
      if(known) rs.appendChild(cardEl(res)); else { rs.style.border='2px solid #c47bff'; rs.style.background='radial-gradient(circle,#c47bff55,transparent)'; rs.innerHTML='<span class="f" style="font-size:34px;color:#e6c4ff">?</span>'; } }
    else if(A>=0&&Bi>=0) rs.innerHTML = '<span style="font-size:24px">✖</span>';
    else rs.textContent = '?';
    box.appendChild(rs);
    container.appendChild(box);
    const info = document.createElement('div'); info.className='sub'; info.style.margin='4px 0 8px';
    info.innerHTML = res ? (res.kind==='up' ? `Dos cartas iguales se funden: <b>nivel ${res.lvl}</b>` : META.recipes.includes(res.key) ? `<b style="color:#e6c4ff">${CARDS[res.key].name}</b> · ${CARDS[res.key].desc}` : '<b style="color:#e6c4ff">¡Fusión desconocida!</b> Descubre qué sale…')
      : (A>=0&&Bi>=0) ? 'Estas cartas no combinan. Toca otra carta de abajo (las que brillan sí combinan).' : 'Elige dos cartas de tu mazo. Iguales suben de nivel; ciertas parejas crean tropas nuevas.';
    container.appendChild(info);
    // pista de fusiones posibles
    const possible = []; for(let i=0;i<RUN.deck.length;i++) for(let j=i+1;j<RUN.deck.length;j++){ const r = recipeFor(RUN.deck[i].key, RUN.deck[j].key); if(r && !possible.includes(r)) possible.push(r); }
    if(possible.length){ const h = document.createElement('div'); h.className='sub'; h.style.marginBottom='6px';
      const known = possible.filter(p=>META.recipes.includes(p)), unk = possible.length - known.length;
      h.innerHTML = `✨ Tu mazo puede crear: ${known.map(k=>`<b style="color:#e6c4ff">${CARDS[k].name}</b>`).join(', ')}${known.length&&unk?' y ':''}${unk?`<b style="color:#ffcf4a">${unk} fusi${unk>1?"ones":"ón"} secreta${unk>1?'s':''}</b>`:''}`; container.appendChild(h); }
    const btn = document.createElement('button'); btn.className='btn'; btn.textContent='¡Forjar!'; btn.disabled = !res; btn.style.marginBottom='10px';
    if(RUN.deck.length<=4 && res && res.kind==='fuse'){ btn.disabled = true; info.innerHTML += '<br><b style="color:#ff8a8a">Tu mazo necesita al menos 4 cartas.</b>'; }
    btn.onclick = () => doForge(A, Bi, res, onDone);
    container.appendChild(btn);
    if(A>=0||Bi>=0){ const cl = document.createElement('button'); cl.className='btn dark sm'; cl.textContent='↺ Vaciar'; cl.style.margin='0 0 10px 8px'; cl.onclick=()=>{ A=-1; Bi=-1; SFX.click(); draw(); }; container.appendChild(cl);
      const tip = document.createElement('div'); tip.className='sub'; tip.style.cssText='font-size:11px;opacity:.8;margin-bottom:6px'; tip.innerHTML='Las cartas que brillan combinan con la elegida: <b style="color:#ffcf4a">⬆ Nivel</b> (iguales) o <b style="color:#e6c4ff">✨ Fusión</b>. Toca una carta de arriba para quitarla.'; container.appendChild(tip); }
    const grid = document.createElement('div'); grid.className='gridCards';
    RUN.deck.forEach((card,i)=>{ if(i===A||i===Bi) return; const ce = cardEl(card);
      const base = A>=0 ? RUN.deck[A] : (Bi>=0 ? RUN.deck[Bi] : null);
      if(base){ const ok = base.key===card.key ? 'up' : recipeFor(base.key, card.key) ? 'fuse' : null;
        if(ok){ ce.style.boxShadow = ok==='up' ? '0 0 0 3px #ffcf4a, 0 0 14px #ffcf4a' : '0 0 0 3px #c47bff, 0 0 16px #c47bff'; ce.style.borderRadius='12px';
          ce.insertAdjacentHTML('beforeend', `<div style="position:absolute;top:-8px;right:-6px;background:${ok==='up'?'#ffcf4a':'#c47bff'};color:#1a1030;border-radius:10px;padding:1px 6px;font:900 11px Nunito;z-index:3">${ok==='up'?'⬆ Nivel':'✨ Fusión'}</div>`); if(getComputedStyle(ce).position==='static') ce.style.position='relative'; }
        else ce.style.opacity = '0.45'; }
      ce.onclick = () => { SFX.select(); if(A<0) A=i; else if(Bi<0) Bi=i; else { Bi=i; } draw(); };
      grid.appendChild(ce); });
    container.appendChild(grid);
  };
  draw();
}
function doForge(A, Bi, res, onDone){
  const isNew = res.kind==='fuse' && !META.recipes.includes(res.key);
  const idx = [A,Bi].sort((a,b)=>b-a); RUN.deck.splice(idx[0],1); RUN.deck.splice(idx[1],1);
  RUN.deck.push({key:res.key, lvl:res.lvl});
  if(res.kind==='fuse'){ RUN.stats.fusions++; if(isNew){ META.recipes.push(res.key); } }
  saveRun(); SFX.forge();
  const big = cardEl({key:res.key,lvl:res.lvl},{big:true}); big.style.transform='scale(1.5)'; big.style.margin='26px 0';
  const m = $('modalBody'); m.innerHTML = `<div style="font-size:13px;color:var(--gold);font-weight:900">${isNew?'¡NUEVA RECETA DESCUBIERTA!':res.kind==='up'?'¡CARTA MEJORADA!':'¡FUSIÓN COMPLETADA!'}</div>`;
  const glow = document.createElement('div'); glow.style.cssText='position:relative;display:flex;justify-content:center;animation:pop .5s'; glow.appendChild(big); m.appendChild(glow);
  m.insertAdjacentHTML('beforeend', `<h2 class="f">${CARDS[res.key].name} <span style="color:var(--gold)">Nv${res.lvl}</span></h2><div class="sub">${CARDS[res.key].desc}</div>`);
  const b = document.createElement('button'); b.className='btn'; b.textContent='¡Genial!'; b.onclick = () => { closeModal(); onDone(); }; m.appendChild(b);
  $('modal').classList.add('on');
}

// ---------- hoguera ----------
function showRest(){
  showScreen('rest');
  let tab = 'forge';
  const body = $('restBody');
  const tabs = $('restTabs').children;
  const draw = () => {
    [...tabs].forEach(b=>b.classList.toggle('on', b.dataset.t===tab));
    body.innerHTML = '';
    if(tab==='forge') forgeUI(body, completeNode);
    else if(tab==='heal'){ const amt = Math.round(RUN.maxHp*0.35);
      body.innerHTML = `<div style="display:flex;flex-direction:column;align-items:center;gap:14px;margin-top:30px"><div style="font-size:70px">${artHtml('ev_camp','🔥','120px')}</div><div class="sub" style="font-size:16px">${BaseName()} se repara y recupera <b style="color:var(--good)">${Math.min(amt, RUN.maxHp-Math.ceil(RUN.hp))}</b> de vida.<br>Vida actual: ${Math.ceil(RUN.hp)} / ${RUN.maxHp}</div></div>`;
      const b = document.createElement('button'); b.className='btn'; b.textContent='Descansar'; b.style.marginTop='18px'; b.disabled = RUN.hp>=RUN.maxHp;
      b.onclick = () => { RUN.hp = Math.min(RUN.maxHp, RUN.hp+amt); SFX.heal(); completeNode(); };
      body.firstChild.appendChild(b); }
    else { body.innerHTML = '<div class="sub" style="margin:10px 0">Elige una carta para subirla un nivel (+12% vida y daño).</div>';
      const grid = document.createElement('div'); grid.className='gridCards';
      RUN.deck.forEach((card)=>{ const ce = cardEl(card); if(card.lvl>=5){ ce.classList.add('off'); } else ce.onclick = () => { card.lvl++; SFX.forge(); toast(`${CARDS[card.key].name} sube a nivel ${card.lvl}`); completeNode(); }; grid.appendChild(ce); });
      body.appendChild(grid); }
  };
  [...tabs].forEach(b=>b.onclick = () => { SFX.click(); tab = b.dataset.t; draw(); });
  draw();
}

// ---------- tienda ----------
function showShop(nd){
  showScreen('shop');
  if(!nd.shop){
    const cards = rollCards(3, 0.3, diffRow(RUN.pos[0])).map(c=>({card:c, price: Math.round((CARDS[c.key].rar===2?115:CARDS[c.key].rar===1?70:48) + (c.lvl-1)*25 + rint(-6,6)), sold:false}));
    const relics = shuffleR(Object.keys(RELICS).filter(k=>!RUN.relics.includes(k))).slice(0,2).map(id=>({id, price:rint(105,155), sold:false}));
    cards.push({card:{key:pick(MERCS), lvl:1 + (diffRow(RUN.pos[0])>=5 ? 1 : 0)}, price:rint(82,98), sold:false, merc:true});
    nd.shop = {cards, relics, removed:false, up:false};
  }
  const S = nd.shop;
  const draw = () => {
    $('sGold').textContent = `🪙 ${RUN.gold}`;
    const sc = $('sCards'); sc.innerHTML = '';
    S.cards.forEach(it=>{ const d = document.createElement('div'); d.className='shopItem'+(it.sold?' sold':''); d.appendChild(cardEl(it.card));
      d.insertAdjacentHTML('beforeend', (it.merc ? `<div style="font-size:10px;font-weight:900;color:#ffcf4a">⚔️ Cazarrecompensas</div>` : '') + `<div class="price">🪙 ${it.price}</div>`);
      d.onclick = () => { if(RUN.gold<it.price){ toast('No tienes suficiente oro'); SFX.bad(); return; } RUN.gold-=it.price; it.sold=true; RUN.deck.push(it.card); SFX.coin(); saveRun(); draw(); };
      sc.appendChild(d); });
    const sr = $('sRelics'); sr.innerHTML = '';
    S.relics.forEach(it=>{ const d = document.createElement('div'); d.className='shopItem'+(it.sold?' sold':'');
      d.innerHTML = `<div class="relic"><span style="font-size:28px">${relicIc(it.id)}</span></div><b style="font-size:11px;text-align:center">${RELICS[it.id].name}</b><div class="desc" style="font-size:10px;color:var(--mut);text-align:center">${RELICS[it.id].desc}</div><div class="price">🪙 ${it.price}</div>`;
      d.onclick = () => { if(RUN.gold<it.price){ toast('No tienes suficiente oro'); SFX.bad(); return; } RUN.gold-=it.price; it.sold=true; addRelic(it.id); SFX.forge(); saveRun(); draw(); };
      sr.appendChild(d); });
    const sv = $('sServ'); sv.innerHTML = '';
    const serv = (ic, name, price, used, fn) => { const d = document.createElement('div'); d.className='shopItem'+(used?' sold':'');
      d.innerHTML = `<div class="relic" style="background:linear-gradient(180deg,#3a7a5a,#1f4a35);border-color:#8affc0"><span style="font-size:26px">${ic}</span></div><b style="font-size:11px;text-align:center">${name}</b><div class="price">🪙 ${price}</div>`;
      d.onclick = () => { if(RUN.gold<price){ toast('No tienes suficiente oro'); SFX.bad(); return; } fn(price); }; sv.appendChild(d); };
    serv('🗑️','Quitar una carta', 60, S.removed, price => { if(RUN.deck.length<=4){ toast('Tu mazo necesita al menos 4 cartas'); return; }
      pickCard('Quitar una carta','Esta carta desaparecerá de tu mazo.', i => { RUN.gold-=price; S.removed=true; RUN.deck.splice(i,1); SFX.click(); saveRun(); showScreen('shop'); draw(); }, () => showScreen('shop')); });
    serv('⬆️','Mejorar una carta', 70, S.up, price => {
      pickCard('Mejorar una carta','Sube un nivel (+12% vida y daño).', i => { if(RUN.deck[i].lvl>=5){ toast('Ya está al máximo'); return; } RUN.gold-=price; S.up=true; RUN.deck[i].lvl++; SFX.forge(); saveRun(); showScreen('shop'); draw(); }, () => showScreen('shop')); });
    serv('⚒️','Forjar', 50, S.forged, price => { showScreen('picker'); $('pkTitle').textContent='⚒️ Forja del Mercader'; $('pkSub').textContent='Funde dos cartas.'; $('pkOk').style.display='none';
      const g = $('pkGrid'); g.parentElement.scrollTop = 0; forgeUIInto(g, () => { RUN.gold-=price; S.forged=true; saveRun(); showScreen('shop'); draw(); });
      $('pkCancel').onclick = () => { showScreen('shop'); }; });
  };
  $('sLeave').onclick = () => { SFX.click(); completeNode(); };
  draw();
}
function forgeUIInto(el, onDone){ el.className = ''; el.style.cssText='display:flex;flex-direction:column;align-items:center'; forgeUI(el, onDone); }

// ---------- selector de cartas ----------
function pickCard(title, sub, onPick, onCancel){
  showScreen('picker');
  $('pkTitle').textContent = title; $('pkSub').textContent = sub; $('pkOk').style.display = 'none';
  const g = $('pkGrid'); g.className='gridCards'; g.style.cssText=''; g.innerHTML = '';
  RUN.deck.forEach((card,i)=>{ const ce = cardEl(card); ce.onclick = () => { SFX.select(); onPick ? onPick(i) : cardInfo(card); }; g.appendChild(ce); });
  $('pkCancel').onclick = () => { SFX.click(); onCancel(); };
}
function cardInfo(card){
  const c = CARDS[card.key], L = lvlMul(card.lvl);
  const big = cardEl(card,{big:true}); big.style.margin='4px auto';
  const m = $('modalBody'); m.innerHTML = ''; m.appendChild(big);
  const kv = (k,v) => `<div class="kv"><span>${k}</span><b>${v}</b></div>`;
  let stats = '';
  if(c.spell){
    if(c.allyBuff) stats = kv('Efecto', `Aliados: ataque más rápido y +${Math.round((c.allyBuff.dmg-1)*100)}% daño`) + kv('Duración', `${(c.allyBuff.haste*L).toFixed(1)} s`) + kv('Radio', c.radius);
    else { stats = kv('Daño', Math.round(c.dmg*L)) + kv('Daño a torres', Math.round(c.dmg*L*c.towerMul)) + kv('Radio', c.radius);
      if(c.stun) stats += kv('Aturdimiento', c.stun+' s'); if(c.slowDur) stats += kv('Ralentiza', c.slowDur+' s'); if(c.spawnAfter) stats += kv('Invoca', c.spawnAfter.n+' '+CARDS[c.spawnAfter.key].name); }
  } else {
    stats = kv('Vida', Math.round(c.hp*L) + (c.count>1?' ×'+c.count:''));
    if(c.repairer) stats += kv('Reparación', `${Math.round(c.repairer.rate*L)}/s durante ${c.repairer.dur} s`);
    else if(c.kamikaze) stats += kv('Explosión', `${Math.round(c.kamikaze.dmg*L)} (radio ${c.kamikaze.radius})`);
    else if(c.dmg>0) stats += kv('Daño', Math.round(c.dmg*L) + (c.count>1?' ×'+c.count:'') + (c.splash?' · en área':''));
    if(c.dmg>0 && !c.kamikaze) stats += kv('Alcance', c.range>1.5 ? c.range + (c.minRange?` (mín. ${c.minRange})`:'') : 'Cuerpo a cuerpo');
    const tg = cardTags(c);
    stats += kv('Ataca a', `${tagIc(tg.atk.i)} ${c.targets==='buildings' ? 'Solo edificios' : c.dmg<=0&&!c.kamikaze ? 'Nada (apoyo)' : c.range>1.5||c.air ? 'Aire y tierra' : 'Solo tierra'}`);
    stats += kv('Se mueve', tg.mov ? `${tagIc(tg.mov.i)} ${c.air?'Volando':c.leap?'Por tierra, salta el río':'No se mueve'}` : '🥾 Por tierra');
    const tags = [c.air&&'Volador', c.building&&`Edificio (${c.life} s)`, c.leap&&'Salta el río', c.rage&&'Furia al estar herido', c.antiTank&&`×${c.antiTank} a tanques`, c.hasteAura&&'Aura de ansia de sangre', c.dmgAura&&`Aura +${Math.round((c.dmgAura.mul-1)*100)}% daño`, c.heal&&`Cura ${Math.round(c.heal.amt*L)}/s`, c.slowOnHit&&'Ralentiza al golpear', c.stomp&&'Pisotón en área', c.spawn&&`Invoca ${CARDS[c.spawn.key].name}`, c.deathBomb&&'Explota al morir', c.charge&&'Carga: primer golpe ×2'].filter(Boolean);
    if(tags.length) stats += kv('Especial', tags.join(' · '));
  }
  if(c.spell) stats += kv('Alcanza a', `${tagIc(cardTags(c).atk.i)} ${c.allyBuff ? 'Tus tropas' : 'Aire y tierra'}`);
  const legend = `<div class="legend2">${tagIc('⚔️')} solo tierra · ${tagIc('🎯')} aire y tierra · ${tagIc('🏰')} solo edificios · ${tagIc('🪽')} vuela · ${tagIc('🦘')} salta el río · ${tagIc('🧱')} edificio · 👻 invisible · ${tagIc('✨')} hechizo · 💚 apoyo o cura · 🛡️ distrae</div>`;
  m.insertAdjacentHTML('beforeend', `<h2 class="f">${c.name} <span style="color:var(--gold)">Nv${card.lvl}</span></h2><div class="sub">${c.desc}</div><div style="width:100%">${stats}<div class="kv"><span>Coste</span><b>${c.cost} elixir</b></div>${legend}</div>`);
  const b = document.createElement('button'); b.className='btn sm'; b.textContent='Cerrar'; b.onclick = closeModal; m.appendChild(b);
  $('modal').classList.add('on');
}

// ---------- eventos ----------
const EVENTS = [
  {ic:'⛲', t:'Fuente Mística', d:'Un agua brillante brota entre las rocas. Dicen que cura… o que concede deseos a cambio de oro.',
    o:[{l:'Beber (+40% de vida)', f:()=>{ RUN.hp=Math.min(RUN.maxHp, RUN.hp+RUN.maxHp*0.4); SFX.heal(); return 'Te sientes renovado.'; }},
       {l:'Lanzar 30 de oro: mejora 2 cartas al azar', c:()=>RUN.gold>=30, f:()=>{ RUN.gold-=30; const ups = shuffleR(RUN.deck.filter(c=>c.lvl<5)).slice(0,2); ups.forEach(c=>c.lvl++); SFX.forge(); return ups.length?`Mejoradas: ${ups.map(c=>CARDS[c.key].name).join(' y ')}.`:'El agua no responde.'; }}]},
  {ic:'🧙‍♂️', t:'Mercader Encapuchado', d:'Una figura te ofrece un objeto envuelto en tela. "Solo 60 monedas, sin preguntas."',
    o:[{l:'Comprar (60 de oro)', c:()=>RUN.gold>=60, f:()=>{ RUN.gold-=60; const r = shuffleR(Object.keys(RELICS).filter(k=>!RUN.relics.includes(k)))[0]; if(r){ addRelic(r); SFX.forge(); return `¡Es la reliquia ${RELICS[r].name}! ${RELICS[r].desc}`; } return 'Estaba vacío…'; }},
       {l:'Seguir de largo', f:()=>'Te alejas con prudencia.'}]},
  {ic:'🩸', t:'Altar de Sangre', d:'Un altar antiguo pide un sacrificio. A cambio, ofrece un poder prohibido.',
    o:[{l:'Sacrificar 350 de vida: carta fusionada', c:()=>RUN.hp>400, f:()=>{ RUN.hp-=350; const k = pick(facFusions(myFac())); RUN.deck.push({key:k,lvl:1}); if(!META.recipes.includes(k)) META.recipes.push(k); SFX.forge(); return `Obtienes ${CARDS[k].name}. ¡Receta añadida al libro!`; }},
       {l:'Marcharse', f:()=>'El altar se queda en silencio.'}]},
  {ic:'🧰', t:'Cofre Abandonado', d:'Un cofre cubierto de musgo junto al camino. Podría tener oro… o una trampa.',
    o:[{l:'Abrirlo', f:()=>{ if(rnd()<0.7){ const g=rint(55,95); RUN.gold+=g; SFX.coin(); return `¡${g} monedas de oro!`; } RUN.hp=Math.max(1,RUN.hp-220); SFX.boom(); return '¡Trampa! '+BaseName()+' pierde 220 de vida.'; }},
       {l:'Dejarlo', f:()=>'Mejor no tentar a la suerte.'}]},
  {ic:'⚒️', t:'Herrero Errante', d:'"Mi yunque es tuyo por hoy, viajero." Te ofrece forjar gratis.',
    o:[{l:'Forjar gratis', forge:true}, {l:'Pedirle oro para el viaje (+35)', f:()=>{ RUN.gold+=35; SFX.coin(); return 'Te da unas monedas y un consejo.'; }}]},
  {ic:'👺', t:'Duende Ladrón', d:'Un duende te corta el paso: "¡La bolsa o la batalla!"',
    o:[{l:'Luchar (botín doble)', fight:true}, {l:'Pagar 25 de oro', c:()=>RUN.gold>=25, f:()=>{ RUN.gold-=25; return 'El duende se ríe y desaparece.'; }}]},
  {ic:'📜', t:'Biblioteca Olvidada', d:'Entre polvo y telarañas encuentras un tomo de recetas de forja.',
    o:[{l:'Estudiar (revela una receta)', f:()=>{ const unk = RECIPES.map(r=>r[2]).filter(k=>!META.recipes.includes(k)); if(!unk.length){ RUN.gold+=40; return 'Ya lo sabías todo. Vendes el libro por 40 de oro.'; } const k=pick(unk); META.recipes.push(k); const r=RECIPES.find(x=>x[2]===k); SFX.forge(); return `Receta: ${CARDS[r[0]].name} + ${CARDS[r[1]].name} = ${CARDS[k].name}`; }},
       {l:'Llevarte una carta al azar', f:()=>{ const c = rollCards(1,0,diffRow(RUN.pos[0]))[0]; RUN.deck.push(c); SFX.coin(); return `Añades ${CARDS[c.key].name} a tu mazo.`; }}]},
];
function showEvent(){
  showScreen('event');
  const ev = pick(EVENTS);
  const EVI = {'Manantial de Energía':'ev_fountain','Contrabandista':'ev_merchant','Reactor Inestable':'ev_altar','Contenedor Abandonado':'ev_chest','Ingeniera Ambulante':'ev_smith','Dron Ladrón':'ev_thief','Archivo de Datos':'ev_library','Fuente Mística':'ev_fountain','Mercader Encapuchado':'ev_merchant','Altar de Sangre':'ev_altar','Cofre Abandonado':'ev_chest','Herrero Errante':'ev_smith','Duende Ladrón':'ev_thief','Biblioteca Olvidada':'ev_library'};
  $('evIcon').innerHTML = `<div style="font-size:64px">${artHtml(EVI[ev.t]||'', ev.ic, '128px')}</div>`;
  $('evTitle').textContent = ev.t; $('evText').textContent = ev.d;
  const box = $('evOpts'); box.innerHTML = '';
  ev.o.forEach(o=>{ const b = document.createElement('button'); b.className='btn'+(o.fight?' blue':''); b.textContent=o.l; b.style.fontSize='16px';
    if(o.c && !o.c()) b.disabled = true;
    b.onclick = () => { SFX.click();
      if(o.fight){ goBattle('elite', RUN.pos[0], {mult:0.85+0.07*diffRow(RUN.pos[0]), name:'🛸 Banda del Dron Ladrón', subtitle:'Emboscada'}); return; }
      if(o.forge){ showScreen('picker'); $('pkTitle').textContent='⚒️ Yunque del Herrero'; $('pkSub').textContent=''; $('pkOk').style.display='none'; forgeUIInto($('pkGrid'), completeNode); $('pkCancel').onclick = completeNode; return; }
      const msg = o.f(); saveRun();
      $('evText').textContent = msg; box.innerHTML = '';
      const c = document.createElement('button'); c.className='btn'; c.textContent='Continuar'; c.onclick = () => { SFX.click(); completeNode(); }; box.appendChild(c); };
    box.appendChild(b); });
}

// ---------- fin de partida ----------
function endRun(victory){
  RUN.over = true;
  const s = RUN.stats;
  const shards = s.floors + s.elites*2 + (s.mbosses||0)*4 + Math.floor(s.crowns/3) + (s.comebacks||0)*2 + (victory?15:0) + (RUN.daily?3:0);
  META.shards += shards; if(victory) META.wins++;
  META.bestFloor = Math.max(META.bestFloor||0, s.floors);
  const score = s.floors*100 + s.crowns*10 + s.elites*50 + (victory?1000+Math.ceil(RUN.hp/10):0);
  let dailyMsg = '';
  if(RUN.daily){ const prev = META.daily[RUN.date]||0; if(score>prev){ META.daily[RUN.date]=score; dailyMsg = prev?'¡Nuevo récord del día!':'Puntuación del día registrada'; } else dailyMsg = `Tu récord de hoy: ${prev}`; }
  META.run = null; saveMeta();
  showScreen('over');
  $('ovTitle').innerHTML = `<div>${artHtml(victory?'emb_victoria':'emb_derrota','', '96px')}</div>` + (victory ? '¡VICTORIA!' : 'Fin del viaje');
  $('ovTitle').style.color = victory ? 'var(--gold)' : '#ff8a8a';
  $('ovSub').textContent = victory ? 'Has derrotado a '+(RUN.lastBoss||'su jefe')+'. ¡Tu leyenda crece!' : `Caíste en el piso ${Math.min(nRows(), (RUN.pos?RUN.pos[0]:0)+1)} de ${nRows()}. Cada derrota te hace más fuerte.`;
  $('ovStats').innerHTML = [['Pisos superados', s.floors],['Batallas ganadas', s.battles],['Élites derrotadas', s.elites],['Coronas', s.crowns],['Fusiones', s.fusions],['Remontadas', s.comebacks||0],['Enemigos eliminados', s.kills],['Puntuación', score]].map(([k,v])=>`<div class="kv"><span>${k}</span><b>${v}</b></div>`).join('')
    + `<div class="kv" style="border:none;margin-top:6px"><span>Esquirlas ganadas</span><b style="color:#7fd8ff">💠 +${shards}</b></div>` + (dailyMsg?`<div class="sub" style="margin-top:6px">📅 ${dailyMsg}</div>`:'');
  $('ovBtn').onclick = () => { SFX.click(); showTitle(); };
}

// ---------- mejoras permanentes ----------
function showMeta(tab='upg'){
  showScreen('meta');
  $('metaShards').textContent = META.shards;
  const body = $('metaBody'); body.innerHTML = '';
  [...$('metaTabs').children].forEach(b=>{ b.classList.toggle('on', b.dataset.t===tab); b.onclick = () => { SFX.click(); showMeta(b.dataset.t); }; });
  if(tab==='upg'){
    body.innerHTML = '<div class="sub" style="margin:4px 0 10px">Ganas 💠 esquirlas en cada partida, aunque pierdas. Las mejoras son para siempre.</div>';
    META_UPG.forEach(u=>{ const lvl = META.upg[u.id]||0, max = u.costs.length, cost = u.costs[lvl];
      const d = document.createElement('div'); d.className='upg'; d.style.marginBottom='8px';
      d.innerHTML = `<div class="t"><b>${u.name}</b><span>${u.desc}</span><div class="dots">${u.costs.map((_,i)=>`<i class="${i<lvl?'on':''}"></i>`).join('')}</div></div>`;
      const b = document.createElement('button'); b.className='btn sm'+(lvl>=max?' dark':''); b.textContent = lvl>=max ? 'MÁX' : `💠 ${cost}`; b.disabled = lvl>=max || META.shards<cost;
      b.onclick = () => { META.shards -= cost; META.upg[u.id] = lvl+1; saveMeta(); SFX.forge(); showMeta('upg'); };
      d.appendChild(b); body.appendChild(d); });
  } else if(tab==='heroes'){
    body.innerHTML = '<div class="sub" style="margin:4px 0 10px">Al empezar cada aventura eliges un héroe de tu bando. Súbelos de nivel con esquirlas: su versión en batalla es más fuerte.</div>';
    for(const id of Object.keys(HEROES)){ const H = HEROES[id], lv = heroLvl(id), cost = HERO_COSTS[lv-1];
      const d = document.createElement('div'); d.className='upg'; d.style.marginBottom='8px';
      d.innerHTML = `<div>${heroPortrait(id,56)}</div><div class="t"><b>${facIc(H.fac,'1em')} ${H.name}</b><span style="display:block"><b style="color:#9ad0ff">Pasiva:</b> ${H.passive}</span><span style="display:block;margin-top:3px">${artHtml(H.hab,'✨','1.6em')} ${CARDS[H.card].desc}</span><div class="dots">${[1,2,3].map(i=>`<i class="${i<=lv?'on':''}"></i>`).join('')}</div></div>`;
      const b = document.createElement('button'); b.className='btn sm'+(lv>=3?' dark':''); b.textContent = lv>=3 ? 'MÁX' : `💠 ${cost}`; b.disabled = lv>=3 || META.shards<cost;
      b.onclick = () => { META.shards -= cost; META.heroes = META.heroes||{}; META.heroes[id] = lv+1; saveMeta(); SFX.forge(); showMeta('heroes'); };
      d.appendChild(b); body.appendChild(d); }
  } else if(tab==='cards'){
    body.innerHTML = '<div class="sub" style="margin:4px 0 10px">Desbloquea cartas nuevas: aparecerán como recompensa y abrirán nuevas recetas de forja.</div>';
    for(const fk of Object.keys(FACTIONS)){
    body.insertAdjacentHTML('beforeend', `<h2 class="f" style="font-size:20px;margin-top:8px">${facIc(fk,'1.3em')} ${FACTIONS[fk].name}</h2>`);
    const g = document.createElement('div'); g.className='gridCards';
    FACTIONS[fk].cards.forEach(k=>{ const wrap = document.createElement('div'); wrap.style.cssText='display:flex;flex-direction:column;align-items:center;gap:6px';
      const ce = cardEl({key:k,lvl:1}); const un = META.unlocked.includes(k);
      if(!un){ ce.classList.add('off'); }
      ce.onclick = () => cardInfo({key:k,lvl:1});
      wrap.appendChild(ce);
      if(!un){ const u = UNLOCKABLE.find(x=>x.key===k) || {key:k,cost:10}; const b = document.createElement('button'); b.className='btn sm'; b.textContent=`💠 ${u.cost}`; b.disabled = META.shards<u.cost;
        b.onclick = () => { META.shards -= u.cost; META.unlocked.push(k); saveMeta(); SFX.forge(); showMeta('cards'); }; wrap.appendChild(b); }
      else wrap.insertAdjacentHTML('beforeend','<span style="font-size:11px;color:var(--good);font-weight:900">✓ Desbloqueada</span>');
      g.appendChild(wrap); });
    body.appendChild(g); }
    body.insertAdjacentHTML('beforeend', `<h2 class="f" style="font-size:20px;margin-top:8px">⚔️ Cazarrecompensas</h2><div class="sub" style="margin-bottom:6px">Sirven a cualquier bando. Se contratan en la tienda.</div>`);
    const gm = document.createElement('div'); gm.className='gridCards';
    MERCS.forEach(k=>{ const ce = cardEl({key:k,lvl:1}); ce.onclick = () => cardInfo({key:k,lvl:1}); gm.appendChild(ce); });
    body.appendChild(gm);
  } else {
    body.innerHTML = `<div class="sub" style="margin:4px 0 8px">Recetas descubiertas: <b style="color:var(--gold)">${META.recipes.length} / ${RECIPES.length}</b></div>`;
    const list = document.createElement('div'); list.className='recipes';
    RECIPES.slice().sort((x,y)=>facOf(x[2]).localeCompare(facOf(y[2]))).forEach(([a,b,r])=>{ const known = META.recipes.includes(r); const d = document.createElement('div');
      d.innerHTML = known ? `<img src="${cardArt(a)}" width="30"><span>${CARDS[a].name}</span> + <img src="${cardArt(b)}" width="30"><span>${CARDS[b].name}</span> = <img src="${cardArt(r)}" width="34"><b>${CARDS[r].name}</b>`
        : `<span style="font-size:16px">${facIc(facOf(r),'1.3em')}</span><span>??? + ???</span> = <span style="font-size:20px">✨</span><b style="color:#7a6a9a">Fusión secreta</b>`;
      if(known) d.onclick = () => cardInfo({key:r,lvl:1});
      list.appendChild(d); });
    body.appendChild(list);
  }
  $('metaBack').onclick = () => { SFX.click(); showTitle(); };
}

function mapHelp(){
  infoModal(`<h2 class="f">🗺️ El mapa de la aventura</h2>
  <div class="sub" style="text-align:left;font-size:14px;line-height:1.5">
  Cada partida es un viaje de <b>15 pisos</b>: empiezas abajo y subes hasta el <b>jefe 👑</b> de arriba.<br><br>
  Toca uno de los <b>puntos que brillan</b> para avanzar. Solo puedes seguir los caminos que salen de donde estás, así que <b>tú eliges la ruta</b>:<br>
  ⚔️ <b>Batalla</b>: oro y una carta nueva<br>
  💀 <b>Élite</b>: más difícil, pero da una reliquia<br>
  🔥 <b>Hoguera</b>: forjar cartas, reparar tu base o entrenar<br>
  🛒 <b>Tienda</b>: comprar cartas y reliquias<br>
  ❓ <b>Evento</b>: sorpresas con riesgo y premio<br>
  💰 <b>Tesoro</b>: batalla bonus de cofres, sin riesgo<br>
  👹 <b>Jefe intermedio</b> en el piso 8: reliquia a elegir entre 3 y curación<br>
  🌧️🌫️ Algunas batallas tienen <b>lluvia o niebla</b><br><br>
  🌲⛰️🐍🧊🌋🐸 Desde el piso 3, el <b>terreno</b> cambia: bosque (emboscadas), cañón (roca que tapa el centro), senderos en zigzag, lago helado (se rompe al final), volcán (lluvia de lava) y pantano (barro que frena). Mira el icono del nodo.<br><br>
  🦸 Tu <b>héroe</b> da una ventaja toda la aventura y, una vez por batalla, puedes llamarlo al campo con su carta dorada.<br><br>
  🏔️ El paisaje cambia por zonas: pradera, después nieve o desierto, y al final cementerio o volcán.<br><br>
  ⚔️ En la tienda a veces hay <b>mercenarios</b>: sirven a cualquier bando.<br><br>
  La vida de tu base (${baseName()}) <b>no se recupera sola</b> entre batallas. Si cae, la aventura termina…
  pero ganas 💠 <b>esquirlas</b> para mejoras permanentes, y la siguiente vez llegarás más lejos. Cada aventura tiene un mapa distinto.</div>`);
}

function chooseFaction(cb){
  const m = $('modalBody'); m.innerHTML = '<h2 class="f">Elige tu bando</h2><div class="sub">Los enemigos serán de los otros bandos. Las esquirlas y mejoras son comunes.</div>';
  for(const fk of Object.keys(FACTIONS)){ const F = FACTIONS[fk];
    const d = document.createElement('div'); d.className='upg'; d.style.cursor='pointer';
    const art = F.starter.slice(0,3).map(k=>`<img src="${cardArt(k)}" width="40" height="40">`).join('');
    d.innerHTML = `<div style="font-size:34px">${imgFor('fac_'+fk) ? `<img src="${ART_SRC['fac_'+fk]}" style="width:92px;height:122px;object-fit:cover;border-radius:12px;border:2px solid rgba(255,255,255,.25)">` : facIc(fk,'1.4em')}</div><div class="t"><b>${F.name}</b><span>${F.desc}</span><div style="margin-top:4px">${art}</div></div>`;
    d.onclick = () => { SFX.select(); closeModal(); cb(fk); };
    m.appendChild(d); }
  const c = document.createElement('button'); c.className='btn dark sm'; c.textContent='Cancelar'; c.onclick = closeModal; m.appendChild(c);
  $('modal').classList.add('on');
}

function heroPortrait(id, size=54){ const H = HEROES[id]; return artHtml(CARDS[H.card].art, '🦸', size+'px'); }
function chooseHero(fk, cb){
  const m = $('modalBody'); m.innerHTML = `<h2 class="f">Elige tu héroe</h2><div class="sub">Te acompaña toda la aventura: tiene una <b>pasiva</b> y, una vez por batalla, puedes llamarlo al campo (4 de elixir).</div>`;
  for(const id of Object.keys(HEROES).filter(h=>HEROES[h].fac===fk)){ const H = HEROES[id], c = CARDS[H.card];
    const d = document.createElement('div'); d.className='upg'; d.style.cursor='pointer';
    d.innerHTML = `<div>${heroPortrait(id,60)}</div><div class="t"><b>${H.name} <span style="color:var(--gold);font-size:12px">Nv ${heroLvl(id)}</span></b><span style="display:block"><b style="color:#9ad0ff">Pasiva:</b> ${H.passive}</span><span style="display:block;margin-top:3px">${artHtml(H.hab,'✨','1.6em')} ${c.desc}</span></div>`;
    d.onclick = () => { SFX.select(); closeModal(); cb(id); };
    m.appendChild(d); }
  const c = document.createElement('button'); c.className='btn dark sm'; c.textContent='Volver'; c.onclick = () => chooseFaction(f=>chooseHero(f, cb)); m.appendChild(c);
  $('modal').classList.add('on');
}

// ---------- modales ----------
function infoModal(html){ const m = $('modalBody'); m.innerHTML = html; const b = document.createElement('button'); b.className='btn sm'; b.textContent='Vale'; b.onclick = closeModal; m.appendChild(b); $('modal').classList.add('on'); }
function closeModal(){ $('modal').classList.remove('on'); }

// ================= 🧪 PRUEBAS (novedades experimentales) =================
META.lab = Object.assign({evo:false, asc:0, ascMax:1, endlessBest:0, weekWin:-1, spinDay:'', streak:0, lastDay:''}, META.lab || {});
const labSave = () => saveMeta();
const weekNum = () => Math.floor((Date.now()/86400000 + 3) / 7);

// ---------- 1. ASCENSIÓN ----------
const ASC_TYPES = [
  {k:'str',  t:'Rivales +5% de vida y daño'},
  {k:'tower',t:'Torres rivales +6% de vida'},
  {k:'elx',  t:'El rival recarga elixir un 3% más rápido'},
  {k:'hp',   t:'Tu base empieza con −5% de vida'},
  {k:'gold', t:'Empiezas con 10 de oro menos'},
  {k:'ai',   t:'El rival piensa un 5% más rápido'}];
const ascRule = i => ASC_TYPES[(i-1) % ASC_TYPES.length];
function ascCount(L, k){ let n = 0; for(let i=1;i<=L;i++) if(ascRule(i).k===k) n++; return n; }
const curAsc = () => (RUN && RUN.asc) || 0;
const _makeEncounter = makeEncounter;
makeEncounter = function(type, r0){
  const e = _makeEncounter(type, r0), L = curAsc();
  if(L){ e.mult *= 1 + 0.05*ascCount(L,'str'); e.towerMul *= 1 + 0.06*ascCount(L,'tower'); e.regen *= 1 + 0.03*ascCount(L,'elx'); e.think *= Math.pow(0.95, ascCount(L,'ai')); e.subtitle += ' · ⛰️ A'+L; }
  return e;
};
const _newRun = newRun;
newRun = function(daily, faction, hero){
  _newRun(daily, faction, hero);
  const L = daily ? 0 : (META.lab.asc||0);
  if(L){ RUN.asc = L; RUN.maxHp = Math.round(RUN.maxHp*(1 - 0.05*ascCount(L,'hp'))); RUN.hp = RUN.maxHp; RUN.gold = Math.max(0, RUN.gold - 10*ascCount(L,'gold')); saveRun(); showMap(); toast('⛰️ Ascensión '+L); }
};
const _endRun = endRun;
endRun = function(victory){
  const L = RUN && RUN.asc || 0;
  _endRun(victory);
  if(victory && L && L>=META.lab.ascMax && META.lab.ascMax<20){ META.lab.ascMax = L+1; labSave(); setTimeout(()=>infoModal(`<div style="font-size:52px">⛰️</div><h2 class="f">¡Ascensión ${L+1} desbloqueada!</h2><div class="sub">Nueva regla: ${ascRule(L+1).t}.</div>`), 600); }
};

// ---------- 2. CARTAS EVOLUCIONADAS ----------
const EVO_LVL = 5;
const _spawnUnit = spawnUnit;
spawnUnit = function(side, key, lvl, x, y, deploy){
  const u = _spawnUnit(side, key, lvl, x, y, deploy);
  if(META.lab.evo && side==='p' && lvl>=EVO_LVL && !u.c.building){ u.evo = true; u.hp *= 1.2; u.maxHp *= 1.2; u.dmg *= 1.2; u.speed *= 1.08; }
  return u;
};
const _cardEl = cardEl;
cardEl = function(card, opts){
  const d = _cardEl(card, opts);
  if(META.lab.evo && card && card.lvl>=EVO_LVL && !CARDS[card.key].spell && !CARDS[card.key].building){ d.classList.add('evo'); const b = document.createElement('div'); b.className = 'evoTag'; b.textContent = 'EVO'; d.appendChild(b); }
  return d;
};
function drawEvoAura(u, now){
  const r = X(u.r*1.5), EV = imgFor('fx_evo');
  if(EV){ const w = X(u.r*2.8), h = w*EV.naturalHeight/EV.naturalWidth; ctx.globalAlpha = 0.6 + 0.25*Math.sin(now*4 + u.walk); ctx.drawImage(EV, X(u.x)-w/2, X(u.y+0.2)-h*0.75, w, h); ctx.globalAlpha = 1; if(Math.random()<0.05) part('spark', u.x+(Math.random()-0.5)*u.r*2, u.y-0.6, {sp:0.6, col:'#ffe066', life:0.6, size:0.07}); return; }
  ctx.save(); ctx.globalAlpha = 0.35 + 0.15*Math.sin(now*5 + u.walk);
  const g = ctx.createRadialGradient(X(u.x), X(u.y), r*0.2, X(u.x), X(u.y), r); g.addColorStop(0,'rgba(255,215,80,0.9)'); g.addColorStop(1,'rgba(255,215,80,0)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(X(u.x), X(u.y+0.15), r, r*0.55, 0, 0, TAU); ctx.fill(); ctx.restore();
  if(Math.random()<0.08) part('spark', u.x+(Math.random()-0.5)*u.r*2, u.y-0.6-Math.random()*0.6, {sp:0.6, col:'#ffe066', life:0.6, size:0.07});
}

// ---------- 5. REPETICIONES (instantáneas de la batalla) ----------
let REPLAY = null, REC = null;
const _startBattle = startBattle;
startBattle = function(enc, onEnd){
  REC = {frames:[], ter:null, bio:null, name:enc.name};
  _startBattle(enc, res => { if(REC && REC.frames.length>30){ REPLAY = REC; REPLAY.win = res.win; REPLAY.crowns = [res.crowns, res.eCrowns]; } REC = null; onEnd(res); });
  REC.ter = B.terrain; REC.bio = B.biome; REC.facP = RUN && RUN.faction || 'human'; REC.facE = enc.faction || 'orc';
};
const _updateBattle = updateBattle;
updateBattle = function(dt){
  _updateBattle(dt);
  if(REC && B && !B.over && B.tick % 6 === 0 && REC.frames.length < 2400){
    REC.frames.push({t:B.time, e:B.ents.filter(e=>(e.type==='unit'||e.type==='tower') && e.hp>0).map(e=>[e.type==='tower'?(e.king?2:1):0, e.type==='unit'?(e.bk?'bk_'+e.sprite:e.sprite):e.fac, e.side, +e.x.toFixed(2), +e.y.toFixed(2), +(e.hp/e.maxHp).toFixed(2), e.face||1, e.r||1])});
  }
};
function showReplay(){
  if(!REPLAY){ toast('Juega una batalla primero'); return; }
  const m = $('modalBody'); m.innerHTML = `<h2 class="f">🎬 Repetición</h2><div class="sub">${REPLAY.name} · ${REPLAY.win?'Victoria':'Derrota'} ${REPLAY.crowns[0]}–${REPLAY.crowns[1]}</div>`;
  const ts = Math.min(15, (Math.min(window.innerWidth, 420)-40)/W), c = document.createElement('canvas'), dpr = Math.min(2, window.devicePixelRatio||1);
  c.width = W*ts*dpr; c.height = H*ts*dpr; c.style.width = (W*ts)+'px'; c.style.height = (H*ts)+'px'; c.style.borderRadius = '10px'; c.style.display = 'block'; c.style.margin = '6px auto';
  m.appendChild(c);
  const ctl = document.createElement('div'); ctl.style.cssText = 'display:flex;gap:6px;justify-content:center;margin-top:4px';
  const bp = document.createElement('button'); bp.className = 'btn sm'; bp.textContent = '⏸';
  const bs = document.createElement('button'); bs.className = 'btn dark sm'; bs.textContent = '×1';
  const bc = document.createElement('button'); bc.className = 'btn dark sm'; bc.textContent = 'Cerrar';
  ctl.append(bp, bs, bc); m.appendChild(ctl); $('modal').classList.add('on');
  const g = c.getContext('2d'); g.setTransform(dpr,0,0,dpr,0,0);
  const arena = renderArena(ts, dpr, 'std', REPLAY.ter||'river', false, REPLAY.bio||'grass');
  let f = 0, play = true, speed = 1, last = performance.now(), acc = 0, alive = true;
  bp.onclick = () => { play = !play; bp.textContent = play ? '⏸' : '▶'; };
  bs.onclick = () => { speed = speed===1 ? 2 : speed===2 ? 4 : 1; bs.textContent = '×'+speed; };
  bc.onclick = () => { alive = false; closeModal(); };
  const step = now => {
    if(!alive || !$('modal').classList.contains('on')) return;
    acc += (now-last)/1000*speed; last = now;
    while(play && acc > 0.1){ acc -= 0.1; f = Math.min(REPLAY.frames.length-1, f+1); }
    const fr = REPLAY.frames[f], Xr = v => v*ts;
    g.clearRect(0,0,W*ts,H*ts); g.drawImage(arena, 0, 0, W*ts, H*ts);
    const ents = fr.e.slice().sort((a,b)=>a[4]-b[4]);
    for(const [k, sp, side, x, y, hpf, face, r] of ents){
      if(k){ const w = Xr(k===2?3.5:2.8), tw = getTower(side, k===2, w, sp); g.drawImage(tw.normal, Xr(x)-tw.w/2, Xr(y+(k===2?0.95:0.75)) - tw.h*118/130); }
      else { const px = ts*(1.12 + r*2.2), s = getSprite(sp, side, px); g.save(); g.translate(Xr(x), Xr(y)); if(face<0 && !sp.startsWith('bk_')) g.scale(-1,1); g.drawImage(s.normal, -s.pad-s.px*0.5, -s.pad-s.px*0.88); g.restore(); }
      g.fillStyle = 'rgba(0,0,0,0.5)'; g.fillRect(Xr(x)-Xr(0.5), Xr(y)-Xr(k?2.6:1.3), Xr(1), 3);
      g.fillStyle = side==='p' ? '#4aa8ff' : '#ff5050'; g.fillRect(Xr(x)-Xr(0.5), Xr(y)-Xr(k?2.6:1.3), Xr(1)*hpf, 3);
    }
    const t = Math.max(0, Math.ceil(fr.t)); g.fillStyle = 'rgba(0,0,0,0.55)'; g.fillRect(4,4,52,20); g.fillStyle = '#fff'; g.font = 'bold 13px sans-serif'; g.fillText(Math.floor(t/60)+':'+String(t%60).padStart(2,'0'), 12, 19);
    if(f>=REPLAY.frames.length-1){ play = false; bp.textContent = '↺'; bp.onclick = () => { f = 0; play = true; bp.textContent = '⏸'; bp.onclick = () => { play = !play; bp.textContent = play ? '⏸' : '▶'; }; }; }
    requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// ---------- utilidades para modos sueltos ----------
function tempRun(faction, extra={}){
  const maxHp = 2400 + 200*(META.upg.hp||0);
  return Object.assign({seed:(Math.random()*2**31)>>>0, faction, lab:true, pos:[0,0], map:null, hp:maxHp, maxHp, gold:0, deck:FACTIONS[faction].starter.map(k=>({key:k,lvl:1})), hero:null, relics:[], phoenixUsed:false, stats:{battles:0, elites:0, crowns:0, fusions:0, floors:0, kills:0}, over:false}, extra);
}
function chooseCardModal(title, cards, cb){
  const m = $('modalBody'); m.innerHTML = `<h2 class="f">${title}</h2><div class="sub">Elige una carta para tu mazo</div>`;
  const row = document.createElement('div'); row.style.cssText = 'display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin:8px 0';
  cards.forEach(card => { const d = cardEl(card, {big:true}); d.style.cursor = 'pointer'; d.onclick = () => { SFX.coin(); closeModal(); cb(card); }; row.appendChild(d); });
  m.appendChild(row);
  const s = document.createElement('button'); s.className = 'btn dark sm'; s.textContent = 'Saltar'; s.onclick = () => { closeModal(); cb(null); }; m.appendChild(s);
  $('modal').classList.add('on');
}

// ---------- 3. TORRE SIN FIN ----------
function startEndless(){
  chooseFaction(fac => {
    RUN = tempRun(fac, {endless:1});
    const next = () => {
      const n = RUN.endless, type = n%5===0 ? 'elite' : 'battle';
      const enc = makeEncounter(type, Math.min(14, n-1));
      const extra = Math.max(0, n-15); enc.mult *= 1 + 0.06*extra; enc.towerMul *= 1 + 0.04*extra;
      enc.name = '🗼 Torre sin fin · Piso '+n; enc.subtitle = 'Récord: '+META.lab.endlessBest; enc.seed = (Math.random()*2**31)>>>0;
      if(n>=3){ const w = Math.random(); enc.weather = w<0.2 ? 'rain' : w<0.35 ? 'fog' : 'clear'; enc.terrain = pick(TERRAIN_KEYS.filter(t=>t!=='winding')); }
      running = true;
      startBattle(enc, res => {
        if(!res.win){
          const fl = n-1, sh = Math.floor(fl/2); META.shards += sh;
          const best = fl > META.lab.endlessBest; if(best) META.lab.endlessBest = fl; labSave();
          infoModal(`<div style="font-size:52px">🗼</div><h2 class="f">Torre sin fin</h2><div class="sub">Has superado ${fl} pisos.${best?'<br><b style="color:var(--gold)">¡Nuevo récord!</b>':''}<br>💠 +${sh} esquirlas</div>`);
          RUN = META.run || null; showTitle(); return;
        }
        RUN.endless++;
        if(RUN.endless%3===0){ const up = RUN.deck.filter(c=>c.lvl<5); if(up.length){ const c = pick(up); c.lvl++; toast(CARDS[c.key].name+' sube a nivel '+c.lvl); } }
        const pool = FACTIONS[fac].cards.filter(k=>META.unlocked.includes(k) || CARDS[k].s2), choices = shuffleR(pool.slice()).slice(0,3).map(k=>({key:k, lvl:1+Math.floor(RUN.endless/6)}));
        chooseCardModal('🗼 Piso '+(RUN.endless-1)+' superado', choices, card => { if(card) RUN.deck.push(card); next(); });
      });
    };
    next();
  });
}

// ---------- 4. JEFE DE LA SEMANA ----------
const WEEK_MODS = [
  {k:'giant', n:'Gigantes', d:'Las tropas del jefe tienen +60% de vida pero van más lentas.'},
  {k:'rush',  n:'Prisa',    d:'Todas las tropas corren un 35% más.'},
  {k:'fog',   n:'Niebla perpetua', d:'Toda la batalla con niebla.'},
  {k:'snow',  n:'Invierno eterno', d:'Nevada todo el combate.'},
  {k:'fort',  n:'Fortaleza', d:'Las torres del jefe tienen +50% de vida.'},
  {k:'elx',   n:'Elixir salvaje', d:'Los dos bandos recargan elixir el doble de rápido.'}];
function weekInfo(){ const wk = weekNum(), r = mulberry32(wk*977+13); const fac = Object.keys(FACTIONS)[Math.floor(r()*Object.keys(FACTIONS).length)]; const mod = WEEK_MODS[Math.floor(r()*WEEK_MODS.length)]; return {wk, fac, mod}; }
function startWeekly(){
  const W0 = weekInfo();
  chooseFaction(fac => {
    if(fac===W0.fac){ toast('Elige otro bando: el jefe es '+FACTIONS[W0.fac].name); return startWeekly(); }
    RUN = tempRun(fac);
    RUN.deck = shuffleR(FACTIONS[fac].cards.filter(k=>META.unlocked.includes(k))).slice(0,8).map(k=>({key:k, lvl:3}));
    const enc = makeEncounter('boss', 14);
    const F = FACTIONS[W0.fac]; enc.faction = W0.fac; enc.deck = shuffleR(F.cards.slice()).slice(0,6).map(k=>({key:k,lvl:3})).concat(shuffleR(facFusions(W0.fac)).slice(0,2).map(k=>({key:k,lvl:3})));
    enc.name = '👑 Jefe de la semana: '+F.boss; enc.subtitle = W0.mod.n+' · '+W0.mod.d; enc.seed = W0.wk;
    if(W0.mod.k==='fog') enc.weather = 'fog'; if(W0.mod.k==='snow'){ enc.weather = 'snow'; enc.biome = 'snow'; }
    if(W0.mod.k==='fort') enc.towerMul *= 1.5;
    running = true;
    startBattle(enc, res => {
      let msg = res.win ? '¡Has derrotado al jefe de esta semana!' : 'El jefe resiste. Puedes intentarlo otra vez.';
      if(res.win && META.lab.weekWin !== W0.wk){ META.lab.weekWin = W0.wk; META.shards += 10; msg += '<br>💠 +10 esquirlas'; labSave(); }
      infoModal(`<div style="font-size:52px">👑</div><h2 class="f">Jefe de la semana</h2><div class="sub">${msg}</div>`);
      RUN = META.run || null; showTitle();
    });
    if(W0.mod.k==='giant'){ B.e.mods.hp *= 1.6; B.e.mods.speed *= 0.8; }
    if(W0.mod.k==='rush'){ B.p.mods.speed *= 1.35; B.e.mods.speed *= 1.35; }
    if(W0.mod.k==='elx'){ B.p.mods.regen *= 2; B.e.mods.regen *= 2; }
  });
}

// ---------- 6. DUELO EN EL MISMO MÓVIL ----------
let sel2 = -1;
function startDuel(){
  chooseFaction(f1 => {
    toast('Jugador 2 (arriba): elige bando');
    setTimeout(() => chooseFaction(f2 => {
      RUN = tempRun(f1);
      const enc = {type:'battle', row:5, faction:f2, mult:1, towerMul:1.15, regen:1, think:99, aggro:9, duel:true, towerDmg:1, name:'⚔️ Duelo', subtitle:'Jugador 1 abajo · Jugador 2 arriba', seed:(Math.random()*2**31)>>>0,
        deck: FACTIONS[f2].starter.map(k=>({key:k,lvl:1})), weather:'clear', terrain:'river'};
      running = true; sel2 = -1;
      startBattle(enc, res => {
        $('hand2').style.display = 'none';
        infoModal(`<div style="font-size:52px">⚔️</div><h2 class="f">${res.win ? '¡Gana el Jugador 1!' : '¡Gana el Jugador 2!'}</h2><div class="sub">Coronas ${res.crowns} – ${res.eCrowns}</div>`);
        RUN = META.run || null; showTitle();
      });
      $('hand2').style.display = 'flex'; renderHand2();
    }), 350);
  });
}
const _aiThink = aiThink;
aiThink = function(dt){ if(B.enc.duel) return; _aiThink(dt); };
function renderHand2(){
  const h = $('hand2'); if(!B || !B.enc.duel || B.over){ h.style.display = 'none'; return; }
  h.innerHTML = `<div class="e2">💧 ${Math.floor(B.e.elixir)}</div>`;
  B.e.hand.forEach((card, i) => { const d = cardEl(card); d.classList.toggle('sel', i===sel2); d.classList.toggle('off', B.e.elixir < cardCost('e', card));
    d.addEventListener('pointerdown', ev => { ev.preventDefault(); ev.stopPropagation(); sel2 = sel2===i ? -1 : i; SFX.select(); renderHand2(); }); h.appendChild(d); });
}
setInterval(() => { if(B && B.enc && B.enc.duel && curScreen==='battle') renderHand2(); }, 300);
cv.addEventListener('pointerdown', ev => {
  if(!B || !B.enc.duel || sel2<0 || !running || B.over) return;
  const pt = toTile(ev); if(!pt || pt.y >= H/2) return;
  ev.stopImmediatePropagation();
  const card = B.e.hand[sel2];
  if(!validDrop('e', card.key, pt.x, pt.y)){ toast('Jugador 2: solo en tu mitad'); SFX.bad(); return; }
  if(B.e.elixir < cardCost('e', card)){ toast('Jugador 2: falta elixir'); SFX.bad(); return; }
  playCard('e', sel2, pt.x, pt.y); sel2 = -1; renderHand2();
}, true);

// ---------- 7. RULETA DIARIA Y RACHA ----------
const SPIN = [{t:'💠 2', s:2},{t:'💠 3', s:3},{t:'💠 5', s:5},{t:'💠 2', s:2},{t:'💠 8', s:8},{t:'💠 3', s:3},{t:'🃏 Carta', card:1},{t:'💠 12', s:12}];
function dayDiff(a, b){ return Math.round((new Date(b) - new Date(a))/86400000); }
function showSpin(){
  const today = todayStr(), done = META.lab.spinDay===today;
  const m = $('modalBody'); m.innerHTML = `<h2 class="f">🎡 Ruleta diaria</h2><div class="sub">Racha: <b>${META.lab.streak}</b> día(s) · día 3: +5 💠 · día 7: +15 💠</div>`;
  const wheel = document.createElement('div'); wheel.className = 'spinGrid';
  SPIN.forEach((s,i) => { const c = document.createElement('div'); c.className = 'spinCell'; c.textContent = s.t; c.dataset.i = i; wheel.appendChild(c); });
  m.appendChild(wheel);
  const b = document.createElement('button'); b.className = 'btn'; b.textContent = done ? 'Vuelve mañana' : '¡Girar!'; b.disabled = done; m.appendChild(b);
  const c = document.createElement('button'); c.className = 'btn dark sm'; c.textContent = 'Cerrar'; c.onclick = closeModal; m.appendChild(c);
  $('modal').classList.add('on');
  b.onclick = () => {
    b.disabled = true; const target = Math.floor(Math.random()*SPIN.length), total = SPIN.length*3 + target; let k = 0;
    const cells = [...wheel.children];
    const tick = () => { cells.forEach(x=>x.classList.remove('on')); cells[k%SPIN.length].classList.add('on'); SFX.click(); k++;
      if(k<=total) setTimeout(tick, 40 + Math.pow(k/total, 3)*260); else finish(); };
    const finish = () => {
      const R = SPIN[target]; let msg = '';
      const prev = META.lab.lastDay; META.lab.streak = prev && dayDiff(prev, today)===1 ? META.lab.streak+1 : 1; META.lab.lastDay = today; META.lab.spinDay = today;
      if(R.s){ META.shards += R.s; msg = `💠 +${R.s} esquirlas`; }
      if(R.card){ const locked = UNLOCKABLE.filter(u=>!META.unlocked.includes(u.key)); if(locked.length){ const u = pick(locked); META.unlocked.push(u.key); msg = `🃏 Desbloqueada: ${CARDS[u.key].name}`; } else { META.shards += 6; msg = '💠 +6 esquirlas'; } }
      if(META.lab.streak===3){ META.shards += 5; msg += '<br>🔥 Racha de 3 días: +5 💠'; }
      if(META.lab.streak===7){ stAdd('spin7'); META.shards += 15; msg += '<br>🔥 Racha de 7 días: +15 💠'; META.lab.streak = 0; }
      labSave(); SFX.coin();
      setTimeout(() => infoModal(`<div style="font-size:52px">🎡</div><h2 class="f">¡Premio!</h2><div class="sub">${msg}</div>`), 500);
    };
    tick();
  };
}

// ---------- MENÚ DE PRUEBAS ----------
function labMenu(){
  const m = $('modalBody'), L = META.lab, W0 = weekInfo();
  m.style.maxHeight = '88vh'; m.style.overflowY = 'auto';
  m.innerHTML = `<h2 class="f">🧪 Pruebas</h2><div class="sub">Novedades experimentales. No cambian tu partida normal salvo que las actives.</div>`;
  const row = (ic, title, desc, btns) => { const d = document.createElement('div'); d.className = 'upg'; d.style.marginBottom = '7px';
    d.innerHTML = `<div style="font-size:30px">${ic}</div><div class="t"><b>${title}</b><span>${desc}</span></div>`; const bx = document.createElement('div'); bx.style.cssText = 'display:flex;gap:4px;align-items:center'; btns.forEach(b=>bx.appendChild(b)); d.appendChild(bx); m.appendChild(d); };
  const btn = (t, f, cls='btn sm') => { const b = document.createElement('button'); b.className = cls; b.textContent = t; b.onclick = () => { SFX.click(); f(); }; return b; };
  const rules = L.asc ? Array.from({length:L.asc},(_, i)=>ascRule(i+1).t).join(' · ') : 'Desactivada';
  row('⛰️', `Ascensión ${L.asc||'—'} <small style="color:#aaa">(máx. ${L.ascMax})</small>`, rules, [btn('−', ()=>{ L.asc = Math.max(0,(L.asc||0)-1); labSave(); labMenu(); }, 'btn dark sm'), btn('+', ()=>{ L.asc = Math.min(L.ascMax,(L.asc||0)+1); labSave(); labMenu(); }, 'btn dark sm')]);
  row('✨', 'Cartas evolucionadas', `Las cartas a nivel ${EVO_LVL} evolucionan: +20% vida y daño, más velocidad y aura dorada.`, [btn(L.evo?'ON':'OFF', ()=>{ L.evo = !L.evo; labSave(); labMenu(); }, L.evo?'btn sm':'btn dark sm')]);
  row('🗼', 'Torre sin fin', `Batallas sin parar, cada vez más duras. Récord: ${L.endlessBest} pisos.`, [btn('Jugar', ()=>{ closeModal(); startEndless(); })]);
  row('👑', 'Jefe de la semana', `${FACTIONS[W0.fac].boss} · <b>${W0.mod.n}</b>: ${W0.mod.d}${L.weekWin===W0.wk?' ✅':''}`, [btn('Luchar', ()=>{ closeModal(); startWeekly(); })]);
  row('🎬', 'Repetición', REPLAY ? `Última batalla: ${REPLAY.name}` : 'Juega una batalla y podrás volver a verla.', [btn('Ver', showReplay, REPLAY?'btn sm':'btn dark sm')]);
  row('🛡️', 'Guardianes', `Solo la torre del rey y 2 puestos: deja una tropa de guardián (×2 de vida, no se mueve) o tócala para soltarla. Victorias: ${L.guardWins||0}`, [btn('Jugar', ()=>{ closeModal(); startGuard(); })]);
  row('⚔️', 'Duelo en el mismo móvil', 'Dos jugadores: uno abajo y otro arriba, con el móvil en la mesa.', [btn('Jugar', ()=>{ closeModal(); startDuel(); })]);
  row('🎉', 'Evento de fin de semana', 'Forzar el evento también entre semana, para probarlo.', [btn(L.evForce?'ON':'OFF', ()=>{ L.evForce = !L.evForce; labSave(); labMenu(); }, L.evForce?'btn sm':'btn dark sm')]);
  row('🎡', 'Ruleta diaria', `Racha: ${L.streak} día(s)${L.spinDay===todayStr()?' · ya has girado hoy':''}`, [btn('Abrir', showSpin)]);
  const c = document.createElement('button'); c.className = 'btn dark sm'; c.textContent = 'Cerrar'; c.onclick = () => { m.style.maxHeight = ''; m.style.overflowY = ''; closeModal(); }; m.appendChild(c);
  $('modal').classList.add('on');
}

$('bLab').onclick = () => { SFX.click(); labMenu(); };
const _closeModal = closeModal;
closeModal = function(){ const m = $('modalBody'); m.style.maxHeight = ''; m.style.overflowY = ''; _closeModal(); };

// ================= 🛡️ MODO GUARDIANES =================
// Solo la torre del rey. En los huecos de las torres laterales hay 2 puestos:
// arrastra una tropa a un puesto y se queda de guardián (quieta, ×2 de vida).
// Tócala para soltarla y que avance como una tropa normal.
const GUARD_X = [3.5, 14.5], GUARD_SNAP = 2.0, GUARD_HP = 2;
const isGuardMode = () => B && B.enc && B.enc.guard;

function guardPosts(side){ return B.posts ? B.posts[side] : []; }
function postAlive(p){ p.units = p.units.filter(u => u.hp>0 && u.guard); return p.units.length>0; }
function nearPost(side, x, y){
  let best = null, bd = GUARD_SNAP;
  for(const p of guardPosts(side)){ const d = Math.hypot(p.x-x, p.y-y); if(d<=bd && !postAlive(p)){ bd = d; best = p; } }
  return best;
}
function canGuard(c){ return c && !c.spell && !c.building && !c.hero && c.speed>0; }
function releasePost(p, who){
  const us = p.units.filter(u=>u.hp>0); if(!us.length) return;
  for(const u of us){ u.guard = false; u.maxHp /= GUARD_HP; u.hp = Math.min(u.hp, u.maxHp); u.retarget = 0; u.target = null; u.locked = false;
    B.fx.push({k:'ring', x:u.x, y:u.y, r0:0.3, r1:1.6, t:0, life:0.5, col:'#ffe066'}); }
  p.units = [];
  part('text', p.x, p.y-1.6, {txt: who==='p' ? '¡Al ataque!' : '¡Sale su guardián!', col: who==='p' ? '#ffe066' : '#ff9a9a', life:1.1});
  SFX.crown(); if(who==='p') buzz(30);
}

// --- arranque: quitar torres laterales, activar el rey y crear puestos ---
const _gStartBattle = startBattle;
startBattle = function(enc, onEnd){
  _gStartBattle(enc, onEnd);
  if(!enc.guard) return;
  B.ents = B.ents.filter(e => !(e.type==='tower' && !e.king));
  for(const t of B.ents) if(t.type==='tower' && t.king) t.active = true;
  B.posts = {p: GUARD_X.map(x=>({x, y:frontY('p',x), units:[]})), e: GUARD_X.map(x=>({x, y:frontY('e',x), units:[]}))};
  B.e.gT = 1.5 + B.rng()*1.5;
  const fb = B; setTimeout(()=>{ if(B===fb && !B.over) toast('🛡️ Arrastra una tropa a un puesto para dejarla de guardián. Tócala para soltarla.', 4200); }, 2000);
};

// --- en este modo solo se despliega en tu mitad (no hay torres que abrir carril) ---
const _gPrincessAlive = princessAlive;
princessAlive = function(side, lane){ return isGuardMode() ? true : _gPrincessAlive(side, lane); };

// --- soltar una carta cerca de un puesto libre = guardián ---
const _gSpawnCard = spawnCard;
spawnCard = function(side, card, x, y){
  const p = isGuardMode() && canGuard(CARDS[card.key]) ? nearPost(side, x, y) : null;
  if(!p) return _gSpawnCard(side, card, x, y);
  const n0 = B.ents.length;
  _gSpawnCard(side, card, p.x, p.y);
  for(let i=n0;i<B.ents.length;i++){ const u = B.ents[i]; if(u.type!=='unit' || u.side!==side) continue;
    u.guard = true; u.gx = u.x; u.gy = u.y; u.maxHp *= GUARD_HP; u.hp *= GUARD_HP; p.units.push(u); }
  B.fx.push({k:'ring', x:p.x, y:p.y, r0:0.4, r1:1.8, t:0, life:0.6, col:'#9fd0ff'});
  if(side==='p') part('text', p.x, p.y-1.5, {txt:'🛡️ Guardián', col:'#bfe2ff', life:1.0});
};

// --- el guardián no se mueve: ataca lo que entre en su alcance ---
const _gUpdUnit = updUnit;
updUnit = function(u, dt){
  if(!u.guard) return _gUpdUnit(u, dt);
  const sp = u.speed; u.speed = 0; _gUpdUnit(u, dt); u.speed = sp;
  if(u.target && edge(u, u.target) > u.range){ u.target = null; u.locked = false; }
  u.x = u.gx; u.y = u.gy;
};
const _gUpdateBattle = updateBattle;
updateBattle = function(dt){
  _gUpdateBattle(dt);
  if(!isGuardMode()) return;
  for(const e of B.ents) if(e.guard && e.hp>0){ e.x = e.gx; e.y = e.gy; }
};

// --- IA rival: pone guardianes y a veces los suelta ---
const _gAiThink = aiThink;
aiThink = function(dt){
  if(isGuardMode() && !B.enc.duel){
    const S = B.e; S.gT -= dt;
    if(S.gT <= 0){ S.gT = 1.6 + B.rng()*1.6;
      for(const p of guardPosts('e')){
        if(!postAlive(p)){
          const opts = S.hand.map((card,i)=>({card, i, c:CARDS[card.key]})).filter(o=>canGuard(o.c) && o.c.cost<=S.elixir);
          if(opts.length && (S.elixir>=5 || B.rng()<0.3)){
            opts.sort((a,b)=> (b.c.range>2?600:0) + b.c.hp*b.c.count - ((a.c.range>2?600:0) + a.c.hp*a.c.count) + (B.rng()-0.5)*500);
            playCard('e', opts[0].i, p.x, p.y); return;
          }
        } else {
          const pk = B.ents.find(t=>t.type==='tower'&&t.king&&t.side==='p');
          const threats = B.ents.filter(u=>u.type==='unit'&&u.side==='p'&&u.hp>0&&u.y<RB).length;
          const late = B.time < 70 || B.overtime;
          if(!threats && (late ? B.rng()<0.45 : B.rng()<0.12 && S.elixir>=6) || (pk && pk.hp/pk.maxHp<0.35 && B.rng()<0.5)){ releasePost(p, 'e'); return; }
        }
      }
    }
  }
  _gAiThink(dt);
};

// --- tocar a tu guardián lo suelta ---
cv.addEventListener('pointerdown', ev => {
  if(!running || !isGuardMode() || B.over || sel>=0) return;
  const pt = toTile(ev); if(!pt) return;
  for(const p of guardPosts('p')){ if(!postAlive(p)) continue;
    if(p.units.some(u => Math.hypot(u.x-pt.x, u.y-0.4-pt.y) < 1.3) || Math.hypot(p.x-pt.x, p.y-pt.y) < 1.2){ releasePost(p, 'p'); return; } }
});

// --- dibujo: puestos en el suelo y escudo sobre los guardianes ---
const _gDrawAnvil = drawAnvil;
drawAnvil = function(now){
  _gDrawAnvil(now);
  if(!isGuardMode()) return;
  const card = sel>=0 ? handCard(sel) : null, dragTroop = card && canGuard(CARDS[card.key]);
  for(const side of ['p','e']) for(const p of guardPosts(side)){
    const busy = postAlive(p), col = side==='p' ? '120,190,255' : '255,120,120';
    ctx.save();
    ctx.globalAlpha = 0.9; ctx.fillStyle = `rgba(40,40,50,0.35)`;
    ctx.beginPath(); ctx.ellipse(X(p.x), X(p.y+0.1), X(1.25), X(0.6), 0, 0, TAU); ctx.fill();
    ctx.lineWidth = Math.max(2, TS*0.12); ctx.strokeStyle = `rgba(${col},${busy?0.9:0.55+0.3*Math.sin(now*4)})`;
    if(!busy) ctx.setLineDash([X(0.3), X(0.2)]);
    ctx.beginPath(); ctx.ellipse(X(p.x), X(p.y+0.1), X(1.25), X(0.6), 0, 0, TAU); ctx.stroke(); ctx.setLineDash([]);
    if(!busy && side==='p'){
      ctx.globalAlpha = dragTroop ? 0.95 : 0.6; ctx.font = `900 ${X(0.9)}px Nunito`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillStyle = '#fff'; ctx.fillText('🛡️', X(p.x), X(p.y-0.2));
      if(dragTroop){ ctx.globalAlpha = 0.35 + 0.2*Math.sin(now*6); ctx.fillStyle = `rgb(${col})`; ctx.beginPath(); ctx.ellipse(X(p.x), X(p.y+0.1), X(GUARD_SNAP*0.75), X(GUARD_SNAP*0.36), 0, 0, TAU); ctx.fill(); }
    }
    ctx.restore();
  }
};
const _gDrawUnitE = drawUnitE;
drawUnitE = function(u, now){
  _gDrawUnitE(u, now);
  if(!u.guard || u.hp<=0 || (u.side==='e' && !visibleTo('p',u))) return;
  const y = u.y - u.r - 1.35 - (u.r>0.7?0.5:0) - (isAir(u)?1.0:0);
  ctx.save(); ctx.font = `900 ${X(0.62)}px Nunito`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.globalAlpha = 0.95; ctx.fillText('🛡️', X(u.x), X(y));
  if(u.side==='p' && sel<0){ ctx.globalAlpha = 0.55 + 0.35*Math.sin(now*3); ctx.font = `800 ${X(0.42)}px Nunito`; ctx.fillStyle = '#fff'; ctx.strokeStyle = 'rgba(0,0,0,0.7)'; ctx.lineWidth = 3;
    ctx.strokeText('toca: soltar', X(u.x), X(y-0.55)); ctx.fillText('toca: soltar', X(u.x), X(y-0.55)); }
  ctx.restore();
};

// --- arrancar el modo ---
function startGuard(){
  chooseFaction(fac => {
    RUN = tempRun(fac);
    const others = Object.keys(FACTIONS).filter(f => f!==fac), ef = pick(others);
    const enc = {type:'battle', row:5, faction:ef, mult:1, towerMul:1, regen:1, think:2.3, aggro:7, guard:true, towerDmg:1,
      name:'🛡️ Guardianes', subtitle:'Solo la torre del rey · 2 puestos de guardián', seed:(Math.random()*2**31)>>>0,
      deck: FACTIONS[ef].starter.map(k=>({key:k,lvl:1})), weather:'clear', terrain:'river'};
    running = true;
    startBattle(enc, res => {
      const best = META.lab.guardWins || 0; if(res.win){ META.lab.guardWins = best+1; labSave(); }
      infoModal(`<div style="font-size:52px">🛡️</div><h2 class="f">${res.win ? '¡Victoria!' : 'Derrota'}</h2><div class="sub">Modo Guardianes · contra ${FACTIONS[ef].name}<br>Victorias en este modo: ${META.lab.guardWins||0}</div>`);
      RUN = META.run || null; showTitle();
    });
  });
}

// ================= 🗼 MINI TORRE CENTRAL (elegible) =================
// La torre del centro es pequeña, está pegada al castillo y su tipo se elige al empezar:
//   ballista: solo tierra, mucho daño · antiair: solo voladores, rápida · garrison: mete una tropa dentro
const MINI_TYPES = {
  ballista: {ic:'🏹', name:'Ballesta',          desc:'Solo ataca tropas de tierra. Mucho daño y buen alcance.'},
  antiair:  {ic:'🎯', name:'Antiaérea',         desc:'Solo ataca voladores. Dispara muy rápido.'},
  garrison: {ic:'🛡️', name:'Torre de guardia',  desc:'Arrastra una tropa encima y entra dentro: ataca con su arma y más alcance. Puedes cambiarla cuando quieras.'},
};
const MINI_HP = 0.6, MINI_R = 0.75, GAR_SNAP = 2.3;
const miniOf = side => B && B.ents.find(t=>t.type==='tower' && t.mini && t.side===side && t.hp>0);

function applyMini(t, k){
  const base = 55 * B[t.side].mods.towerDmg;
  t.ctype = k; t.gar = null; t.air = true; t.ground = true; t.splash = 0; t.pk = 'tarrow';
  if(k==='ballista'){ t.dmg = base*1.7; t.hs = 1.1; t.range = 7.5; t.air = false; t.pk = 'bolt'; }
  else if(k==='antiair'){ t.dmg = base*1.05; t.hs = 0.5; t.range = 8.5; t.ground = false; }
  else { t.dmg = 0; t.range = 0; }
}
function garrison(t, card){
  const c = CARDS[card.key], L = card.lvl || 1;
  t.gar = {key:card.key, lvl:L};
  t.dmg = c.dmg * Math.min(c.count||1, 3) * 0.7 * (1 + 0.1*(L-1));
  t.hs = Math.max(0.5, c.hs || 1); t.range = Math.min(8, Math.max(c.range||0.5, 1) + 4.5);
  t.air = !!(c.air || (c.range||0) > 1.5 || c.hitsAir); t.ground = true;
  t.splash = c.splash || 0; t.pk = c.proj || 'tarrow'; t.cd = 0.3;
  B.fx.push({k:'ring', x:t.x, y:t.y, r0:0.3, r1:1.8, t:0, life:0.5, col:'#9fd0ff'});
  part('text', t.x, t.y-2.4, {txt:'🛡️ '+c.name, col: t.side==='p' ? '#bfe2ff' : '#ffb0b0', life:1.2});
}
function pickMini(cb){
  const m = $('modalBody');
  m.innerHTML = `<h2 class="f">Tu mini torre</h2><div class="sub">Protege tu castillo desde el centro. Elige cómo será durante toda esta aventura.</div>`;
  for(const [k,v] of Object.entries(MINI_TYPES)){
    const b = document.createElement('div'); b.className = 'upg'; b.style.cursor = 'pointer';
    b.innerHTML = `<div style="font-size:30px;width:40px;text-align:center">${v.ic}</div><div class="t"><b>${v.name}</b><span>${v.desc}</span></div>`;
    b.onclick = () => { closeModal(); cb(k); };
    m.appendChild(b);
  }
  $('modal').classList.add('on');
}

const _mStartBattle = startBattle;
startBattle = function(enc, onEnd){
  _mStartBattle(enc, onEnd);
  if(enc.guard) return;
  for(const t of B.ents) if(t.type==='tower' && !t.king && Math.abs(t.x-9)<0.1){
    t.mini = true; t.r *= MINI_R; t.maxHp = Math.round(t.maxHp*MINI_HP); t.hp = Math.min(t.hp, t.maxHp);
  }
  const et = miniOf('e'); if(et) applyMini(et, ['ballista','antiair','garrison'][(B.seed>>>3)%3]);
  const pt = miniOf('p'); if(!pt) return;
  if(RUN && RUN.ctype){ applyMini(pt, RUN.ctype); return; }
  applyMini(pt, 'ballista');
  if(window.QA_NOPICK) return;
  running = false; const fb = B;
  pickMini(k => { if(RUN) RUN.ctype = k; if(B===fb) applyMini(pt, k); try{ if(typeof saveRun==='function') saveRun(); }catch(e){} running = true; lastT = performance.now(); });
};

// ataque de la mini torre según su tipo
const _mUpdTower = updTower;
updTower = function(t, dt){
  if(!t.mini) return _mUpdTower(t, dt);
  if(t.recoil>0) t.recoil -= dt;
  t.cd = Math.max(0, t.cd-dt);
  if(!t.dmg) return;
  const ok = e => e.type==='unit' && e.side!==t.side && e.hp>0 && !(e.deploy>0) && !e.hidden && (isAir(e) ? t.air : t.ground);
  let tg = t.target; if(!tg || !ok(tg) || dist(t,tg)-tg.r > t.range) tg = null;
  if(!tg){ let bd = 1e9; for(const e of B.ents){ if(!ok(e)) continue; const d = dist(t,e)-e.r; if(d<=t.range && d<bd){ bd = d; tg = e; } } }
  t.target = tg;
  if(tg && t.cd<=0){ t.cd = t.hs; t.recoil = 0.15; const sy = t.y - 1.8;
    B.projs.push({kind:t.pk, x:t.x, y:sy, sx:t.x, sy, tx:tg.x, ty:tg.y, target:tg, dmg:t.dmg, splash:t.splash, side:t.side, speed:14, t:0}); SFX.arrow(); }
};

// soltar una tropa sobre tu torre de guardia → entra dentro
const _mSpawnCard = spawnCard;
spawnCard = function(side, card, x, y){
  const t = miniOf(side), c = CARDS[card.key];
  if(t && t.ctype==='garrison' && c && !c.spell && !c.building && !c.hero && c.speed>0 && Math.hypot(t.x-x, t.y-y) <= GAR_SNAP) return garrison(t, card);
  return _mSpawnCard(side, card, x, y);
};

// la IA llena su torre de guardia
const _mAiThink = aiThink;
aiThink = function(dt){
  const t = miniOf('e');
  if(t && t.ctype==='garrison' && !t.gar && !B.enc.duel){
    B.e.garT = (B.e.garT||2.5) - dt;
    if(B.e.garT<=0){ B.e.garT = 2;
      const o = B.e.hand.map((card,i)=>({c:CARDS[card.key], i})).filter(o=>!o.c.spell && !o.c.building && o.c.speed>0 && o.c.cost<=B.e.elixir).sort((a,b)=>(b.c.range>2)-(a.c.range>2))[0];
      if(o){ playCard('e', o.i, t.x, t.y); return; } }
  }
  _mAiThink(dt);
};

// dibujo: icono del tipo y aviso de "pon una tropa"
const _mDrawTowerE = drawTowerE;
drawTowerE = function(t, now){
  _mDrawTowerE(t, now);
  if(!t.mini || t.hp<=0 || !t.ctype) return;
  const y = t.y - 2.75;
  ctx.save(); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = `900 ${X(0.55)}px Nunito`; ctx.fillText(MINI_TYPES[t.ctype].ic, X(t.x + 0.95), X(y + 0.6));
  if(t.side==='p' && t.ctype==='garrison'){
    const card = sel>=0 ? handCard(sel) : null, c = card && CARDS[card.key], drag = c && !c.spell && !c.building && !c.hero && c.speed>0;
    if(!t.gar || drag){
      ctx.globalAlpha = drag ? 0.45 + 0.25*Math.sin(now*6) : 0.5 + 0.3*Math.sin(now*3);
      ctx.strokeStyle = '#9fd0ff'; ctx.lineWidth = Math.max(2, TS*0.1); ctx.setLineDash([X(0.25), X(0.18)]);
      ctx.beginPath(); ctx.ellipse(X(t.x), X(t.y+0.3), X(GAR_SNAP*0.8), X(GAR_SNAP*0.42), 0, 0, TAU); ctx.stroke(); ctx.setLineDash([]);
      if(!t.gar){ ctx.globalAlpha = 0.9; ctx.font = `800 ${X(0.4)}px Nunito`; ctx.fillStyle = '#fff'; ctx.strokeStyle = 'rgba(0,0,0,0.7)'; ctx.lineWidth = 3;
        ctx.strokeText('pon una tropa', X(t.x), X(y)); ctx.fillText('pon una tropa', X(t.x), X(y)); }
    }
  }
  ctx.restore();
};

// ================= PROGRESO Y ENGANCHE =================
// misiones, pase de temporada, logros, álbum, aspectos, racha, eventos de fin de semana, música, ajustes
META.m2 = Object.assign({xp:0, season:'', passClaimed:0, stats:{}, ach:[], daily:null, weekly:null, seen:[], skins:['none'], skin:'none', streak:0, bestStreak:0, music:true, albumDone:[]}, META.m2 || {});
const M2 = META.m2;
const monthStr = () => new Date().toISOString().slice(0,7);
const st = k => M2.stats[k] || 0;
function stAdd(k, n=1){ M2.stats[k] = st(k) + n; }

// ---------- MÚSICA (generada en directo, sin archivos) ----------
const MUSIC = (() => {
  let ac = null, out = null, timer = null, mode = null, step = 0, nextT = 0;
  const N = n => 440*Math.pow(2, (n-69)/12);
  const SONGS = {
    menu:  {bpm:92,  prog:[[57,60,64],[53,57,60],[60,64,67],[55,59,62]], bass:[45,41,48,43], arp:[0,1,2,1], drum:0,   vol:0.10},
    map:   {bpm:100, prog:[[50,53,57],[55,58,62],[53,57,60],[52,55,59]], bass:[38,43,41,40], arp:[0,2,1,2], drum:0.5, vol:0.10},
    battle:{bpm:132, prog:[[57,60,64],[55,59,62],[53,57,60],[52,56,59]], bass:[45,43,41,40], arp:[0,1,2,0,2,1,2,1], drum:1, vol:0.12},
    boss:  {bpm:140, prog:[[52,55,59],[53,56,60],[50,53,57],[52,56,59]], bass:[40,41,38,40], arp:[0,2,1,2,0,1,2,2], drum:1.2, vol:0.13}};
  function init(){ if(ac) return; try{ ac = new (window.AudioContext||window.webkitAudioContext)(); out = ac.createGain(); out.gain.value = 0; out.connect(ac.destination); }catch(e){ ac = null; } }
  function note(f, t, d, type, v){ const o = ac.createOscillator(), g = ac.createGain(); o.type = type; o.frequency.value = f; g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t+0.02); g.gain.exponentialRampToValueAtTime(0.0001, t+d); o.connect(g); g.connect(out); o.start(t); o.stop(t+d+0.05); }
  function kick(t, v){ const o = ac.createOscillator(), g = ac.createGain(); o.frequency.setValueAtTime(130, t); o.frequency.exponentialRampToValueAtTime(40, t+0.15); g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.0001, t+0.2); o.connect(g); g.connect(out); o.start(t); o.stop(t+0.25); }
  function hat(t, v){ const len = Math.floor(ac.sampleRate*0.05), b = ac.createBuffer(1, len, ac.sampleRate), d = b.getChannelData(0); for(let i=0;i<len;i++) d[i] = (Math.random()*2-1)*(1-i/len); const s = ac.createBufferSource(); s.buffer = b; const f = ac.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 6000; const g = ac.createGain(); g.gain.value = v; s.connect(f); f.connect(g); g.connect(out); s.start(t); }
  function tick(){
    if(!ac || !mode) return; const S = SONGS[mode], spb = 60/S.bpm/2;
    while(nextT < ac.currentTime + 0.25){
      const bar = Math.floor(step/8) % 4, chord = S.prog[bar], i = step % 8;
      if(i===0){ chord.forEach(n => note(N(n), nextT, spb*7.5, 'triangle', S.vol*0.35)); note(N(S.bass[bar]), nextT, spb*3.5, 'sine', S.vol*0.9); }
      if(i===4) note(N(S.bass[bar]+(mode==='boss'?0:7)), nextT, spb*3, 'sine', S.vol*0.6);
      const a = S.arp[i % S.arp.length]; note(N(chord[a]+12), nextT, spb*0.9, 'square', S.vol*0.11);
      if(S.drum){ if(i%4===0) kick(nextT, 0.35*S.drum*S.vol*6); if(i%2===1) hat(nextT, 0.05*S.drum); }
      nextT += spb; step++;
    }
  }
  return {
    play(m){ if(!META.sound || M2.music===false){ this.stop(); return; } init(); if(!ac) return; if(ac.state==='suspended') ac.resume(); if(mode===m) return;
      mode = m; step = 0; nextT = ac.currentTime + 0.1; out.gain.cancelScheduledValues(ac.currentTime); out.gain.setTargetAtTime(0.9, ac.currentTime, 0.4);
      if(!timer) timer = setInterval(tick, 90); },
    stop(){ mode = null; if(out && ac) out.gain.setTargetAtTime(0, ac.currentTime, 0.2); },
  };
})();
const _showScreen = showScreen;
showScreen = function(id){
  _showScreen(id);
  const m = id==='battle' ? (B && B.enc && (B.enc.boss||B.enc.mboss) ? 'boss' : 'battle') : id==='map' ? 'map' : 'menu';
  MUSIC.play(m);
};
document.addEventListener('pointerdown', () => { if(curScreen) MUSIC.play(curScreen==='battle' ? 'battle' : curScreen==='map' ? 'map' : 'menu'); }, {once:true});

// ---------- XP y PASE DE TEMPORADA ----------
const PASS_LEVELS = 30, XP_LVL = 100;
const SKINS = {none:'Normal', human:'Piedra del Reino', orc:'Empalizada Orca', elf:'Mármol Élfico', undead:'Cripta Oscura'};
function passReward(l){ // l = 1..30
  if(l===5) return {skin:'orc'}; if(l===20) return {skin:'undead'}; if(l===30) return {skin:'human', s:30};
  if(l%5===0) return {s:12}; if(l%3===0) return {spin:1}; return {s: 3 + Math.floor(l/6)};
}
function passLevel(){ return Math.min(PASS_LEVELS, Math.floor(M2.xp/XP_LVL)); }
function checkSeason(){ const m = monthStr(); if(M2.season!==m){ M2.season = m; M2.xp = 0; M2.passClaimed = 0; } }
function gainXP(n, why){
  checkSeason(); const before = passLevel(); M2.xp += n; const after = passLevel();
  for(let l=before+1; l<=after; l++){ const R = passReward(l); let txt = '';
    if(R.s){ META.shards += R.s; txt += `💠 +${R.s} `; }
    if(R.skin && !M2.skins.includes(R.skin)){ M2.skins.push(R.skin); txt += `🏰 Aspecto: ${SKINS[R.skin]} `; }
    if(R.spin){ META.lab.spinDay = ''; txt += '🎡 Tirada extra de ruleta'; }
    M2.passClaimed = l; setTimeout(() => toast(`🏅 Pase nivel ${l}: ${txt}`), 400 + (l-before)*900); buzz(40); }
  saveMeta();
}

// ---------- MISIONES ----------
const MISSIONS = [
  {id:'win',   t:n=>`Gana ${n} batallas`, ev:'win', d:[3,5], w:[15,25]},
  {id:'crown', t:n=>`Consigue ${n} coronas`, ev:'crown', d:[8,12], w:[40,60]},
  {id:'kill',  t:n=>`Elimina ${n} tropas enemigas`, ev:'kill', d:[60,100], w:[300,450]},
  {id:'spell', t:n=>`Lanza ${n} hechizos`, ev:'spell', d:[6,10], w:[30,45]},
  {id:'hero',  t:n=>`Llama a tu héroe ${n} ${n===1?'vez':'veces'}`, ev:'hero', d:[2,4], w:[10,15]},
  {id:'fuse',  t:n=>`Haz ${n} ${n===1?"fusión":"fusiones"}`, ev:'fuse', d:[1,2], w:[5,8]},
  {id:'perfect',t:n=>`Gana ${n} ${n===1?'batalla':'batallas'} sin perder torres`, ev:'perfect', d:[1,2], w:[5,8]},
  {id:'elite', t:n=>`Derrota ${n} ${n===1?'élite o jefe':'élites o jefes'}`, ev:'elite', d:[1,2], w:[5,8]},
  {id:'air',   t:n=>`Despliega ${n} tropas voladoras`, ev:'air', d:[5,8], w:[25,40]},
  {id:'build', t:n=>`Coloca ${n} edificios`, ev:'build', d:[2,4], w:[10,16]},
  {id:'floor', t:n=>`Supera ${n} pisos de aventura`, ev:'floor', d:[4,6], w:[20,30]},
  {id:'mode',  t:n=>`Juega ${n} ${n===1?'vez':'veces'} Torre sin fin o Jefe semanal`, ev:'mode', d:[1,1], w:[3,5]}];
function genMissions(kind){ const seed = hashStr(kind + (kind==='daily' ? todayStr() : String(weekNum()))), r = mulberry32(seed);
  const pool = MISSIONS.slice(); const out = [];
  for(let i=0;i<3;i++){ const m = pool.splice(Math.floor(r()*pool.length),1)[0]; const rng = kind==='daily' ? m.d : m.w; out.push({id:m.id, goal: rng[0] + Math.floor(r()*(rng[1]-rng[0]+1)), p:0, done:false}); }
  return {key: kind==='daily' ? todayStr() : weekNum(), list: out}; }
function missions(){ if(!M2.daily || M2.daily.key!==todayStr()) M2.daily = genMissions('daily'); if(!M2.weekly || M2.weekly.key!==weekNum()) M2.weekly = genMissions('weekly'); return [M2.daily, M2.weekly]; }
function track(ev, n=1){
  if(!n) return; stAdd(ev, n);
  const [d, w] = missions();
  for(const [set, rew] of [[d,{s:3,xp:40}],[w,{s:10,xp:150}]]) for(const m of set.list){
    if(m.done || MISSIONS.find(x=>x.id===m.id).ev!==ev) continue;
    m.p = Math.min(m.goal, m.p + n);
    if(m.p>=m.goal){ m.done = true; META.shards += rew.s; setTimeout(()=>{ toast(`🎯 Misión completada: ${MISSIONS.find(x=>x.id===m.id).t(m.goal)} · 💠 +${rew.s}`); SFX.coin(); buzz(50); }, 300); gainXP(rew.xp); }
  }
  checkAch();
}

// ---------- LOGROS ----------
const ACH = [];
const A = (id, ic, n, d, f, s=5) => ACH.push({id, ic, n, d, f, s});
[[1,'Primera sangre'],[10,'Soldado'],[50,'Veterano'],[200,'Señor de la guerra'],[500,'Leyenda']].forEach(([n,t],i)=>A('win'+n,'⚔️',t,`Gana ${n} batallas`,()=>st('win')>=n, [3,5,10,20,40][i]));
[[25,'Coronado'],[150,'Rompetorres'],[600,'Derribador']].forEach(([n,t],i)=>A('crown'+n,'👑',t,`Consigue ${n} coronas`,()=>st('crown')>=n,[4,10,25][i]));
[[100,'Cazador'],[1000,'Exterminador'],[5000,'Plaga andante']].forEach(([n,t],i)=>A('kill'+n,'💀',t,`Elimina ${n} tropas`,()=>st('kill')>=n,[4,10,25][i]));
[[1,'Aprendiz de herrero'],[10,'Forjador'],[40,'Maestro forjador']].forEach(([n,t],i)=>A('fuse'+n,'⚒️',t,`Haz ${n} ${n===1?"fusión":"fusiones"}`,()=>st('fuse')>=n,[3,8,20][i]));
[[1,'Sin un rasguño'],[10,'Muralla viviente']].forEach(([n,t],i)=>A('perf'+n,'🛡️',t,`Gana ${n} ${n===1?'batalla':'batallas'} sin perder torres`,()=>st('perfect')>=n,[5,15][i]));
['human','orc','undead'].forEach(f=>A('run_'+f, FACTIONS[f].ic, 'Campeón: '+FACTIONS[f].name, `Gana una aventura con ${FACTIONS[f].name}`, ()=>st('runwin_'+f)>=1, 15));
A('allfac','🌍','Señor de los tres bandos','Gana una aventura con cada bando',()=>['human','orc','undead'].every(f=>st('runwin_'+f)>=1),40);
Object.keys(HEROES).forEach(h=>A('hero_'+h,'🦸',HEROES[h].name,`Gana una aventura con ${HEROES[h].name}`,()=>st('herowin_'+h)>=1,8));
[[5,'En racha'],[15,'Imparable']].forEach(([n,t],i)=>A('streak'+n,'🔥',t,`Gana ${n} batallas seguidas`,()=>M2.bestStreak>=n,[5,15][i]));
[[10,'Escalador'],[25,'Rascacielos']].forEach(([n,t],i)=>A('endless'+n,'🗼',t,`Supera ${n} pisos en la Torre sin fin`,()=>(META.lab.endlessBest||0)>=n,[8,20][i]));
[[3,'Ascendido'],[10,'Cumbre'],[20,'Más allá']].forEach(([n,t],i)=>A('asc'+n,'⛰️',t,`Desbloquea Ascensión ${n}`,()=>(META.lab.ascMax||1)>=n,[8,20,50][i]));
A('weekly','👑','Matajefes','Derrota a un Jefe de la semana',()=>st('weeklywin')>=1,10);
A('album','📖','Coleccionista','Completa el álbum de un bando',()=>M2.albumDone.length>=1,15);
A('pass','🏅','Temporada completa','Llega al nivel 30 del pase',()=>passLevel()>=30,30);
A('spin7','🎡','Fiel','Consigue una racha de 7 días en la ruleta',()=>st('spin7')>=1,10);
A('evo','✨','Evolución','Juega una carta evolucionada',()=>st('evo')>=1,5);
A('duel','⚔️','Cara a cara','Juega un duelo en el mismo móvil',()=>st('duel')>=1,3);
function checkAch(){
  for(const a of ACH){ if(M2.ach.includes(a.id) || !a.f()) continue; M2.ach.push(a.id); META.shards += a.s;
    setTimeout(()=>{ toast(`🏆 Logro: ${a.n} · 💠 +${a.s}`); SFX.crown(); buzz([30,30,60]); }, 700); }
  saveMeta();
}

// ---------- ÁLBUM ----------
function markSeen(keys){ let ch = false; for(const k of keys) if(!M2.seen.includes(k)){ M2.seen.push(k); ch = true; } if(ch) checkAlbum(); }
function albumOf(f){ return Object.keys(CARDS).filter(k => !CARDS[k].hidden && (CARDS[k].fac||'human')===f && !CARDS[k].hero); }
function checkAlbum(){ for(const f of ['human','orc','undead','merc']){ const all = albumOf(f); if(!M2.albumDone.includes(f) && all.length && all.every(k=>M2.seen.includes(k))){ M2.albumDone.push(f); META.shards += 15; toast(`📖 ¡Álbum de ${f==='merc'?'Cazarrecompensas':FACTIONS[f].name} completo! 💠 +15`); } } }

// ---------- EVENTOS DE FIN DE SEMANA ----------
const WKEVENTS = [
  {k:'elixir', n:'Elixir infinito', d:'Fin de semana loco: los dos bandos recargan elixir el triple de rápido.'},
  {k:'mirror', n:'Espejo', d:'El rival juega con tu mismo mazo.'},
  {k:'giants', n:'Gigantes', d:'Todas las tropas tienen +50% de vida.'},
  {k:'fast',   n:'A toda prisa', d:'Todas las tropas corren un 40% más.'}];
function weekendEvent(force){ const d = new Date().getDay(); if(!force && d!==0 && d!==6 && !META.lab.evForce) return null; return WKEVENTS[weekNum() % WKEVENTS.length]; }

// ---------- SEGUIMIENTO DE BATALLAS ----------
const _startBattle2 = startBattle;
startBattle = function(enc, onEnd){
  const ev = (!enc.duel && !enc.mode) ? weekendEvent() : null;
  if(ev && ev.k==='mirror' && RUN && RUN.deck) enc.deck = RUN.deck.map(c=>({key:c.key, lvl:c.lvl}));
  if(ev) enc.subtitle = (enc.subtitle||'') + ' · 🎉 ' + ev.n;
  const facNow = RUN && RUN.faction;
  _startBattle2(enc, res => {
    if(!enc.duel){
      track('battle'); if(res.win) track('win'); track('crown', res.crowns); track('kill', res.stats.kills||0);
      if(res.win && res.eCrowns===0) track('perfect'); if(res.win && (enc.elite||enc.boss||enc.mboss)) track('elite');
      if(RUN && (RUN.endless || enc.name && enc.name.indexOf('semana')>=0)) track('mode');
      if(res.win && enc.name && enc.name.indexOf('Jefe de la semana')>=0) stAdd('weeklywin');
      if(res.win){ M2.streak++; M2.bestStreak = Math.max(M2.bestStreak, M2.streak); const bonus = M2.streak===5 ? 3 : M2.streak===10 ? 6 : M2.streak===20 ? 12 : 0; if(bonus){ META.shards += bonus; setTimeout(()=>toast(`🔥 ¡${M2.streak} victorias seguidas! 💠 +${bonus}`), 1200); } }
      else M2.streak = 0;
      gainXP(res.win ? 20 + res.crowns*5 : 8 + res.crowns*3);
      checkAch();
    } else stAdd('duel');
    onEnd(res);
  });
  if(ev && B){ if(ev.k==='elixir'){ B.p.mods.regen *= 3; B.e.mods.regen *= 3; } if(ev.k==='giants'){ B.p.mods.hp *= 1.5; B.e.mods.hp *= 1.5; } if(ev.k==='fast'){ B.p.mods.speed *= 1.4; B.e.mods.speed *= 1.4; } }
  if(RUN && RUN.deck) markSeen(RUN.deck.map(c=>c.key));
};
const _playCard2 = playCard;
playCard = function(side, idx, x, y){
  const card = side==='p' ? (idx===4 ? B.p.heroCard : B.p.hand[idx]) : null;
  const ok = _playCard2(side, idx, x, y);
  if(ok!==false && side==='p' && card && !B.enc.duel){ const c = CARDS[card.key]; buzz(15);
    if(c.spell) track('spell'); if(c.hero) track('hero'); if(c.air) track('air'); if(c.building) track('build');
    if(META.lab.evo && card.lvl>=5 && !c.spell && !c.building) stAdd('evo'); }
  return ok;
};
const _endRun2 = endRun;
endRun = function(victory){
  const R = RUN; if(R && !R.lab){ track('floor', R.stats.floors||0); track('fuse', R.stats.fusions||0); if(victory){ stAdd('runwin_'+(R.faction||'human')); if(R.hero) stAdd('herowin_'+R.hero); } }
  _endRun2(victory);
  // barras de progreso hacia lo siguiente
  const next = UNLOCKABLE.filter(u=>!META.unlocked.includes(u.key)).sort((a,b)=>a.cost-b.cost)[0];
  const bar = (lbl, v, max, col) => `<div style="margin:5px 0;text-align:left"><div style="font-size:12px;font-weight:800;display:flex;justify-content:space-between"><span>${lbl}</span><span>${v}/${max}</span></div><div style="height:9px;background:#0006;border-radius:6px;overflow:hidden"><div style="height:100%;width:${Math.min(100,v/max*100)}%;background:${col}"></div></div></div>`;
  const pl = passLevel(), [d] = missions();
  let html = `<div style="margin-top:10px;padding:8px 10px;background:#0003;border-radius:12px">`;
  if(next) html += bar(`🔓 ${CARDS[next.key].name}`, Math.min(META.shards, next.cost), next.cost, 'linear-gradient(90deg,#4ab0ff,#7fd8ff)');
  html += bar(`🏅 Pase · nivel ${pl+1}`, M2.xp % XP_LVL, XP_LVL, 'linear-gradient(90deg,#ffb020,#ffe066)');
  d.list.filter(m=>!m.done).slice(0,2).forEach(m => html += bar('🎯 '+MISSIONS.find(x=>x.id===m.id).t(m.goal), m.p, m.goal, 'linear-gradient(90deg,#5ad06a,#a8f0a0)'));
  html += `</div>`;
  $('ovStats').insertAdjacentHTML('beforeend', html);
};

// ---------- ASPECTOS DE TORRE ----------
const _getTower = getTower;
getTower = function(side, king, w, fac){ if(side==='p' && M2.skin && M2.skin!=='none' && curScreen==='battle') fac = M2.skin; return _getTower(side, king, w, fac); };

// ---------- MARCOS DE CARTA ----------
const _cardEl3 = cardEl;
cardEl = function(card, opts={}){
  const d = _cardEl3(card, opts), c = CARDS[card.key];
  const fk = c.hero ? 'marco_habilidad' : c.spell ? 'marco_hechizo' : c.rar===2 ? 'marco_fusion' : c.rar===1 ? 'marco_rara' : 'marco_comun';
  if(ART_SRC[fk] && !opts.mini){ const im = document.createElement('img'); im.className = 'frm'; im.src = ART_SRC[fk]; im.alt = ''; d.appendChild(im); }
  return d;
};

// ---------- PANTALLAS ----------
function m2Modal(title, sub){ const m = $('modalBody'); m.style.maxHeight = '88vh'; m.style.overflowY = 'auto'; m.innerHTML = `<h2 class="f">${title}</h2>${sub?`<div class="sub">${sub}</div>`:''}`; $('modal').classList.add('on'); return m; }
function closeBtn(m){ const c = document.createElement('button'); c.className = 'btn dark sm'; c.textContent = 'Cerrar'; c.onclick = closeModal; m.appendChild(c); }
const pbar = (v, max, col) => `<div style="height:8px;background:#0006;border-radius:6px;overflow:hidden;margin-top:3px"><div style="height:100%;width:${Math.min(100,v/max*100)}%;background:${col}"></div></div>`;
function showMissions(){
  const [d, w] = missions(); const m = m2Modal('🎯 Misiones', 'Las diarias se renuevan cada día y las semanales cada lunes.');
  for(const [set, tt, rew] of [[d,'Diarias','💠 3 · ⭐ 40 XP'],[w,'Semanales','💠 10 · ⭐ 150 XP']]){
    m.insertAdjacentHTML('beforeend', `<div style="font-weight:900;margin:8px 0 4px;color:var(--gold)">${tt} <small style="color:#aaa">(${rew} cada una)</small></div>`);
    set.list.forEach(x => m.insertAdjacentHTML('beforeend', `<div class="upg" style="margin-bottom:5px;display:block"><b>${x.done?'✅ ':''}${MISSIONS.find(y=>y.id===x.id).t(x.goal)}</b> <span style="float:right">${x.p}/${x.goal}</span>${pbar(x.p,x.goal,x.done?'#5ad06a':'linear-gradient(90deg,#4ab0ff,#7fd8ff)')}</div>`)); }
  closeBtn(m);
}
function showPass(){
  checkSeason(); const pl = passLevel(); const m = m2Modal('🏅 Pase de temporada', `Temporada ${M2.season} · nivel <b>${pl}</b>/${PASS_LEVELS} · ganas ⭐ XP en cada batalla y misión.`);
  m.insertAdjacentHTML('beforeend', pbar(M2.xp%XP_LVL, XP_LVL, 'linear-gradient(90deg,#ffb020,#ffe066)'));
  const g = document.createElement('div'); g.style.cssText = 'display:grid;grid-template-columns:repeat(5,1fr);gap:5px;margin:10px 0';
  for(let l=1;l<=PASS_LEVELS;l++){ const R = passReward(l), got = l<=pl;
    const ic = R.skin ? '🏰' : R.spin ? '🎡' : '💠'+R.s;
    g.insertAdjacentHTML('beforeend', `<div style="background:${got?'linear-gradient(#ffe066,#e09a1a)':'#2a2040'};color:${got?'#3a2000':'#fff'};border-radius:9px;padding:6px 2px;text-align:center;font-weight:900;font-size:12px;border:2px solid ${l===pl+1?'#7fd8ff':'#0000'}"><div style="font-size:10px;opacity:.75">${l}</div>${ic}</div>`); }
  m.appendChild(g); m.insertAdjacentHTML('beforeend', `<div class="sub">🏰 = aspecto de torre (niveles 5, 12, 20 y 30). Equípalo en ⚙️ Ajustes.</div>`); closeBtn(m);
}
function showAch(){
  const m = m2Modal('🏆 Logros', `${M2.ach.length}/${ACH.length} conseguidos`);
  const g = document.createElement('div'); g.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:5px;margin:8px 0';
  ACH.forEach(a => { const ok = M2.ach.includes(a.id); g.insertAdjacentHTML('beforeend', `<div style="background:${ok?'#3a5a2a':'#2a2040'};opacity:${ok?1:0.7};border-radius:10px;padding:6px;font-size:11px"><b style="font-size:12px">${a.ic} ${a.n}</b><div>${a.d}</div><div style="color:#7fd8ff">💠 ${a.s}${ok?' ✅':''}</div></div>`); });
  m.appendChild(g); closeBtn(m);
}
function showAlbum(f='human'){
  const facs = ['human','orc','undead','merc'], all = albumOf(f), seen = all.filter(k=>M2.seen.includes(k)).length;
  const m = m2Modal('📖 Álbum', `Las cartas aparecen al jugarlas en tu mazo. Completa un bando: 💠 +15`);
  const tabs = document.createElement('div'); tabs.style.cssText = 'display:flex;gap:4px;justify-content:center;flex-wrap:wrap;margin:6px 0';
  facs.forEach(x => { const b = document.createElement('button'); b.className = 'btn sm' + (x===f?'':' dark'); b.textContent = x==='merc' ? '⚔️' : FACTIONS[x].ic; b.onclick = () => showAlbum(x); tabs.appendChild(b); });
  m.appendChild(tabs); m.insertAdjacentHTML('beforeend', `<div class="sub">${f==='merc'?'Cazarrecompensas':FACTIONS[f].name}: ${seen}/${all.length}${M2.albumDone.includes(f)?' ✅':''}</div>` + pbar(seen, all.length, 'linear-gradient(90deg,#c070ff,#e8b0ff)'));
  const g = document.createElement('div'); g.className = 'gridCards'; g.style.marginTop = '8px';
  all.forEach(k => { const ce = cardEl({key:k, lvl:1}); if(!M2.seen.includes(k)){ ce.style.filter = 'grayscale(1) brightness(0.35)'; } else ce.onclick = () => cardInfo({key:k, lvl:1}); g.appendChild(ce); });
  m.appendChild(g); closeBtn(m);
}
function showModes(){
  const m = m2Modal('🎮 Modos de juego'); const W0 = weekInfo(), ev = weekendEvent(true);
  const row = (ic, t, d, lbl, f) => { const x = document.createElement('div'); x.className = 'upg'; x.style.marginBottom = '6px'; x.innerHTML = `<div style="font-size:28px">${ic}</div><div class="t"><b>${t}</b><span>${d}</span></div>`; const b = document.createElement('button'); b.className = 'btn sm'; b.textContent = lbl; b.onclick = () => { SFX.click(); f(); }; x.appendChild(b); m.appendChild(x); };
  row('🗼','Torre sin fin',`Récord: ${META.lab.endlessBest} pisos`,'Jugar',()=>{ closeModal(); startEndless(); });
  row('👑','Jefe de la semana',`${FACTIONS[W0.fac].boss} · ${W0.mod.n}${META.lab.weekWin===W0.wk?' ✅':''}`,'Luchar',()=>{ closeModal(); startWeekly(); });
  row('⚔️','Duelo en el mismo móvil','Dos jugadores, un móvil','Jugar',()=>{ closeModal(); startDuel(); });
  row('🎬','Repetición', REPLAY ? REPLAY.name : 'Juega una batalla primero','Ver', showReplay);
  m.insertAdjacentHTML('beforeend', `<div class="sub" style="margin-top:6px">🎉 Evento de fin de semana (sábado y domingo): <b>${ev.n}</b> — ${ev.d}</div>`);
  closeBtn(m);
}
function showSettings(){
  const m = m2Modal('⚙️ Ajustes');
  const tog = (lbl, get, set) => { const x = document.createElement('div'); x.className = 'upg'; x.style.marginBottom = '6px'; x.innerHTML = `<div class="t"><b>${lbl}</b></div>`; const b = document.createElement('button'); b.className = 'btn sm' + (get()?'':' dark'); b.textContent = get() ? 'ON' : 'OFF'; b.onclick = () => { set(!get()); saveMeta(); showSettings(); }; x.appendChild(b); m.appendChild(x); };
  tog('🔊 Efectos de sonido', ()=>META.sound, v=>{ META.sound = v; if(!v) MUSIC.stop(); });
  tog('🎵 Música', ()=>M2.music!==false && META.sound, v=>{ M2.music = v; if(v){ META.sound = true; MUSIC.play('menu'); } else MUSIC.stop(); });
  tog('📳 Vibración', ()=>META.vib!==false, v=>{ META.vib = v; if(v) buzz(40); });
  const sk = document.createElement('div'); sk.className = 'upg'; sk.style.cssText = 'margin-bottom:6px;display:block';
  sk.innerHTML = `<b>🏰 Aspecto de tus torres</b><div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:5px"></div>`;
  Object.keys(SKINS).forEach(k => { const own = M2.skins.includes(k), b = document.createElement('button'); b.className = 'btn sm' + (M2.skin===k?'':' dark'); b.textContent = (own?'':'🔒 ') + SKINS[k]; b.disabled = !own; b.onclick = () => { M2.skin = k; saveMeta(); showSettings(); }; sk.lastElementChild.appendChild(b); });
  m.appendChild(sk);
  const r = document.createElement('button'); r.className = 'btn dark sm'; r.textContent = '🗑️ Borrar todo el progreso'; r.style.marginTop = '6px';
  r.onclick = () => confirmModal('¿Borrar todo?', 'Perderás esquirlas, cartas, logros y partidas. No se puede deshacer.', () => { try{ localStorage.clear(); }catch(e){} location.reload(); });
  m.appendChild(r); closeBtn(m);
}

// ---------- PORTADA ----------
(function(){
  const menu = $('bMeta').parentElement;
  const row = document.createElement('div'); row.className = 'iconRow';
  [['🎯','Misiones',showMissions],['🏅','Pase',showPass],['🏆','Logros',showAch],['📖','Álbum',()=>showAlbum()],['🎡','Ruleta',showSpin],['🎮','Modos',showModes]].forEach(([ic, t, f]) => {
    const b = document.createElement('button'); b.className = 'iconTile'; b.innerHTML = `<span>${ic}</span><small>${t}</small>`; b.onclick = () => { SFX.click(); f(); }; row.appendChild(b); });
  menu.insertBefore(row, $('bLab'));
  $('bSound').textContent = '⚙️'; $('bSound').onclick = () => { SFX.click(); showSettings(); };
  const _st = showTitle;
  showTitle = function(){ _st(); $('bSound').textContent = '⚙️'; checkSeason(); missions();
    const ev = weekendEvent(); let ban = $('evBanner'); if(!ban){ ban = document.createElement('div'); ban.id = 'evBanner'; ban.className = 'evBanner'; menu.parentElement.insertBefore(ban, menu); }
    ban.style.display = ev ? '' : 'none'; if(ev) ban.innerHTML = `🎉 <b>Evento de fin de semana: ${ev.n}</b><br><small>${ev.d}</small>`;
    const pend = M2.daily.list.filter(m=>!m.done).length; const t = row.children[0].querySelector('small'); t.textContent = pend ? `Misiones (${pend})` : 'Misiones'; };
})();

// ================= GALACTIC: textos sin fantasía =================
(function(){
  const D = {
    knight:'Soldado resistente cuerpo a cuerpo con espada de plasma y escudo.',
    archer:'Dos fusileras que disparan a distancia.',
    goblin:'Tres drones pequeños y muy rápidos.',
    skel:'Cuatro reclutas baratos para distraer.',

    mage:'Lanza orbes de plasma con daño en área.',
    boar:'Moto veloz que carga contra las torres.',
    bomber:'Lanza granadas que dañan en área.',
    healer:'Cura a las tropas aliadas cercanas.',
    bats:'Cuatro drones voladores. El cuerpo a cuerpo no puede tocarlos.',
    dragon:'Dron que vuela sobre el río y lanza fuego en área.',
    hunter:'Rifle de precisión: hace daño triple a las tropas grandes (tanques).',
    ballista:'Torreta (30 s). Atrae a mechas y motos y dispara muy lejos.',
    berserk:'Herido por debajo de la mitad, golpea y corre mucho más rápido.',
    agolem:'Titán de combate: sus pisotones dañan a todo lo cercano.',
    stampede:'Tres motos de asalto a toda velocidad.',
    paladin:'Tanque con escudo de energía que cura a los aliados cercanos.',
    farcher:'Disparos incendiarios con daño en área.',
    necro:'Lanza minidrones sin parar.',
    colossus:'Al ser destruido explota causando muchísimo daño.',
    rider:'Piloto en exotraje. Su primer golpe hace doble daño.',
    horde:'Seis soldados a la carga. ¡Avalancha!',
    bombbarr:'La cápsula cae, explota y suelta tres minidrones.',
    infernal:'Nave de combate: vuela y arrasa grupos enteros con fuego.',
    mortar:'Cañón (35 s) que bombardea muy lejos. No puede disparar muy cerca.',
    icemage:'Disparos criogénicos que dañan en área y ralentizan.',
    warlord:'Tanque con hacha de energía: golpea en área y entra en furia al estar herido.',
    grunt:'Guerrero alienígena con caparazón: duro y barato.',
    axeman:'Gusano que dispara púas a media distancia.',
    wolves:'Tres bestias alienígenas rapidísimas.',
    sapper:'Corren hacia los edificios y explotan.',
    shaman:'Frenesí psíquico: los aliados cercanos atacan y corren más rápido.',
    wrider:'Salta el río por cualquier sitio y carga contra las torres.',
    boulder:'Un meteorito enorme cae del cielo.',
    ogre:'Gólem de cristal que pelea contra todo con golpes en área.',
    totem:'Pilón (30 s): los aliados cercanos pegan +45% y se curan.',
    warchief:'Señor alienígena gigante que enfurece a todo su ejército.',
    ogremage:'Bruto psíquico: resistente y con daño en área a distancia.',
    zeppelin:'Medusa voladora que suelta ácido sobre las torres. Solo la paran torres, distancia y hechizos.',
    wildpack:'Cinco bestias alienígenas furiosas.',
    catapult:'Lanzaesporas (35 s) que dispara muy lejos.',
    warlock:'Científico y sanador a la vez. Muy poderoso.',
    troll:'Escupe ácido de lejos y se regenera poco a poco (3% de vida por segundo).',
    kodo:'Gusano gigante con tambores: solo ataca edificios y tus tropas cercanas pegan +30%.',
    raider:'Corre a las torres. Cada golpe a un edificio te da medio elixir.',
    wyvern:'Alienígena a lomos de un insecto volador: dispara a aire y tierra.',
    peon:'Levanta una barricada (22 s) que atrae y frena a los enemigos.',
    elfarcher:'Dos androides con el mayor alcance del juego.',
    sentinel:'Asesina invisible: nadie puede atacarla hasta que da su primer golpe.',
    blade:'Muy rápido con sus dos cuchillas de plasma. Esquiva el 30% de los golpes.',
    wisps:'Tres orbes psíquicos voladores que lanzan descargas a corta distancia.',
    druid:'Cura a los aliados. Al quedar malherido muta en una bestia enorme.',
    bear:'La forma mutada del Mutante.',
    ent:'Mecha helado: cada golpe congela al enemigo y no le deja moverse.',
    hippo:'Nave rápida que ataca a aire y tierra.',
    starfall:'Esquirlas de estrellas caen sobre un área grande.',
    moonbless:'Un rayo de luz cura 450 de vida a tus tropas del área.',
    ancient:'Cerebro gigante: sus ondas psíquicas dañan e inmovilizan a todo lo cercano.',
    dryad:'Gran sanadora que invoca orbes psíquicos sin parar.',
    windrider:'Androide en plataforma voladora: dispara rayos que atraviesan grupos.',
    starstorm:'Una supernova gigante que además inmoviliza 2 s.',

    skarcher:'Tres torretas con patas, frágiles, que disparan a distancia.',
    vbat:'Tres microdrones voladores que absorben energía al atacar.',
  };
  if(CARDS.vbat) CARDS.vbat.name = 'Microdrones Chupavoltios';
  const D2 = {
    banshee:'Dron volador: su onda sónica daña en área y ralentiza.',
    dknight:'Tanque mecánico: golpea en área y absorbe energía.',
    abom:'Máquina trituradora que va a por las torres. Al romperse suelta una nube tóxica.',
    lich:'Robot con cañones de hielo: daño en área que ralentiza.',
    tombstone:'Fábrica (30 s) de la que salen robots sin parar.',
    gravehands:'Daña un poco y reactiva a cuatro robots de la chatarra.',
    bonedragon:'Dragón mecánico que escupe plasma en área.',
    reaper:'Su guadaña láser barre a todo lo cercano y le devuelve energía.',
    plaguecart:'Tanque que va a por las torres y estalla en gas tóxico al romperse.',
    vampire:'Absorbe mucha energía y lanza microdrones sin parar.',
    skmage:'Orbes de energía en área y robots obreros sin parar.',
    soulstorm:'Un vórtice de plasma: mucho daño en área y debilita 4 s.',
    pikeman:'Lanza de energía: golpea desde más lejos y hace doble daño a tropas grandes.',
    battlenun:'Pelea con su maza de energía y cura a los aliados cercanos.',
    gnomeeng:'Planta una torreta (28 s) que dispara muy rápido.',
    griffin:'Vuela rápido, ataca a aire y tierra y su primer golpe hace doble daño.',
    bard:'Su trompeta hace que los aliados cercanos ataquen y corran más rápido.',
    bcannon:'Cañón (30 s) barato que dispara proyectiles de riel.',
    templar:'Soldado pesado con espadón de energía: golpes en área.',
    princess:'Dispara rayos incendiarios desde muy, muy lejos.',
    dragonknight:'Piloto en caza de combate: resistente, vuela y quema en área.',
    oberserk:'Cuatro cuchillas y mucha furia: herido, pega y corre aún más.',
    slinger:'Dos alienígenas baratos que escupen ácido.',
    harpy:'Dos avispas gigantes voladoras con aguijones.',
    voodoo:'Cura a los aliados y sus esporas hacen que el enemigo pegue menos.',
    rocketgob:'Vuela directo a un edificio y explota.',
    scrapgolem:'Gusano acorazado que va a por las torres y explota al caer.',
    warboar:'Bestia acorazada: carga contra las torres con doble daño en el primer golpe.',
    ogreking:'Reina gigante de dos cabezas: golpes en área, furia y frenesí para los suyos.',
    ranger:'Dispara muy rápido con ayuda de su minidron.',
    unicorn:'Caballo mecánico: carga con su antena de energía.',
    fairydragon:'Pequeño dragón robot volador con rayos en área.',
    wolfwhisper:'Domador robot: cada poco llama a arañas robot para que peleen a su lado.',
    jadeblade:'Su alabarda de energía barre en área y esquiva el 20% de los golpes.',
    panther:'Invisible y veloz hasta que da su primer zarpazo.',
    enchantress:'Círculos de runas alienígenas en área que debilitan al enemigo.',
    speardancer:'Se teletransporta al otro lado del río y esquiva el 25%.',
    elfalch:'Lanza frascos biológicos que estallan en área.',
    moonwell:'Pozo de luz (35 s) que cura mucho a tus tropas cercanas.',
    thornwall:'Muro de cristal (25 s) que atrae al enemigo y pincha a todo el que se acerca.',
    healrain:'Una nube de energía cura 650 de vida a tus tropas en un área grande.',
    gargoyle:'Dron blindado: ataca a aire y tierra y aguanta mucho.',
    mummy:'Sus cables sabotean al enemigo: pega menos.',
    wraith:'Holograma volador: sus golpes ralentizan.',
    spiders:'Tres arañas robot rápidas cuyas picaduras ralentizan.',
    headless:'Corre veloz en su moto: su primer golpe hace doble daño.',
    hag:'Lanza químicos que dañan en área y ralentizan.',
    fleshgolem:'Gólem de chatarra que va a por las torres y se repara poco a poco.',
    skpirate:'Barato y con muy mal genio.',
    bonecolossus:'Coloso de hierro: va a por las torres y suelta robots obreros.',
    pirate:'Dispara su trabuco láser con daño en área.',
    dwarf:'Bajito y durísimo: cada poco golpea el suelo con su martillo neumático.',
    alchemist:'Frascos químicos que estallan en área y ralentizan.',
    bearrider:'Carga a lomos de un oso acorazado: el primer golpe hace doble daño.',
    djinn:'Flota y lanza energía del vacío con gran daño en área.',
    dwarfxbow:'Arpones que hacen doble daño a las tropas grandes.',
    spiderbot:'Pequeño piloto en un robot araña: trepa el río por cualquier sitio.',
    centaur:'Centauro cíborg: tirador rápido y resistente.',
    vskel:'Robot obrero barato.',
    h_smith:'Entra con su martillo de energía: golpea el suelo en área. Al llegar repara 350 de vida a todas tus torres.',
    h_paladin:'Tanque que cura. Al llegar da un escudo de 400 a tus tropas cercanas.',
    h_drummer:'Señor de la Colmena con tambores biológicos. Al llegar, TODAS tus tropas pegan +30% y atacan más rápido 6 s.',
    h_druid:'Gran sanadora psíquica. Al llegar inmoviliza 3 s a todas las tropas de tierra enemigas en tu mitad.',
    h_necro:'Lanza robots obreros sin parar. Al llegar activa cinco robots.',
    h_banshee:'Vuela y lanza ondas sónicas en área. Al llegar aturde 1,5 s y debilita 4 s a los enemigos a su alrededor.',
  };
  for(const k in D) if(CARDS[k]) CARDS[k].desc = D[k];
  for(const k in D2) if(CARDS[k]) CARDS[k].desc = D2[k];
  const HN = {smith:'Comandante Forja', paladin:'Capitán Égida', necro:'Núcleo Prime', banshee:'Dama Eco', drummer:'Rey de la Colmena', druid:'Oráculo Psíquico'};
  for(const id in HN){ HEROES[id].name = HN[id]; if(CARDS[HEROES[id].card]) CARDS[HEROES[id].card].name = HN[id]; }
  HEROES.druid.fac = 'orc';
  HEROES.necro.passive = 'Cuando cae una tropa tuya, 25% de que se active un robot obrero.';
  HEROES.druid.passive = 'Tus tropas se curan poco a poco en tu mitad del campo.';
  delete HEROES.moonarcher; delete HEROES.huntress;
  if(CARDS.h_moonarcher) CARDS.h_moonarcher.fac = 'retired';
  if(CARDS.h_huntress) CARDS.h_huntress.fac = 'retired';
  const R = {heart:['Núcleo Reforzado','+500 de vida máxima de tu base (y la repara 500).'], bones:['Chatarra Viva','Cuando cae una tropa tuya (no robot obrero), 30% de que se active un robot obrero.'],
    crystal:['Núcleo de Cristal','Cada robot obrero tuyo que cae te da 0,25 de elixir.'], phoenix:['Módulo de Reinicio',null], armor:['Blindaje de Titanio',null], forgeR:['Yunque Cuántico',null],
    seed:['Semilla Estelar',null], drum:['Tambor de Guerra',null], phylactery:['Copia de Seguridad',null], wall:['Murallas Reforzadas','Tus torres laterales tienen +30% de vida.'],
    ballista:['Cañones Pesados',null], feather:['Mira Telescópica',null], boots:['Propulsores',null], ember:['Núcleo de Plasma',null], regen:['Nanobots',null], chalice:['Batería Desbordante',null]};
  for(const k in R) if(RELICS[k]){ RELICS[k].name = R[k][0]; if(R[k][1]) RELICS[k].desc = R[k][1]; }
  try{ if(typeof SKINS!=='undefined'){ SKINS.human='Acero de la Resistencia'; SKINS.orc='Colmena Azork'; SKINS.undead='Fortaleza Voltempire'; delete SKINS.elf; } }catch(e){}

  const EVT = [
    ['🔋','Manantial de Energía','Una grieta del suelo desprende energía azul. Dicen que repara… o que mejora el equipo a cambio de oro.'],
    ['🕵️','Contrabandista','Una figura con casco te ofrece una caja sellada. "Solo 60 monedas, sin preguntas."'],
    ['☢️','Reactor Inestable','Un reactor abandonado pide energía vital. A cambio, ofrece un poder prohibido.'],
    ['📦','Contenedor Abandonado','Un contenedor oxidado junto al camino. Podría tener oro… o una trampa.'],
    ['🔧','Ingeniera Ambulante','"Mi taller es tuyo por hoy, comandante." Te ofrece forjar gratis.'],
    ['🛸','Dron Ladrón','Un dron pirata te corta el paso: "¡La bolsa o la batalla!"'],
    ['💾','Archivo de Datos','Entre terminales apagados encuentras un disco con recetas de forja.'],
  ];
  try{ EVT.forEach(([ic,tt,dd],i)=>{ if(EVENTS[i]){ EVENTS[i].ic=ic; EVENTS[i].t=tt; EVENTS[i].d=dd; } });
    EVENTS[2].o[0].l='Dar 350 de vida: carta fusionada'; EVENTS[2].o[1].f=()=>'El reactor se apaga.';
    EVENTS[5].o[1].f=()=>{ RUN.gold-=25; return 'El dron pita contento y se va volando.'; };
    EVENTS[0].o[0].l='Recargar (+40% de vida)';
  }catch(e){}
})();

;(function(){for(const k of ["dragon", "hippo", "banshee", "bonedragon", "dragonknight", "rocketgob", "gargoyle"]) if(CARDS[k]&&!CARDS[k].art) CARDS[k].art='cart_'+k; if(CARDS.starfall) CARDS.starfall.art='ic_starfall'; if(CARDS.peon) CARDS.peon.art='ic_peon';})();

;(function(){const P=["princess", "bomber", "ranger", "mage", "repair", "alchemist", "healer", "icemage", "bard", "ninja", "hunter", "necro", "warlock", "pikeman", "berserk", "pirate", "battlenun", "dwarfxbow", "wolfwhisper", "h_banshee", "h_druid", "dryad", "speardancer", "sentinel", "enchantress", "shaman", "druid", "voodoo", "axeman", "elfalch", "skmage", "blade", "lich", "skpirate", "hag", "merman", "jadeblade", "h_necro"],H=["knight", "templar", "paladin", "dwarf", "h_smith", "h_paladin", "warlord", "h_drummer", "vampire", "reaper", "grunt", "mummy", "ghoul", "oberserk", "shadow"];for(const k of P) if(CARDS[k]) CARDS[k].vpx=1.95; for(const k of H) if(CARDS[k]) CARDS[k].vpx=2.08;})();
;(function(){const A={banshee:2.3,hippo:2.6,dragon:2.5,rocketgob:2.2,gargoyle:2.45,bonedragon:2.8,dragonknight:2.8};for(const k in A) if(CARDS[k]) CARDS[k].vpx=A[k];})();

// ================= GALACTIC: hechizos nuevos (despliegues y ataques aéreos) =================
(function(){
  const S = {
    dropod:   {name:'Cápsula de Desembarco', fac:'human', cost:5, dmg:140, radius:1.6, towerMul:0.4, desc:'Cae una cápsula del cielo, daña al aterrizar y salen dos soldados de asalto.'},
    airstrike:{name:'Bombardeo', fac:'human', cost:4, dmg:180, radius:1.4, towerMul:0.35, desc:'Un caza suelta una línea de tres bombas.'},
    portal:   {name:'Portal de Ensamblaje', fac:'undead', cost:4, dmg:0, radius:1.2, towerMul:0, desc:'Abre un portal del que salen 5 robots obreros, uno tras otro.'},
    orbital:  {name:'Láser Orbital', fac:'undead', cost:5, dmg:620, radius:2.0, towerMul:0.35, desc:'Marca la zona y, un segundo después, un satélite dispara un rayo enorme.'},
    nest:     {name:'Nido Excavado', fac:'orc', cost:4, dmg:90, radius:1.6, towerMul:0.3, desc:'La tierra se abre y salen tres bestias alienígenas rapidísimas.'},
    acidrain: {name:'Lluvia Ácida', fac:'orc', cost:4, dmg:110, radius:2.8, towerMul:0.35, desc:'Una nube suelta ácido durante 4 s: daña poco a poco a todo lo que hay debajo.'},
  };
  for(const k in S){
    CARDS[k] = Object.assign({rar:3, spell:true, art:'sp_'+k, sprite:'sp_'+k, gx:true}, S[k]);
    if(S[k].fac==='human') delete CARDS[k].fac;
    const arr = S[k].fac==='orc' ? ORC_BASE : S[k].fac==='undead' ? UNDEAD_BASE : HUMAN_BASE;
    if(!arr.includes(k)) arr.push(k);
    if(!BASE_CARDS.includes(k)) BASE_CARDS.push(k);
    if(!STARTER_UNLOCKED.includes(k)) STARTER_UNLOCKED.push(k);
    try{ if(META && META.unlocked && !META.unlocked.includes(k)) META.unlocked.push(k); }catch(e){}
  }
  const seq = (k, x, y, r, life, ay) => B.fx.push({k:'seq', keys:[0,1,2,3].map(i=>'fx_'+k+'_'+i), x, y, r, t:0, life, ay});
  const area = (side, card, x, y, dmg, r) => castSpell(side, Object.assign({}, card, {key:card.key}), x, y, dmg);
  const _spawn = spawnCard;
  spawnCard = function(side, card, x, y){
    const c = CARDS[card.key];
    if(!c || !c.gx) return _spawn(side, card, x, y);
    const m = B[side].mods, dmg = c.dmg * lvlMul(card.lvl) * (m.spell||1);
    const k = card.key;
    if(k==='dropod'){
      seq('dropod', x, y, 1.5, 1.6, 0.75); SFX.magic();
      setTimeoutB(0.45, ()=>{ castSpell(side, card, x, y, dmg); SFX.boom(); B.shake = Math.max(B.shake, 0.35);
        for(let i=0;i<2;i++) spawnUnit(side, 'knight', card.lvl, x+(i?0.6:-0.6), y+0.4, 0.5); });
    } else if(k==='airstrike'){
      const dir = side==='p' ? -1 : 1;
      seq('airstrike', x, y, 2.2, 1.4, 0.6); SFX.magic();
      [0,1,2].forEach(i => setTimeoutB(0.35+i*0.18, ()=>{ const yy = y + dir*(i-1)*1.4; castSpell(side, card, x, yy, dmg); SFX.boom(); B.fx.push({k:'flash', x, y:yy, r:c.radius, t:0, life:0.35, col:'#ffb040'}); B.shake = Math.max(B.shake, 0.25); }));
    } else if(k==='portal'){
      seq('portal', x, y, 1.4, 4.2, 0.55); SFX.magic();
      for(let i=0;i<5;i++) setTimeoutB(0.6+i*0.7, ()=>spawnUnit(side, 'vskel', card.lvl, x+(Math.random()-0.5)*0.6, y+(Math.random()-0.5)*0.4, 0.3));
    } else if(k==='orbital'){
      seq('orbital', x, y, c.radius*1.15, 1.9, 0.6); SFX.magic();
      setTimeoutB(1.0, ()=>{ castSpell(side, card, x, y, dmg); SFX.boom(); B.shake = Math.max(B.shake, 0.5); B.fx.push({k:'ring', x, y, r0:0.3, r1:c.radius*1.2, t:0, life:0.5, col:'#6fd0ff'}); });
    } else if(k==='nest'){
      seq('nest', x, y, 1.5, 1.8, 0.65); SFX.magic();
      setTimeoutB(0.5, ()=>{ castSpell(side, card, x, y, dmg); for(let i=0;i<3;i++){ const a=i/3*TAU; spawnUnit(side, 'wolves', card.lvl, x+Math.cos(a)*0.5, y+Math.sin(a)*0.4, 0.3); } });
    } else if(k==='acidrain'){
      seq('acidrain', x, y, c.radius*1.05, 4.4, 0.75); SFX.magic();
      for(let i=0;i<8;i++) setTimeoutB(0.5+i*0.5, ()=>castSpell(side, card, x, y, dmg*0.5));
    }
    return true;
  };
})();

// ================= GALACTIC: clima dinámico =================
// Climas: lluvia, niebla, nieve (ya existían) + lluvia ácida (verde) y vapores (volcánicos).
// Cada mapa tiene sus climas probables y, a veces, el clima cambia en mitad de la batalla.
(function(){
  const WX = {
    rain:  ['🌧️ Lluvia', 'Tropas más lentas · fuego −30% · rayos +30%'],
    fog:   ['🌫️ Niebla', 'Solo ves al enemigo cerca de tus tropas'],
    snow:  ['❄️ Nevada', 'Tropas más lentas · el hielo congela más tiempo'],
    acid:  ['🧪 Lluvia ácida', 'Las tropas de tierra pierden vida poco a poco (los dos bandos)'],
    vapor: ['♨️ Vapores', 'El vapor tapa la vista: las tropas a distancia tienen −1 de alcance'],
    clear: ['☀️ Se despeja', 'El clima vuelve a la normalidad'],
  };
  // climas posibles según el mapa
  function wxPool(ter, bio){
    if(ter==='volcano' || bio==='volcanic') return ['vapor','vapor','acid','clear'];
    if(ter==='swamp') return ['acid','fog','acid','rain'];
    if(ter==='ice' || bio==='snow') return ['snow','snow','fog'];
    if(bio==='desert' || ter==='canyon') return ['vapor','clear','fog'];
    if(bio==='grave') return ['fog','acid','rain'];
    if(ter==='forest') return ['rain','fog','rain'];
    return ['rain','fog','clear'];
  }
  const pick = a => a[Math.floor(B.rng()*a.length)];
  const _start = startBattle;
  startBattle = function(enc, onEnd){
    const r = _start.apply(this, arguments);
    if(!B || B.enc.mode==='treasure' || B.enc.noWx) return r;
    if(enc.wxTest){ B.weather = enc.wxTest; B.wxNext = null; return r; }
    if(!(META.lab && META.lab.wxAll)){   // de momento: solo lluvia
      if(B.weather!=='clear') B.weather = 'rain';
      else if(B.rng()<0.25) B.weather = 'rain';
      if(B.rng()<0.4) B.wxNext = {at: 35 + B.rng()*55, to: B.weather==='rain' ? 'clear' : 'rain'};
      return r;
    }
    const pool = wxPool(B.terrain, B.biome);
    // el clima del mapa a veces sustituye al despejado
    if(B.weather==='clear' && B.rng()<0.35) B.weather = pick(pool.filter(w=>w!=='clear')) || 'clear';
    // y a veces cambia durante la batalla
    if(B.rng()<0.5){ const to = B.weather==='clear' ? pick(pool.filter(w=>w!=='clear')) : (B.rng()<0.6 ? 'clear' : pick(pool.filter(w=>w!==B.weather))); if(to) B.wxNext = {at: 35 + B.rng()*55, to}; }
    return r;
  };
  const _upd = updateBattle;
  updateBattle = function(dt){
    _upd(dt);
    if(!B || B.over) return;
    if(B.wxNext && B.t >= B.wxNext.at){
      const to = B.wxNext.to; B.wxNext = null; B.weather = to; rainDrops = null; B.wxFade = 0;
      if(typeof banner==='function') banner(WX[to][0], WX[to][1], 1.8);
    }
    if(B.wxFade!==undefined && B.wxFade<1) B.wxFade = Math.min(1, B.wxFade + dt*0.6);
    // efectos de los climas nuevos
    B.wxAcc = (B.wxAcc||0) + dt;
    if(B.wxAcc >= 1){ B.wxAcc -= 1;
      for(const u of B.ents){ if(u.type!=='unit' || u.hp<=0) continue;
        if(B.weather==='acid' && !u.c.building && !isAir(u)) u.hp -= u.maxHp*0.012;
        if(u.baseRange===undefined) u.baseRange = u.range;
        const want = (B.weather==='vapor' && u.baseRange>2) ? Math.max(1.8, u.baseRange-1) : u.baseRange;
        if(u.range!==want) u.range = want;
      }
    }
  };
  let drops = null;
  const _dw = drawWeather;
  drawWeather = function(now){
    if(B.weather!=='acid' && B.weather!=='vapor') return _dw(now);
    const Hp = X(H), span = CW/TS, x0 = -OX/TS, a = B.wxFade===undefined ? 1 : B.wxFade;
    if(B.weather==='acid'){
      ctx.fillStyle = `rgba(40,90,20,${0.16*a})`; ctx.fillRect(-OX,0,CW,Hp);
      if(!drops || drops.kind!=='acid'){ drops = []; drops.kind='acid'; for(let i=0;i<140;i++) drops.push({x:Math.random()*W, y:Math.random()*H, s:0.6+Math.random()*0.7}); }
      ctx.strokeStyle = `rgba(170,255,90,${0.6*a})`; ctx.lineWidth = Math.max(1, TS*0.06); ctx.lineCap='round'; ctx.beginPath();
      for(const d of drops){ const y = (d.y + now*11*d.s) % (H+2) - 1, x = x0 + ((d.x/W*span + now*1.2*d.s) % span); ctx.moveTo(X(x),X(y)); ctx.lineTo(X(x-0.06),X(y-0.6*d.s)); }
      ctx.stroke();
      if(!B.apuddles && imgFor('wx_acidpuddle')){ const r = mulberry32((B.seed||1)+3); B.apuddles = []; for(let i=0;i<8;i++){ const x = 1+r()*16, y = 3+r()*26; if(Math.abs(y-16)<2.2 || TOWER_X.some(t=>Math.abs(x-t)<1.4)) continue; B.apuddles.push([x,y,0.9+r()*0.6]); } }
      if(B.apuddles){ const pim = imgFor('wx_acidpuddle'); ctx.globalAlpha = 0.7*a; for(const [x,y,s] of B.apuddles){ const w = X(s), h = w*pim.naturalHeight/pim.naturalWidth; ctx.drawImage(pim, X(x)-w/2, X(y)-h/2, w, h); } ctx.globalAlpha = 1; }
      if(Math.random()<0.45){ const x=Math.random()*W, y=Math.random()*H; if(imgFor('wx_acidsplash')) B.fx.push({k:'img', key:'wx_acidsplash', x, y:y+0.2, r:0.35, t:0, life:0.4}); else B.fx.push({k:'ring', x, y, r0:0.05, r1:0.4, t:0, life:0.4, col:'rgba(170,255,90,0.85)'}); }
      if(Math.random()<0.08){ const x=2+Math.random()*14, y=3+Math.random()*26; part('spark', x, y, {sp:0.4, col:'#b4ff6a', life:0.8, size:0.08}); }
    } else {
      ctx.fillStyle = `rgba(120,90,70,${0.13*a})`; ctx.fillRect(-OX,0,CW,Hp);
      if(!drops || drops.kind!=='vapor'){ drops = []; drops.kind='vapor'; for(let i=0;i<16;i++) drops.push({x:Math.random()*W, y:Math.random()*H, s:0.6+Math.random()*0.8, p:Math.random()*TAU}); }
      for(const d of drops){ const k = ((now*0.08*d.s + d.y/H) % 1), y = H+1 - k*(H+3), x = d.x + Math.sin(now*0.5+d.p)*0.8, r = X(1.4+2.2*d.s*(0.4+k));
        const al = 0.42*a*Math.sin(k*Math.PI), sim = imgFor(d.s>1 ? 'wx_steam1' : 'wx_steam2');
        if(sim){ const w = r*1.6, hh = w*sim.naturalHeight/sim.naturalWidth; ctx.globalAlpha = Math.min(1, al*1.6); ctx.drawImage(sim, X(x)-w/2, X(y)-hh/2, w, hh); ctx.globalAlpha = 1; }
        else { const g = ctx.createRadialGradient(X(x),X(y),0,X(x),X(y),r); g.addColorStop(0,`rgba(235,225,215,${al})`); g.addColorStop(1,'rgba(235,225,215,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(X(x),X(y),r,0,TAU); ctx.fill(); } }
    }
  };

  // ---- Pruebas: elegir climas y probar cada uno ----
  function startWxTest(wx){
    chooseFaction(fac => {
      RUN = tempRun(fac);
      const os = Object.keys(FACTIONS).filter(f=>f!==fac), ef = os[Math.floor(Math.random()*os.length)];
      const T = {rain:['river','grass'], fog:['forest','grass'], snow:['ice','snow'], acid:['swamp','grass'], vapor:['volcano','volcanic']}[wx];
      const enc = {type:'battle', row:4, faction:ef, mult:1, towerMul:1, regen:1, think:2.2, aggro:7, towerDmg:1, wxTest:wx,
        name:WX[wx][0], subtitle:WX[wx][1], seed:(Math.random()*2**31)>>>0, deck:FACTIONS[ef].starter.map(k=>({key:k,lvl:1})), weather:wx, terrain:T[0], biome:T[1]};
      running = true;
      startBattle(enc, res => { infoModal(`<div style="font-size:52px">${WX[wx][0].split(' ')[0]}</div><h2 class="f">${res.win?'¡Victoria!':'Derrota'}</h2><div class="sub">Prueba de clima: ${WX[wx][0]}</div>`); RUN = META.run || null; showTitle(); });
    });
  }
  window.startWxTest = startWxTest;
  const _lab = labMenu;
  labMenu = function(){
    _lab.apply(this, arguments);
    const m = $('modalBody'), L = META.lab;
    const d = document.createElement('div'); d.className='upg'; d.style.cssText='margin-bottom:7px;flex-direction:column;align-items:stretch';
    d.innerHTML = `<div style="display:flex;gap:10px;align-items:center"><div style="font-size:30px">🌦️</div><div class="t"><b>Clima</b><span>En las aventuras: ${L.wxAll?'<b>todos los climas</b> (lluvia, niebla, nieve, lluvia ácida y vapores, y cambian durante la batalla)':'<b>solo lluvia</b> (a veces empieza o para durante la batalla)'}. Abajo puedes probar cada uno.</span></div></div>`;
    const r1 = document.createElement('div'); r1.style.cssText='display:flex;gap:6px;flex-wrap:wrap;margin-top:6px';
    const b0 = document.createElement('button'); b0.className = 'btn sm'+(L.wxAll?' dark':''); b0.textContent = 'Solo lluvia'; b0.onclick = ()=>{ L.wxAll = false; labSave(); labMenu(); }; r1.appendChild(b0);
    const b1 = document.createElement('button'); b1.className = 'btn sm'+(L.wxAll?'':' dark'); b1.textContent = 'Todos'; b1.onclick = ()=>{ L.wxAll = true; labSave(); labMenu(); }; r1.appendChild(b1);
    const r2 = document.createElement('div'); r2.style.cssText='display:flex;gap:6px;flex-wrap:wrap;margin-top:6px';
    for(const w of ['rain','fog','snow','acid','vapor']){ const b = document.createElement('button'); b.className='btn blue sm'; b.textContent = 'Probar '+WX[w][0]; b.onclick = ()=>{ closeModal(); startWxTest(w); }; r2.appendChild(b); }
    d.appendChild(r1); d.appendChild(r2);
    const first = m.querySelector('.upg'); m.insertBefore(d, first || null);
  };
})();

// ================= GALACTIC: música (sintetizada, sin archivos) =================
// Temas: DnB (batalla, predeterminado), Electro, Synthwave (menú), Espacio (mapa), Jefe (DnB intenso)
(function(){
  let ac=null, out=null, comp=null, timer=null, mode=null, step=0, nextT=0, noiseBuf=null;
  const N = n => 440*Math.pow(2,(n-69)/12);
  M2.battleMusic = M2.battleMusic || 'dnb';
  const SONGS = {
    dnb:   {bpm:174, kick:[0,10], snare:[4,12], ghost:[7,15], hat:'16', bass:'reese', prog:[[57,60,64],[53,57,60],[55,59,62],[52,55,59]], root:[33,29,31,28], vol:0.13, lead:true},
    boss:  {bpm:176, kick:[0,6,10], snare:[4,12], ghost:[3,7,15], hat:'16', bass:'reese', prog:[[52,55,59],[53,56,60],[50,53,57],[52,56,59]], root:[28,29,26,28], vol:0.14, lead:true, stab:true},
    electro:{bpm:128, kick:[0,4,8,12], snare:[4,12], ghost:[], hat:'off', bass:'pluck', prog:[[57,60,64],[55,59,62],[53,57,60],[52,56,59]], root:[45,43,41,40], vol:0.12, lead:true},
    synth: {bpm:100, kick:[0,8], snare:[4,12], ghost:[], hat:'8', bass:'pluck', prog:[[57,60,64],[53,57,60],[60,64,67],[55,59,62]], root:[45,41,48,43], vol:0.10, lead:false, pad:true},
    space: {bpm:84,  kick:[], snare:[], ghost:[], hat:'', bass:'sub', prog:[[50,57,62],[53,57,60],[48,55,60],[52,55,59]], root:[38,41,36,40], vol:0.10, lead:false, pad:true},
    classic:null,
  };
  function init(){ if(ac) return; try{ ac = new (window.AudioContext||window.webkitAudioContext)(); comp = ac.createDynamicsCompressor(); comp.threshold.value=-14; comp.ratio.value=4; out = ac.createGain(); out.gain.value = 0; out.connect(comp); comp.connect(ac.destination);
    const len = ac.sampleRate*0.3; noiseBuf = ac.createBuffer(1,len,ac.sampleRate); const d = noiseBuf.getChannelData(0); for(let i=0;i<len;i++) d[i]=Math.random()*2-1; }catch(e){ ac=null; } }
  function env(g,t,a,v,d){ g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(v,t+a); g.gain.exponentialRampToValueAtTime(0.0001,t+d); }
  function osc(type,f,t,d,v,filt){ const o=ac.createOscillator(), g=ac.createGain(); o.type=type; o.frequency.value=f; env(g,t,0.01,v,d); let n=o; if(filt){ const fl=ac.createBiquadFilter(); fl.type='lowpass'; fl.frequency.value=filt; o.connect(fl); n=fl; } n.connect(g); g.connect(out); o.start(t); o.stop(t+d+0.05); }
  function kick(t,v){ const o=ac.createOscillator(), g=ac.createGain(); o.frequency.setValueAtTime(150,t); o.frequency.exponentialRampToValueAtTime(42,t+0.12); env(g,t,0.003,v,0.28); o.connect(g); g.connect(out); o.start(t); o.stop(t+0.3); }
  function noise(t,v,d,type,f,q){ const s=ac.createBufferSource(); s.buffer=noiseBuf; const fl=ac.createBiquadFilter(); fl.type=type; fl.frequency.value=f; if(q) fl.Q.value=q; const g=ac.createGain(); env(g,t,0.002,v,d); s.connect(fl); fl.connect(g); g.connect(out); s.start(t); s.stop(t+d+0.02); }
  function snare(t,v){ noise(t,v,0.18,'bandpass',1900,0.8); osc('triangle',185,t,0.09,v*0.6); }
  function reese(f,t,d,v){ const fl=ac.createBiquadFilter(); fl.type='lowpass'; fl.frequency.setValueAtTime(260,t); fl.frequency.linearRampToValueAtTime(700,t+d*0.5); fl.frequency.linearRampToValueAtTime(300,t+d); fl.Q.value=6; const g=ac.createGain(); env(g,t,0.02,v,d); fl.connect(g); g.connect(out);
    for(const dt of [-9,9]){ const o=ac.createOscillator(); o.type='sawtooth'; o.frequency.value=f; o.detune.value=dt; o.connect(fl); o.start(t); o.stop(t+d+0.05); }
    const s=ac.createOscillator(), sg=ac.createGain(); s.type='sine'; s.frequency.value=f; env(sg,t,0.01,v*1.2,d); s.connect(sg); sg.connect(out); s.start(t); s.stop(t+d+0.05); }
  function tick(){
    if(!ac || !mode) return; const S = SONGS[mode]; if(!S) return; const s16 = 60/S.bpm/4;
    while(nextT < ac.currentTime + 0.3){
      const bar = Math.floor(step/16)%4, i = step%16, ch = S.prog[bar], v = S.vol, big = Math.floor(step/64)%2;
      if(S.kick.includes(i)) kick(nextT, v*5.5);
      if(S.snare.includes(i)) snare(nextT, v*3.2);
      if(S.ghost.includes(i)) noise(nextT, v*0.9, 0.06, 'bandpass', 2400, 1);
      if(S.hat==='16') noise(nextT, v*(i%2?0.35:0.7), 0.035, 'highpass', 8000);
      else if(S.hat==='8' && i%2===0) noise(nextT, v*0.5, 0.04, 'highpass', 7500);
      else if(S.hat==='off' && i%4===2) noise(nextT, v*0.9, 0.06, 'highpass', 7000);
      const r = N(S.root[bar]);
      if(S.bass==='reese'){ if(i===0) reese(r, nextT, s16*9, v*1.6); if(i===10) reese(r*(bar%2?1.5:1), nextT, s16*5, v*1.3); }
      else if(S.bass==='pluck'){ if(i%2===0) osc('sawtooth', r*(i%8===6?2:1), nextT, s16*1.6, v*1.0, 900); }
      else if(S.bass==='sub'){ if(i===0) osc('sine', r, nextT, s16*15, v*1.5); }
      if(S.pad && i===0) ch.forEach(n=>osc('triangle', N(n), nextT, s16*15.5, v*0.32, 1800));
      if(!S.pad && i===0) ch.forEach(n=>osc('sawtooth', N(n), nextT, s16*6, v*0.12, 1400));
      if(S.lead && big && i%2===0){ const n = ch[[0,1,2,1,2,0,1,2][(i/2)%8]]+12; osc('square', N(n), nextT, s16*1.4, v*0.14, 3200); }
      if(S.stab && (i===6 || i===14) && bar%2) ch.forEach(n=>osc('sawtooth', N(n+12), nextT, s16*1.2, v*0.2, 2600));
      if(!S.kick.length && i%4===0){ const n = ch[(step/4)%3|0]+24; osc('sine', N(n), nextT, s16*6, v*0.12); }
      nextT += s16; step++;
    }
  }
  const oldPlay = MUSIC.play.bind(MUSIC), oldStop = MUSIC.stop.bind(MUSIC);
  MUSIC.play = function(m){
    const pick = m==='battle' ? (M2.battleMusic==='classic' ? null : M2.battleMusic) : m==='boss' ? (M2.battleMusic==='classic' ? null : 'boss') : m==='map' ? 'space' : 'synth';
    if(!pick){ if(mode){ mode=null; if(out) out.gain.setTargetAtTime(0, ac.currentTime, 0.2); } return oldPlay(m); }
    oldStop();
    if(!META.sound || M2.music===false){ MUSIC.stop(); return; }
    init(); if(!ac) return; if(ac.state==='suspended') ac.resume(); if(mode===pick) return;
    mode = pick; step = 0; nextT = ac.currentTime + 0.1; out.gain.cancelScheduledValues(ac.currentTime); out.gain.setTargetAtTime(0.9, ac.currentTime, 0.4);
    if(!timer) timer = setInterval(tick, 80);
  };
  MUSIC.stop = function(){ oldStop(); mode = null; if(out && ac) out.gain.setTargetAtTime(0, ac.currentTime, 0.2); };
  // selector en Ajustes
  if(typeof showSettings==='function'){
    const _ss = showSettings;
    showSettings = function(){ _ss.apply(this, arguments);
      const body = $('modalBody'); const box = document.createElement('div'); box.className='upg'; box.style.cssText='flex-direction:column;align-items:stretch';
      box.innerHTML = '<div class="t"><b>🎧 Música de batalla</b></div>'; const row = document.createElement('div'); row.style.cssText='display:flex;gap:6px;flex-wrap:wrap;margin-top:6px';
      [['dnb','Drum & Bass'],['electro','Electro'],['classic','Clásica']].forEach(([k,n])=>{ const b=document.createElement('button'); b.className='btn sm'+(M2.battleMusic===k?'':' dark'); b.textContent=n; b.onclick=()=>{ M2.battleMusic=k; saveMeta(); MUSIC.play('battle'); setTimeout(()=>MUSIC.play('menu'), 4000); showSettings(); }; row.appendChild(b); });
      box.appendChild(row); const del = [...body.querySelectorAll('button')].find(b=>/Borrar/.test(b.textContent)); const anchor = del ? (del.closest('.upg')||del) : null; body.insertBefore(box, anchor && anchor.parentNode===body ? anchor : body.lastElementChild);
    };
  }
})();

;(function(){const _ss=showSettings;showSettings=function(){_ss.apply(this,arguments);try{const body=document.querySelector('.modal .body')||document.querySelector('.modal');if(!body||body.querySelector('#dmgnum'))return;const b=document.createElement('button');b.id='dmgnum';b.className='btn dark sm';b.style.margin='6px 0';const lb=()=>b.textContent='💥 Números de daño: '+(META.noDmgNum?'NO':'SÍ');lb();b.onclick=()=>{META.noDmgNum=!META.noDmgNum;try{saveMeta()}catch(e){}lb();};const del=[...body.querySelectorAll('button')].find(x=>/Borrar/.test(x.textContent));if(del&&del.parentNode)del.parentNode.insertBefore(b,del);else body.appendChild(b);}catch(e){}};})();

// ---------- RECOMPENSAS POR VICTORIA: cofres, superruleta por racha, marco de fusión visible ----------
(function(){
  const st = document.createElement('style');
  st.textContent = `
  .card.fus{box-shadow:0 0 0 2px #ffd34a,0 0 14px #c47bff,0 0 22px #ffd34a88;animation:fusGlow 2.2s ease-in-out infinite}
  @keyframes fusGlow{0%,100%{box-shadow:0 0 0 2px #ffd34a,0 0 12px #c47bff,0 0 18px #ffd34a66}50%{box-shadow:0 0 0 2px #fff3b0,0 0 20px #e08bff,0 0 30px #ffd34aaa}}
  .card .fusTag{position:absolute;right:-4px;top:-8px;z-index:6;background:linear-gradient(90deg,#ffd34a,#ff9df5,#9fd8ff,#ffd34a);background-size:200% 100%;animation:fusShine 2.5s linear infinite;color:#2a0f40;font:900 9px Nunito,sans-serif;letter-spacing:.5px;padding:1px 6px;border-radius:8px;border:1px solid #fff8;white-space:nowrap;pointer-events:none}
  @keyframes fusShine{to{background-position:200% 0}}
  .card.off .fusTag{display:none}
  .rwBadge{position:absolute;top:-4px;right:-4px;min-width:18px;height:18px;border-radius:9px;background:#ff4d6a;color:#fff;font:900 11px Nunito;display:flex;align-items:center;justify-content:center;padding:0 4px;box-shadow:0 0 6px #ff4d6a}
  .iconTile{position:relative}
  .chestPop{animation:chestShake .9s ease-in-out}
  @keyframes chestShake{0%,100%{transform:rotate(0) scale(1)}20%{transform:rotate(-8deg) scale(1.05)}40%{transform:rotate(8deg) scale(1.1)}60%{transform:rotate(-6deg) scale(1.15)}80%{transform:rotate(4deg) scale(1.2)}}
  .sspin{display:grid;grid-template-columns:repeat(5,1fr);gap:6px;margin:10px 0}
  .sspin div{background:linear-gradient(#3a2560,#24163e);border:2px solid #6b4aa8;border-radius:10px;padding:10px 2px;font:900 13px Nunito;color:#fff;text-align:center;transition:all .08s}
  .sspin div.on{background:linear-gradient(#ffe27a,#ffb428);color:#3a1a00;border-color:#fff;transform:scale(1.12);box-shadow:0 0 18px #ffd34a}
  .sspin div.jack{border-color:#ffd34a}
  .rwBar{display:flex;gap:4px;justify-content:center;margin:6px 0}.rwBar i{width:26px;height:10px;border-radius:5px;background:#0006;border:1px solid #fff3}.rwBar i.on{background:linear-gradient(#ffe27a,#ffb428)}`;
  document.head.appendChild(st);
})();

// marco de fusión: que se note que es la carta superior
(function(){
  const _ce = cardEl;
  cardEl = function(card, opts={}){
    const d = _ce(card, opts), c = CARDS[card.key];
    if(c && c.rar===2 && !c.hero && !c.spell && !opts.mini){ d.classList.add('fus'); if(getComputedStyle(d).position==='static') d.style.position='relative';
      const t = document.createElement('div'); t.className = 'fusTag'; t.textContent = '✨ FUSIÓN'; d.appendChild(t); }
    return d;
  };
})();

M2.vch = M2.vch || 0;      // victorias hacia el próximo cofre (0..2)
M2.chests = M2.chests || 0; // cofres listos para abrir
M2.stok = M2.stok || 0;    // tiradas de superruleta
const RW_CHEST_EVERY = 3, RW_SUPER_EVERY = 3, RW_MAX_CHESTS = 4;

(function(){
  const _sb = startBattle;
  startBattle = function(enc, onEnd){
    return _sb(enc, res => {
      try{
        if(!enc.duel && res && res.win){
          let msg = [];
          M2.vch++;
          if(M2.vch >= RW_CHEST_EVERY){ M2.vch = 0; if(M2.chests < RW_MAX_CHESTS){ M2.chests++; msg.push('🎁 ¡Cofre de victoria listo!'); } }
          if(M2.streak > 0 && M2.streak % RW_SUPER_EVERY === 0){ M2.stok++; msg.push(`🌟 ¡${M2.streak} seguidas! Tirada de SUPERRULETA`); }
          saveMeta();
          if(msg.length) setTimeout(()=>toast(msg.join(' · ')), 2200);
        }
      }catch(e){}
      onEnd(res);
    });
  };
})();

function rwUnlockCard(){ const locked = UNLOCKABLE.filter(u=>!META.unlocked.includes(u.key) && CARDS[u.key] && CARDS[u.key].fac!=='retired'); if(!locked.length) return null; const u = pick(locked); META.unlocked.push(u.key); return CARDS[u.key].name; }
function rwRecipe(){ const unk = RECIPES.filter(r=>!META.recipes.includes(r[2])); if(!unk.length) return null; const r = pick(unk); META.recipes.push(r[2]); return `${CARDS[r[0]].name} + ${CARDS[r[1]].name} = <b style="color:#e6c4ff">${CARDS[r[2]].name}</b>`; }
function rwSkin(){ const no = Object.keys(SKINS).filter(k=>k!=='none' && k!=='elf' && !M2.skins.includes(k)); if(!no.length) return null; const k = pick(no); M2.skins.push(k); return SKINS[k]; }

function showChest(){
  const m = m2Modal('🎁 Cofres de victoria', 'Cada 3 victorias ganas un cofre (máximo 4 guardados).');
  m.insertAdjacentHTML('beforeend', `<div class="rwBar">${[0,1,2].map(i=>`<i class="${i<M2.vch?'on':''}"></i>`).join('')}</div><div class="sub">Victorias hacia el próximo: <b>${M2.vch}/3</b> · Cofres listos: <b style="color:var(--gold)">${M2.chests}</b></div>`);
  const box = document.createElement('div'); box.style.cssText = 'display:flex;justify-content:center;margin:10px 0';
  const img = document.createElement('img'); img.src = ART_SRC.ui_chest_epic || ART_SRC.ui_chest || ''; img.style.cssText = 'width:130px;height:auto;filter:' + (M2.chests? 'drop-shadow(0 0 14px #c47bff)' : 'grayscale(.8) brightness(.6)');
  box.appendChild(img); m.appendChild(box);
  const b = document.createElement('button'); b.className = 'btn'; b.textContent = M2.chests ? '¡Abrir cofre!' : 'Gana más batallas'; b.disabled = !M2.chests; m.appendChild(b);
  closeBtn(m);
  b.onclick = () => {
    b.disabled = true; img.classList.add('chestPop'); SFX.forge && SFX.forge();
    setTimeout(() => {
      M2.chests--; const out = [];
      const s = 5 + Math.floor(Math.random()*8); META.shards += s; out.push(`💠 +${s} esquirlas`);
      if(Math.random() < 0.5){ const n = rwUnlockCard(); out.push(n ? `🃏 Carta nueva: <b>${n}</b>` : (META.shards += 6, '💠 +6 esquirlas extra')); }
      if(Math.random() < 0.2){ const r = rwRecipe(); if(r) out.push('📜 Receta: ' + r); }
      const xp = 25 + Math.floor(Math.random()*20); try{ gainXP(xp); }catch(e){} out.push(`🏅 +${xp} XP del pase`);
      saveMeta(); try{ labSave(); }catch(e){} SFX.coin && SFX.coin(); rwBadges();
      infoModal(`<img src="${img.src}" style="width:90px"><h2 class="f">¡Cofre abierto!</h2><div class="sub" style="line-height:1.7">${out.join('<br>')}</div>`);
    }, 950);
  };
}

const SUPER = [
  {t:'💠 15', w:16, f:()=>{ META.shards+=15; return '💠 +15 esquirlas'; }},
  {t:'🃏 Carta', w:14, f:()=>{ const n=rwUnlockCard(); if(n) return `🃏 Carta nueva: <b>${n}</b>`; META.shards+=15; return '💠 +15 esquirlas'; }},
  {t:'💠 25', w:12, f:()=>{ META.shards+=25; return '💠 +25 esquirlas'; }},
  {t:'📜 Receta', w:12, f:()=>{ const r=rwRecipe(); if(r) return '📜 Receta secreta: '+r; META.shards+=20; return '💠 +20 esquirlas'; }},
  {t:'💠 20', w:14, f:()=>{ META.shards+=20; return '💠 +20 esquirlas'; }},
  {t:'🃏🃏 2 Cartas', w:7, f:()=>{ const a=rwUnlockCard(), b=rwUnlockCard(); const l=[a,b].filter(Boolean); if(!l.length){ META.shards+=30; return '💠 +30 esquirlas'; } return '🃏 Cartas nuevas: <b>'+l.join('</b> y <b>')+'</b>'; }},
  {t:'💠 40', w:7, f:()=>{ META.shards+=40; return '💠 +40 esquirlas'; }},
  {t:'🏰 Aspecto', w:6, f:()=>{ const s=rwSkin(); if(s) return '🏰 Aspecto de torres: <b>'+s+'</b>'; META.shards+=30; return '💠 +30 esquirlas'; }},
  {t:'🏅 +100 XP', w:9, f:()=>{ try{ gainXP(100); }catch(e){} return '🏅 +100 XP del pase'; }},
  {t:'💎 BOTE 80', w:3, jack:1, f:()=>{ META.shards+=80; return '💎 ¡¡BOTE!! 💠 +80 esquirlas'; }},
];
function showSuperSpin(){
  const m = m2Modal('🌟 Superruleta', `Cada 3 victorias seguidas ganas una tirada. Racha actual: <b>${M2.streak}</b> 🔥 · Tiradas: <b style="color:var(--gold)">${M2.stok}</b>`);
  const g = document.createElement('div'); g.className = 'sspin';
  SUPER.forEach(s => { const c = document.createElement('div'); c.textContent = s.t; if(s.jack) c.className='jack'; g.appendChild(c); });
  m.appendChild(g);
  const b = document.createElement('button'); b.className = 'btn'; b.textContent = M2.stok ? '¡Girar!' : 'Consigue una racha de 3'; b.disabled = !M2.stok; m.appendChild(b);
  closeBtn(m);
  b.onclick = () => {
    b.disabled = true; M2.stok--; saveMeta();
    const tot = SUPER.reduce((a,s)=>a+s.w,0); let r = Math.random()*tot, target = 0; for(let i=0;i<SUPER.length;i++){ r -= SUPER[i].w; if(r<=0){ target=i; break; } }
    const cells = [...g.children], total = SUPER.length*3 + target; let k = 0;
    const tick = () => { cells.forEach(x=>x.classList.remove('on')); cells[k%SUPER.length].classList.add('on'); SFX.click && SFX.click(); k++;
      if(k<=total) setTimeout(tick, 35 + Math.pow(k/total,3)*300); else setTimeout(()=>{ const msg = SUPER[target].f(); saveMeta(); try{ labSave(); }catch(e){} SFX.coin && SFX.coin(); rwBadges();
        infoModal(`<div style="font-size:52px">${SUPER[target].jack?'💎':'🌟'}</div><h2 class="f">¡Premio!</h2><div class="sub">${msg}</div>`); }, 450); };
    tick();
  };
}

function rwBadges(){
  const set = (id, n) => { const t = document.getElementById(id); if(!t) return; let bd = t.querySelector('.rwBadge'); if(!n){ if(bd) bd.remove(); return; } if(!bd){ bd = document.createElement('div'); bd.className='rwBadge'; t.appendChild(bd); } bd.textContent = n; };
  set('tileChest', M2.chests); set('tileSuper', M2.stok);
}
(function(){
  const row = document.querySelector('.iconRow'); if(!row) return;
  [['tileChest','🎁','Cofres',showChest],['tileSuper','🌟','Superruleta',showSuperSpin]].forEach(([id, ic, t, f]) => {
    const b = document.createElement('button'); b.className = 'iconTile'; b.id = id; b.innerHTML = `<span>${ic}</span><small>${t}</small>`; b.onclick = () => { SFX.click(); f(); }; row.appendChild(b); });
  const _st = showTitle; showTitle = function(){ _st.apply(this, arguments); rwBadges(); };
  rwBadges();
})();

// ================= GALACTIC: animación por fotogramas y escuadras =================
// Cada tropa nueva tiene: <sprite>_w0..3 (andar de frente), bk_<sprite>_w0..3 (de espaldas),
// <sprite>_a0/_a1 (ataque de frente) y bk_<sprite>_a0/_a1 (ataque de espaldas).
(function(){
  const hasFrames = sk => !!imgFor(sk+'_w0');
  // escuadras: las cartas de varias tropas tienen un dibujo con todo el grupo
  let GID = 1;
  const _spawnCard = spawnCard;
  spawnCard = function(side, card, x, y){
    const n0 = B.ents.length;
    const r = _spawnCard(side, card, x, y);
    const c = CARDS[card.key];
    if(c && !c.spell && c.count>1 && hasFrames(c.sprite||card.key)){
      const g = GID++;
      for(let i=n0;i<B.ents.length;i++){ const u = B.ents[i]; if(u.type==='unit' && u.key===card.key) u.grp = g; }
    }
    return r;
  };
  const _draw = drawUnitE;
  drawUnitE = function(u, now){
    const base = u.sprite;
    if(!hasFrames(base)) return _draw(u, now);
    // escuadra: solo el primero vivo dibuja el grupo, en el centro de los que quedan
    let sx = u.x, sy = u.y, sr = u.r, mates = null;
    if(u.grp){
      mates = B.ents.filter(o => o.grp===u.grp && o.hp>0);
      if(mates.length && mates[0]!==u) return;
      if(mates.length>1){ u.x = mates.reduce((a,o)=>a+o.x,0)/mates.length; u.y = mates.reduce((a,o)=>a+o.y,0)/mates.length; }
      u.r = sr*1.45;
    }
    const t = u.target, air = u.c.air;
    const atk = u.atk>0 && t;
    // ¿se ve de espaldas? tus tropas avanzan hacia arriba; las rivales hacia abajo
    let back;
    if(u.c.building) back = false;
    else if(atk) back = u.side==='p' ? t.y < u.y + 0.3 : t.y < u.y - 0.3;
    else back = u.side==='p';
    let f;
    if(atk){ const k = 1 - u.atk/0.28; f = k < 0.45 ? '_a0' : '_a1'; }
    else {
      const moving = !u.locked && t && u.stun<=0 && u.deploy<=0;
      const ph = air ? now*6 + u.walk : u.walk;
      f = (moving || air) ? '_w'+(Math.floor(((ph % (Math.PI*2)) + Math.PI*2) % (Math.PI*2) / (Math.PI/2)) % 4) : '_w1';
    }
    const key = (back ? 'bk_' : '') + base + f;
    u.sprite = imgFor(key) ? key : (back && imgFor('bk_'+base) ? 'bk_'+base : base);
    const lk = u.locked, at = u.atk;
    u.atk = 0;            // el golpe ya se ve en el dibujo: sin empujón extra
    try { _draw(u, now); }
    finally { u.sprite = base; u.atk = at; u.locked = lk; if(u.grp){ u.x = sx; u.y = sy; u.r = sr; } }
  };
})();

// ================= GALACTIC: voces (murmullos entonados) =================
// Cada tropa "habla" al salir y a veces al atacar: sílabas inventadas con vocales sintetizadas.
// Resistencia = voces humanas · Voltempire = voces robóticas · Azorks = gorjeos y gruñidos alienígenas.
(function(){
  let ac=null, out=null, lastAtk=0, lastDep=0;
  const V = {a:[800,1200], e:[450,1900], i:[300,2300], o:[500,880], u:[340,780]}, VK = 'aeiou';
  function init(){ if(ac) return; try{ ac = new (window.AudioContext||window.webkitAudioContext)(); out = ac.createGain(); out.gain.value = 0.55; out.connect(ac.destination); }catch(e){ ac=null; } }
  function syl(t, f0, f1, d, vowel, type, vol, robot, vib){
    const o = ac.createOscillator(); o.type = type; o.frequency.setValueAtTime(f0, t); o.frequency.linearRampToValueAtTime(f1, t+d);
    if(vib){ const l = ac.createOscillator(), lg = ac.createGain(); l.frequency.value = vib; lg.gain.value = f0*0.06; l.connect(lg); lg.connect(o.frequency); l.start(t); l.stop(t+d+0.05); }
    const g = ac.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t+0.015); g.gain.setValueAtTime(vol*0.8, t+d*0.7); g.gain.exponentialRampToValueAtTime(0.0001, t+d);
    const [F1,F2] = V[vowel];
    const b1 = ac.createBiquadFilter(), b2 = ac.createBiquadFilter(); b1.type = b2.type = 'bandpass'; b1.frequency.value = F1*(robot?1.15:1); b2.frequency.value = F2*(robot?1.1:1); b1.Q.value = 6; b2.Q.value = 9;
    const m = ac.createGain(); m.gain.value = 1;
    o.connect(b1); o.connect(b2); b1.connect(m); b2.connect(m);
    if(robot){ const am = ac.createGain(); const lfo = ac.createOscillator(); lfo.type='square'; lfo.frequency.value = 38; const lg = ac.createGain(); lg.gain.value = 0.5; lfo.connect(lg); lg.connect(am.gain); am.gain.value = 0.5; m.connect(am); am.connect(g); lfo.start(t); lfo.stop(t+d+0.05); }
    else m.connect(g);
    g.connect(out); o.start(t); o.stop(t+d+0.05);
  }
  function voiceOf(c){
    const fac = c.fac==='undead' ? 'robot' : c.fac==='orc' ? 'alien' : 'human';
    const big = (c.hp||0)*(c.count||1) >= 2200 || c.r>=0.7, small = c.r<=0.36 || (c.count||1)>=3;
    let base = fac==='human' ? 165 : fac==='robot' ? 140 : 240;
    if(big) base *= fac==='alien' ? 0.42 : 0.68; if(small) base *= 1.55;
    if(c.air && fac!=='human') base *= 1.2;
    return {fac, base};
  }
  function say(c, kind, side){
    if(!META.sound || window.QA_FAST) return; init(); if(!ac) return; if(ac.state==='suspended') ac.resume();
    const {fac, base} = voiceOf(c), n = kind==='atk' ? 1 + (Math.random()<0.4) : 2 + Math.floor(Math.random()*3);
    const vol = (side==='p' ? 0.22 : 0.12) * (kind==='atk' ? 0.8 : 1);
    let t = ac.currentTime + 0.02, f = base*(0.92+Math.random()*0.16);
    for(let k=0;k<n;k++){
      const d = fac==='robot' ? 0.085 : fac==='alien' ? 0.07+Math.random()*0.06 : 0.09+Math.random()*0.05;
      const step = fac==='robot' ? [1,1.25,0.8,1.5][Math.floor(Math.random()*4)] : 0.85+Math.random()*0.35;
      const f1 = kind==='atk' && k===n-1 ? f*1.35 : f*step;
      syl(t, f, f1, d, VK[Math.floor(Math.random()*5)], fac==='robot' ? 'square' : 'sawtooth', vol, fac==='robot', fac==='alien' ? 9+Math.random()*8 : 0);
      t += d + (fac==='robot' ? 0.02 : 0.035); f = f1;
    }
  }
  window.VOICE = {say};
  const _spawn = spawnCard;
  spawnCard = function(side, card, x, y){
    const r = _spawn.apply(this, arguments);
    const c = CARDS[card.key]; const now = performance.now();
    if(c && !c.spell && !c.building && (side==='p' || now-lastDep>900)){ lastDep = now; say(c, 'dep', side); }
    return r;
  };
  const _upd = updateBattle;
  updateBattle = function(dt){
    _upd(dt);
    if(!B || B.over || window.QA_FAST) return;
    const now = performance.now(); if(now-lastAtk < 1600) return;
    for(const u of B.ents){ if(u.type==='unit' && u.side==='p' && u.atk>0.26 && !u.c.building && Math.random()<0.25){ lastAtk = now; say(u.c, 'atk', 'p'); break; } }
  };
})();

// ================= PRINCIPAL =================
let curScreen = '';
const STEP = 1/60;   // paso fijo de simulación (necesario para multijugador determinista)
function showScreen(id){
  curScreen = id;
  document.querySelectorAll('.screen').forEach(s=>s.classList.toggle('on', s.id===id));
}
function showTitle(){
  RUN = META.run || null;
  showScreen('title');
  $('tShards').textContent = META.shards;
  $('tWins').textContent = META.wins;
  $('tDaily').textContent = META.daily[todayStr()] || '—';
  $('bContinue').style.display = RUN ? '' : 'none';
  if(RUN) $('bContinue').textContent = 'Continuar partida ' + FACTIONS[RUN.faction||'human'].ic;
  $('bSound').textContent = META.sound ? '🔊' : '🔇';
  $('bDaily').disabled = false;
}
// escena animada del título
const tcv = $('titleCv'), tctx = tcv.getContext('2d');
(function setupTitleCanvas(){ const d = Math.min(2, window.devicePixelRatio||1); tcv.width = 300*d; tcv.height = 190*d; tctx.setTransform(d,0,0,d,0,0); })();
function drawTitle(t){
  const g = tctx; g.clearRect(0,0,300,190);
  const gl = g.createRadialGradient(150,120,10,150,120,150); gl.addColorStop(0,'rgba(255,190,90,0.35)'); gl.addColorStop(1,'rgba(255,190,90,0)');
  g.fillStyle = gl; g.fillRect(0,0,300,190);
  g.fillStyle = 'rgba(0,0,0,0.3)'; g.beginPath(); g.ellipse(150,172,130,14,0,0,TAU); g.fill();
  const put = (key, side, x, y, s, flip, ph) => { const sp = getSprite(key, side, s); const b = Math.abs(Math.sin(t*3+ph))*5; g.save(); g.translate(x, y - b); g.scale(flip,1); g.drawImage(sp.normal, -sp.pad-sp.px*0.5, -sp.pad-sp.px*0.88); g.restore(); };
  put('ogre','e',240,172,108,-1,0.5);
  put('grunt','e',188,178,74,-1,1.7);
  put('golem','p',62,170,104,1,0);
  put('knight','p',118,178,76,1,1.1);
  // chispas de forja
  for(let i=0;i<14;i++){ const k = (t*0.6 + i/14)%1, x = 150 + Math.sin(i*7.1)*60*k, y = 150 - k*130; g.globalAlpha = 1-k; g.fillStyle = i%2?'#ffcf4a':'#e070ff'; g.beginPath(); g.arc(x,y,2.4*(1-k)+0.6,0,TAU); g.fill(); }
  g.globalAlpha = 1;
}

// ---------- botones ----------
document.addEventListener('pointerdown', ()=>SFX.init(), {once:false});
$('bNew').onclick = () => { SFX.click(); const go = () => chooseFaction(f=>chooseHero(f, h=>newRun(false, f, h))); if(META.run){ confirmModal('¿Empezar de nuevo?', 'Perderás la partida en curso.', go); } else go(); };
$('bContinue').onclick = () => { SFX.click(); RUN = META.run; RNG = seeded(5);
  if(RUN.inNode && !RUN.map[RUN.inNode[0]][RUN.inNode[1]].done){ const [r,i] = RUN.inNode; showMap(); enterNode(r,i,true); return; }
  showMap(); };
$('bDaily').onclick = () => { SFX.click(); const go = () => chooseFaction(f=>chooseHero(f, h=>newRun(true, f, h)));
  if(META.run) confirmModal('Reto diario', 'Perderás la partida en curso. Todos juegan hoy el mismo mapa.', go); else confirmModal('📅 Reto diario', 'Hoy todos juegan el mismo mapa y las mismas recompensas. ¡Consigue tu mejor puntuación!', go); };
$('bMeta').onclick = () => { SFX.click(); showMeta('upg'); };
$('bSound').onclick = () => { META.sound = !META.sound; saveMeta(); $('bSound').textContent = META.sound ? '🔊' : '🔇'; SFX.click(); };
$('bDeck').onclick = () => { SFX.click(); pickCard('Tu mazo', `${RUN.deck.length} cartas · toca una para ver detalles`, null, showMap); };
$('bMapHelp').onclick = () => { SFX.click(); mapHelp(); };
$('bMapMenu').onclick = () => { SFX.click();
  const m = $('modalBody'); m.innerHTML = `<h2 class="f">Menú</h2><div class="sub">La partida se guarda automáticamente.</div>`;
  const b1 = document.createElement('button'); b1.className='btn'; b1.textContent='Seguir jugando'; b1.onclick = closeModal;
  const b2 = document.createElement('button'); b2.className='btn dark'; b2.textContent='Salir al inicio'; b2.onclick = () => { closeModal(); showTitle(); };
  const b3 = document.createElement('button'); b3.className='btn dark sm'; b3.textContent='Abandonar partida'; b3.style.marginTop='6px';
  b3.onclick = () => { closeModal(); confirmModal('¿Abandonar?', 'Terminarás la partida y recibirás las esquirlas conseguidas.', ()=>endRun(false)); };
  m.append(b1,b2,b3); $('modal').classList.add('on'); };
$('bQuit').onclick = () => pauseBattle();
function pauseBattle(){
  if(!B || B.over || curScreen!=='battle') return;
  running = false;
  const m = $('modalBody'); m.innerHTML = `<h2 class="f">Pausa</h2><div class="sub">${B.enc.name}</div>`;
  const b1 = document.createElement('button'); b1.className='btn'; b1.textContent='Continuar'; b1.onclick = () => { closeModal(); running = true; lastT = performance.now(); };
  const b2 = document.createElement('button'); b2.className='btn dark sm'; b2.textContent='Rendirse'; b2.onclick = () => { closeModal(); running = true; lastT = performance.now(); endBattle(false); };
  m.append(b1,b2); $('modal').classList.add('on');
}
function confirmModal(title, text, onYes){
  const m = $('modalBody'); m.innerHTML = `<h2 class="f">${title}</h2><div class="sub">${text}</div>`;
  const y = document.createElement('button'); y.className='btn'; y.textContent='Aceptar'; y.onclick = () => { closeModal(); onYes(); };
  const n = document.createElement('button'); n.className='btn dark sm'; n.textContent='Cancelar'; n.onclick = closeModal;
  m.append(y,n); $('modal').classList.add('on');
}
$('eticks').innerHTML = '<i></i>'.repeat(10);
document.addEventListener('visibilitychange', ()=>{ if(document.hidden && running && curScreen==='battle') pauseBattle(); });
window.addEventListener('resize', ()=>{ if(curScreen==='battle'){ resizeBattle(); } else if(curScreen==='map' && RUN) showMap(); });
document.addEventListener('contextmenu', e=>e.preventDefault());

// ---------- bucle ----------
function loop(now){
  const dt = Math.min(0.05, (now-lastT)/1000); lastT = now;
  if(curScreen==='battle' && B){ if(running && !$('modal').classList.contains('on')) { B.acc += dt*(B.slowmo>0 ? 0.3 : 1); if(B.slowmo>0) B.slowmo -= dt; let n=0; while(B.acc >= STEP && n<6){ updateBattle(STEP); B.tick++; B.acc -= STEP; n++; } if(n>=6) B.acc = 0; } if(!B.over || true) drawBattle(); updHUD(); }
  else if(curScreen==='title') drawTitle(now/1000);
  requestAnimationFrame(loop);
}
(function(){ try{
  document.querySelectorAll('.hIc').forEach(el=>{ el.innerHTML = artHtml(el.dataset.k, el.textContent, '1.25em'); });
  if(ART_SRC._map_bg){ $('mapScroll').style.backgroundImage = `linear-gradient(rgba(20,14,30,.25),rgba(20,14,30,.25)), url(${ART_SRC._map_bg})`; $('mapScroll').style.backgroundSize = '100% auto'; $('mapScroll').style.backgroundRepeat = 'repeat-y'; $('mapScroll').style.backgroundAttachment = 'local'; }
  if(ART_SRC._menu_bg) for(const id of ['meta','shop','rest','reward','event','picker','over','map']){ const el = $(id); el.style.backgroundImage = `linear-gradient(180deg, rgba(18,13,31,.72), rgba(18,13,31,.88)), url(${ART_SRC._menu_bg})`; el.style.backgroundSize = 'cover'; el.style.backgroundPosition = 'center'; }
  if(ART_SRC._title_bg){ $('title').style.backgroundImage = `linear-gradient(180deg, rgba(18,13,31,.15) 0%, rgba(18,13,31,0) 30%, rgba(18,13,31,.35) 62%, rgba(18,13,31,.9) 88%, #120d1f 100%), url(${ART_SRC._title_bg})`; $('title').style.backgroundSize='cover'; $('title').style.backgroundPosition='center'; }
  if(ART_SRC._icon){ for(const rel of ['icon','apple-touch-icon']){ const l=document.createElement('link'); l.rel=rel; l.href=ART_SRC._icon; document.head.appendChild(l); } } }catch(e){} })();
loadArt().then(()=>{ SPRITE_CACHE.clear(); TOWER_CACHE.clear(); for(const k in ART_CACHE) delete ART_CACHE[k]; showTitle(); });
showTitle();
requestAnimationFrame(t=>{ lastT = t; loop(t); });

// ===== cambia emojis de la interfaz por las imágenes ilustradas =====
const EMOJI_IMG = [['🪙','ui_coin'],['💠','ui_shard'],['🌧️','ui_rain'],['🌧','ui_rain'],['🌫️','ui_fog'],['🌫','ui_fog'],['🔒','ui_lock']].filter(([e,k])=>ART_SRC[k]);
function emojiSwap(root){
  if(!EMOJI_IMG.length || !root) return;
  if(root.nodeType===1 && (root.id==='pCrowns'||root.id==='eCrowns'||root.closest && root.closest('#cvWrap'))) return;
  const tw = document.createTreeWalker(root.nodeType===3 ? root.parentNode || root : root, NodeFilter.SHOW_TEXT), list = [];
  while(tw.nextNode()){ const n = tw.currentNode; if(EMOJI_IMG.some(([e])=>n.nodeValue.includes(e)) && !(n.parentNode && n.parentNode.closest && n.parentNode.closest('#cvWrap'))) list.push(n); }
  for(const n of list){ const frag = document.createDocumentFragment(); let txt = n.nodeValue;
    const re = new RegExp(EMOJI_IMG.map(([e])=>e).join('|'), 'g'); let last = 0, m;
    while((m = re.exec(txt))){ if(m.index>last) frag.appendChild(document.createTextNode(txt.slice(last, m.index))); const im = document.createElement('img'); im.src = ART_SRC[EMOJI_IMG.find(([e])=>e===m[0])[1]]; im.className = 'emo'; im.alt = m[0]; frag.appendChild(im); last = m.index + m[0].length; }
    if(last < txt.length) frag.appendChild(document.createTextNode(txt.slice(last)));
    if(n.parentNode) n.parentNode.replaceChild(frag, n); }
}
emojiSwap(document.body);
new MutationObserver(ms=>{ for(const m of ms){ emojiSwap(m.type==='characterData' ? m.target : m.target); } }).observe(document.body, {childList:true, subtree:true, characterData:true});

try{ if(ART_SRC._logo){ const L=document.querySelector('#title .logo'); if(L) L.innerHTML='<img class="lg" alt="Rompetorres: Galactic" src="'+ART_SRC._logo+'">'; } }catch(e){}
