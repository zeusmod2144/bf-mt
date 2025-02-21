<template>
  <v-card class="squad-list--entry-card">
    <v-layout row class="pa-2">
      <v-flex>
        <h1 class="title">
          {{ squad.name }}
        </h1>
      </v-flex>
      <v-spacer/>
      <v-flex style="flex-grow: 0;">
        <h2 class="subheading">
          {{ squadCost }} Cost
        </h2>
      </v-flex>
    </v-layout>
    <v-layout row wrap class="px-2">
      <template v-if="!isLoadingInParent">
        <unit-entry
          v-for="(unit, i) in fullUnits"
          :key="getUnitEntryKey(unit, i)"
          xs12 sm6
          :index="i"
          :isVisible="isVisible"
          :unit="unit"
          :getUnit="getUnit"
          :getItem="getItem"
          :getExtraSkill="getExtraSkill"
          :isLead="i === squad.lead"
          :isFriend="i === squad.friend"
          class="d-flex py-1"
          style="align-items: center; border: 1px solid var(--background-color-alt);"/>
      </template>
      <loading-indicator v-else loadingMessage="Loading squad data"/>
    </v-layout>
    <v-divider class="mt-2"/>
    <slot name="card-actions" :disabled="isLoadingInParent || !isVisible">
      <v-card-actions>
        <v-btn flat :disabled="isLoadingInParent || !isVisible" v-if="to" :to="to">View</v-btn>
        <v-btn flat :disabled="isLoadingInParent || !isVisible" v-else @click="$emit('view')">View</v-btn>
        <v-btn flat :disabled="isLoadingInParent || !isVisible" @click="$emit('share')">
          <v-icon left>share</v-icon>
          Share
        </v-btn>
        <v-spacer/>
        <v-btn flat :disabled="isLoadingInParent || !isVisible" @click="$emit('delete')">
          <v-icon left>delete</v-icon>
          Delete
        </v-btn>
      </v-card-actions>
    </slot>
  </v-card>
</template>

<script>
import { unitPositionMapping } from '@/modules/constants';
import { generateFillerSquadUnitEntry } from '@/modules/core/squads';
import UnitEntry from '@/components/Tools/Squads/SquadUnitEntry';
import GettersMixin from '@/components/Tools/Squads/SynchronousGettersMixin';
import LoadingIndicator from '@/components/LoadingIndicator';

export default {
  mixins: [GettersMixin],
  components: {
    UnitEntry,
    LoadingIndicator,
  },
  props: {
    squad: {
      type: Object,
      required: true,
    },
    to: {
      type: String,
      default: '',
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
    isLoadingInParent: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    squadCost () {
      return this.squad.units
        .map(({ id }) => this.getUnit(id))
        .reduce((acc, unit) => acc + (+(unit.cost || 0)), 0);
    },
    // fills empty positions with empty values
    fullUnits () {
      return unitPositionMapping.map(position => {
        let unit = this.squad.units.find(unit => unit.position === position);
        if (!unit) { // empty position, so fill it with empty data
          unit = generateFillerSquadUnitEntry({ isEmpty: true, bbOrder: null, position });
        }

        return unit;
      });
    },
  },
  methods: {
    getUnitEntryKey (unit = {}, i = 0) {
      return `${JSON.stringify(unit)}-${i}`;
    },
  },
};
</script>
