<template>
  <input-edit class="context-situation-rules"
          :value="contextSituation.rules" size="mini" :rules="validationRules"
          :placeholder="$t('context_situation.edit.rules')"
  ></input-edit>
</template>

<script>
import InputEdit from '@/components/InputEdit.vue'

/*
 * @vuese
 * @group Components
 *
 * A Component for modelling the Rules of a Context Situation
 */
export default {
  name: 'ContextSituationRules',
  components: {
    InputEdit
  },

  props: {
    // The Context Situation Object
    contextSituation: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      validationRules: [
        { required: true, message: this.$t('context_situation.edit.validation.rules.required'), trigger: 'blur' }
      ]
    }
  }
}
</script>

<style scoped lang="scss">
</style>
