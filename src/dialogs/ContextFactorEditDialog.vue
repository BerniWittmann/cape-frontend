<template>
  <el-dialog :title="activeContextFactor.name" :visible.sync="showContextFactorEdit">
    <el-row>
      <el-col>
        <el-form :model="contextFactorData" :rules="rules" ref="contextFactorForm">
          <el-form-item :label="$t('context_factor.edit.name')" prop="name">
            <el-input v-model="contextFactorData.name"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row slot="footer">
      <el-col>
        <el-button type="text" @click="closeDialog">{{ $t('context_factor.edit.cancel') }}</el-button>
        <el-button type="success" @click="save">{{ $t('context_factor.edit.save') }}</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
/* ============
 * Context Factor Edit Dialog
 * ============
 *
 * Allows Editing of a Context Factore
 */
import ContextFactorService from '@/services/contextFactor'

export default {
  data() {
    return {
      contextFactorData: {},
      rules: {
        name: [
          { required: true, message: this.$t('context_factor.edit.validation.name.required'), trigger: 'blur' },
          { min: 3, message: this.$t('context_factor.edit.validation.name.min'), trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    activeContextFactor() {
      return this.$store.state.contextFactor.activeContextFactor
    },
    showContextFactorEdit: {
      get: function () {
        return !!this.activeContextFactor
      },
      set: function () {
        this.closeDialog()
      }
    }
  },

  methods: {
    closeDialog() {
      this.$router.back()
    },

    save() {
      this.$refs.contextFactorForm.validate((valid) => {
        if (valid) {
          ContextFactorService.update(this.contextFactorData).then(result => {
            if (result) {
              this.closeDialog()
            }
          })
        }
      })
    }
  },

  beforeMount() {
    this.contextFactorData = { ...this.activeContextFactor }
  }
}
</script>

<style scoped lang="scss">
</style>
