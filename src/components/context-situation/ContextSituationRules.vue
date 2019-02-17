<template>
  <input-edit class="context-situation-rules"
          :value="contextSituation.rules" size="mini" :rules="validationRules"
          :placeholder="$t('context_situation.edit.rules')"
  ></input-edit>
</template>

<script>
/* ============
 * ContextSituationRules
 * ============
 *
 *
 */
import InputEdit from '@/components/InputEdit.vue'

export default {
  components: {
    InputEdit
  },

  props: {
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
