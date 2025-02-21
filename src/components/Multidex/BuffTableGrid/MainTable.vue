<template>
  <div class="buff-table-grid" :style="mainGridStyle">
    <template v-if="showHeaders">
      <span class="id-cell header-cell">
        <v-btn flat @click="toggleAllEffectViews" small style="min-height: 40px;">
          <v-icon>{{ hiddenIndices.length === mappedEffects.length ? 'fullscreen' : 'fullscreen_exit' }}</v-icon>
          ID
        </v-btn>
      </span>
      <span class="value-subgrid header-grid">
        <span class="property-cell header-cell">
          Buff Property
        </span>
        <span class="value-cell header-cell">
          Buff Value
        </span>
      </span>
    </template>
    <template v-for="(effectEntry, i) in mappedEffects">
      <span class="id-cell" :key="`${effectEntry.id}-${i}=id`">
        <v-btn flat small class="collapse-btn" @click="() => toggleEffectView(i)">
          <span style="flex: 1 1 100%;">
            <v-icon>{{ hiddenIndices.includes(i) ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}</v-icon>
          </span>
          <span style="flex: 1 1 100%;">
            <slot name="default">
              {{ effectEntry.id }}
            </slot>
          </span>
          <span style="flex: 1 1 100%;">
            <v-icon>{{ hiddenIndices.includes(i) ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}</v-icon>
          </span>
        </v-btn>
      </span>
      <span  
        class="value-subgrid"
        :key="`${effectEntry.id}-${i}-value-subgrid`"
      >
        <span
          v-if="hiddenIndices.includes(i)"
          class="property-cell"
          style="grid-column: span 2"
          v-text="getEffectsHiddenText(getSortedProps(effectEntry.effect).length, effectEntry.effect)"
        />
        <template v-else>
          <template v-for="(prop, j) in getSortedProps(effectEntry.effect)">
            <span
              :class="{
                'property-cell': true,
                [j % 2 === 0 ? 'even-row' : 'odd-row']: true,
                'only-row': getSortedProps(effectEntry.effect).length === 1,
              }"
              :key="`${effectEntry.id}-${i}-${j}-property`"
            >
              <span v-text="prop"/>
            </span>
            <span
              v-if="hasBuffTable && isProcBuffList(prop)"
              :class="{
                'value-cell has-table': true,
                [j % 2 === 0 ? 'even-row' : 'odd-row']: true,
                'only-row': getSortedProps(effectEntry.effect).length === 1,
              }"
              :key="`${effectEntry.id}-${i}-${j}-table`"
            >
              <buff-table-grid :effects="effectEntry.effect[prop]"/>
            </span>
            <span
              v-else
              :class="{
                'value-cell': true,
                [j % 2 === 0 ? 'even-row' : 'odd-row']: true,
                'only-row': getSortedProps(effectEntry.effect).length === 1,
              }"
              :key="`${effectEntry.id}-${i}-${j}-value`"
              style="display: flex; align-items: center; justify-content: center;"
            >
              {{ effectEntry.effect[prop] }}
              <span v-if="isEmptyArray(effectEntry.effect[prop])" style="padding-left: 4px">
                (None)
              </span>
            </span>
          </template>
        </template>
      </span>
    </template>
  </div>
</template>

<script>
import { getEffectType, getEffectId } from '@/modules/EffectProcessor/processor-helper';
import { getEffectName, handleUnknownParams } from '@/modules/core/buffs';

export default {
  props: {
    effects: {
      type: Array,
      default: () => [],
    },
    showHeaders: {
      type: Boolean,
      default: false,
    },
    translateEffectNames: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    idKeys: () => ['passive id', 'unknown passive id', 'proc id', 'unknown proc id'],
    mappedEffects () {
      return this.effects.map(this.getEffectDetails);
    },
    hasBuffTable () {
      return this.mappedEffects.some(entry => entry.type === 'passive' && +entry.id === 66);
    },
    gridRowConfig () {
      const numEffectRows = this.mappedEffects.length; // number of effect rows
      return [
        this.showHeaders ? 'minmax(40px, auto)' : '',
        `repeat(${numEffectRows}, auto)`,
      ].filter(v => v).join(' ');
    },
    mainGridStyle () {
      return {
        'grid-template-rows': this.gridRowConfig,
      };
    },
  },
  data () {
    return {
      sortedPropsCache: new WeakMap(),
      hiddenIndices: [],
    };
  },
  methods: {
    getEffectDetails (effect) {
      const type = getEffectType(effect);
      const id = getEffectId(effect);
      const filteredEffect = {};
      const processedEffect = handleUnknownParams(effect);
      Object.keys(processedEffect).forEach(key => {
        // get everything but the ID
        if (!this.idKeys.includes(key)) {
          filteredEffect[key] = processedEffect[key];
        }
      });
      if (this.translateEffectNames) {
        filteredEffect['translated name'] = getEffectName(effect) || `Unknown buff ${id}`;
      }
      return { type, id, effect: filteredEffect };
    },
    getSortedProps (effect) {
      if (!this.sortedPropsCache.has(effect)) {
        this.sortedPropsCache.set(effect, Object.freeze(Object.keys(effect).sort((a, b) => {
          if (a === 'translated name') {
            return -1;
          } else if (b === 'translated name') {
            return 1;
          } else {
            return a < b ? -1 : 1;
          }
        })));
      }
      return this.sortedPropsCache.get(effect);
    },
    toggleEffectView (i) {
      if (this.hiddenIndices.includes(i)) {
        this.hiddenIndices = this.hiddenIndices.filter(val => val !== i);
      } else {
        this.hiddenIndices.push(i);
      }
    },
    toggleAllEffectViews () {
      if (this.hiddenIndices.length === this.mappedEffects.length) {
        this.hiddenIndices = [];
      } else {
        this.hiddenIndices = this.mappedEffects.map((val, i) => i);
      }
    },
    isProcBuffList (prop) {
      return prop === 'triggered effect';
    },
    getValueSubgridStyle (effect) {
      const numProps = Object.keys(effect);
      return {
        'grid-template-rows': `repeat(${numProps}, minmax(36px, auto))`,
      };
    },
    isEmptyArray (obj) {
      return Array.isArray(obj) && obj.length === 0;
    },
    getEffectsHiddenText (numProps, effect) {
      const effectName = effect['translated name'] || getEffectName(effect);
      const subEffectNames = (effect['triggered effect'] || []).map(getEffectName);
      return [
        `${numProps} ${numProps !== 1 ? 'Effects' : 'Effect'} Hidden`,
        effectName && `for ${effectName}`,
        subEffectNames.length > 0 && `(${subEffectNames.join(', ')})`,
      ].filter(v => v).join(' ');
    },
  },
  name: 'buff-table-grid',
};
</script>

<style lang="less">
div.buff-table-grid {
  --table-border-color: var(--background-color-alt);
  --table-background-color: var(--background-color-alt--lighten-1);
  --table-border-settings: 1px solid var(--table-border-color);

  display: grid;
  grid-template-columns: minmax(64px, auto) 1fr;
  border: var(--table-border-settings);
  width: 100%;

  .header-cell {
    font-weight: bold;
    border-bottom: var(--table-border-settings);
  }

  .id-cell {
    height: 100%;
    display: flex;
    align-content: center;
  }

  .id-cell button {
    height: auto;
    min-width: 0;
    flex: auto;

    .v-btn__content {
      flex-wrap: wrap;
    }
  }

  .value-cell {
    text-align: center;
  }

  .property-cell, .value-cell {
    padding: 0.5em;
    word-break: break-word;
    hyphens: auto;
  }

  .property-cell, .header-cell {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .property-cell span {
    flex: 1 0 100%;
    text-align: center;
  }

  .id-cell:not(.header-cell), .value-subgrid:not(.header-grid) {
    border-top: 2px solid var(--table-background-color);
    border-bottom: 2px solid var(--table-background-color);
  }

  .value-subgrid {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 17.5em 1fr;
    grid-auto-flow: stretch;

    // nested table
    .value-subgrid {
      grid-template-columns: minmax(17.5em, auto) 1fr;
    }

    .even-row:not(.value-cell), .even-row.value-cell:not(:hover) {
      &:not(.only-row) {
        background-color: var(--table-border-color);
      }
    }

    .value-cell:not(.header-cell):hover {
      background-color: var(--background-color--card);
    }

    .value-cell.has-table:not(.header-cell):hover {
      background-color: var(--background-color);
    }
  }
}
</style>
