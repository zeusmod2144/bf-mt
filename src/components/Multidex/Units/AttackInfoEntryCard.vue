<template>
  <base-entry-card :to="to || undefined">
    <v-container fluid class="pa-3 unit-attack-info-entry-card-area">
      <unit-thumbnail
        class="unit-thumbnail"
        :src="getImageUrls(entry.id).ills_thum"
        :rarity="rarity"
        :imageTitle="entry.name"
        :displayWidth="thumbnailSize"
        :displayHeight="thumbnailSize"
      />
      <div class="unit-name d-flex-container items-center">
        <element-icon v-if="entry.element" :element="entry.element" :displaySize="20" class="mr-1"/>
        <h1 class="subheading d-inline-block" style="word-break: break-word;">
          <b v-text="entry.name || entry.id"/>
        </h1>
      </div>
      <div class="attack-chips-container" :data-nonattacker="!hasAnyAttack">
        <template v-if="hasAnyAttack">
          <div v-for="type in attackTypesOnEntry" :key="type" class="attack-chips--burst-entry">
            <span class="attack-chips--name">
              {{ attackTypeNameMapping[type] }}:
            </span>
            <div class="attack-chips--list">
              <template v-if="hasAttack(type)">
                <v-chip
                  v-for="(attack, i) in attackChipsByBurstType[type]"
                  :key="i"
                  small
                  style="pointer-events: none;"
                  :color="getChipColorConfigForAttackType(attack.burstType).color"
                  text-color="white"
                  outline
                >
                  <v-avatar :class="getChipColorConfigForAttackType(attack.burstType).avatarColor">
                    {{ attack.hits }}
                  </v-avatar>
                  {{ attack.label }}
                </v-chip>
              </template>
              <span v-else style="margin-left: 4px;">
                No attacks found.
              </span>
            </div>
          </div>
        </template>
        <template v-else>
          <span>No attacks found.</span>
        </template>
      </div>
      <div class="d-flex-container items-center content-flex-end unit-rarity">
        <span v-if="rarity < 8">{{ rarity }}</span>
        <rarity-icon :class="{ 'ml-1': rarity !== 8 }" :rarity="rarity" :displaySize="18"/>
      </div>
    </v-container>
  </base-entry-card>
</template>

<script>
import { mapGetters } from 'vuex';
import { burstTypes } from '@/modules/constants';
import { getEffectName } from '@/modules/core/buffs';
import EntryCardMixin from '@/components/Multidex/BaseEntryCardMixin';
import ElementIcon from '@/components/Multidex/ElementIcon';
import RarityIcon from '@/components/Multidex/RarityIcon';
import UnitThumbnail from '@/components/Multidex/Units/UnitThumbnail';

const CHIP_COLOR_MAPPING_BY_ATTACK_TYPE = {
  bb: {
    color: 'blue-grey',
    avatarColor: 'blue-grey darken-1',
  },
  sbb: {
    color: 'amber darken-3',
    avatarColor: 'amber darken-4',
  },
  ubb: {
    color: 'red darken-3',
    avatarColor: 'red darken-4',
  },
};

export default {
  mixins: [EntryCardMixin],
  components: {
    ElementIcon,
    RarityIcon,
    UnitThumbnail,
  },
  computed: {
    ...mapGetters('units', ['getImageUrls']),
    attackTypes: () => ['normal'].concat(burstTypes),
    attackTypesOnEntry () {
      return this.attackTypes.filter(t => this.hasAttack(t));
    },
    attackTypeNameMapping: () => Object.freeze({
      normal: 'ATK',
      bb: 'BB',
      sbb: 'SBB',
      ubb: 'UBB',
    }),
    hasAnyAttack () {
      return !!this.entry && this.attackTypes.some(t => this.hasAttack(t));
    },
    rarity () {
      return this.entry.rarity;
    },
    thumbnailSize () {
      const breakpoint = this.$vuetify.breakpoint;
      if (breakpoint.xlOnly) {
        return 64;
      } else if (breakpoint.mdAndUp) {
        return 56;
      } else {
        return 48;
      }
    },
    hasDifferingMoveTypes () {
      const attackTypes = {};
      Object.values(this.entry.attackInfo || {}).forEach(attacks => {
        attacks.forEach(attack => {
          if (!attackTypes[attack.moveType]) {
            attackTypes[attack.moveType] = true;
          }
        });
      });
      return Object.keys(attackTypes).length > 1;
    },
    attackChipsByBurstType () {
      const { hasAttack, entry, hasDifferingMoveTypes } = this;
      return this.attackTypes.reduce((acc, burstType) => {
        if (hasAttack(burstType)) {
          const attacks = entry.attackInfo[burstType].map(attack => {
            const buffName = (getEffectName({ 'proc id': attack.id }) || '').replace(/ Damage$/, '');
            return {
              hits: attack.hits,
              label: [
                buffName,
                (hasDifferingMoveTypes || burstType === 'normal') ? attack.moveType : '',
                attack.target !== 'RT' ? attack.target : '',
                attack.sourcePath ? `(${attack.sourcePath})` : '',
              ].filter(v => v).join(' '),
              burstType,
            };
          });
          acc[burstType] = attacks;
        } else {
          acc[burstType] = [];
        }
        return acc;
      }, {});
    },
  },
  methods: {
    getChipColorConfigForAttackType (type) {
      return CHIP_COLOR_MAPPING_BY_ATTACK_TYPE[type] || CHIP_COLOR_MAPPING_BY_ATTACK_TYPE.bb;
    },
    hasAttack (type) {
      return this.entry.attackInfo &&
        Array.isArray(this.entry.attackInfo[type]) &&
        this.entry.attackInfo[type].length >= 1;
    },
  },
};
</script>

<style lang="less">
.unit-attack-info-entry-card-area {
  display: grid;
  grid-template-rows: auto 1fr;
  grid-template-columns: auto 1fr auto;
  grid-template-areas:  "name name rarity"
                        "thumbnail attack attack";
  grid-gap: 0.25em 0.5em;
  height: 100%;

  .unit-thumbnail {
    grid-area: thumbnail;
    align-self: center;
  }

  .unit-name {
    grid-area: name;
  }

  .attack-chips-container {
    grid-area: attack;
    align-self: center;

    &[data-nonattacker] {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .attack-chips--burst-entry {
      display: grid;
      grid-template-columns: 40px 1fr;
      grid-template-rows: auto;
      grid-row-gap: 0.25em;

      .attack-chips--name {
        display: flex;
        align-items: center;
        font-weight: bold;
      }

      &:not(:last-child) {
        border-bottom: 1px solid var(--background-color-alt);
      }
    }
  }

  .unit-rarity {
    grid-area: rarity;
  }
}
</style>
