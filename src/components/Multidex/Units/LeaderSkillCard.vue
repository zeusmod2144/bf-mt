<template>
  <description-card-base
    :entry="leaderSkill"
    materialColor="green darken-3"
    :titleHtmlGenerator="() => `<b>Leader Skill: ${name}</b>`"
    :multidexPath="leaderSkill && getMultidexPathTo(leaderSkill.id) || ''"
    :descriptionGetter="() => description"
    :contextHandler="() => ({ isLS: true })"
    :treeOptions="{ maxDepth: 1 }"/>
</template>

<script>
import { mapGetters } from 'vuex';
import DescriptionCardBase from '@/components/Multidex/DescriptionCardBase';

export default {
  props: {
    unit: {
      type: Object,
    },
    logger: {
      required: true,
    },
  },
  components: {
    DescriptionCardBase,
  },
  computed: {
    ...mapGetters('leaderSkills', ['getMultidexPathTo']),
    leaderSkill () {
      return this.unit && this.unit['leader skill'];
    },
    name () {
      return this.leaderSkill ? this.leaderSkill.name : 'None';
    },
    description () {
      return this.leaderSkill ? this.leaderSkill.desc : 'None';
    },
  },
};
</script>
