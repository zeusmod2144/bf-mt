import IconKeyMappings from './icon-key-mappings';
import { effectTypes } from '../constants';
import numbro from 'numbro';

import { Logger } from '@/modules/Logger';

const logger = new Logger({ prefix: '[PROCESSOR-HELPER]' });

export function isPassiveEffect (effect = {}) {
  return !!(effect['passive id'] || effect['unknown passive id']);
}

export function isProcEffect (effect = {}) {
  return !!(effect['proc id'] || effect['unknown proc id']);
}

export function getEffectType (effect = {}) {
  return (isPassiveEffect(effect) && 'passive') ||
    (isProcEffect(effect) && 'proc') ||
    (logger.warn('unknown effect type', effect) || 'unknown');
}

export function getEffectId (effect = {}) {
  return effect['passive id'] || effect['unknown passive id'] ||
    effect['proc id'] || effect['unknown proc id'];
}

export const iconGeneratorSymbol = Symbol('iconGeneratorSymbol');

export function formatNumber (number, options = { thousandSeparated: true }, useMinThreshold = true) {
  return (useMinThreshold && number < 1000) ? number : numbro(number).format(options);
}

export function multiStatToObject (hp, atk, def, rec, crit) {
  return {
    hp,
    atk,
    def,
    rec,
    crit,
  };
}

export function containsAnyKey (input = {}, keys = []) {
  return Object.keys(input).some(key => keys.includes(key));
}

export function getNumberAsPolarizedNumber (number = 0, formatNumber = false) {
  return `${(number < 0 ? number.toString() : `+${formatNumber ? formatNumber(number) : number}`)}`;
}

export function getNumberAsPolarizedPercent (number = 0) {
  return `${getNumberAsPolarizedNumber(number)}%`;
}

export function getTargetData (inputArea, inputType, options = {}) {
  const validTypes = ['party', 'self', 'enemy'];
  let area, type;
  let isPassive = options.isPassive || false;
  if (typeof inputArea === 'object' && inputArea['target type'] && inputArea['target area']) {
    type = inputArea['target type'];
    area = inputArea['target area'];
  } else if (typeof inputType === 'object' && inputType['target type'] && inputType['target area']) {
    area = inputType['target area'];
    type = inputType['target type'];
  } else if (typeof inputArea === 'object' && inputArea['passive target']) {
    type = inputArea['passive target'];
    isPassive = true;
  } else if (typeof inputType === 'object' && inputType['passive target']) {
    type = inputType['passive target'];
    isPassive = true;
  } else {
    area = inputArea;
    type = inputType;
  }

  if (!validTypes.includes(type)) {
    type = (options.isLS) ? 'party' : 'self';
  }

  let result;
  if (type === 'self') {
    result = 'self';
  } else if ((area === 'aoe' || isPassive) && type === 'party') {
    result = 'party';
  } else if (area === 'aoe' && type === 'enemy') {
    result = 'all enemies';
  } else if (area === 'single' && type === 'enemy') {
    result = 'one enemy';
  } else if (area === 'single' && type === 'party') {
    result = 'one ally';
  } else {
    result = `${area},${type}`;
  }

  return !options.noParentheses ? `(${result})` : result;
}

export function getTurns (effect) {
  const value = !isNaN(effect) ? effect : ((effect && effect['buff turns']) || 0);
  return {
    value,
    text: `${value} turn`,
  };
}

export function getIconKey (key = '') {
  return (IconKeyMappings[key] || {}).name || key;
}

export function capitalize (str = '') {
  return str[0].toUpperCase().concat(str.slice(1).toLowerCase());
}

export function generateDefaultEntry (id = '0') {
  return {
    desc: `Untranslated buff ${id}`,
    type: [effectTypes.UNTRANSLATED.name],
    possibleIcons: () => [IconKeyMappings.UNKNOWN.name],
    process(effect = {}, context) {
      return {
        type: this.type,
        originalEffect: effect,
        context,
        values: [{
          iconKey: IconKeyMappings.UNKNOWN.name,
          value: effect,
          desc: `Unknown effect. Effect Keys: [${Object.keys(effect).join(', ')}]`,
        } ],
      };
    },
  };
}

export function getInnateAttackBoosts (effect) {
  const innateBoosts = [];

  const bc = effect['bb bc%'];
  const crit = effect['bb crit%'];
  const hc = effect['bb hc%'];
  if (bc) {
    innateBoosts.push(`innate ${getNumberAsPolarizedPercent(bc)} BC drop rate`);
  }
  if (crit) {
    innateBoosts.push(`innate ${getNumberAsPolarizedPercent(crit)} Critical Hit rate`);
  }
  if (hc) {
    innateBoosts.push(`innate ${getNumberAsPolarizedPercent(hc)} HC drop rate`);
  }

  return innateBoosts;
}

export function getFormattedMinMax (min = 0, max = 0) {
  const [formattedMin, formattedMax] = [formatNumber(min), formatNumber(max)];
  return (min !== max) ? [formattedMin, max > 0 ? '-' : ' to ', formattedMax].join('') : (formattedMin || formattedMax);
}

export function getSphereCategory (num) {
  const categories = {
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
  };
  return categories[+num];
}

export function getHighestRarityUnit (category = 0, unitById = (id) => ({ name: id })) {
  for (let i = 9; i >= 0; --i) {
    const id = `${+category + i}`;
    const unit = unitById(id);
    if (unit) {
      return unit;
    }
  }
}

export function conditionHelperGetUnitNames (units = [], unitById = (id) => ({ name: id, id })) {
  return units.map(entry => {
    const names = [];
    if (entry.name) {
      names.push(entry.name);
    } else {
      const id = (entry.id) ? entry.id.toString() : entry.toString();
      if (+id % 10 === 0) {
        const unit = getHighestRarityUnit(+id, unitById) || {};
        names.push(`any evolution of ${unit.name || id}`);
      } else {
        // specify a specific unit
        const unit = unitById(id) || {};
        names.push(unit.name || id);
      }
    }
    return names;
  }).reduce((acc, val) => acc.concat(val), []);
}

export function conditionalHelperGetItemNames (items = [], itemById = (id) => ({ name: id, id })) {
  return items.map(id => {
    const item = itemById(id.toString()) || {};
    return item.name || id;
  });
}

export function getConditionMessage (effect) {
  return convertParsedConditionsToMessage(parseConditions(effect));
}

export function parseConditions (effect) {
  const parsedConditions = { unit: [], item: [], sphereType: [] };
  if (!effect.conditions || effect.conditions.length === 0) {
    return parsedConditions;
  }

  effect.conditions.forEach(condition => {
    if (condition['sphere category required'] !== undefined) {
      parsedConditions.sphereType.push(condition['sphere category required (raw)']);
    } else if (condition['item required'] !== undefined) {
      if (Array.isArray(condition['item required']) && condition['item required'].length > 0) {
        condition['item required'].forEach(item => {
          if (!parsedConditions.item.includes(item)) {
            parsedConditions.item.push(item);
          }
        });
      } else if (!Array.isArray(condition['item required'])) {
        parsedConditions.item.push(condition['item required']);
      }
    } else if (condition['unit required'] !== undefined) {
      if (Array.isArray(condition['unit required']) && condition['unit required'].length > 0) {
        condition['unit required'].forEach(unit => {
          if (!parsedConditions.unit.includes(unit)) {
            parsedConditions.unit.push(unit);
          }
        });
      } else if (!Array.isArray(condition['unit required'])) {
        parsedConditions.unit.push(condition['unit required']);
      }
    } else if (condition.unknown !== undefined) {
      parsedConditions.item.push(`unknown sphere type ${condition['unknown']}`);
    }
  });

  return parsedConditions;
}

export function convertParsedConditionsToMessage ({ unit = [], item = [], sphereType = [] }, { unitById, itemById }) {
  const conditions = [];

  if (unit.length > 0) {
    const names = conditionHelperGetUnitNames(unit, unitById);
    if (unit.length === 1 && names.length === 1) {
      conditions.push(`${names[0]} is in squad`);
    } else {
      conditions.push(`${names.join(' or ')} are in squad`);
    }
  }

  if (item.length > 0) {
    const names = conditionalHelperGetItemNames(item, itemById);
    if (item.length === 1) {
      conditions.push(`${names[0]} is equipped`);
    } else {
      conditions.push(`${names.join(' or ')} are equipped`);
    }
  }

  if (sphereType.length > 0) {
    const names = sphereType.map(c => getSphereCategory(+c));
    if (sphereType.length === 1) {
      conditions.push(`${names[0]} sphere is equipped`);
    } else {
      conditions.push(`${names.join(' or ')} spheres are equipped`);
    }
  }

  return conditions.join(' or ');
}
