<template>
  <v-card flat style="min-height: 64px;">
    <v-container fluid class="pa-0">
      <v-layout v-if="!isKarma" row style="min-height: 64px;">
        <v-flex xs3 sm2 md1 class="center-align-parent pa-0" style="max-width: 60px;">
          <router-link :to="to || multidexUrl">
            <div class="center-align-container card__media">
              <item-thumbnail
                :src="getImageUrl(item.id)"
                style="height: 52px; width: 52px;"
                imgStyle="height: 52px; width: 52px;"
                :rarity="item.rarity"
                :type="item.type"
                :raid="item.raid"/>
            </div>
          </router-link>
        </v-flex>
        <v-flex xs6 sm9 md10>
          <v-layout row wrap>
            <v-flex xs12 :sm6="hasRecipe || showButtonCondition !== undefined">
              <router-link :to="to || multidexUrl" style="color: inherit; text-decoration: none;">
                <sphere-type-icon
                  v-if="item['sphere type'] !== undefined || item.type === 'sphere' || item.type === 'ls_sphere'"
                  :category="item['sphere type']"
                  class="ml-0 mr-0"/>
                <b>{{ item.name }}</b>
                <v-icon small class="pl-1">fas fa-external-link-alt</v-icon>
              </router-link>
            </v-flex>
            <v-flex v-if="(showButtonCondition !== undefined && !!showButtonCondition) || (showButtonCondition === undefined && item.recipe)" xs3 sm6 class="text-xs-right">
              <v-btn @click="showRecipe = !showRecipe" small>{{ buttonText || 'Recipe' }}</v-btn>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex xs3 sm1 class="text-xs-center">
          {{ materialCount }}
        </v-flex>
      </v-layout>
      <template v-if="showButtonCondition !== undefined">
        <v-layout row>
          <v-slide-y-transition mode="in-out">
            <v-container fluid v-show="showRecipe" :style="expandedAreaStyle" :class="expandedAreaClass">
              <slot name="expanded-area" class="ml-2 mr-2 mb-5 pb-1" style="min-width: 20rem; overflow-x: auto;">
                Put your stuff here.
              </slot>
            </v-container>
          </v-slide-y-transition>
        </v-layout>
      </template>
      <template v-else-if="showButtonCondition === undefined && item && item.recipe">
        <v-layout row>
          <v-slide-y-transition mode="in-out">
            <slot name="expanded-area">
              <v-container fluid v-show="showRecipe" class="ml-2 mr-2 mb-5 pb-1 sub-recipe-container" style="min-width: 20rem; overflow-x: auto;">
                <material-row
                  v-for="(mat, i) in item.recipe.materials"
                  :key="i"
                  :material="mat"/>
                <material-row
                  v-if="item.recipe.karma && item.recipe.karma > 0"
                  :karma="item.recipe.karma"/>
              </v-container>
            </slot>
          </v-slide-y-transition>
        </v-layout>
      </template>
      <v-layout row v-if="isKarma">
        <v-flex xs3 sm2 md1 class="vertical-align-parent pa-0" style="max-width: 60px;">
          <v-card-media :src="require('@/assets/karma_thum.png')" contain height="48px"/>
        </v-flex>
        <v-flex xs6 sm9 md10>
          Karma
        </v-flex>
        <v-flex xs3 sm1 class="text-xs-center">
          {{ formatNumber(karma) }}
        </v-flex>
      </v-layout>
    </v-container>
  </v-card>  
</template>

<script>
import { mapGetters } from 'vuex';
import numbro from 'numbro';
import ItemThumbnail from '@/components/Multidex/Items/ItemThumbnail';
import SphereTypeIcon from '@/components/Multidex/Items/SphereTypeIcon';

export default {
  props: ['material', 'karma', 'to', 'buttonText', 'showButtonCondition', 'expandedAreaStyle', 'expandedAreaClass', 'parentObject'],
  components: {
    'item-thumbnail': ItemThumbnail,
    'sphere-type-icon': SphereTypeIcon,
  },
  computed: {
    ...mapGetters('items', ['getImageUrl', 'itemById', 'getMultidexPathTo']),
    item () {
      if (!this.material) {
        return;
      }
      return this.itemById(this.materialId);
    },
    isKarma () {
      return this.karma !== undefined;
    },
    hasRecipe () {
      return this.item && this.item.recipe;
    },
    materialId () {
      if (!this.material) {
        return;
      }

      return this.material.id.toString();
    },
    materialCount () {
      if (!this.material) {
        return;
      }

      return this.material.count;
    },
    multidexUrl () {
      if (!this.material) {
        return;
      }
      return this.getMultidexPathTo(this.materialId);
    },
  },
  data () {
    return {
      showRecipe: false,
    };
  },
  methods: {
    formatNumber (number) {
      return +number < 1000 ? +number : numbro(+number).format({ average: true, mantissa: 3 });
    },
  },
  name: 'material-row',
};
</script>

<style>
.sub-recipe-container {
  border: 1px solid grey;
}
</style>
