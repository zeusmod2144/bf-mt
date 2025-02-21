import TernaryFilterOption from './TernaryFilterOption';

export const multidexModuleInfo = Object.freeze([
  {
    name: 'units',
    fullName: 'Units',
    type: 'multidex',
    link: '/multidex/units',
  },
  {
    name: 'items',
    fullName: 'Items',
    type: 'multidex',
    link: '/multidex/items',
  },
  {
    name: 'bursts',
    fullName: 'Bursts',
    type: 'multidex',
    link: '/multidex/bursts',
  },
  {
    name: 'extraSkills',
    fullName: 'Extra Skills',
    type: 'multidex',
    link: '/multidex/extra-skills',
  },
  {
    name: 'leaderSkills',
    fullName: 'Leader Skills',
    type: 'multidex',
    link: '/multidex/leader-skills',
  },
  {
    name: 'missions',
    fullName: 'Missions',
    type: 'multidex',
    link: '/multidex/missions',
  },
  {
    name: 'dictionary',
    fullName: 'Dictionary',
    type: 'multidex',
    link: '/multidex/dictionary',
  },
]);

export const servers = Object.freeze(['gl', 'eu', 'jp']);
export const elements = Object.freeze(['fire', 'water', 'earth', 'thunder', 'light', 'dark']);
export const genders = Object.freeze(['male', 'female', 'other']);
export const unitKinds = Object.freeze(['normal', 'evolution', 'enhancing', 'sale']);
export const itemTypes = Object.freeze(['consumable', 'material', 'raid', 'sphere', 'evomat', 'summoner_consumable', 'ls_sphere']);
export const missionLocationTypes = Object.freeze(['land', 'area', 'dungeon']);

export const defaultTernaryOptions = new TernaryFilterOption('with', 'without'); // generic ternary
export const exclusiveFilterOptions = new TernaryFilterOption('exclusive', 'non-exclusive');
export const craftableFilterOptions = new TernaryFilterOption('craftable', 'non-craftable');
export const usageFilterOptions = new TernaryFilterOption('used', 'unused');

export const itemTypeMapping = Object.freeze({
  consumable: 'Item',
  material: 'Material',
  sphere: 'Sphere',
  evomat: 'Evo Material',
  summoner_consumable: 'Booster',
  raid: 'Raid Item',
  ls_sphere: 'LS Sphere',
});

export const sphereTypeMapping = Object.freeze({
  0: 'None',
  1: 'Status Enhancing',
  2: 'Critical',
  3: 'Drop',
  4: 'Ailment Inducing',
  5: 'Element Fusion',
  6: 'BB Gauge',
  7: 'HP Recovery',
  8: 'Target Setting',
  9: 'Damage Deflecting',
  10: 'Damage Reducing',
  11: 'Spark',
  12: 'Defense Piercing',
  13: 'Attack Boosting',
  14: 'Special',
});

export const squadUnitActions = Object.freeze({
  ATK: 'atk',
  BB: 'bb',
  SBB: 'sbb',
  UBB: 'ubb',
  NONE: 'none',
});
export const targetAreaMapping = Object.freeze({
  aoe: 'AOE',
  single: 'ST',
  random: 'RT',
});
export const burstTypes = Object.freeze([squadUnitActions.BB, squadUnitActions.SBB, squadUnitActions.UBB]);
export const buffSearchOptions = Object.freeze(['ls', 'es', 'sp'].concat(burstTypes));
export const unitTypes = Object.freeze(['lord', 'anima', 'breaker', 'guardian', 'oracle']);
export const ailments = Object.freeze(['poison', 'weak', 'sick', 'injury', 'curse', 'paralysis']);
export const dropTypes = Object.freeze(['hc', 'bc', 'item', 'zel', 'karma']);

export const unitStatFields = Object.freeze(['hp', 'atk', 'def', 'rec']);
export const moveTypeMapping = Object.freeze({
  1: 'Moving',
  2: 'Teleporting',
  3: 'Non-Moving',
});
export const moveTypeIdByName = Object.freeze({
  Moving: 1,
  Teleporting: 2,
  'Non-Moving': 3,
});

export const spCategoryMapping = Object.freeze({
  1: 'Parameter Boost',
  2: 'Spark',
  3: 'Critical Hits',
  4: 'Attack Boost',
  5: 'BB Gauge',
  6: 'HP Recovery',
  7: 'Drops',
  8: 'Ailment Resistance',
  9: 'Ailment Infliction',
  10: 'Damage Reduction',
  11: 'Special',
});

export const mimicIds = Object.freeze({
  mimic: '60142',
  batMimic: '60143',
  dragonMimic: '60144',
  metalMimic: '60224',
});

export const missionMonsterGroupMapping = Object.freeze({
  '1000': mimicIds.mimic,
  '1100': mimicIds.batMimic,
  '1101': mimicIds.batMimic,
  '1200': mimicIds.dragonMimic,
  '1300': mimicIds.metalMimic,
});

export const unitPositionMapping = Object.freeze(['Top Left', 'Top Right', 'Middle Left', 'Middle Right', 'Bottom Left', 'Bottom Right']);
export const squadFillerMapping = Object.freeze({
  EMPTY: '(Empty)',
  ANY: '(Any)',
  SQUAD: '(Squad)',
});

export const effectTypes = Object.freeze({
  ATTACK: {
    name: 'Attack',
    desc: 'These types of effects directly inflict damage on targets.',
  },
  PASSIVE: {
    name: 'Passive',
    desc: 'These effects are always active unless nullified by an enemy skill or battle restriction. Passives from different sources usually stack.',
  },
  'INSTANT/BURST': {
    name: 'Instant/Burst',
    desc: 'These take effect as soon as they are cast and are usually stackable with other effects of the same type.',
  },
  TIMED: {
    name: 'Timed',
    desc: 'These conditionally occur (e.g. from the start of battle, after X damage is taken, etc.) and last for a set amount of turns. Timed buffs of the same effect do not stack, regardless of the source. Newer timed buffs of the same type will override the old buff.',
  },
  ACTIVE: {
    name: 'Active',
    desc: 'These are usually turn based; the source for these effects are from unit bursts (BB, SBB, UBB) or enemy skills. Newer active buffs of the same type will override the old buff (using the new value and duration).',
  },
  PERMANENT: {
    name: 'Permanent',
    desc: 'These remain in effect for the entire battle. Depending on the buff, it may go away once used.',
  },
  UNKNOWN: {
    name: 'Unknown',
    desc: 'These effects aren\'t fully understood yet.',
  },
  UNTRANSLATED: {
    name: 'Untranslated',
    desc: 'These effects aren\'t supported by the effect processor yet.',
  },
});

// mapping of icon keys to index on @/assets/buff-translation/battle/battle_buff_icon.png
export const battleBuffIconKeys = Object.freeze([
  'BUFF_ATKUP',
  'BUFF_ATKDOWN',
  'BUFF_DEFUP',
  'BUFF_DEFDOWN',
  'BUFF_RECUP',
  'BUFF_RECDOWN',
  'BUFF_CRTRATEUP',
  'BUFF_HPREC',
  'BUFF_HCDROP',
  'BUFF_BCDROP',
  'BUFF_ITEMDROP',
  'BUFF_KOBLK',
  'BUFF_FIREATKUP',
  'BUFF_FIREDEFUP',
  'BUFF_FIRERECUP',
  'BUFF_WATERATKUP',
  'BUFF_WATERDEFUP',
  'BUFF_WATERRECUP',
  'BUFF_EARTHATKUP',
  'BUFF_EARTHDEFUP',
  'BUFF_EARTHRECUP',
  'BUFF_THUNDERATKUP',
  'BUFF_THUNDERDEFUP',
  'BUFF_THUNDERRECUP',
  'BUFF_LIGHTATKUP',
  'BUFF_LIGHTDEFUP',
  'BUFF_LIGHTRECUP',
  'BUFF_DARKATKUP',
  'BUFF_DARKDEFUP',
  'BUFF_DARKRECUP',
  'BUFF_FIREATKDOWN',
  'BUFF_FIREDEFDOWN',
  'BUFF_FIRERECDOWN',
  'BUFF_WATERATKDOWN',
  'BUFF_WATERDEFDOWN',
  'BUFF_WATERRECDOWN',
  'BUFF_EARTHATKDOWN',
  'BUFF_EARTHDEFDOWN',
  'BUFF_EARTHRECDOWN',
  'BUFF_THUNDERATKDOWN',
  'BUFF_THUNDERDEFDOWN',
  'BUFF_THUNDERRECDOWN',
  'BUFF_LIGHTATKDOWN',
  'BUFF_LIGHTDEFDOWN',
  'BUFF_LIGHTRECDOWN',
  'BUFF_DARKATKDOWN',
  'BUFF_DARKDEFDOWN',
  'BUFF_DARKRECDOWN',
  'BUFF_FIREDMGDOWN',
  'BUFF_WATERDMGDOWN',
  'BUFF_EARTHDMGDOWN',
  'BUFF_THUNDERDMGDOWN',
  'BUFF_LIGHTDMGDOWN',
  'BUFF_DARKDMGDOWN',
  'BUFF_POISONBLK',
  'BUFF_WEAKBLK',
  'BUFF_SICKBLK',
  'BUFF_INJURYBLK',
  'BUFF_CURSEBLK',
  'BUFF_PARALYSISBLK',
  'BUFF_BBREC',
  'BUFF_DAMAGEBB',
  'BUFF_GETENEATT',
  'BUFF_REPENEATT',
  'BUFF_IGNOREDEF',
  'BUFF_DBLSTRIKE',
  'BUFF_HITUP',
  'BUFF_ADDFIRE',
  'BUFF_ADDWATER',
  'BUFF_ADDEARTH',
  'BUFF_ADDTHUNDER',
  'BUFF_ADDLIGHT',
  'BUFF_ADDDARK',
  'BUFF_DAMAGECUT',
  'BUFF_SPARKUP',
  'BUFF_SPARKHC',
  'BUFF_SPARKBC',
  'BUFF_SPARKITEM',
  'BUFF_DISABLELS',
  'BUFF_RAIDATKUP',
  'BUFF_RAIDDEFUP',
  'BUFF_RAIDRECUP',
  'BUFF_RAIDCRTUP',
  'BUFF_RAIDDMGDOWN',
  'BUFF_ATKDOWNLOCK',
  'BUFF_DEFDOWNLOCK',
  'BUFF_RECDOWNLOCK',
  'BUFF_ADDPOISON',
  'BUFF_ADDWEAK',
  'BUFF_ADDSICK',
  'BUFF_ADDINJURY',
  'BUFF_ADDCURSE',
  'BUFF_ADDPARA',
  'BUFF_SPARKABILITY',
  'BUFF_ACTIVEOD',
  'BUFF_TURNDMG',
  'BUFF_BBATKUP',
  'BUFF_COUNTERDAMAGE',
  'BUFF_ADDATKDOWN',
  'BUFF_ADDDEFDOWN',
  'BUFF_ADDRECDOWN',
  'BUFF_BBFILL',
  'BUFF_CRTUP',
  'BUFF_FIREDMGUP',
  'BUFF_WATERMDGUP',
  'BUFF_EARTHDMGUP',
  'BUFF_THUNDERDMGUP',
  'BUFF_LIGHTDMGUP',
  'BUFF_DARKDMGUP',
  'BUFF_POISIONCOUNTER',
  'BUFF_WEAKCOUNTER',
  'BUFF_SICKCOUNTER',
  'BUFF_INJCONTER',
  'BUFF_CURSECOUNTER',
  'BUFF_PARALYCOUNTER',
  'BUFF_KOBLOCK',
  'BUFF_HCDOWN',
  'BUFF_BCDOWN',
  'BUFF_SPARKDMGUP',
  'BUFF_BBATKDOWN',
  'BUFF_FIRESHIELD',
  'BUFF_WATERSHIELD',
  'BUFF_EARTHSHIELD',
  'BUFF_THUNDERSHIELD',
  'BUFF_LIGHTSHIELD',
  'BUFF_DARKSHIELD',
  'BUFF_AILDMGUP',
  'BUFF_SPARKBBUP',
  'BUFF_GUARDCUT',
  'BUFF_GUARDBBUP',
  'BUFF_GUARDPARAMUP',
  'BUFF_BBFILLDOWN',
  'BUFF_SPARKATKUP',
  'BUFF_SPARKDEFUP',
  'BUFF_SPARKRECUP',
  'BUFF_SPARKCRTUP',
  'BUFF_RESISTATKDOWN',
  'BUFF_RESISTDEFDOWN',
  'BUFF_RESISTRECDOWN',
  'BUFF_ATKUP2',
  'BUFF_DEFUP2',
  'BUFF_RECUP2',
  'BUFF_SPARKCRTACTIVATED',
  'BUFF_OVERDRIVEUP',
  'BUFF_BEENATK_HPREC',
  'BUFF_HPABS',
  'BUFF_SPARK_HPREC',
  'BUFF_ATKUP3',
  'BUFF_DEFUP3',
  'BUFF_RECUP3',
  'BUFF_CRTRATEUP2',
  'BUFF_SPARKDMGUP2',
  'BUFF_HPREC2',
  'BUFF_BBFILL2',
  'BUFF_ATKUP4',
  'BUFF_DEFUP4',
  'BUFF_RECUP4',
  'BUFF_CRTDOWN',
  'BUFF_ELEMENTDOWN',
  'BUFF_SPARKDMGDOWN',
  'BUFF_AOEATK',
  'BUFF_NULLSPHERE',
  'BUFF_NULLES',
  'BUFF_BBREDUC',
  'BUFF_ODFILLBOOST',
  'BUFF_ATKREDUC',
  'BUFF_TARGETED',
  'BUFF_PROB_ATKREDUC',
  'BUFF_PROB_DEFREDUC',
  'BUFF_PROB_RECREDUC',
  'BUFF_CRITDMG_VUL',
  'BUFF_ELEDMG_VUL',
  'BUFF_NULLITEM',
  'BUFF_NULLSWAP',
  'BUFF_FIRESHIELDDOWN',
  'BUFF_WATERSHIELDDOWN',
  'BUFF_EARTHSHIELDDOWN',
  'BUFF_THUNDERSHIELDDOWN',
  'BUFF_LIGHTSHIELDDOWN',
  'BUFF_DARKSHIELDDOWN',
]);

// mapping of icon keys to index on @/assets/buff-translation/battle/battle_buff_icon_sg.png
export const sgBattleBuffIconKeys = Object.freeze([
  'SG_BUFF_TAUNT',
  'SG_BUFF_STEALTH',
  'SG_BUFF_ALL',
  'SG_BUFF_FIRE',
  'SG_BUFF_WATER',
  'SG_BUFF_EARTH',
  'SG_BUFF_THUNDER',
  'SG_BUFF_LIGHT',
  'SG_BUFF_DARK',
  'SG_BUFF_SPHERE_DISABLE',
  'SG_BUFF_DMG_IMMUNINTY',
  'SG_BUFF_SKIP_TURN',
  'SG_BUFF_TIME_STOP',
  'SG_BUFF_EVASION',
  'SG_BUFF_CRTRATEDOWN',
  'SG_BUFF_FIRESHIELDDOWN',
  'SG_BUFF_WATERSHIELDDOWN',
  'SG_BUFF_EARTHSHIELDDOWN',
  'SG_BUFF_THUNDERSHIELDDOWN',
  'SG_BUFF_LIGHTSHIELDDOWN',
  'SG_BUFF_DARKSHIELDDOWN',
  'SG_BUFF_WEAKSHIELD',
  'SG_BUFF_DAMAGECUTDOWN',
  'SG_BUFF_ATK_EU',
  'SG_BUFF_DBLBB_EU',
  'SG_BUFF_REC_EU',
]);

// mapping of icon keys to index on @/assets/buff-translation/battle/custom-icons.png
export const customBuffIconKeys = Object.freeze([
  'BUFF_RED',
  'BUFF_RED_ARROW',
  'BUFF_HPUP',
  'BUFF_ELEMENTALHPUP',
  'BUFF_ELEMENTALCRTRATEUP',
  'BUFF_ELEMENTALATKUP',
  'BUFF_ELEMENTALDEFUP',
  'BUFF_ELEMENTALRECUP',
  'BUFF_HCREC',
  'BUFF_ALLAILNULL',
  'BUFF_HPTHRESHGENERIC',
  'BUFF_BBTHRESHGENERIC',
  'BUFF_GENERICDROP',
  'BUFF_ALLDMGDOWN',
]);

// mapping of icon keys to index on @/assets/buff-translation/battle/battle_bad_icon.png
export const ailmentBuffIconKeys = ailments.map(ail => `DEBUFF_${ail.toUpperCase()}`);

export const targetTypes = Object.freeze({
  SELF: 'self',
  PARTY: 'party',
  ENEMY: 'enemy',
  OTHER: 'other',
});

export const squadBuffTypes = Object.freeze({
  PASSIVE: 'passive',
  PROC: 'proc',
  BURST: 'burst',
});

export const ANY_BB_ORDER = '(Any)';

export const arenaConditionMapping = Object.freeze({
  hp_50pr_under: 'has less than 50% HP',
  hp_50pr_over: 'has more than 50% HP',
  hp_75pr_under: 'has less than 75% HP',
  hp_25pr_under: 'has less than 25% HP',
  hp_min: 'has the lowest HP',
  hp_max: 'has the highest HP',
  atk_max: 'has the highest attack',
  random: 'is present',
});
export const arenaActionMapping = Object.freeze({
  skill: 'use BB/SBB',
  attack: 'normal attack',
});
export const arenaTargetMapping = Object.freeze({
  party: 'when an ally',
  enemy: 'on enemy that',
});

export const SOURCE_PATH_TO_TEXT_MAPPING = Object.freeze({
  'unit.ls': 'Leader Skill',
  'unit.es': 'Extra Skill',
  'unit.bb': 'Brave Burst',
  'unit.sbb': 'Super Brave Burst',
  'unit.ubb': 'Ultimate Brave Burst',
  'unit.sp': 'SP Enhancement',
  'unit.type.lord': 'Unit Type (Lord)',
  'unit.type.anima': 'Unit Type (Anima)',
  'unit.type.breaker': 'Unit Type (Breaker)',
  'unit.type.guardian': 'Unit Type (Guardian)',
  'unit.type.oracle': 'Unit Type (Oracle)',
  'unit.type.rex': 'Unit Type (Rex)',
  'squad.omniBoost': 'Elemental Paradigm',
});

export const UNIT_TYPE_MAPPING = Object.freeze({
  L: 'Lord',
  A: 'Anima',
  B: 'Breaker',
  G: 'Guardian',
  O: 'Oracle',
  R: 'Rex',
  Lord: 'L',
  Anima: 'A',
  Breaker: 'B',
  Guardian: 'G',
  Oracle: 'O',
  Rex: 'R',
});

/**
 * @description Leader Skill IDs of Omni Paradigm buffs
 */
export const OMNI_PARADIGM_ID_BY_LEVEL = Object.freeze({
  1: '8100100',
  2: '8100200',
  3: '8100300',
});

/**
 * @description Extra Skill IDs of buffs given based on a unit's type.
 */
export const UNIT_TYPE_BUFF_ID_BY_TYPE = Object.freeze({
  Lord0: '500100',
  Lord1: '500101',
  Lord2: '500102',
  Lord3: '500103',

  Anima0: '500200',
  Anima1: '500201',
  Anima2: '500202',
  Anima3: '500203',

  Breaker0: '500300',
  Breaker1: '500301',
  Breaker2: '500302',
  Breaker3: '500303',

  Guardian0: '500400',
  Guardian1: '500401',
  Guardian2: '500402',
  Guardian3: '500403',

  Oracle0: '500500',
  Oracle1: '500501',
  Oracle2: '500502',
  Oracle3: '500503',

  Rex0: '500600',
  Rex1: '500601',
  Rex2: '500602',
  Rex3: '500603',
});

export const MATERIAL_COLOR_MAPPING = Object.freeze({
  unit: {
    ls: {
      background: 'green darken-3',
      text: 'green lighten-5',
    },
    es: {
      background: 'orange darken-4',
      text: 'orange lighten-5',
    },
    bb: {
      background: 'blue-grey',
      text: 'blue-grey lighten-5',
    },
    sbb: {
      background: 'yellow darken-3',
      text: 'yellow lighten-5',
    },
    ubb: {
      background: 'red darken-3',
      text: 'red lighten-5',
    },
    sp: {
      background: 'light-green darken-3',
      text: 'light-green lighten-5',
    },
  },
});

export const COMPARE_KEY_ORDER = ['unit', 'item', 'es', 'bb', 'ls'];
export const COMPARE_KEY_MAPPING = Object.freeze({
  unit: { name: 'Unit', multidexKey: 'units', key: 'unit' },
  item: { name : 'Sphere', multidexKey: 'items', key: 'item' },
  bb: { name: 'Burst', multidexKey: 'bursts', key: 'bb' },
  es: { name: 'Extra Skill', multidexKey: 'extraSkills', key: 'es' },
  ls: { name: 'Leader Skill', multidexKey: 'leaderSkills', key: 'ls' },
});

export const CONTENT_URLS = {
  eu: 'http://static-bravefrontier.gumi-europe.net/content',
  gl: 'https://dv5bk1m8igv7v.cloudfront.net/asset/21900/content',
  jp: 'http://cdn.android.brave.a-lim.jp',
};
