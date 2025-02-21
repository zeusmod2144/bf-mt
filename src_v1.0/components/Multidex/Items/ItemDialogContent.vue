<template>
  <v-card flat>
    <v-card-text v-if="loadingItemData" class="text-xs-center pt-5">
      <v-progress-circular indeterminate/>
      <h4 class="subheading">Loading item data</h4>
    </v-card-text>
    <v-card-text v-else-if="!item">
      No item data found.
    </v-card-text>
    <v-card-text v-else class="pl-0 pr-0 pb-5">
      <v-container class="item-dialog-content" grid-list-xl>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card style="border-color: var(--description-card-color)">
              <v-card-title class="orange darken-3 white--text">
                <h3 class="title">{{ item.name }}</h3>
              </v-card-title>
              <v-card-text class="pt-0 pb-0">
                <description-and-effects-section
                  :description="item.desc"
                  :effects="itemEffect"
                  tab-items-style="min-height: 55px;"
                  tab-items-class="pt-1">
                  <div slot="description" class="pl-4 pt-1" style="min-height: 55px">
                    <v-layout row wrap style="min-height: 55px">
                      <v-flex xs2 sm1 class="center-align-parent">
                        <div class="card__media text-xs-center center-align-container">
                          <item-thumbnail
                            :src="getItemImage(item.id)"
                            class="mx-auto"
                            style="height: 48px; width: 48px;"
                            imgStyle="height: 48px; width: 48px;"
                            :rarity="item.rarity"
                            :type="item.type"
                            :raid="item.raid"/>
                        </div>
                      </v-flex>
                      <v-flex xs10 sm11>
                        {{ item.desc }}
                      </v-flex>
                    </v-layout>
                  </div>
                </description-and-effects-section>
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex xs12>
            <v-card style="border-color: var(--miscellaneous-card-color)">
              <v-card-title class="blue-grey white--text">
                <h3 class="title">Miscellaneous Info</h3>
              </v-card-title>
              <v-card-text>
                <v-layout row wrap>
                  <v-flex xs12 sm6 md4 v-for="(item, i) in miscellaneousItems" :key="i">
                    <v-layout row>
                      <v-flex xs6 class="text-xs-center pl-0 pr-0">
                        <b>{{ item.label }}</b>
                      </v-flex>
                      <v-flex xs6 class="text-xs-center pl-0 pr-0">
                        <span v-if="item.label.includes('Rarity')">
                          <span v-if="item.value < 8">
                            <h3 class="subheading d-inline-block">{{ item.value }}</h3>
                            <img class="icon bf" src="@/assets/star_rare.png" height="18px" style="margin-top: -0.25rem;"/>
                          </span>
                          <img v-else class="icon bf" src="@/assets/phantom_icon.png" height="18px"/>
                        </span>
                        <span v-else-if="item.label.includes('Sphere Type')">
                          <sphere-type-icon :category="item.value" class="ml-0 mr-1"/>
                          <span style="text-transform: capitalize">{{ getSphereCategory(item.value) }}</span>
                        </span>
                        <span v-else>
                          {{ item.value }}
                        </span>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex xs12 v-if="item.first_clear_missions">
            <mission-card :entry="item" style="border-color: var(--mission-card-color)"/>
          </v-flex>
          <v-flex xs12>
            <usage-card :item="item" style="border-color: var(--usage-card-color)"/>
          </v-flex>
          <v-flex xs12>
            <crafting-card :item="item" style="border-color: var(--recipe-card-color)"/>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import numbro from 'numbro';
import ItemThumbnail from '@/components/Multidex/Items/ItemThumbnail';
import SphereTypeIcon from '@/components/Multidex/Items/SphereTypeIcon';
import UsageCard from '@/components/Multidex/Items/UsageCard';
import CraftingCard from '@/components/Multidex/Items/CraftingCard';
import DescriptionAndEffects from '@/components/Multidex/GenericEffectsSection';
import MissionCard from '@/components/Multidex/Items/MissionCard';

export default {
  props: ['itemId'],
  components: {
    'item-thumbnail': ItemThumbnail,
    'sphere-type-icon': SphereTypeIcon,
    'usage-card': UsageCard,
    'crafting-card': CraftingCard,
    'description-and-effects-section': DescriptionAndEffects,
    'mission-card': MissionCard,
  },
  computed: {
    ...mapGetters('items', { getItemImage: 'getImageUrl', getSphereCategory: 'getSphereCategory' }),
    ...mapState('items', ['pageDb']),
    miscellaneousItems () {
      return !this.item ? [] : [
        { label: 'Item ID:', value: this.item.id },
        { label: 'Max Stack:', value: `x${this.item.max_stack}` },
        { label: 'Sell Price:', value: `${this.formatNumber(+this.item.sell_price)} Zel` },
        { label: 'Raid Item?', value: this.item.raid ? 'Yes' : 'No' },
        this.item.rarity !== undefined ? { label: 'Rarity:', value: this.item.rarity } : undefined,
        { label: 'Item Type:', value: this.itemType },
        this.isSphere ? { label: 'Sphere Type:', value: this.item['sphere type'] } : undefined,
      ].filter(i => !!i);
    },
    isSphere () {
      return !!this.item && (this.item['sphere type'] !== undefined || this.item.type === 'sphere' || this.item.type === 'ls_sphere');
    },
    itemType () {
      if (!this.item) {
        return 'None';
      }
      const { type, raid } = this.item;
      // items, raid items, booster, spheres, materials, evo materials, ls spheres
      if (type === 'consumable' && !raid) {
        return 'Item';
      } else if (type === 'material' && !raid) {
        return 'Material';
      } else if (type === 'sphere') {
        return 'Sphere';
      } else if (type === 'evomat') {
        return 'Evo Material';
      } else if (type === 'summoner_consumable') {
        return 'Booster';
      } else if (raid) {
        return 'Raid Item';
      } else if (type === 'ls_sphere') {
        return 'LS Sphere';
      } else {
        console.warn('unknown item type', type);
        return type || 'Unknown Type';
      }
    },
    itemEffect () {
      if (!this.item || !this.item.effect) {
        return;
      }

      if (this.item.effect.effect && this.item.effect.effect.length > 0) {
        const { effect, ...extraParams } = this.item.effect;
        console.debug('original effect value', this.item.effect);
        return [
          { ...effect[0], ...extraParams },
          ...effect.slice(1),
        ];
      } else {
        return this.item.effect;
      }
    },
  },
  data () {
    return {
      item: undefined,
      loadingItemData: true,
    };
  },
  watch: {
    async itemId (newValue) {
      if (!newValue) {
        this.item = undefined;
      } else {
        this.loadingItemData = true;
        this.item = await this.getItem(newValue);
        this.loadingItemData = false;
      }
    },
    async pageDb () {
      if (this.itemId && Object.keys(this.pageDb).length > 0) {
        this.loadingItemData = true;
        this.item = await this.getItem(this.itemId);
        this.loadingItemData = false;
      }
    },
  },
  async mounted () {
    if (this.itemId) {
      this.loadingItemData = true;
      this.item = await this.getItem(this.itemId);
      this.loadingItemData = false;
    }
  },
  methods: {
    ...mapActions('items', { getItem: 'getById' }),
    formatNumber (number) {
      return +number < 1000 ? +number : numbro(+number).format({ average: true, mantissa: 2 });
    },
  },
};
</script>

<style>
.item-dialog-content .card:not(.item-card) {
  border: 2px solid transparent;
  margin: -2px;
  --description-card-color: #ef6c00; /* orange darken-3 */
  --miscellaneous-card-color: #607d8b; /* blue-grey */
  --usage-card-color: #3f51b5; /* indigo */
  --recipe-card-color: #4caf50; /* green */
  --mission-card-color: #009688; /* teal */
}

.theme--light .item-dialog-content .item-card,
.theme--light .item-dialog-content .unit-card,
.theme--light .item-dialog-content .mission-card {
  background-color: whitesmoke;
}

.theme--dark .item-dialog-content .item-card,
.theme--dark .item-dialog-content .unit-card,
.theme--dark .item-dialog-content .mission-card {
  background-color: black;
}
</style>
