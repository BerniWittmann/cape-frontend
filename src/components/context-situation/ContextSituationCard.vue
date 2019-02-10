<template>
  <el-card :class="{ 'context-situation-card': true, 'is-active': isActive }" @click.native.stop="navigateToContextSituation" :shadow="shadowMode">
    <div slot="header" class="clearfix">
      <span>{{ contextSituation.name }}</span>
    </div>

    <div class="rules" v-show="isActive">
      <p>{{ contextSituation.rules }}</p>
    </div>

    <div class="tags">
      <tag v-for="tag in contextSituation.tags" :tag="tag" :size="tagMode" :key="tag.id"></tag>
    </div>
  </el-card>
</template>

<script>
/* ============
 * Context Situation Card Component
 * ============
 *
 * A Card to view a single Context Situation
 */
import Tag from '@/components/Tag'

export default {
  components: {
    Tag
  },

  props: {
    contextSituation: {
      type: Object,
      required: true
    }
  },

  computed: {
    activeContextSituation() {
      return this.$store.state.contextSituation.activeContextSituation
    },

    isActive() {
      return this.activeContextSituation && this.activeContextSituation.id === this.contextSituation.id
    },

    shadowMode() {
      return this.isActive ? 'always' : 'hover'
    },

    tagMode() {
      return this.isActive ? 'normal' : 'small'
    }
  },

  methods: {
    navigateToContextSituation() {
      this.$router.push({
        name: 'context_situations.single',
        params: {
          contextSituationID: this.contextSituation.id
        }
      })
    }
  }
}

</script>

<style lang="scss" scoped>
.context-situation-card {
  margin: 10px;
  width: 300px;
  cursor: pointer;

  &.is-active {
    width: 100%;
    margin-bottom: 50px;
  }
}

</style>
