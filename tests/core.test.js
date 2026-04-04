// core.test.js — self-contained regression tests for Morning Mobility logic.
// Run with: node tests/core.test.js
// No external dependencies required.

'use strict';

// ---------------------------------------------------------------------------
// Assertion harness
// ---------------------------------------------------------------------------

let passed = 0, failed = 0;

function assert(desc, actual, expected) {
  if (JSON.stringify(actual) === JSON.stringify(expected)) {
    console.log('✓', desc);
    passed++;
  } else {
    console.error('✗', desc, '| expected:', expected, 'got:', actual);
    failed++;
  }
}

// ---------------------------------------------------------------------------
// Production logic — copied verbatim from index.html
// ---------------------------------------------------------------------------

const SKATE_DAYS = [2, 4];
const RUN_DAYS   = [6, 0];

const exercises = {
  daily: [
    { id:'d1', name:'90/90 Hip Stretch',          detail:'60–90 sec each side',              seconds:90,   videoId:'v4q8RHWcBvE',
      cues:['Sit with front shin parallel, back shin at 90° behind you','Stay tall — chest up','Feel the stretch in the outer hip of the front leg','Switch sides and repeat'] },
    { id:'d2', name:'Couch Stretch',               detail:'60–90 sec each side',              seconds:90,   videoId:'HeRCFDal5rg',
      cues:['Kneel with one foot up on the wall or couch behind you','Drive hips forward gently — don\'t arch your back','Feel it deep in the front of the back hip','Squeeze glute on the back leg to deepen'] },
    { id:'d3', name:'Dead Bug',                    detail:'3 × 8 reps',                       seconds:null, videoId:'g_BYB0R-4Ws',
      cues:['Lie on back, arms up, knees at 90° over hips','Press lower back INTO the floor — keep it there','Slowly lower opposite arm and leg without losing back contact','Slow is better than fast'] },
    { id:'d4', name:'Glute Bridge',                detail:'3 × 12 reps',                      seconds:null, videoId:'OUgsJ8-Vi0E',
      cues:['Feet flat, hip-width apart, knees at 90°','Push through heels — not toes','Squeeze glutes hard at the top, hold 2 seconds','Lower slowly'] }
  ],
  preskate: [
    { id:'ps1', name:'Leg Swings',                 detail:'10 reps each direction, each leg', seconds:null, videoId:'tKIdBzqsVKM',
      cues:['Hold a wall for balance','Front-to-back first, then side-to-side','Let the leg swing freely — don\'t force the range','Gradually increase the arc'] },
    { id:'ps2', name:'Hip Circles',                detail:'10 reps each direction',           seconds:null, videoId:'mKLx9okH0oA',
      cues:['Stand on one leg, draw big circles with the raised knee','Go slow and controlled','Both clockwise and counter-clockwise','Keep upper body still'] },
    { id:'ps3', name:'Walking Lunges + Rotation',  detail:'10 steps total',                   seconds:null, videoId:'L8fvypPrzzs',
      cues:['Lunge forward then rotate torso toward front leg','Keep front knee over foot','Rotate from your core','Alternate legs each step'] },
    { id:'ps4', name:'Lateral Band Walks',         detail:'10 steps each direction',          seconds:null, videoId:'k6JGMbXkgW4',
      cues:['Slight squat, feet shoulder-width, toes forward','Step sideways — don\'t let feet come together','Keep tension throughout','No band? Do bodyweight — same benefit'] }
  ],
  postskate: [
    { id:'pk1', name:'Pigeon Pose',                detail:'90 sec each side',                 seconds:90,   videoId:'fPyPmrcNlac',
      cues:['Front shin roughly parallel to mat front','Sink hips toward floor','Fold forward over front leg to deepen','Breathe into the tightness'] },
    { id:'pk2', name:'Supine Figure-4',            detail:'60 sec each side',                 seconds:60,   videoId:'n0RcFlzGgF8',
      cues:['Lie on back, cross ankle over opposite knee','Pull both legs toward chest','Feel it in the outer hip','Let gravity do the work'] },
    { id:'pk3', name:"Child's Pose + Lateral Reach", detail:'60 sec each side',              seconds:60,   videoId:'eqVMAPM00GM',
      cues:['Start in child\'s pose, arms extended','Walk hands to one side and hold','Feel the stretch along your back and lat','5 slow breaths, then switch'] }
  ],
  prerun: [
    { id:'pr1', name:'Leg Swings',                 detail:'10 reps each direction, each leg', seconds:null, videoId:'tKIdBzqsVKM',
      cues:['Front-to-back loosens hip flexors for stride','Side-to-side opens the inner thigh','Let momentum build naturally','Do right before heading out'] },
    { id:'pr2', name:'Hip Circles',                detail:'10 reps each direction',           seconds:null, videoId:'mKLx9okH0oA',
      cues:['Biggest circles you can','Loosens the hip joint before impact','Both directions, both legs'] },
    { id:'pr3', name:'Walking Lunges + Rotation',  detail:'10 steps total',                   seconds:null, videoId:'L8fvypPrzzs',
      cues:['Activates glutes and hip flexors in running pattern','Rotation prepares your thoracic spine','Exaggerate the reach across your body'] }
  ],
  postrun: [
    { id:'prun1', name:'Couch Stretch',            detail:'90 sec each side',                 seconds:90,   videoId:'HeRCFDal5rg',
      cues:['Running shortens hip flexors — best counter-stretch','Hip forward, glute squeezed, chest tall','First 30 sec is just the muscle letting go'] },
    { id:'prun2', name:'Pigeon Pose',              detail:'90 sec each side',                 seconds:90,   videoId:'fPyPmrcNlac',
      cues:['Essential for IT band and piriformis after running','Fold forward to increase intensity','Use a towel under the hip if needed'] },
    { id:'prun3', name:'Supine Figure-4',          detail:'60 sec each side',                 seconds:60,   videoId:'n0RcFlzGgF8',
      cues:['Lying down — easier to fully relax','Releases the glute which absorbs running impact','Breathe out as you pull legs toward chest'] }
  ]
};

function getDayType(d) {
  if (SKATE_DAYS.includes(d)) return 'skate';
  if (RUN_DAYS.includes(d))   return 'run';
  return 'rest';
}

function getRoutine(type) {
  if (type === 'skate') return [
    { label:'Daily Mobility',        items:exercises.daily    },
    { label:'Pre-Skate Warm-Up',     items:exercises.preskate },
    { label:'Post-Skate Cool-Down',  items:exercises.postskate }
  ];
  if (type === 'run') return [
    { label:'Daily Mobility',        items:exercises.daily   },
    { label:'Pre-Run Warm-Up',       items:exercises.prerun  },
    { label:'Post-Run Cool-Down',    items:exercises.postrun }
  ];
  return [{ label:'Daily Mobility', items:exercises.daily }];
}

function fmt(s) {
  return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
}

const STORAGE_KEY = 'ilves_completed';

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

function totalExercises(sections) {
  return sections.reduce((sum, sec) => sum + sec.items.length, 0);
}

// ---------------------------------------------------------------------------
// Tests: getDayType
// ---------------------------------------------------------------------------

console.log('\n--- getDayType ---');
assert('Sunday    (0) → run',   getDayType(0), 'run');
assert('Monday    (1) → rest',  getDayType(1), 'rest');
assert('Tuesday   (2) → skate', getDayType(2), 'skate');
assert('Wednesday (3) → rest',  getDayType(3), 'rest');
assert('Thursday  (4) → skate', getDayType(4), 'skate');
assert('Friday    (5) → rest',  getDayType(5), 'rest');
assert('Saturday  (6) → run',   getDayType(6), 'run');

// ---------------------------------------------------------------------------
// Tests: getRoutine — section count and total exercise count
// ---------------------------------------------------------------------------

console.log('\n--- getRoutine: skate ---');
const skateRoutine = getRoutine('skate');
assert('skate: 3 sections',                    skateRoutine.length, 3);
assert('skate: daily section has 4 exercises', skateRoutine[0].items.length, 4);
assert('skate: preskate section has 4 exercises', skateRoutine[1].items.length, 4);
assert('skate: postskate section has 3 exercises', skateRoutine[2].items.length, 3);
assert('skate: 11 exercises total',            totalExercises(skateRoutine), 11);

console.log('\n--- getRoutine: run ---');
const runRoutine = getRoutine('run');
assert('run: 3 sections',                     runRoutine.length, 3);
assert('run: daily section has 4 exercises',  runRoutine[0].items.length, 4);
assert('run: prerun section has 3 exercises', runRoutine[1].items.length, 3);
assert('run: postrun section has 3 exercises', runRoutine[2].items.length, 3);
assert('run: 10 exercises total',             totalExercises(runRoutine), 10);

console.log('\n--- getRoutine: rest ---');
const restRoutine = getRoutine('rest');
assert('rest: 1 section',                     restRoutine.length, 1);
assert('rest: daily section has 4 exercises', restRoutine[0].items.length, 4);
assert('rest: 4 exercises total',             totalExercises(restRoutine), 4);

// ---------------------------------------------------------------------------
// Tests: fmt
// ---------------------------------------------------------------------------

console.log('\n--- fmt ---');
assert('fmt(0)    → "0:00"',  fmt(0),    '0:00');
assert('fmt(60)   → "1:00"',  fmt(60),   '1:00');
assert('fmt(90)   → "1:30"',  fmt(90),   '1:30');
assert('fmt(3600) → "60:00"', fmt(3600), '60:00');
assert('fmt(59)   → "0:59"',  fmt(59),   '0:59');
assert('fmt(61)   → "1:01"',  fmt(61),   '1:01');

// ---------------------------------------------------------------------------
// Tests: progress calculation
// ---------------------------------------------------------------------------

console.log('\n--- Progress calculation ---');

function calcProgress(total, done) {
  return Math.round((done / total) * 100);
}

assert('0 of 11 done → 0%',   calcProgress(11, 0),  0);
assert('11 of 11 done → 100%', calcProgress(11, 11), 100);
assert('1 of 4 done → 25%',   calcProgress(4, 1),   25);
assert('3 of 4 done → 75%',   calcProgress(4, 3),   75);
assert('1 of 10 done → 10%',  calcProgress(10, 1),  10);
assert('5 of 11 done → 45%',  calcProgress(11, 5),  45);
// Verify Math.round behaviour at the boundary (rounds half up)
assert('1 of 3 done → 33%',   calcProgress(3, 1),   33);
assert('2 of 3 done → 67%',   calcProgress(3, 2),   67);

// ---------------------------------------------------------------------------
// Tests: localStorage key constant
// ---------------------------------------------------------------------------

console.log('\n--- localStorage key ---');
assert('STORAGE_KEY is exactly "ilves_completed"', STORAGE_KEY, 'ilves_completed');

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
