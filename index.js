const SPLASH = '/g-project-splash.png';
const HEADER = '/g-project-header-exact.png';
const STORE_KEY = 'g_project_training_log_v32_engadin';

const DEFAULT_WORKOUTS = [
  { day:'Day 1', title:'Bench / Push Strength', subtitle:'Bench strength + upper push', exercises:[
    {name:'Bench Press', graphic:'bench', target:'Warm-up 60kg × 8, then 5 × 5', defaultWeight:75, reps:5, sets:5, warmups:[{weight:60,reps:8}], maintainWeight:false},
    {name:'Incline Dumbbell Press', graphic:'incline', target:'3 × 8–10', defaultWeight:24, reps:8, sets:3, maintainWeight:false},
    {name:'Cable Fly', graphic:'fly', target:'3 × 10–12', defaultWeight:12, reps:10, sets:3, maintainWeight:true},
    {name:'Seated Shoulder Press', graphic:'shoulder', target:'3 × 8–10', defaultWeight:20, reps:8, sets:3, maintainWeight:false},
    {name:'Triceps Rope Pressdown', graphic:'pressdown', target:'3 × 10–12', defaultWeight:25, reps:10, sets:3, maintainWeight:true},
    {name:'Plank', graphic:'plank', target:'3 rounds', defaultWeight:0, reps:45, sets:3, maintainWeight:true}
  ]},
  { day:'Day 2', title:'Engadin Pull Strength', subtitle:'Double-pole power + posterior chain', exercises:[
    {name:'Chin-Ups / Assisted Chin-Ups', graphic:'pullup', target:'4 × 5–8', defaultWeight:0, reps:6, sets:4, maintainWeight:false},
    {name:'Seated Cable Row', graphic:'row', target:'3 × 8–12', defaultWeight:50, reps:10, sets:3, maintainWeight:false},
    {name:'Straight-Arm Cable Pulldown', graphic:'pulldown', target:'3 × 12–15', defaultWeight:25, reps:12, sets:3, maintainWeight:true},
    {name:'Back Raises / Hyperextensions', graphic:'backextension', target:'3 × 10–15', defaultWeight:0, reps:12, sets:3, maintainWeight:true},
    {name:'Face Pulls', graphic:'facepull', target:'3 × 12–15', defaultWeight:20, reps:12, sets:3, maintainWeight:true},
    {name:'Pallof Press / Cable Woodchop', graphic:'woodchop', target:'3 × 10 each side', defaultWeight:15, reps:10, sets:3, maintainWeight:true}
  ]},
  { day:'Day 3', title:'Bulgarian Squat + Arms', subtitle:'Ski legs + arms + core', exercises:[
    {name:'Bulgarian Squat', graphic:'squat', target:'3 × 8 each leg', defaultWeight:16, reps:8, sets:3, maintainWeight:false},
    {name:'Leg Press', graphic:'legpress', target:'3 × 8–12', defaultWeight:100, reps:10, sets:3, maintainWeight:false},
    {name:'Lying Leg Curl', graphic:'legcurl', target:'3 × 10–15', defaultWeight:30, reps:12, sets:3, maintainWeight:false},
    {name:'Arm Curls', graphic:'curl', target:'3 × 10–12', defaultWeight:20, reps:10, sets:3, maintainWeight:true},
    {name:'Bar Triceps Extension', graphic:'tricepbar', target:'3 × 10–12', defaultWeight:20, reps:10, sets:3, maintainWeight:true},
    {name:'Plank', graphic:'plank', target:'3 rounds', defaultWeight:0, reps:45, sets:3, maintainWeight:true}
  ]},
  { day:'Day 4', title:'Leg Strength / Durability', subtitle:'Lower-body strength for skating endurance', exercises:[
    {name:'Leg Press', graphic:'legpress', target:'4 × 8–10', defaultWeight:110, reps:8, sets:4, maintainWeight:false},
    {name:'Romanian Deadlift', graphic:'deadlift', target:'4 × 8', defaultWeight:60, reps:8, sets:4, maintainWeight:false},
    {name:'Hamstring Curl', graphic:'legcurl', target:'3 × 10–12', defaultWeight:35, reps:10, sets:3, maintainWeight:false},
    {name:'Walking Lunges', graphic:'squat', target:'3 × 10 each leg', defaultWeight:16, reps:10, sets:3, maintainWeight:true},
    {name:'Leg Extension', graphic:'legextension', target:'3 × 10–12', defaultWeight:40, reps:10, sets:3, maintainWeight:false},
    {name:'Plank', graphic:'plank', target:'3 rounds', defaultWeight:0, reps:45, sets:3, maintainWeight:true}
  ]}
];

const DEFAULT_CARDIO = [
  {title:'Easy Run', target:'Easy 10 km'},
  {title:'Easy + Strides', target:'10 km + strides'},
  {title:'Tempo Run', target:'Tempo / threshold'},
  {title:'Long Run', target:'Long easy run'},
  {title:'SkiErg', target:'5 min warm-up + 5 × 3 min hard / 2 min easy + 5 min cooldown'}
];

const POPULAR_EXERCISES = [
  'Bench Press','Incline Dumbbell Press','Cable Fly','Cable Fly','Seated Shoulder Press','Triceps Rope Pressdown','Plank',
  'Chin-Ups / Assisted Chin-Ups','Chin-Ups','Assisted Chin-Ups','Seated Cable Row','Straight-Arm Cable Pulldown','Back Raises / Hyperextensions','Back Extension','Face Pulls','Pallof Press / Cable Woodchop','Cable Woodchop',
  'Bulgarian Squat','Leg Press','Lying Leg Curl','Hamstring Curl','Arm Curls','Bar Triceps Extension','Plank','Romanian Deadlift','Walking Lunges','Leg Extension','Plank',
  'Dumbbell Bench Press','Chest Press Machine','Machine Chest Fly','Push-Ups','Dips','Overhead Press','Lateral Raises','Rear Delt Fly','Pull-Ups','Lat Pulldown','Single Arm Dumbbell Row','Barbell Row','Deadlift','Barbell Curls','Dumbbell Curls','Hammer Curls','Cable Pressdown','Skull Crushers','Squat','Front Squat','Calf Raises','Weighted Sit-Ups','Sit-Ups / Crunches','Hanging Knee Raises','Russian Twists'
];
const CARDIO_OPTIONS = ['Easy Run','Easy + Strides','Tempo Run','Long Run','Intervals','Hill Repeats','SkiErg','Rowing Machine','Bike','Roller Ski'];
function clone(obj){ return JSON.parse(JSON.stringify(obj)); }
let workouts = clone(DEFAULT_WORKOUTS);
let cardio = clone(DEFAULT_CARDIO);
let state = { view:'workout', day:0, detail:null, toast:'', timer:{show:false,duration:60,seconds:60,running:false}, weekViewStart:weekStartISO(), activeWeekStart:weekStartISO(), openWeekDays:{}, moreMode:'workout', store:loadStore(), data:null };
applyConfig();
state.data = getWeekData(state.activeWeekStart);
let timerId = null;

function localISO(d=new Date()){
  const y=d.getFullYear();
  const m=String(d.getMonth()+1).padStart(2,'0');
  const day=String(d.getDate()).padStart(2,'0');
  return `${y}-${m}-${day}`;
}
function today(){ return localISO(new Date()); }
function weekStartISO(d=new Date()) { const x=new Date(d); const day=(x.getDay()+6)%7; x.setHours(12,0,0,0); x.setDate(x.getDate()-day); return localISO(x); }
function addDaysISO(iso,days){ const d=new Date(iso+'T12:00:00'); d.setDate(d.getDate()+days); return localISO(d); }
function weekDates(weekKey=weekStartISO()){ const start=new Date(weekKey+'T12:00:00'); return Array.from({length:7},(_,i)=>{const d=new Date(start); d.setDate(start.getDate()+i); return localISO(d);}); }
function normaliseStoredWeekKey(key){ const d=new Date(key+'T12:00:00'); return d.getDay()===0 ? addDaysISO(key,1) : weekStartISO(d); }
function fmtDate(s){ return new Date(s+'T12:00:00').toLocaleDateString('en-GB',{weekday:'short', day:'numeric', month:'short'}); }
function fmtWeek(s){ const dates=weekDates(s); return `${fmtDate(dates[0])} – ${fmtDate(dates[6])}`; }
function uid(){ return (crypto?.randomUUID?.() || `id_${Date.now()}_${Math.random().toString(16).slice(2)}`); }
function emptyWeek(key=weekStartISO()){ return {weekKey:key, workouts:{}, cardio:{}}; }
function loadStore(){ try { const raw=JSON.parse(localStorage.getItem(STORE_KEY)||'{}'); const key=weekStartISO(); const config=raw.config||null; if(raw.weeks){ const weeks={}; Object.entries(raw.weeks).forEach(([wk,data])=>{ const nk=normaliseStoredWeekKey(wk); weeks[nk]={...(weeks[nk]||emptyWeek(nk)), ...(data||{}), weekKey:nk, workouts:{...((weeks[nk]||{}).workouts||{}), ...((data||{}).workouts||{})}, cardio:{...((weeks[nk]||{}).cardio||{}), ...((data||{}).cardio||{})}}; }); if(!weeks[key]) weeks[key]=emptyWeek(key); return {version:22,currentWeekKey:key,weeks,config}; } const nk=normaliseStoredWeekKey(raw.weekKey||key); const migrated=emptyWeek(nk); migrated.workouts=raw.workouts||{}; migrated.cardio=raw.cardio||{}; return {version:22,currentWeekKey:key,weeks:{[migrated.weekKey]:migrated},config}; } catch { const key=weekStartISO(); return {version:22,currentWeekKey:key,weeks:{[key]:emptyWeek(key)},config:null}; }}
function applyConfig(){
  if(state.store.config){
    workouts = clone(state.store.config.workouts||DEFAULT_WORKOUTS);
    cardio = clone(state.store.config.cardio||DEFAULT_CARDIO);
  }
  workouts = workouts.slice(0,7).map((w,i)=>({day:`Day ${i+1}`, title:w.title||`Day ${i+1}`, subtitle:w.subtitle||'', exercises:(w.exercises||[]).map(normaliseExercise)}));
  cardio = cardio.map(c=>({title:c.title||'Cardio', target:c.target||'Cardio session'}));
}
function persistConfig(){ state.store.config={workouts:clone(workouts), cardio:clone(cardio)}; save(); }
function normaliseExercise(ex){ return {name:ex.name||'Custom Exercise', graphic:ex.graphic||guessGraphic(ex.name||''), target:ex.target||`${ex.sets||3} × ${ex.reps||10}`, defaultWeight:Number(ex.defaultWeight)||0, reps:Number(ex.reps)||10, sets:Number(ex.sets)||3, maintainWeight:!!ex.maintainWeight, ...(ex.warmups?{warmups:ex.warmups}: {})}; }
function guessGraphic(name=''){ const n=name.toLowerCase(); if(n.includes('bench')||n.includes('chest press')) return 'bench'; if(n.includes('incline')) return 'incline'; if(n.includes('fly')) return 'fly'; if(n.includes('shoulder')||n.includes('overhead press')) return 'shoulder'; if(n.includes('rope')||n.includes('pressdown')) return 'pressdown'; if(n.includes('triceps')||n.includes('skull')) return 'tricepbar'; if(n.includes('curl')) return n.includes('leg curl')||n.includes('hamstring') ? 'legcurl' : 'curl'; if(n.includes('pull-up')||n.includes('pull up')||n.includes('chin')) return 'pullup'; if(n.includes('pulldown')||n.includes('lat')) return 'pulldown'; if(n.includes('row')||n.includes('face pull')) return n.includes('face pull') ? 'facepull' : 'row'; if(n.includes('woodchop')||n.includes('pallof')) return 'woodchop'; if(n.includes('back raise')||n.includes('hyper')) return 'backextension'; if(n.includes('plank')||n.includes('dead bug')||n.includes('mountain climber')) return 'plank'; if(n.includes('sit')||n.includes('crunch')||n.includes('knee')) return 'situp'; if(n.includes('leg press')) return 'legpress'; if(n.includes('leg extension')) return 'legextension'; if(n.includes('leg curl')||n.includes('hamstring')) return 'legcurl'; if(n.includes('lunge')||n.includes('bulgarian')||n.includes('split squat')||n.includes('squat')) return 'squat'; if(n.includes('dead')) return 'deadlift'; if(n.includes('ski')) return 'ski'; return 'generic'; }
function getWeekData(key=weekStartISO()){ if(!state.store.weeks[key]) state.store.weeks[key]=emptyWeek(key); return state.store.weeks[key]; }
function activeWeekKey(){ return state.activeWeekStart || weekStartISO(); }
function setActiveWeek(key){ const current=weekStartISO(); const wk=key>current?current:key; state.activeWeekStart=wk; state.weekViewStart=wk; state.data=getWeekData(wk); }
function logDate(){ const wk=activeWeekKey(); return wk===weekStartISO() ? today() : addDaysISO(wk, Math.max(0, Math.min(6, Number(state.day)||0))); }
function refreshCurrentWeek(){ const key=weekStartISO(); if(!state.store.weeks[key]) state.store.weeks[key]=emptyWeek(key); state.store.currentWeekKey=key; if((state.weekViewStart||key)>key) state.weekViewStart=key; if((state.activeWeekStart||key)>key) state.activeWeekStart=key; state.data=getWeekData(activeWeekKey()); }
function save(){ refreshCurrentWeek(); const key=activeWeekKey(); state.data.weekKey=key; state.store.weeks[key]=state.data; localStorage.setItem(STORE_KEY, JSON.stringify(state.store)); }
function ensureRows(dayIndex=state.day){ refreshCurrentWeek(); if(!workouts[dayIndex]) state.day=0; dayIndex=Math.min(dayIndex, workouts.length-1); const key=String(dayIndex); if(!state.data.workouts[key]) state.data.workouts[key]={}; (workouts[dayIndex]?.exercises||[]).forEach(ex=>{ if(!state.data.workouts[key][ex.name]) state.data.workouts[key][ex.name]=makeRows(ex, dayIndex, activeWeekKey()); else syncRowsToExercisePlan(dayIndex, ex, state.data.workouts[key][ex.name], activeWeekKey()); }); state.store.weeks[activeWeekKey()]=state.data; return state.data.workouts[key]; }
function progressionStep(ex){
  if(ex.maintainWeight) return 0;
  const n=(ex.name||'').toLowerCase();
  if((Number(ex.defaultWeight)||0)<=0 && !n.includes('machine')) return 0;
  if(n.includes('bench')) return 2.5;
  if(n.includes('dumbbell')||n.includes('lateral')||n.includes('curl')) return 1;
  if(n.includes('leg press')||n.includes('hip thrust')||n.includes('squat')||n.includes('deadlift')) return 5;
  return 2.5;
}
function roundToStep(value, step){ if(!step) return Number(value)||0; return Math.max(0, Math.round((Number(value)||0)/step)*step); }
function previousExerciseRows(dayIndex, exName, beforeWeekKey){
  let wk=addDaysISO(beforeWeekKey,-7);
  for(let i=0;i<52;i++){
    const rows=state.store.weeks?.[wk]?.workouts?.[String(dayIndex)]?.[exName];
    if(Array.isArray(rows) && rows.length) return rows;
    wk=addDaysISO(wk,-7);
  }
  return null;
}
function suggestedWeightFromPrevious(ex, prevRows){
  const work=(prevRows||[]).filter(r=>r.type==='work');
  if(!work.length) return Number(ex.defaultWeight)||0;
  const weighted=work.filter(r=>(Number(r.weight)||0)>0);
  const base=weighted.length ? Math.max(...weighted.map(r=>Number(r.weight)||0)) : (Number(ex.defaultWeight)||0);
  const step=progressionStep(ex);
  if(!step) return roundToStep(base, 0);
  const target=work.reduce((a,r)=>a+(Number(r.targetReps)||Number(ex.reps)||0),0);
  const achieved=work.reduce((a,r)=>a+(r.done ? (Number(r.reps)||0) : 0),0);
  const doneCount=work.filter(r=>r.done).length;
  if(!target || !doneCount) return roundToStep(base, step);
  const ratio=achieved/target;
  if(ratio>=0.9 && doneCount>=Math.max(1,work.length-1)) return roundToStep(base+step, step);
  if(ratio<0.6 || doneCount<Math.ceil(work.length/2)) return roundToStep(base-step, step);
  return roundToStep(base, step);
}
function setExerciseMaintainWeight(dayIndex, exName, maintain, fromWeekKey=activeWeekKey()){
  const ex=workouts[dayIndex]?.exercises.find(e=>e.name===exName);
  if(!ex) return;
  ex.maintainWeight=!!maintain;
  state.store.config={workouts:clone(workouts), cardio:clone(cardio)};
  updateFutureSuggestionsFrom(dayIndex, exName, fromWeekKey);
  save();
}

function makeRows(ex, dayIndex=state.day, weekKey=activeWeekKey()){
  const rows=[]; const d=weekKey===weekStartISO()?today():addDaysISO(weekKey, Math.max(0, Math.min(6, Number(dayIndex)||0)));
  const prev=previousExerciseRows(dayIndex, ex.name, weekKey);
  const suggested=suggestedWeightFromPrevious(ex, prev);
  (ex.warmups||[]).forEach((w,i)=>rows.push({id:uid(), type:'warmup', label:i?`Warm-up ${i+1}`:'Warm-up', weight:w.weight, reps:w.reps, targetReps:w.reps, done:false, date:d}));
  for(let i=0;i<ex.sets;i++) rows.push({id:uid(), type:'work', label:`Set ${i+1}`, weight:suggested, reps:ex.reps, targetReps:ex.reps, done:false, date:d});
  return rows;
}
function relabelWorkSets(rows){ let n=1; rows.forEach(r=>{ if(r.type==='work') r.label=`Set ${n++}`; }); }
function syncRowsToExercisePlan(dayIndex, ex, rows, weekKey=activeWeekKey()){
  const target=Number(ex.sets)||0;
  let work=rows.filter(r=>r.type==='work');
  const d=weekKey===weekStartISO()?today():addDaysISO(weekKey, Math.max(0, Math.min(6, Number(dayIndex)||0)));
  while(work.length<target){
    const prev=previousExerciseRows(dayIndex, ex.name, weekKey);
    const last=[...work].reverse()[0];
    const suggested=prev ? suggestedWeightFromPrevious(ex, prev) : (last?.weight ?? ex.defaultWeight);
    rows.push({id:uid(), type:'work', label:`Set ${work.length+1}`, weight:suggested, reps:ex.reps, targetReps:ex.reps, done:false, date:d});
    work=rows.filter(r=>r.type==='work');
  }
  while(work.length>target){
    const remove=[...rows].map((r,i)=>({r,i})).reverse().find(x=>x.r.type==='work'&&!x.r.done) || [...rows].map((r,i)=>({r,i})).reverse().find(x=>x.r.type==='work');
    if(!remove) break;
    rows.splice(remove.i,1);
    work=rows.filter(r=>r.type==='work');
  }
  relabelWorkSets(rows);
}
function updateExerciseTarget(ex){
  const warm=(ex.warmups||[]).length ? `Warm-up ${(ex.warmups||[]).map(w=>`${w.weight}kg × ${w.reps}`).join(', ')}, then ` : '';
  ex.target=`${warm}${ex.sets} × ${ex.reps}`;
}
function applySetPlanToWeeks(dayIndex, exName, fromWeekKey){
  const ex=workouts[dayIndex]?.exercises.find(e=>e.name===exName);
  if(!ex) return;
  Object.keys(state.store.weeks||{}).sort().forEach(wk=>{
    if(wk<fromWeekKey) return;
    const rows=state.store.weeks[wk]?.workouts?.[String(dayIndex)]?.[exName];
    if(Array.isArray(rows)) syncRowsToExercisePlan(dayIndex, ex, rows, wk);
  });
}
function updateFutureSuggestionsFrom(dayIndex, exName, fromWeekKey){
  const ex=workouts[dayIndex]?.exercises.find(e=>e.name===exName);
  if(!ex) return;
  Object.keys(state.store.weeks||{}).sort().forEach(wk=>{
    if(wk<=fromWeekKey) return;
    const rows=state.store.weeks[wk]?.workouts?.[String(dayIndex)]?.[exName];
    if(!Array.isArray(rows)) return;
    syncRowsToExercisePlan(dayIndex, ex, rows, wk);
    const work=rows.filter(r=>r.type==='work');
    if(work.some(r=>r.done)) return;
    const suggested=suggestedWeightFromPrevious(ex, previousExerciseRows(dayIndex, ex.name, wk));
    work.forEach(r=>{ r.weight=suggested; r.reps=ex.reps; r.targetReps=ex.reps; });
  });
}
function changeExerciseSetCount(dayIndex, exName, count, fromWeekKey=activeWeekKey()){
  const ex=workouts[dayIndex]?.exercises.find(e=>e.name===exName);
  if(!ex) return;
  ex.sets=Math.max(1, Number(count)||1);
  updateExerciseTarget(ex);
  state.store.config={workouts:clone(workouts), cardio:clone(cardio)};
  applySetPlanToWeeks(dayIndex, exName, fromWeekKey);
  updateFutureSuggestionsFrom(dayIndex, exName, fromWeekKey);
  save();
}

function completeExercise(rows){ return rows && rows.length && rows.every(r=>r.type==='warmup' || r.done); }
function completeDay(dayIndex){ const rows=ensureRows(dayIndex); const exs=workouts[dayIndex]?.exercises||[]; return exs.length>0 && exs.every(ex=>completeExercise(rows[ex.name])); }
function dayStats(dayIndex=state.day){ const rows=Object.values(ensureRows(dayIndex)).flat().filter(r=>r.done); return {sets: rows.length, volume: rows.reduce((a,r)=>a+(Number(r.weight)||0)*(Number(r.reps)||0),0)}; }
function toast(msg){ state.toast=msg; render(); setTimeout(()=>{ state.toast=''; render(); }, 1400); }
function esc(s){ return String(s).replace(/[&<>"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }

function icon(type){
  const s='stroke="currentColor" stroke-width="3.8" fill="none" stroke-linecap="round" stroke-linejoin="round"';
  const sg='stroke="url(#neonStroke)" stroke-width="3.8" fill="none" stroke-linecap="round" stroke-linejoin="round"';
  const defs=`<defs><linearGradient id="neonStroke" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#eaf7ff"/><stop offset=".45" stop-color="#35a6ff"/><stop offset="1" stop-color="#0b73ff"/></linearGradient><linearGradient id="bodyFill" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0e3970" stop-opacity=".86"/><stop offset="1" stop-color="#04142a" stop-opacity=".94"/></linearGradient><filter id="glow" x="-25%" y="-25%" width="150%" height="150%"><feGaussianBlur stdDeviation="2.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>`;
  const open=`<svg class="exerciseSvg" viewBox="0 0 260 150" aria-hidden="true">${defs}<g filter="url(#glow)">`;
  const close='</g></svg>';
  if(type==='bench') return `${open}<line ${s} x1="36" y1="108" x2="224" y2="108" opacity=".7"/><line ${s} x1="63" y1="108" x2="63" y2="36"/><line ${s} x1="198" y1="108" x2="198" y2="40"/><line ${s} x1="45" y1="108" x2="80" y2="108"/><line ${s} x1="180" y1="108" x2="216" y2="108"/><line ${s} x1="50" y1="48" x2="211" y2="48"/><circle ${s} cx="84" cy="48" r="14"/><circle ${s} cx="200" cy="48" r="14"/><line ${s} x1="72" y1="48" x2="96" y2="48"/><line ${s} x1="188" y1="48" x2="212" y2="48"/><rect ${s} x="70" y="94" width="112" height="11" rx="4"/><line ${s} x1="84" y1="105" x2="84" y2="118"/><line ${s} x1="170" y1="105" x2="170" y2="118"/><ellipse cx="93" cy="74" rx="11" ry="9" fill="url(#bodyFill)" stroke="url(#neonStroke)" stroke-width="3"/><path d="M104 78 C124 63 145 67 162 85 L181 98" fill="url(#bodyFill)" stroke="url(#neonStroke)" stroke-width="3.8" stroke-linecap="round" stroke-linejoin="round"/><path ${sg} d="M124 67 L116 49 M152 77 L144 50"/><path ${sg} d="M162 85 L141 103 M181 98 L213 104"/>${close}`;
  if(type==='incline') return `${open}<line ${s} x1="50" y1="115" x2="210" y2="115" opacity=".65"/><line ${s} x1="70" y1="104" x2="170" y2="70"/><line ${s} x1="76" y1="104" x2="76" y2="118"/><line ${s} x1="158" y1="74" x2="176" y2="112"/><ellipse cx="88" cy="74" rx="10" ry="8" fill="url(#bodyFill)" stroke="url(#neonStroke)" stroke-width="3"/><path d="M98 78 L124 77 L152 88" fill="url(#bodyFill)" stroke="url(#neonStroke)" stroke-width="3.8"/><path ${sg} d="M120 77 L128 54 M150 87 L162 60"/><circle ${s} cx="128" cy="52" r="6"/><circle ${s} cx="163" cy="58" r="6"/><path ${sg} d="M153 88 L176 106 M124 78 L112 107"/>${close}`;
  if(type==='fly') return `${open}<rect ${s} x="62" y="96" width="120" height="11" rx="4"/><line ${s} x1="76" y1="107" x2="76" y2="120"/><line ${s} x1="166" y1="107" x2="166" y2="120"/><ellipse cx="88" cy="76" rx="10" ry="8" fill="url(#bodyFill)" stroke="url(#neonStroke)" stroke-width="3"/><path d="M98 79 C119 68 144 75 164 93" fill="url(#bodyFill)" stroke="url(#neonStroke)" stroke-width="3.5"/><path ${sg} d="M118 71 C104 56 92 45 82 35 M145 82 C162 66 176 53 188 40"/><circle ${s} cx="78" cy="31" r="6"/><circle ${s} cx="192" cy="36" r="6"/><path ${sg} d="M163 93 L186 111 M122 76 L108 111"/>${close}`;
  if(type==='shoulder') return `${open}<line ${s} x1="80" y1="115" x2="180" y2="115"/><rect ${s} x="86" y="73" width="55" height="39" rx="7"/><circle cx="153" cy="47" r="11" fill="url(#bodyFill)" stroke="url(#neonStroke)" stroke-width="3"/><path d="M153 59 L153 94" fill="url(#bodyFill)" stroke="url(#neonStroke)" stroke-width="3.6"/><path ${sg} d="M153 72 L127 36 M153 72 L181 36"/><circle ${s} cx="122" cy="32" r="7"/><circle ${s} cx="186" cy="32" r="7"/><path ${sg} d="M153 94 L132 116 M153 94 L174 116"/>${close}`;
  if(type==='pressdown') return `${open}<line ${s} x1="190" y1="25" x2="190" y2="125"/><line ${s} x1="190" y1="25" x2="215" y2="25"/><circle cx="112" cy="45" r="10" fill="url(#bodyFill)" stroke="url(#neonStroke)" stroke-width="3"/><path d="M112 57 L112 94" stroke="url(#neonStroke)" stroke-width="4" fill="none"/><path ${sg} d="M112 70 L144 72 L160 86"/><path ${sg} d="M112 94 L95 123 M112 94 L130 123"/><line ${s} x1="144" y1="72" x2="174" y2="72"/><line ${s} x1="174" y1="72" x2="174" y2="87"/><path ${sg} d="M160 86 L154 101 M160 86 L168 101"/>${close}`;
  if(type==='tricepbar') return `${open}<line ${s} x1="190" y1="25" x2="190" y2="125"/><line ${s} x1="190" y1="25" x2="215" y2="25"/><circle cx="112" cy="45" r="10" fill="url(#bodyFill)" stroke="url(#neonStroke)" stroke-width="3"/><path ${sg} d="M112 57 L112 94 M112 70 L146 74 M112 94 L95 123 M112 94 L130 123"/><line ${s} x1="146" y1="74" x2="174" y2="74"/><line ${s} x1="174" y1="74" x2="174" y2="98"/><line ${s} x1="152" y1="100" x2="178" y2="100"/>${close}`;
  if(type==='row') return `${open}<line ${s} x1="48" y1="120" x2="215" y2="120"/><line ${s} x1="52" y1="104" x2="88" y2="104"/><line ${s} x1="88" y1="104" x2="108" y2="76"/><circle cx="142" cy="50" r="10" fill="url(#bodyFill)" stroke="url(#neonStroke)" stroke-width="3"/><path d="M138 61 L118 88 L92 103" fill="url(#bodyFill)" stroke="url(#neonStroke)" stroke-width="3.8"/><path ${sg} d="M128 73 L92 70"/><line ${s} x1="92" y1="70" x2="50" y2="70"/><path ${sg} d="M118 88 L143 120 M108 91 L88 120"/>${close}`;
  if(type==='facepull') return `${open}<line ${s} x1="195" y1="24" x2="195" y2="126"/><line ${s} x1="195" y1="24" x2="218" y2="24"/><circle cx="115" cy="45" r="10" fill="url(#bodyFill)" stroke="url(#neonStroke)" stroke-width="3"/><path ${sg} d="M115 57 L115 95 M115 72 L91 53 M115 72 L141 53 M115 95 L98 124 M115 95 L132 124"/><line ${s} x1="141" y1="53" x2="174" y2="53"/><line ${s} x1="174" y1="53" x2="174" y2="62"/><path ${sg} d="M91 53 L105 42 M141 53 L127 42"/>${close}`;
  if(type==='pulldown') return `${open}<line ${s} x1="195" y1="22" x2="195" y2="128"/><line ${s} x1="195" y1="22" x2="218" y2="22"/><circle cx="108" cy="47" r="10" fill="url(#bodyFill)" stroke="url(#neonStroke)" stroke-width="3"/><path ${sg} d="M108 59 L108 96 M108 73 L142 45 M108 73 L78 76 M108 96 L90 124 M108 96 L126 124"/><line ${s} x1="142" y1="45" x2="174" y2="45"/><line ${s} x1="174" y1="45" x2="174" y2="68"/>${close}`;
  if(type==='pullup') return `${open}<line ${s} x1="58" y1="28" x2="202" y2="28"/><line ${s} x1="72" y1="28" x2="72" y2="122" opacity=".55"/><line ${s} x1="188" y1="28" x2="188" y2="122" opacity=".55"/><circle cx="130" cy="52" r="11" fill="url(#bodyFill)" stroke="url(#neonStroke)" stroke-width="3"/><path ${sg} d="M130 64 L130 98 M130 76 L100 30 M130 76 L160 30 M130 98 L112 126 M130 98 L148 126"/>${close}`;
  if(type==='backextension') return `${open}<line ${s} x1="45" y1="114" x2="125" y2="70"/><line ${s} x1="70" y1="114" x2="70" y2="99"/><line ${s} x1="98" y1="114" x2="98" y2="85"/><rect ${s} x="68" y="80" width="58" height="12" rx="4"/><circle cx="160" cy="55" r="10" fill="url(#bodyFill)" stroke="url(#neonStroke)" stroke-width="3"/><path d="M151 61 L125 74 L98 86" fill="url(#bodyFill)" stroke="url(#neonStroke)" stroke-width="3.6"/><path ${sg} d="M127 75 L158 88 M158 88 L176 118 M158 88 L140 118"/>${close}`;
  if(type==='woodchop') return `${open}<line ${s} x1="195" y1="22" x2="195" y2="128"/><line ${s} x1="195" y1="22" x2="218" y2="22"/><circle cx="105" cy="48" r="10" fill="url(#bodyFill)" stroke="url(#neonStroke)" stroke-width="3"/><path ${sg} d="M105 60 L108 96 M108 96 L90 126 M108 96 L130 126"/><path ${sg} d="M105 68 L147 41 M108 72 L145 94"/><line ${s} x1="147" y1="41" x2="176" y2="41"/><line ${s} x1="176" y1="41" x2="176" y2="94"/>${close}`;
  if(type==='squat') return `${open}<line ${s} x1="42" y1="120" x2="218" y2="120" opacity=".65"/><circle cx="90" cy="50" r="10" fill="url(#bodyFill)" stroke="url(#neonStroke)" stroke-width="3"/><path d="M91 61 L106 89 L142 87 L166 105" fill="url(#bodyFill)" stroke="url(#neonStroke)" stroke-width="3.8"/><path ${sg} d="M106 89 L86 119 M142 87 L130 119 M166 105 L196 116"/><line ${s} x1="156" y1="104" x2="196" y2="104"/><line ${s} x1="82" y1="119" x2="102" y2="119"/><line ${s} x1="126" y1="119" x2="146" y2="119"/>${close}`;
  if(type==='legpress') return `${open}<line ${s} x1="42" y1="118" x2="218" y2="118"/><line ${s} x1="58" y1="102" x2="112" y2="102"/><line ${s} x1="112" y1="102" x2="186" y2="56"/><line ${s} x1="186" y1="56" x2="206" y2="76"/><circle cx="78" cy="72" r="10" fill="url(#bodyFill)" stroke="url(#neonStroke)" stroke-width="3"/><path d="M88 75 L112 93 L139 88" fill="url(#bodyFill)" stroke="url(#neonStroke)" stroke-width="3.6"/><path ${sg} d="M112 93 L90 119 M139 88 L180 66"/><line ${s} x1="178" y1="66" x2="205" y2="66"/>${close}`;
  if(type==='legextension') return `${open}<line ${s} x1="70" y1="118" x2="195" y2="118"/><rect ${s} x="70" y="74" width="62" height="44" rx="8"/><circle cx="150" cy="55" r="10" fill="url(#bodyFill)" stroke="url(#neonStroke)" stroke-width="3"/><path ${sg} d="M146 66 L132 89 L105 79 M132 89 L160 91 M160 91 L205 91"/><circle ${s} cx="215" cy="91" r="7"/><path ${sg} d="M132 89 L120 118"/>${close}`;
  if(type==='legcurl') return `${open}<rect ${s} x="50" y="84" width="142" height="13" rx="5"/><line ${s} x1="60" y1="97" x2="60" y2="118"/><line ${s} x1="180" y1="97" x2="180" y2="118"/><circle cx="78" cy="65" r="9" fill="url(#bodyFill)" stroke="url(#neonStroke)" stroke-width="3"/><path d="M88 68 C112 79 135 84 163 84" fill="url(#bodyFill)" stroke="url(#neonStroke)" stroke-width="3.6"/><path ${sg} d="M163 84 L190 70"/><circle ${s} cx="199" cy="68" r="7"/>${close}`;
  if(type==='curl') return `${open}<circle cx="130" cy="42" r="11" fill="url(#bodyFill)" stroke="url(#neonStroke)" stroke-width="3"/><path ${sg} d="M130 54 L130 95 M130 68 L98 78 M130 68 L162 78 M130 95 L110 126 M130 95 L150 126"/><path ${sg} d="M98 78 L108 58 M162 78 L152 58"/><circle ${s} cx="108" cy="53" r="7"/><circle ${s} cx="152" cy="53" r="7"/>${close}`;
  if(type==='deadlift') return `${open}<line ${s} x1="50" y1="105" x2="205" y2="105" opacity=".65"/><circle cx="122" cy="45" r="10" fill="url(#bodyFill)" stroke="url(#neonStroke)" stroke-width="3"/><path d="M122 57 L130 86 L160 96" fill="url(#bodyFill)" stroke="url(#neonStroke)" stroke-width="3.8"/><path ${sg} d="M130 86 L101 98 M101 98 L88 124 M160 96 L177 124"/><line ${s} x1="70" y1="94" x2="184" y2="94"/><circle ${s} cx="58" cy="94" r="10"/><circle ${s} cx="196" cy="94" r="10"/>${close}`;
  if(type==='situp') return `${open}<line ${s} x1="42" y1="118" x2="218" y2="118"/><circle cx="75" cy="82" r="10" fill="url(#bodyFill)" stroke="url(#neonStroke)" stroke-width="3"/><path d="M85 86 C112 61 143 65 162 91" fill="url(#bodyFill)" stroke="url(#neonStroke)" stroke-width="3.6"/><path ${sg} d="M162 91 L195 113"/>${close}`;
  if(type==='plank') return `${open}<line ${s} x1="38" y1="119" x2="220" y2="119"/><circle cx="72" cy="82" r="10" fill="url(#bodyFill)" stroke="url(#neonStroke)" stroke-width="3"/><path d="M83 84 L132 91 L184 95" fill="url(#bodyFill)" stroke="url(#neonStroke)" stroke-width="4"/><path ${sg} d="M132 91 L112 119 M184 95 L204 119"/>${close}`;
  if(type==='ski') return `${open}<circle cx="86" cy="45" r="10" fill="url(#bodyFill)" stroke="url(#neonStroke)" stroke-width="3"/><path d="M86 57 L113 78 L101 112" fill="url(#bodyFill)" stroke="url(#neonStroke)" stroke-width="3.8"/><path ${sg} d="M113 78 L153 68 M101 112 L72 126 M101 112 L148 127"/><line ${s} x1="60" y1="130" x2="166" y2="130"/><line ${s} x1="162" y1="40" x2="162" y2="130"/>${close}`;
  return `${open}<circle cx="130" cy="42" r="11" fill="url(#bodyFill)" stroke="url(#neonStroke)" stroke-width="3"/><path ${sg} d="M130 54 L130 95 M130 68 L100 82 M130 68 L160 82 M130 95 L112 126 M130 95 L148 126"/>${close}`;
}
function graphic(type, size='small'){
  const imageTypes = new Set(['bench','incline','fly','shoulder','pressdown','tricepbar','plank','pullup','row','pulldown','facepull','woodchop','backextension','squat','legpress','legcurl','legextension','curl','deadlift','ski','run','generic','sideplank','lunges','plankmountain']);
  if(imageTypes.has(type)){
    const stem = type==='bench' ? 'bench-press' : (type==='sideplank' ? 'preview-sideplank' : type==='lunges' ? 'preview-lunges' : type==='plankmountain' ? 'preview-plankmountain' : `exercise-${type}`);
    const src = `${stem}-${size==='large'?'large':'small'}.png`;
    const alt = `${type} exercise illustration`;
    return `<div class="graphic ${size==='large'?'graphicLarge':'graphicSmall'} graphicImage graphicImage-${type}"><img src="${src}" alt="${alt}" class="exerciseArt ${size==='large'?'exerciseArtLarge':'exerciseArtSmall'}"></div>`;
  }
  return `<div class="graphic ${size==='large'?'graphicLarge':'graphicSmall'}">${icon(type)}</div>`;
}

function render(){
  if(document.body.dataset.ready!=='yes') return;
  const root=document.getElementById('root');
  root.innerHTML = `<div class="app"><header class="sticky"><div class="brand" aria-label="G-Project"><img src="${HEADER}" alt="G-Project" class="headerLogoExact"></div>${state.toast?`<span class="toast">${state.toast}</span>`:''}</header><main class="content">${viewHTML()}</main>${timerHTML()}${navHTML()}</div>`;
  bind();
}
function viewHTML(){ if(state.view==='workout') return workoutHTML(); if(state.view==='cardio') return cardioHTML(); if(state.view==='week') return weekHTML(); if(state.view==='progress') return progressHTML(); return moreHTML(); }
function workoutHTML(){
  const w=workouts[state.day]; const rows=ensureRows(); const stats=dayStats(); const done=completeDay(state.day);
  if(state.detail){ const ex=w.exercises.find(e=>e.name===state.detail); const exRows=rows[ex.name]||[]; const exDone=completeExercise(exRows); return `<section class="card exercise detail ${exDone?'complete':''}"><div class="detailTop"><button class="backButton" data-action="back">‹ Back to exercises</button><label class="maintainToggle"><span>Keep weight same</span><input type="checkbox" data-action="maintainWeight" data-ex="${esc(ex.name)}" ${ex.maintainWeight?'checked':''}><i></i></label></div><div class="detailHeroWrap">${graphic(ex.graphic,'large')}<div class="detailInfo"><h2>${esc(ex.name)}</h2><p>${esc(ex.target)}</p></div>${exDone?'<span class="doneIcon detailDone">✓</span>':''}</div><div class="setGrid labels"><span>Set</span><span>Suggested</span><span>KG</span><span>Reps</span><span></span></div>${exRows.map(r=>`<div class="setGrid setRow ${r.done?'done':''}" data-ex="${esc(ex.name)}" data-id="${r.id}"><span>${esc(r.label)}</span><span>${r.weight} kg × ${r.targetReps}</span><input type="number" step="0.5" value="${r.weight}" data-field="weight"><input type="number" value="${r.reps}" data-field="reps"><button class="setTick" data-action="tick">✓</button></div>`).join('')}<div class="setTools"><button class="ghost" data-action="addset" data-ex="${esc(ex.name)}">＋ Add Set</button><button class="danger" data-action="removeset" data-ex="${esc(ex.name)}">− Remove Last Set</button></div></section>`; }
  return `<div class="chooser stickyChooser">${workouts.map((x,i)=>`<button data-action="day" data-day="${i}" class="${state.day===i?'active':''} ${completeDay(i)?'complete':''}"><b>${x.day}</b><span>${esc(x.title)}</span></button>`).join('')}</div><section class="hero ${done?'complete':''}"><div><small>${activeWeekKey()===weekStartISO()?'TODAY · '+fmtDate(today()):'VIEWING WEEK · '+fmtWeek(activeWeekKey())}</small><h1>${esc(w.title)}</h1><p>${esc(w.subtitle)}</p></div><div class="heroBadge">${done?'COMPLETED':`${stats.sets} sets`}</div></section>${w.exercises.map(ex=>{ const exDone=completeExercise(rows[ex.name]); return `<button class="exerciseSummary ${exDone?'complete':''}" data-action="detail" data-ex="${esc(ex.name)}">${graphic(ex.graphic,'small')}<div><h2>${esc(ex.name)}</h2><p>${esc(ex.target)}</p></div><span>${exDone?'✓':'○'}</span></button>`; }).join('')}<p class="saveNote">Autosaves as soon as you tick or untick a set</p>`;
}
function cardioHTML(){ return cardio.map(c=>{ const item=state.data.cardio[c.title]||{}; const done=!!item.done; const cardGraphic = /ski/i.test(c.title) ? 'ski' : 'run'; return `<section class="card runCard ${done?'complete':''}" data-cardio="${esc(c.title)}"><div class="runTop">${graphic(cardGraphic,'small')}<div><h2>${esc(c.title)}</h2><p>${esc(c.target)}</p></div>${done?'<span class="doneIcon">✓</span>':''}</div><label>Distance<input placeholder="e.g. 10.25" value="${esc(item.distance||'')}" data-cardio-field="distance"><span>${c.title==='SkiErg'?'m/km':'km'}</span></label><label>Time<input placeholder="e.g. 52:18" value="${esc(item.time||'')}" data-cardio-field="time"><span>mm:ss</span></label><div class="runActions"><button class="primary" data-action="cardioToggle">${done?'✓ Completed':'Mark Complete'}</button>${done?'<button class="danger" data-action="cardioUndo">Mark as not done</button>':''}</div></section>`; }).join(''); }
function dayWeekSummary(weekData,d){
  const parts=[]; const details=[];
  Object.entries(weekData.workouts||{}).forEach(([idx,dayRows])=>{
    Object.entries(dayRows||{}).forEach(([exName,rows])=>{
      const done=(rows||[]).filter(r=>r.done&&r.date===d);
      if(done.length){
        const max=Math.max(...done.map(r=>Number(r.weight)||0));
        const maxText=max>0?` · max ${max}kg`:'';
        parts.push(`${exName} · ${done.length} sets${maxText}`);
        details.push(`<li><b>${esc(exName)}</b><span>${done.length} sets${maxText}</span></li>`);
      }
    });
  });
  Object.entries(weekData.cardio||{}).forEach(([title,item])=>{
    if(item.done && item.date===d){
      const extra=[item.distance?`${item.distance}${title==='SkiErg'?'m/km':'km'}`:'', item.time||''].filter(Boolean).join(' · ');
      parts.push(`${title}${extra?` · ${extra}`:''}`);
      details.push(`<li><b>${esc(title)}</b><span>${esc(extra||'completed')}</span></li>`);
    }
  });
  return {parts, details};
}
function chevronIcon(open=false){ return open ? `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 15l6-6 6 6"/></svg>` : `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>`; }
function weekHTML(){
  const wk=state.weekViewStart||weekStartISO(); const current=weekStartISO(); const viewingCurrent=wk===current; const weekData=getWeekData(wk);
  return `<section class="card"><div class="weekHeader"><button class="weekNavBtn" data-action="weekPrev">‹</button><div><h2>Week View</h2><p class="muted">${fmtWeek(wk)}</p></div><button class="weekNavBtn ${viewingCurrent?'disabled':''}" data-action="weekNext" ${viewingCurrent?'disabled':''}>›</button></div>${weekDates(wk).map(d=>{ const summary=dayWeekSummary(weekData,d); const any=summary.parts.length; const open=!!state.openWeekDays[`${wk}_${d}`]; return `<div class="weekRowWrap ${any?'complete':''}"><div class="weekRow"><div><b>${fmtDate(d)}</b><p>${summary.parts.slice(0,2).join(', ')||'No log yet'}${summary.parts.length>2?'…':''}</p></div><div class="weekRight"><button class="weekDrop" data-action="toggleWeekDay" data-day="${d}" aria-label="Toggle day summary">${chevronIcon(open)}</button><span>${any?'✓':'○'}</span></div></div>${open?`<div class="weekDetails">${any?`<ul>${summary.details.join('')}</ul>`:'<p>No completed exercises or runs logged.</p>'}</div>`:''}</div>`; }).join('')}</section>`;
}
function benchProgress(){
  const points=[];
  Object.entries(state.store.weeks||{}).sort(([a],[b])=>a.localeCompare(b)).forEach(([wk,weekData])=>{
    let max=null;
    Object.values(weekData.workouts||{}).forEach(dayRows=>{
      Object.entries(dayRows||{}).forEach(([exName,rows])=>{
        const name=exName.toLowerCase();
        if((name==='bench press' || (name.includes('bench press') && !name.includes('light') && !name.includes('incline'))) && Array.isArray(rows)){
          rows.filter(r=>r.done).forEach(r=>{ const w=Number(r.weight)||0; if(w>0) max=max===null?w:Math.max(max,w); });
        }
      });
    });
    if(max!==null) points.push({week:wk, label:fmtDate(wk).replace(/^[A-Za-z]+ /,''), weight:max});
  });
  return points;
}
function benchChartHTML(){
  const points=benchProgress();
  if(!points.length) return `<div class="benchChart empty"><p>No flat bench records yet. Tick completed Bench Press sets and they’ll appear here.</p></div>`;
  const width=620, height=260, left=44, right=18, top=24, bottom=48;
  const vals=points.map(p=>p.weight); const min=Math.max(0, Math.floor((Math.min(...vals)-5)/5)*5); const max=Math.ceil((Math.max(...vals)+5)/5)*5 || 100;
  const span=Math.max(1,max-min); const plotW=width-left-right, plotH=height-top-bottom;
  const x=i=>left+(points.length===1?plotW/2:(i/(points.length-1))*plotW); const y=v=>top+plotH-((v-min)/span)*plotH;
  const path=points.map((p,i)=>`${i?'L':'M'} ${x(i).toFixed(1)} ${y(p.weight).toFixed(1)}`).join(' ');
  const yTicks=[min, Math.round((min+max)/2), max];
  return `<div class="benchChart"><div class="chartTitle"><h3>Flat Bench Progress</h3><span>Max completed weight per week</span></div><svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Flat bench max weight by week">${yTicks.map(t=>`<g><line x1="${left}" y1="${y(t)}" x2="${width-right}" y2="${y(t)}"/><text x="${left-8}" y="${y(t)+4}" text-anchor="end">${t}kg</text></g>`).join('')}<path d="${path}" class="chartLine"/>${points.map((p,i)=>`<g><circle cx="${x(i)}" cy="${y(p.weight)}" r="5"/><text x="${x(i)}" y="${y(p.weight)-10}" text-anchor="middle">${p.weight}kg</text><text class="xLabel" x="${x(i)}" y="${height-18}" text-anchor="middle">${esc(p.label)}</text></g>`).join('')}</svg></div>`;
}
function progressHTML(){ const allRows=Object.values(state.data.workouts).flatMap(day=>Object.values(day).flat()); const doneRows=allRows.filter(r=>r.done); const vol=doneRows.reduce((a,r)=>a+(Number(r.weight)||0)*(Number(r.reps)||0),0); const cardioCount=Object.values(state.data.cardio).filter(c=>c.done).length; return `<section class="card"><h2>Progress</h2><div class="progressGrid"><div><small>Completed days</small><b>${workouts.filter((_,i)=>completeDay(i)).length}</b></div><div><small>Cardio</small><b>${cardioCount}</b></div><div><small>Total volume</small><b>${vol}kg</b></div><div><small>This week</small><b>${doneRows.length} sets</b></div></div>${benchChartHTML()}<button class="danger wide" data-action="clear">Clear saved logs</button></section>`; }
function exerciseOptionHTML(selected=''){ return `<option value="">Choose exercise…</option>${POPULAR_EXERCISES.map(x=>`<option value="${esc(x)}" ${x===selected?'selected':''}>${esc(x)}</option>`).join('')}`; }
function moreHTML(){
  if(state.moreMode==='cardio') return cardioConfigHTML();
  return workoutConfigHTML();
}
function workoutConfigHTML(){
  return `<section class="card configCard"><h2>More</h2><div class="segmented"><button class="active" data-action="moreMode" data-mode="workout">Workout</button><button data-action="moreMode" data-mode="cardio">Cardio</button></div><p class="muted configIntro">Edit the workout plan. This changes what appears in the Workout tab.</p>${workouts.map((day,di)=>`<div class="configDay"><div class="configDayHead"><div><b>${esc(day.day)} · ${esc(day.title)}</b><small>${day.exercises.length} exercises</small></div><button class="redX" data-action="removeDay" data-day="${di}" ${workouts.length<=1?'disabled':''}>×</button></div><label class="configLabel">Day title<input value="${esc(day.title)}" data-action="dayTitle" data-day="${di}"></label>${day.exercises.map((ex,ei)=>`<div class="configItem"><div><b>${esc(ex.name)}</b><small>${esc(ex.target)} · ${ex.defaultWeight}kg</small></div><button class="redX" data-action="removeExercise" data-day="${di}" data-ex-index="${ei}">×</button></div>`).join('')}<div class="addExercise"><select data-add-select="${di}">${exerciseOptionHTML()}</select><input placeholder="Or custom exercise" data-add-custom="${di}"><button class="primary" data-action="addExercise" data-day="${di}">＋ Add</button></div></div>`).join('')}<button class="ghost wide" data-action="addDay" ${workouts.length>=7?'disabled':''}>＋ Add Day</button></section>`;
}
function cardioConfigHTML(){
  return `<section class="card configCard"><h2>More</h2><div class="segmented"><button data-action="moreMode" data-mode="workout">Workout</button><button class="active" data-action="moreMode" data-mode="cardio">Cardio</button></div><p class="muted configIntro">Edit the cardio list. This changes what appears in the Cardio tab.</p>${cardio.map((c,i)=>`<div class="configItem"><div><b>${esc(c.title)}</b><small>${esc(c.target)}</small></div><button class="redX" data-action="removeCardio" data-cardio-index="${i}">×</button></div>`).join('')}<div class="addExercise"><select data-cardio-select>${CARDIO_OPTIONS.map(x=>`<option value="${esc(x)}">${esc(x)}</option>`).join('')}</select><input placeholder="Or custom cardio" data-cardio-custom><button class="primary" data-action="addCardio">＋ Add</button></div></section>`;
}

function timerHTML(){ const t=state.timer; const pct=Math.max(0,Math.min(100,(t.seconds/t.duration)*100)); const mm=String(Math.floor(t.seconds/60)).padStart(2,'0'), ss=String(t.seconds%60).padStart(2,'0'), dm=String(Math.floor(t.duration/60)).padStart(2,'0'), ds=String(t.duration%60).padStart(2,'0'); return `<div id="gproject-rest-timer" class="${t.show?'show':''}"><button type="button" class="gptimer-close" data-action="timerClose">×</button><div class="gptimer-top"><button type="button" class="gptimer-reset" data-action="timerReset">RESET TIMER</button><button type="button" class="gptimer-duration" data-action="timerDuration">${t.duration} SECONDS</button></div><div class="gptimer-dial" style="--pct:${pct}%"><div class="gptimer-inner"><strong>${mm}:${ss}</strong><em>/ ${dm}:${ds}</em></div></div></div>`; }
function navIcon(name){
  const common='width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
  const icons={
    workout:`<svg ${common}><path d="M3 12h3"/><path d="M18 12h3"/><path d="M6 8v8"/><path d="M18 8v8"/><path d="M9 6v12"/><path d="M15 6v12"/><path d="M9 12h6"/></svg>`,
    week:`<svg ${common}><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/></svg>`,
    cardio:`<svg ${common}><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/></svg>`,
    progress:`<svg ${common}><path d="M4 19V5"/><path d="M4 19h17"/><path d="M8 16v-5"/><path d="M13 16V8"/><path d="M18 16v-9"/></svg>`,
    more:`<svg ${common}><path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/></svg>`
  };
  return icons[name]||'';
}
function navHTML(){ return `<nav class="bottom"><button class="${state.view==='workout'?'active':''}" data-view="workout">${navIcon('workout')}<span>Workout</span></button><button class="${state.view==='week'?'active':''}" data-view="week">${navIcon('week')}<span>Week</span></button><button class="${state.view==='cardio'?'active':''}" data-view="cardio">${navIcon('cardio')}<span>Cardio</span></button><button class="${state.view==='progress'?'active':''}" data-view="progress">${navIcon('progress')}<span>Progress</span></button><button class="${state.view==='more'?'active':''}" data-view="more">${navIcon('more')}<span>More</span></button></nav>`; }

function bind(){
  document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>{state.view=b.dataset.view; state.detail=null; render();});
  document.querySelectorAll('[data-action="day"]').forEach(b=>b.onclick=()=>{state.day=Number(b.dataset.day); state.detail=null; ensureRows(); render();});
  document.querySelectorAll('[data-action="detail"]').forEach(b=>b.onclick=()=>{state.detail=b.dataset.ex; render();});
  const back=document.querySelector('[data-action="back"]'); if(back) back.onclick=()=>{state.detail=null; render();};
  document.querySelectorAll('[data-action="maintainWeight"]').forEach(inp=>inp.onchange=()=>{ setExerciseMaintainWeight(state.day, inp.dataset.ex, inp.checked, activeWeekKey()); toast(inp.checked?'Weight held steady':'Progression enabled'); render(); });
  document.querySelectorAll('.setRow input').forEach(inp=>inp.onchange=()=>{ const row=inp.closest('.setRow'); const rows=ensureRows()[row.dataset.ex]; const item=rows.find(r=>r.id===row.dataset.id); item[inp.dataset.field]=inp.value; item.date=logDate(); save(); updateFutureSuggestionsFrom(state.day, row.dataset.ex, activeWeekKey()); localStorage.setItem(STORE_KEY, JSON.stringify(state.store)); toast('Autosaved'); });
  document.querySelectorAll('[data-action="tick"]').forEach(btn=>btn.onclick=()=>{ const row=btn.closest('.setRow'); const rows=ensureRows()[row.dataset.ex]; const item=rows.find(r=>r.id===row.dataset.id); item.done=!item.done; item.date=logDate(); save(); updateFutureSuggestionsFrom(state.day, row.dataset.ex, activeWeekKey()); localStorage.setItem(STORE_KEY, JSON.stringify(state.store)); if(item.done) startTimer(); render(); });
  document.querySelectorAll('[data-action="addset"]').forEach(btn=>btn.onclick=()=>{ const ex=workouts[state.day].exercises.find(e=>e.name===btn.dataset.ex); const rows=ensureRows()[ex.name]; const last=[...rows].reverse().find(r=>r.type==='work')||{weight:ex.defaultWeight,reps:ex.reps}; rows.push({id:uid(),type:'work',label:`Set ${rows.filter(r=>r.type==='work').length+1}`,weight:last.weight,reps:last.reps,targetReps:ex.reps,done:false,date:logDate()}); relabelWorkSets(rows); changeExerciseSetCount(state.day, ex.name, rows.filter(r=>r.type==='work').length, activeWeekKey()); render(); });
  document.querySelectorAll('[data-action="removeset"]').forEach(btn=>btn.onclick=()=>{ const ex=workouts[state.day].exercises.find(e=>e.name===btn.dataset.ex); const rows=ensureRows()[ex.name]; const work=rows.filter(r=>r.type==='work'); if(work.length<=1) return toast('Keep at least 1 set'); const removable=[...rows].map((r,i)=>({r,i})).reverse().find(x=>x.r.type==='work'&&!x.r.done) || [...rows].map((r,i)=>({r,i})).reverse().find(x=>x.r.type==='work'); if(removable) rows.splice(removable.i,1); relabelWorkSets(rows); changeExerciseSetCount(state.day, ex.name, rows.filter(r=>r.type==='work').length, activeWeekKey()); render(); });
  document.querySelectorAll('[data-cardio-field]').forEach(inp=>inp.onchange=()=>{ const title=inp.closest('.runCard').dataset.cardio; const item=state.data.cardio[title]||{}; item[inp.dataset.cardioField]=inp.value; item.date=activeWeekKey()===weekStartISO()?today():activeWeekKey(); state.data.cardio[title]=item; save(); toast('Cardio autosaved'); });
  document.querySelectorAll('[data-action="cardioToggle"]').forEach(btn=>btn.onclick=()=>{ const title=btn.closest('.runCard').dataset.cardio; state.data.cardio[title]={...(state.data.cardio[title]||{}), done:true, date:activeWeekKey()===weekStartISO()?today():activeWeekKey()}; save(); render(); });
  document.querySelectorAll('[data-action="cardioUndo"]').forEach(btn=>btn.onclick=()=>{ const title=btn.closest('.runCard').dataset.cardio; state.data.cardio[title]={...(state.data.cardio[title]||{}), done:false, date:activeWeekKey()===weekStartISO()?today():activeWeekKey()}; save(); render(); });
  document.querySelectorAll('[data-action="toggleWeekDay"]').forEach(btn=>btn.onclick=()=>{ const key=`${state.weekViewStart}_${btn.dataset.day}`; state.openWeekDays[key]=!state.openWeekDays[key]; render(); });
  const prev=document.querySelector('[data-action="weekPrev"]'); if(prev) prev.onclick=()=>{ setActiveWeek(addDaysISO(state.weekViewStart||weekStartISO(),-7)); state.detail=null; render(); };
  const next=document.querySelector('[data-action="weekNext"]'); if(next) next.onclick=()=>{ const target=addDaysISO(state.weekViewStart||weekStartISO(),7); if(target<=weekStartISO()){ setActiveWeek(target); state.detail=null; render(); }};
  const clear=document.querySelector('[data-action="clear"]'); if(clear) clear.onclick=()=>{ if(confirm('Delete the selected week’s saved logs?')){ const key=activeWeekKey(); state.store.weeks[key]=emptyWeek(key); state.data=state.store.weeks[key]; save(); render(); }};
  document.querySelectorAll('[data-action="moreMode"]').forEach(btn=>btn.onclick=()=>{ state.moreMode=btn.dataset.mode; render(); });
  document.querySelectorAll('[data-action="dayTitle"]').forEach(inp=>inp.onchange=()=>{ const i=Number(inp.dataset.day); workouts[i].title=inp.value||`Day ${i+1}`; persistConfig(); render(); });
  document.querySelectorAll('[data-action="removeExercise"]').forEach(btn=>btn.onclick=()=>{ const di=Number(btn.dataset.day), ei=Number(btn.dataset.exIndex); workouts[di].exercises.splice(ei,1); persistConfig(); render(); });
  document.querySelectorAll('[data-action="addExercise"]').forEach(btn=>btn.onclick=()=>{ const di=Number(btn.dataset.day); const picked=document.querySelector(`[data-add-select="${di}"]`)?.value||''; const custom=document.querySelector(`[data-add-custom="${di}"]`)?.value.trim()||''; const name=custom||picked; if(!name) return; workouts[di].exercises.push(normaliseExercise({name, graphic:guessGraphic(name), target:'3 × 10', defaultWeight:0, reps:10, sets:3})); persistConfig(); render(); });
  document.querySelectorAll('[data-action="addDay"]').forEach(btn=>btn.onclick=()=>{ if(workouts.length>=7) return; const i=workouts.length; workouts.push({day:`Day ${i+1}`, title:`New Day`, subtitle:'Custom workout', exercises:[]}); persistConfig(); state.day=i; render(); });
  document.querySelectorAll('[data-action="removeDay"]').forEach(btn=>btn.onclick=()=>{ if(workouts.length<=1) return; workouts.splice(Number(btn.dataset.day),1); workouts.forEach((w,i)=>w.day=`Day ${i+1}`); state.day=Math.min(state.day,workouts.length-1); persistConfig(); render(); });
  document.querySelectorAll('[data-action="removeCardio"]').forEach(btn=>btn.onclick=()=>{ cardio.splice(Number(btn.dataset.cardioIndex),1); persistConfig(); render(); });
  document.querySelectorAll('[data-action="addCardio"]').forEach(btn=>btn.onclick=()=>{ const picked=document.querySelector('[data-cardio-select]')?.value||''; const custom=document.querySelector('[data-cardio-custom]')?.value.trim()||''; const title=custom||picked; if(!title) return; cardio.push({title, target:title}); persistConfig(); render(); });

  const tc=document.querySelector('[data-action="timerClose"]'); if(tc) tc.onclick=stopTimer;
  const tr=document.querySelector('[data-action="timerReset"]'); if(tr) tr.onclick=startTimer;
  const td=document.querySelector('[data-action="timerDuration"]'); if(td) td.onclick=()=>{ const d=[15,30,60,90,120]; state.timer.duration=d[(d.indexOf(state.timer.duration)+1)%d.length]; state.timer.seconds=state.timer.duration; render();};
}
function startTimer(){ clearInterval(timerId); state.timer.show=true; state.timer.seconds=state.timer.duration||60; state.timer.running=true; render(); timerId=setInterval(()=>{ state.timer.seconds=Math.max(0,state.timer.seconds-1); if(state.timer.seconds<=0) stopTimer(); else render(); },1000); }
function stopTimer(){ clearInterval(timerId); timerId=null; state.timer.show=false; state.timer.running=false; render(); }
function splash(){ const root=document.getElementById('root'); root.innerHTML=`<div class="splash"><img src="${SPLASH}" alt="G-Project"><div class="splashPulse"></div></div>`; setTimeout(()=>{ document.body.dataset.ready='yes'; ensureRows(); render(); }, 3000); }

splash();


// v23 iPhone fixed-width/zoom guard. Keeps original viewport meta but prevents accidental pinch/gesture zoom in the app shell.
(function preventAccidentalMobileZoom(){
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  const stop = (event) => {
    if (event.cancelable) event.preventDefault();
  };
  document.addEventListener('gesturestart', stop, { passive: false });
  document.addEventListener('gesturechange', stop, { passive: false });
  document.addEventListener('gestureend', stop, { passive: false });
  document.addEventListener('touchmove', (event) => {
    if (event.touches && event.touches.length > 1 && event.cancelable) event.preventDefault();
  }, { passive: false });
  let lastTouchEnd = 0;
  document.addEventListener('touchend', (event) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300 && event.cancelable) event.preventDefault();
    lastTouchEnd = now;
  }, { passive: false });
})();
