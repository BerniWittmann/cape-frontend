<template>
  <el-dialog :title="title" :visible.sync="showExtensionArea" width="70%">
    <el-collapse v-model="activeInjection" accordion>
      <el-collapse-item v-for="injectionMapping in injectionMappings" :key="injectionMapping.id" :name="injectionMapping.id || 'new'">
        <template slot="title">
          {{ getTitlePart(injectionMapping, 'contextSituation') }} <i class="title-icon el-icon-back"></i> {{ getTitlePart(injectionMapping, 'injectedProcess') }}
        </template>
        <injection-mapping  :injection-mapping="injectionMapping"></injection-mapping>
      </el-collapse-item>
    </el-collapse>
    <el-button plain icon="el-icon-plus" size="small" @click="addInjectionMapping()" id="add" v-if="noExistingNewInjection">
      {{ $t('injection_mapping.add') }}
    </el-button>
  </el-dialog>
</template>

<script>

import InjectionMapping from '@/components/InjectionMapping.vue'
import InjectionMappingModel from '@/models/injectionMapping.js'

/*
 * @vuese
 * @group Dialogs
 *
 * A Dialog to edit an Extension Area
 */
export default {
  name: 'ExtensionAreaEditDialog',
  components: {
    InjectionMapping
  },

  data() {
    return {
      activeInjection: ''
    }
  },

  computed: {
    activeProcess() {
      return this.$store.state.process.activeProcess
    },
    showExtensionArea: {
      get: function () {
        return !!this.activeProcess
      },
      set: function () {
        this.closeDialog()
      }
    },

    title() {
      return this.$route.params.title || this.$t('extension_area.title')
    },

    injectionMappings() {
      return this.$store.getters['injectionMapping/getInjectionMappings'](this.$route.params.processID, this.$route.params.extensionAreaID)
    },
    noExistingNewInjection() {
      return !(this.injectionMappings.filter(a => a.id === undefined).length > 0)
    }
  },

  methods: {
    closeDialog() {
      this.$router.back()
    },

    getTitlePart(injectionMapping, name) {
      if (!injectionMapping[name]) return this.$t('injection_mapping.undefined_' + name)
      return injectionMapping[name].name
    },
    addInjectionMapping() {
      this.$store.dispatch('injectionMapping/add', new InjectionMappingModel({ 'extension_area_id': this.$route.params.extensionAreaID, 'process_id': this.$route.params.processID })).then(() => {
        this.activeInjection = 'new'
      })
    }
  }
}
</script>

<style scoped lang="scss">
.title-icon {
  transform: rotate(180deg);
  margin-left: 10px;
  margin-right: 10px;
}
#add{
  margin-bottom: 10px;
  margin-top: 10px;
}
</style>
