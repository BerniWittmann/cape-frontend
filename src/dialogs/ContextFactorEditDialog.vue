<template>
  <el-dialog :title="activeContextFactor.name" :visible.sync="showContextFactorEdit">
    <el-row>
      <el-col>
        <el-form :model="contextFactorData" :rules="rules" ref="contextFactorForm" label-position="left" label-width="120px">
          <el-form-item :label="$t('context_factor.edit.name')" prop="name">
            <el-input v-model="contextFactorData.name"></el-input>
          </el-form-item>
          <el-form-item :label="$t('context_factor.edit.type')" prop="contextType">
            <el-select v-model="contextFactorData.contextType" placeholder="Select" value-key="id" clearable>
              <el-option
                      v-for="contextType in contextTypes"
                      :value="contextType"
                      :key="contextType.id"
                      :label="contextType.name">
                <i class="context-type-icon" :class="'fa ' + contextType.icon"></i>
                <span>{{ contextType.name }}</span>
              </el-option>
            </el-select>
          </el-form-item>

          <br>
          <h4>{{ $t('context_factor.edit.attributes') }}</h4>
          <el-form v-for="(attr, idx) in contextFactorData.attributes" :key="idx" :model="attr" inline :rules="attributeRules" :ref="'contextAttributeForm' + idx">
            <el-form-item prop="key">
              <el-input v-model="attr.key" :placeholder="$t('context_factor.edit.attribute.key')"></el-input>
            </el-form-item>
            <el-form-item prop="value">
              <el-input v-model="attr.value" :placeholder="$t('context_factor.edit.attribute.value')"></el-input>
            </el-form-item>
            <el-tooltip :content="$t('context_factor.edit.attribute.remove')">
              <el-button plain type="info" icon="el-icon-close" @click="removeAttribute(idx)"></el-button>
            </el-tooltip>
          </el-form>
          <el-button plain icon="el-icon-plus" @click="addAttribute()">
            {{ $t('context_factor.edit.attribute.add') }}
          </el-button>
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
import ContextFactor from '@/models/contextFactor'
import ContextAttribute from '@/models/contextAttribute'

export default {
  data() {
    return {
      contextFactorData: {},
      rules: {
        name: [
          { required: true, message: this.$t('context_factor.edit.validation.name.required'), trigger: 'blur' },
          { min: 3, message: this.$t('context_factor.edit.validation.name.min'), trigger: 'blur' }
        ]
      },
      attributeRules: {
        key: [
          { required: true, message: this.$t('context_factor.edit.validation.attribute.key.required'), trigger: 'blur' }
        ],
        value: [
          { required: true, message: this.$t('context_factor.edit.validation.attribute.value.required'), trigger: 'blur' }
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
    },
    contextTypes() {
      return this.$store.state.contextType.contextTypes
    }
  },

  methods: {
    closeDialog() {
      this.$router.back()
    },

    save() {
      this.$refs.contextFactorForm.validate((valid) => {
        if (valid) {
          if (this.validateAttributes()) {
            const data = ContextFactor.create(this.contextFactorData)
            data.id = this.contextFactorData.id
            data.parentID = this.contextFactorData.parentID
            if (this.contextFactorData.contextType) {
              data.contextType.id = this.contextFactorData.contextType.id
            }
            ContextFactorService.update(data).then(result => {
              if (result) {
                this.closeDialog()
              }
            })
          }
        }
      })
    },

    validateAttributes() {
      const count = this.contextFactorData.attributes.length
      let result = true
      for (let i = 0; i < count; i++) {
        const form = this.$refs['contextAttributeForm' + i][0]
        form.validate((valid) => {
          if (!valid) {
            result = false
          }
        })
      }
      return result
    },

    resetAttributeForms() {
      const count = this.contextFactorData.attributes.length
      for (let i = 0; i < count; i++) {
        const form = this.$refs['contextAttributeForm' + i][0]
        form.resetFields()
      }
    },

    addAttribute() {
      this.contextFactorData.attributes.push(new ContextAttribute({}))
    },

    removeAttribute(idx) {
      this.contextFactorData.attributes.splice(idx, 1)
      this.resetAttributeForms()
    }
  },

  beforeMount() {
    this.contextFactorData = { ...this.activeContextFactor }
  }
}
</script>

<style scoped lang="scss">
.context-type-icon {
  margin-right: 10px;
}
input {
  width: 80%;
}
</style>
