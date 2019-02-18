<template>
  <el-row type="flex" justify="center">
    <el-col :span="8">
      <el-checkbox v-model="enableValidation" @change="setCookie" :label="$t('settings.process_modeler.enable_validation')" border></el-checkbox>
      <p><small>{{ $t('settings.process_modeler.enable_validation_help_text') }}</small></p>
    </el-col>
  </el-row>
</template>

<script>
/* ============
 * Process Modeler Settings Component
 * ============
 *
 * A component to edit the settings for the Process Modeler
 */

import { hasProcessModelerRulesEnabled } from '@/utils/helpers'

/*
 * @vuese
 * @group Components
 *
 * The Settings Tag to edit the settings for the Process Modeler
 */
export default {
  name: 'ProcessModelerSettings',
  data() {
    return {
      enableValidation: false
    }
  },

  methods: {
    getCookieValue() {
      this.enableValidation = hasProcessModelerRulesEnabled()
    },

    setCookie(val) {
      document.cookie = 'enableProcessValidation=' + val + '; expires=Fri, 31 Dec 2100 12:00:00 UTC; path=/'
      this.getCookieValue()
    }
  },

  beforeMount() {
    this.getCookieValue()
  }
}

</script>

<style scoped lang="scss">
</style>
