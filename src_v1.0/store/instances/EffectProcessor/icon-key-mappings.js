import knownConstants from '../../modules/constants';

const atkIcon = require('@/assets/buff-translation/raid/raid_unit_name_icon_b.png');
const hpRecAtkIcon = require('@/assets/buff-translation/raid/hprec-attack-icon.png');

const IconKeyMappings = {
  UNKNOWN: { src: require('@/assets/secret.png'), name: 'UNKNOWN' },
  ATK: { src: atkIcon, name: 'ATK' },
  ST_ATK: { src: atkIcon, name: 'ST_ATK' },
  AOE_ATK: { src: atkIcon, name: 'AOE_ATK' },
  RT_ATK: { src: atkIcon, name: 'RT_ATK' },
  HPREC_ST_ATK: { src: hpRecAtkIcon, name: 'HPREC_ST_ATK' },
  HPREC_AOE_ATK: { src: hpRecAtkIcon, name: 'HPREC_AOE_ATK' },

  // custom passives
  PASSIVE_BUFF_HPRECTURNSTART: { name: 'PASSIVE_BUFF_HPRECTURNSTART' }, // based on BUFF_HPREC
  PASSIVE_BUFF_BBRECTURNSTART: { name: 'PASSIVE_BUFF_BBRECTURNSTART' }, // based on BUFF_BBREC
  ...(() => {
    const customElementalPassives = {};
    knownConstants.elements.forEach(e => {
      const hpKey = `PASSIVE_BUFF_${e.toUpperCase()}HPUP`;
      customElementalPassives[hpKey] = { name: hpKey };

      const critRateKey = `PASSIVE_BUFF_${e.toUpperCase()}CRTRATEUP`;
      customElementalPassives[critRateKey] = { name: critRateKey };
    });
    return customElementalPassives;
  })(),
  ...(() => {
    const customStatPassives = {};
    const addStatKey = (statKey) => {
      customStatPassives[statKey] = { name: statKey };
    };
    const statTypes = ['hp', 'atk', 'def', 'rec'];
    knownConstants.unitTypes.forEach(u => {
      statTypes.forEach(s => {
        addStatKey(`PASSIVE_BUFF_${u.toUpperCase()}${s.toUpperCase()}UP`);
      });
    });
    statTypes.slice(1).forEach(s => {
      addStatKey(`PASSIVE_BUFF_HPTHRESH${s.toUpperCase()}UP`);
    });
    return customStatPassives;
  })(),
  ...(() => {
    const customDropPassives = {};
    knownConstants.dropTypes.forEach(type => {
      const iconKey = `PASSIVE_BUFF_HPTHRESH${type.toUpperCase()}DROP`;
      customDropPassives[iconKey] = { name: iconKey };
    });
    return customDropPassives;
  })(),

  // instant buffs
  INSTANT_BUFF_HPREC: { name: 'INSTANT_BUFF_HPREC' }, // based off of BUFF_HPREC
  INSTANT_BUFF_BBREC: { name: 'INSTANT_BUFF_BBREC' },

  // custom procs
  BUFF_HPUP: { name: 'BUFF_HPUP' },
  BUFF_HCREC: { name: 'BUFF_HCREC' },
  BUFF_ALLAILNULL: { name: 'BUFF_ALLAILNULL' },
  BUFF_ZELDROP: { name: 'BUFF_ZELDROP' },
  BUFF_KARMADROP: { name: 'BUFF_KARMADROP' },
  BUFF_ALLDMGDOWN: { name: 'BUFF_ALLDMGDOWN' },

  // most proc buffs
  BUFF_ATKUP: { name: 'BUFF_ATKUP' },
  BUFF_ATKDOWN: { name: 'BUFF_ATKDOWN' },
  BUFF_DEFUP: { name: 'BUFF_DEFUP' },
  BUFF_DEFDOWN: { name: 'BUFF_DEFDOWN' },
  BUFF_RECUP: { name: 'BUFF_RECUP' },
  BUFF_RECDOWN: { name: 'BUFF_RECDOWN' },
  BUFF_CRTRATEUP: { name: 'BUFF_CRTRATEUP' },
  BUFF_HPREC: { name: 'BUFF_HPREC' },
  BUFF_HCDROP: { name: 'BUFF_HCDROP' },
  BUFF_BCDROP: { name: 'BUFF_BCDROP' },
  BUFF_ITEMDROP: { name: 'BUFF_ITEMDROP' },
  BUFF_KOBLK: { name: 'BUFF_KOBLK' },
  BUFF_FIREATKUP: { name: 'BUFF_FIREATKUP' },
  BUFF_FIREDEFUP: { name: 'BUFF_FIREDEFUP' },
  BUFF_FIRERECUP: { name: 'BUFF_FIRERECUP' },
  BUFF_WATERATKUP: { name: 'BUFF_WATERATKUP' },
  BUFF_WATERDEFUP: { name: 'BUFF_WATERDEFUP' },
  BUFF_WATERRECUP: { name: 'BUFF_WATERRECUP' },
  BUFF_EARTHATKUP: { name: 'BUFF_EARTHATKUP' },
  BUFF_EARTHDEFUP: { name: 'BUFF_EARTHDEFUP' },
  BUFF_EARTHRECUP: { name: 'BUFF_EARTHRECUP' },
  BUFF_THUNDERATKUP: { name: 'BUFF_THUNDERATKUP' },
  BUFF_THUNDERDEFUP: { name: 'BUFF_THUNDERDEFUP' },
  BUFF_THUNDERRECUP: { name: 'BUFF_THUNDERRECUP' },
  BUFF_LIGHTATKUP: { name: 'BUFF_LIGHTATKUP' },
  BUFF_LIGHTDEFUP: { name: 'BUFF_LIGHTDEFUP' },
  BUFF_LIGHTRECUP: { name: 'BUFF_LIGHTRECUP' },
  BUFF_DARKATKUP: { name: 'BUFF_DARKATKUP' },
  BUFF_DARKDEFUP: { name: 'BUFF_DARKDEFUP' },
  BUFF_DARKRECUP: { name: 'BUFF_DARKRECUP' },
  BUFF_FIREATKDOWN: { name: 'BUFF_FIREATKDOWN' },
  BUFF_FIREDEFDOWN: { name: 'BUFF_FIREDEFDOWN' },
  BUFF_FIRERECDOWN: { name: 'BUFF_FIRERECDOWN' },
  BUFF_WATERATKDOWN: { name: 'BUFF_WATERATKDOWN' },
  BUFF_WATERDEFDOWN: { name: 'BUFF_WATERDEFDOWN' },
  BUFF_WATERRECDOWN: { name: 'BUFF_WATERRECDOWN' },
  BUFF_EARTHATKDOWN: { name: 'BUFF_EARTHATKDOWN' },
  BUFF_EARTHDEFDOWN: { name: 'BUFF_EARTHDEFDOWN' },
  BUFF_EARTHRECDOWN: { name: 'BUFF_EARTHRECDOWN' },
  BUFF_THUNDERATKDOWN: { name: 'BUFF_THUNDERATKDOWN' },
  BUFF_THUNDERDEFDOWN: { name: 'BUFF_THUNDERDEFDOWN' },
  BUFF_THUNDERRECDOWN: { name: 'BUFF_THUNDERRECDOWN' },
  BUFF_LIGHTATKDOWN: { name: 'BUFF_LIGHTATKDOWN' },
  BUFF_LIGHTDEFDOWN: { name: 'BUFF_LIGHTDEFDOWN' },
  BUFF_LIGHTRECDOWN: { name: 'BUFF_LIGHTRECDOWN' },
  BUFF_DARKATKDOWN: { name: 'BUFF_DARKATKDOWN' },
  BUFF_DARKDEFDOWN: { name: 'BUFF_DARKDEFDOWN' },
  BUFF_DARKRECDOWN: { name: 'BUFF_DARKRECDOWN' },
  BUFF_FIREDMGDOWN: { name: 'BUFF_FIREDMGDOWN' },
  BUFF_WATERDMGDOWN: { name: 'BUFF_WATERDMGDOWN' },
  BUFF_EARTHDMGDOWN: { name: 'BUFF_EARTHDMGDOWN' },
  BUFF_THUNDERDMGDOWN: { name: 'BUFF_THUNDERDMGDOWN' },
  BUFF_LIGHTDMGDOWN: { name: 'BUFF_LIGHTDMGDOWN' },
  BUFF_DARKDMGDOWN: { name: 'BUFF_DARKDMGDOWN' },
  BUFF_POISONBLK: { name: 'BUFF_POISONBLK' },
  BUFF_WEAKBLK: { name: 'BUFF_WEAKBLK' },
  BUFF_SICKBLK: { name: 'BUFF_SICKBLK' },
  BUFF_INJURYBLK: { name: 'BUFF_INJURYBLK' },
  BUFF_CURSEBLK: { name: 'BUFF_CURSEBLK' },
  BUFF_PARALYSISBLK: { name: 'BUFF_PARALYSISBLK' },
  BUFF_BBREC: { name: 'BUFF_BBREC' },
  BUFF_DAMAGEBB: { name: 'BUFF_DAMAGEBB' },
  BUFF_GETENEATT: { name: 'BUFF_GETENEATT' },
  BUFF_REPENEATT: { name: 'BUFF_REPENEATT' },
  BUFF_IGNOREDEF: { name: 'BUFF_IGNOREDEF' },
  BUFF_DBLSTRIKE: { name: 'BUFF_DBLSTRIKE' },
  BUFF_HITUP: { name: 'BUFF_HITUP' },
  BUFF_ADDFIRE: { name: 'BUFF_ADDFIRE' },
  BUFF_ADDWATER: { name: 'BUFF_ADDWATER' },
  BUFF_ADDEARTH: { name: 'BUFF_ADDEARTH' },
  BUFF_ADDTHUNDER: { name: 'BUFF_ADDTHUNDER' },
  BUFF_ADDLIGHT: { name: 'BUFF_ADDLIGHT' },
  BUFF_ADDDARK: { name: 'BUFF_ADDDARK' },
  BUFF_DAMAGECUT: { name: 'BUFF_DAMAGECUT' },
  BUFF_SPARKUP: { name: 'BUFF_SPARKUP' },
  BUFF_SPARKHC: { name: 'BUFF_SPARKHC' },
  BUFF_SPARKBC: { name: 'BUFF_SPARKBC' },
  BUFF_SPARKITEM: { name: 'BUFF_SPARKITEM' },
  BUFF_DISABLELS: { name: 'BUFF_DISABLELS' },
  BUFF_RAIDATKUP: { name: 'BUFF_RAIDATKUP' },
  BUFF_RAIDDEFUP: { name: 'BUFF_RAIDDEFUP' },
  BUFF_RAIDRECUP: { name: 'BUFF_RAIDRECUP' },
  BUFF_RAIDCRTUP: { name: 'BUFF_RAIDCRTUP' },
  BUFF_RAIDDMGDOWN: { name: 'BUFF_RAIDDMGDOWN' },
  BUFF_ATKDOWNLOCK: { name: 'BUFF_ATKDOWNLOCK' },
  BUFF_DEFDOWNLOCK: { name: 'BUFF_DEFDOWNLOCK' },
  BUFF_RECDOWNLOCK: { name: 'BUFF_RECDOWNLOCK' },
  BUFF_ADDPOISON: { name: 'BUFF_ADDPOISON' },
  BUFF_ADDWEAK: { name: 'BUFF_ADDWEAK' },
  BUFF_ADDSICK: { name: 'BUFF_ADDSICK' },
  BUFF_ADDINJURY: { name: 'BUFF_ADDINJURY' },
  BUFF_ADDCURSE: { name: 'BUFF_ADDCURSE' },
  BUFF_ADDPARA: { name: 'BUFF_ADDPARA' },
  BUFF_SPARKABILITY: { name: 'BUFF_SPARKABILITY' },
  BUFF_ACTIVEOD: { name: 'BUFF_ACTIVEOD' },
  BUFF_TURNDMG: { name: 'BUFF_TURNDMG' },
  BUFF_BBATKUP: { name: 'BUFF_BBATKUP' },
  BUFF_COUNTERDAMAGE: { name: 'BUFF_COUNTERDAMAGE' },
  BUFF_ADDATKDOWN: { name: 'BUFF_ADDATKDOWN' },
  BUFF_ADDDEFDOWN: { name: 'BUFF_ADDDEFDOWN' },
  BUFF_ADDRECDOWN: { name: 'BUFF_ADDRECDOWN' },
  BUFF_BBFILL: { name: 'BUFF_BBFILL' },
  BUFF_CRTUP: { name: 'BUFF_CRTUP' },
  BUFF_FIREDMGUP: { name: 'BUFF_FIREDMGUP' },
  BUFF_WATERMDGUP: { name: 'BUFF_WATERMDGUP' },
  BUFF_EARTHDMGUP: { name: 'BUFF_EARTHDMGUP' },
  BUFF_THUNDERDMGUP: { name: 'BUFF_THUNDERDMGUP' },
  BUFF_LIGHTDMGUP: { name: 'BUFF_LIGHTDMGUP' },
  BUFF_DARKDMGUP: { name: 'BUFF_DARKDMGUP' },
  BUFF_POISIONCOUNTER: { name: 'BUFF_POISIONCOUNTER' },
  BUFF_WEAKCOUNTER: { name: 'BUFF_WEAKCOUNTER' },
  BUFF_SICKCOUNTER: { name: 'BUFF_SICKCOUNTER' },
  BUFF_INJCONTER: { name: 'BUFF_INJCONTER' },
  BUFF_CURSECOUNTER: { name: 'BUFF_CURSECOUNTER' },
  BUFF_PARALYCOUNTER: { name: 'BUFF_PARALYCOUNTER' },
  BUFF_KOBLOCK: { name: 'BUFF_KOBLOCK' },
  BUFF_HCDOWN: { name: 'BUFF_HCDOWN' },
  BUFF_BCDOWN: { name: 'BUFF_BCDOWN' },
  BUFF_SPARKDMGUP: { name: 'BUFF_SPARKDMGUP' },
  BUFF_BBATKDOWN: { name: 'BUFF_BBATKDOWN' },
  BUFF_FIRESHIELD: { name: 'BUFF_FIRESHIELD' },
  BUFF_WATERSHIELD: { name: 'BUFF_WATERSHIELD' },
  BUFF_EARTHSHIELD: { name: 'BUFF_EARTHSHIELD' },
  BUFF_THUNDERSHIELD: { name: 'BUFF_THUNDERSHIELD' },
  BUFF_LIGHTSHIELD: { name: 'BUFF_LIGHTSHIELD' },
  BUFF_DARKSHIELD: { name: 'BUFF_DARKSHIELD' },
  BUFF_AILDMGUP: { name: 'BUFF_AILDMGUP' },
  BUFF_SPARKBBUP: { name: 'BUFF_SPARKBBUP' },
  BUFF_GUARDCUT: { name: 'BUFF_GUARDCUT' },
  BUFF_GUARDBBUP: { name: 'BUFF_GUARDBBUP' },
  BUFF_GUARDPARAMUP: { name: 'BUFF_GUARDPARAMUP' },
  BUFF_BBFILLDOWN: { name: 'BUFF_BBFILLDOWN' },
  BUFF_SPARKATKUP: { name: 'BUFF_SPARKATKUP' },
  BUFF_SPARKDEFUP: { name: 'BUFF_SPARKDEFUP' },
  BUFF_SPARKRECUP: { name: 'BUFF_SPARKRECUP' },
  BUFF_SPARKCRTUP: { name: 'BUFF_SPARKCRTUP' },
  BUFF_RESISTATKDOWN: { name: 'BUFF_RESISTATKDOWN' },
  BUFF_RESISTDEFDOWN: { name: 'BUFF_RESISTDEFDOWN' },
  BUFF_RESISTRECDOWN: { name: 'BUFF_RESISTRECDOWN' },
  BUFF_ATKUP2: { name: 'BUFF_ATKUP2' },
  BUFF_DEFUP2: { name: 'BUFF_DEFUP2' },
  BUFF_RECUP2: { name: 'BUFF_RECUP2' },
  BUFF_SPARKCRTACTIVATED: { name: 'BUFF_SPARKCRTACTIVATED' },
  BUFF_OVERDRIVEUP: { name: 'BUFF_OVERDRIVEUP' },
  BUFF_BEENATK_HPREC: { name: 'BUFF_BEENATK_HPREC' },
  BUFF_HPABS: { name: 'BUFF_HPABS' },
  BUFF_SPARK_HPREC: { name: 'BUFF_SPARK_HPREC' },
  BUFF_ATKUP3: { name: 'BUFF_ATKUP3' },
  BUFF_DEFUP3: { name: 'BUFF_DEFUP3' },
  BUFF_RECUP3: { name: 'BUFF_RECUP3' },
  BUFF_CRTRATEUP2: { name: 'BUFF_CRTRATEUP2' },
  BUFF_SPARKDMGUP2: { name: 'BUFF_SPARKDMGUP2' },
  BUFF_HPREC2: { name: 'BUFF_HPREC2' },
  BUFF_BBFILL2: { name: 'BUFF_BBFILL2' },
  BUFF_ATKUP4: { name: 'BUFF_ATKUP4' },
  BUFF_DEFUP4: { name: 'BUFF_DEFUP4' },
  BUFF_RECUP4: { name: 'BUFF_RECUP4' },
  BUFF_CRTDOWN: { name: 'BUFF_CRTDOWN' },
  BUFF_ELEMENTDOWN: { name: 'BUFF_ELEMENTDOWN' },
  BUFF_SPARKDMGDOWN: { name: 'BUFF_SPARKDMGDOWN' },
  BUFF_AOEATK: { name: 'BUFF_AOEATK' },
  BUFF_NULLSPHERE: { name: 'BUFF_NULLSPHERE' },
  BUFF_NULLES: { name: 'BUFF_NULLES' },
  BUFF_BBREDUC: { name: 'BUFF_BBREDUC' },
  BUFF_ODFILLBOOST: { name: 'BUFF_ODFILLBOOST' },
  BUFF_ATKREDUC: { name: 'BUFF_ATKREDUC' },
  BUFF_TARGETED: { name: 'BUFF_TARGETED' },
  BUFF_PROB_ATKREDUC: { name: 'BUFF_PROB_ATKREDUC' },
  BUFF_PROB_DEFREDUC: { name: 'BUFF_PROB_DEFREDUC' },
  BUFF_PROB_RECREDUC: { name: 'BUFF_PROB_RECREDUC' },
  BUFF_CRITDMG_VUL: { name: 'BUFF_CRITDMG_VUL' },
  BUFF_ELEDMG_VUL: { name: 'BUFF_ELEDMG_VUL' },

  BUFF_NULLITEM: { name: 'BUFF_NULLITEM' },
  BUFF_NULLSWAP: { name: 'BUFF_NULLSWAP' },
  BUFF_FIRESHIELDDOWN: { name: 'BUFF_FIRESHIELDDOWN' },
  BUFF_WATERSHIELDDOWN: { name: 'BUFF_WATERSHIELDDOWN' },
  BUFF_EARTHSHIELDDOWN: { name: 'BUFF_EARTHSHIELDDOWN' },
  BUFF_THUNDERSHIELDDOWN: { name: 'BUFF_THUNDERSHIELDDOWN' },
  BUFF_LIGHTSHIELDDOWN: { name: 'BUFF_LIGHTSHIELDDOWN' },
  BUFF_DARKSHIELDDOWN: { name: 'BUFF_DARKSHIELDDOWN' },

  // sg icon keys
  SG_BUFF_TAUNT: { name: 'SG_BUFF_TAUNT' },
  SG_BUFF_STEALTH: { name: 'SG_BUFF_STEALTH' },
  SG_BUFF_ALL: { name: 'SG_BUFF_ALL' },
  SG_BUFF_FIRE: { name: 'SG_BUFF_FIRE' },
  SG_BUFF_WATER: { name: 'SG_BUFF_WATER' },
  SG_BUFF_EARTH: { name: 'SG_BUFF_EARTH' },
  SG_BUFF_THUNDER: { name: 'SG_BUFF_THUNDER' },
  SG_BUFF_LIGHT: { name: 'SG_BUFF_LIGHT' },
  SG_BUFF_DARK: { name: 'SG_BUFF_DARK' },
  SG_BUFF_SPHERE_DISABLE: { name: 'SG_BUFF_SPHERE_DISABLE' },
  SG_BUFF_DMG_IMMUNINTY: { name: 'SG_BUFF_DMG_IMMUNINTY' },
  SG_BUFF_SKIP_TURN: { name: 'SG_BUFF_SKIP_TURN' },
  SG_BUFF_TIME_STOP: { name: 'SG_BUFF_TIME_STOP' },
  SG_BUFF_EVASION: { name: 'SG_BUFF_EVASION' },
  SG_BUFF_CRTRATEDOWN: { name: 'SG_BUFF_CRTRATEDOWN' },
  SG_BUFF_FIRESHIELDDOWN: { name: 'SG_BUFF_FIRESHIELDDOWN' },
  SG_BUFF_WATERSHIELDDOWN: { name: 'SG_BUFF_WATERSHIELDDOWN' },
  SG_BUFF_EARTHSHIELDDOWN: { name: 'SG_BUFF_EARTHSHIELDDOWN' },
  SG_BUFF_THUNDERSHIELDDOWN: { name: 'SG_BUFF_THUNDERSHIELDDOWN' },
  SG_BUFF_LIGHTSHIELDDOWN: { name: 'SG_BUFF_LIGHTSHIELDDOWN' },
  SG_BUFF_DARKSHIELDDOWN: { name: 'SG_BUFF_DARKSHIELDDOWN' },
  SG_BUFF_WEAKSHIELD: { name: 'SG_BUFF_WEAKSHIELD' }, // unknown actual name or use
  SG_BUFF_DAMAGECUTDOWN: { name: 'SG_BUFF_DAMAGECUTDOWN' },
  SG_BUFF_ATK_EU: { name: 'SG_BUFF_ATK_EU' },
  SG_BUFF_DBLBB_EU: { name: 'SG_BUFF_DBLBB_EU' },
  SG_BUFF_REC_EU: { name: 'SG_BUFF_REC_EU' },

  // debuffs
  ...(() => {
    const ailments = {};
    knownConstants.ailments.forEach(ail => {
      const key = `DEBUFF_${ail.toUpperCase()}`;
      ailments[key] = { name: key };
    });
    return ailments;
  })(),
};
export default IconKeyMappings;
