<template>
  <base-entry-card :to="to" style="height: 100%;">
    <v-container fluid class="pa-3">
      <v-layout row>
        <v-flex>
          <div class="d-flex-container items-center">
            <sphere-type-icon
              v-if="hasSphereType"
              :category="entry['sphere type']"
              :displaySize="24"
              class="mr-1"/>
            <h1 class="subheading d-inline-block" style="word-break: break-word;">
              <b v-text="entry.name"/>
            </h1>
          </div>
        </v-flex>
      </v-layout>
      <v-layout row class="d-align-items-center">
        <v-flex xs3 class="text-xs-center pb-0">
          <item-thumbnail
            :src="getImageUrl(entry.id, entry)"
            :rarity="rarity"
            :type="entry.type"
            :isRaidItem="!!entry.raid"
            :imageTitle="entry.name"
            :displayWidth="thumbnailSize" :displayHeight="thumbnailSize"/>
        </v-flex>
        <v-flex xs9 class="pb-0" style="word-break: break-word;">
          {{ entry.desc }}
        </v-flex>
      </v-layout>
      <v-layout row class="d-align-items-center">
        <v-flex xs6>
          <h2 class="subheading">{{ itemType }}</h2>
        </v-flex>
        <v-flex xs3>
          x{{ entry.max_stack }}
        </v-flex>
        <v-flex xs3>
          <div class="d-flex-container items-center content-flex-end">
            <span v-if="rarity < 8">{{ rarity }}</span>
            <rarity-icon :class="{ 'ml-1': rarity !== 8 }" :rarity="rarity" :displaySize="18"/>
          </div>
        </v-flex>
      </v-layout>
    </v-container>
  </base-entry-card>
</template>

<script>
import { mapGetters } from 'vuex';
import EntryCardMixin from '@/components/Multidex/BaseEntryCardMixin';
import SphereTypeIcon from '@/components/Multidex/Items/SphereTypeIcon';
import RarityIcon from '@/components/Multidex/RarityIcon';
import ItemThumbnail from '@/components/Multidex/Items/ItemThumbnail';
import { getItemType, isSphere } from '@/modules/core/items';

export default {
  mixins: [EntryCardMixin],
  components: {
    SphereTypeIcon,
    RarityIcon,
    ItemThumbnail,
  },
  computed: {
    ...mapGetters('items', ['getImageUrl']),
    rarity () {
      return this.entry.rarity;
    },
    hasSphereType () {
      return isSphere(this.entry);
    },
    itemType () {
      return getItemType(this.entry);
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
  },
};
</script>
