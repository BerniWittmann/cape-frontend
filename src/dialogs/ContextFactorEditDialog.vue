<template>
  <el-dialog :title="activeContextFactor.name" :visible.sync="showContextFactorEdit" width="70%">
    <el-tabs type="border-card" @tab-click="updateStates">

      <el-tab-pane :label="$t('context_factor.edit.data_tab')">
        <el-row class="less-margin-top">
          <el-col>
            <el-form :model="contextFactorData" :rules="rules" ref="contextFactorForm" label-position="top"
                     label-width="120px" inline>
              <el-form-item :label="$t('context_factor.edit.name')" prop="name">
                <el-input v-model="contextFactorData.name"></el-input>
              </el-form-item>
              <el-form-item :label="$t('context_factor.edit.type')" prop="contextType">
                <el-select v-model="contextFactorData.contextType" placeholder="Select" value-key="id" clearable
                           @change="selectChange" ref="select">
                  <i :class="selectIconClass" slot="prefix" v-if="selectIconClass"></i>
                  <el-option
                          v-for="contextType in contextTypes"
                          :value="contextType"
                          :key="contextType.id"
                          :label="contextType.name">
                    <i class="context-type-icon" :class="'fa ' + contextType.icon"></i>
                    <span>{{ contextType.name }}</span>
                  </el-option>
                  <el-option
                          :value="$t('context_factor.none')"
                          :label="$t('context_factor.none')"></el-option>
                </el-select>
              </el-form-item>
              <br>
              <h4>{{ $t('context_factor.edit.attributes') }}</h4>
              <ul>
                <template v-for="(attr, idx) in contextFactorData.attributes">
                  <li :key="idx">
                    <el-form :model="attr" inline :rules="attributeRules" :ref="'contextAttributeForm' + idx">
                      <el-form-item prop="key">
                        <el-input v-model="attr.key" :placeholder="$t('context_factor.edit.attribute.key')"></el-input>
                      </el-form-item>
                      <el-form-item prop="value">
                        <input-type :value="attr.value" :type="attr.type"
                                    @change="data => handleAttributeChange(data, idx)"
                                    :placeholder="$t('context_factor.edit.attribute.value')"
                                    :ref="'contextAttributeValue' + idx"
                                    :type-placeholder="$t('context_factor.edit.attribute.type')"></input-type>
                      </el-form-item>
                      <el-tooltip :content="$t('context_factor.edit.attribute.remove')">
                        <el-button plain type="info" icon="el-icon-close" @click="removeAttribute(idx)"></el-button>
                      </el-tooltip>
                    </el-form>
                  </li>
                </template>
              </ul>
              <el-button plain icon="el-icon-plus" size="small" @click="addAttribute()">
                {{ $t('context_factor.edit.attribute.add') }}
              </el-button>
            </el-form>
          </el-col>
        </el-row>
      </el-tab-pane>

      <el-tab-pane :label="$t('context_factor.edit.states_tab')">
        <el-row :gutter="20">
          <el-col :span="24">
            <AttributeRules :contextFactor="contextFactorStatesData" ref="attributeRules"></AttributeRules>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>

    <el-row slot="footer" justify="end" :gutter="20">
      <el-col :span="8" id="left-align">
        <el-button @click="reset" type="danger" plain>
          {{ $t('context_factor.edit.reset') }}
        </el-button>
        <el-button type="danger" @click="deleteContextFactor()">
          {{ $t('context_factor.edit.delete') }}
        </el-button>
      </el-col>
      <el-col :span="8" :offset="8">
        <el-button-group>
          <el-button type="success" @click="save(false)" plain>{{ $t('context_factor.edit.apply') }}</el-button>
          <el-button type="success" @click="save(true)">{{ $t('context_factor.edit.save') }}</el-button>
        </el-button-group>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import ContextFactorService from '@/services/contextFactor'
import ContextFactor from '@/models/contextFactor'
import ContextAttribute from '@/models/contextAttribute'
import InputType from '@/components/InputType'
import AttributeRules from '@/components/context-factor/AttributeRules'

/*
 * @vuese
 * @group Dialogs
 *
 * A Dialog to edit a Context Factor
 */
export default {
  name: 'ContextFactorEditDialog',
  components: {
    InputType,
    AttributeRules
  },
  data() {
    return {
      contextFactorData: {},
      contextFactorStatesData: {},
      rules: {
        name: [
          { required: true, message: this.$t('context_factor.edit.validation.name.required'), trigger: 'blur' },
          { min: 3, message: this.$t('context_factor.edit.validation.name.min'), trigger: 'blur' }
        ]
      },
      attributeRules: {
        key: [
          { required: true, message: this.$t('context_factor.edit.validation.attribute.key.required'), trigger: 'blur' }
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
    },

    selectIconClass() {
      if (!this.contextFactorData.contextType) return ''
      const result = ['el-input__icon', 'fa', 'fa-fw']
      result.push(this.contextFactorData.contextType.icon)
      return result
    }
  },

  methods: {
    closeDialog() {
      this.$router.back()
    },

    save(close) {
      this.$refs.contextFactorForm.validate((valid) => {
        if (valid) {
          if (this.validateAttributes()) {
            this.contextFactorData.attributes.forEach((a, index) => {
              if (this.contextFactorStatesData.attributes[index] && a.type !== this.contextFactorStatesData.attributes[index].type) {
                // updates a type in case of changes
                this.contextFactorStatesData.attributes[index].type = a.type
              }
            }, this)
            this.$refs.attributeRules.convertFromTableData()
            const data = ContextFactor.create(this.contextFactorStatesData)
            // this way the objects are correctly typed
            data.attributes = this.contextFactorData.attributes
            data.id = this.contextFactorData.id
            data.parentID = this.contextFactorData.parentID
            data.contextType = this.contextFactorData.contextType
            data.name = this.contextFactorData.name

            ContextFactorService.update(data).then(result => {
              if (result && close) {
                this.closeDialog()
              } else {
                this.copyActiveContextFactorData()
                this.$refs.attributeRules.reRender()
              }
            })
          }
        }
      })
    },

    reset() {
      this.contextFactorData = { ...this.$store.state.contextFactor.contextFactors.filter(cf => cf.id === this.contextFactorData.id)[0] }
      this.resetAttributeForms()
      this.$refs.attributeRules.convertToTableData()

      this.resetAttributeForms()
      this.copyActiveContextFactorData()
      this.$refs.attributeRules.convertToTableData()
      this.$refs.attributeRules.reRender()
    },

    deleteContextFactor() {
      this.$confirm(this.$t('context_factor.delete.message'), this.$t('context_factor.delete.warning'), {
        confirmButtonText: this.$t('context_factor.delete.ok'),
        cancelButtonText: this.$t('context_factor.delete.cancel'),
        type: 'warning',
        cancelButtonClass: 'is-plain el-button--info',
        confirmButtonClass: 'el-button--danger'
      }).then(() => {
        ContextFactorService.remove(this.activeContextFactor).then(() => {
          this.$router.back()
          ContextFactorService.getAll()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('context_factor.delete.cancellation')
        })
      })
    },

    validateAttributes() {
      const count = this.contextFactorData.attributes.length
      let result = true
      const forms = []
      for (let i = 0; i < count; i++) {
        forms.push(this.$refs['contextAttributeForm' + i][0])
        forms.push(this.$refs['contextAttributeValue' + i][0])
      }
      forms.forEach((form) => {
        form.validate((valid) => {
          if (!valid) {
            result = false
          }
        })
      })
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
      this.contextFactorData.attributes.push(ContextAttribute.create({}))
    },

    removeAttribute(idx) {
      this.contextFactorData.attributes.splice(idx, 1)
      this.resetAttributeForms()
    },

    selectChange(selected) {
      if (selected === this.$t('context_factor.none')) this.contextFactorData.contextType = undefined
    },

    handleAttributeChange(data, idx) {
      this.contextFactorData.attributes[idx] = {
        ...this.contextFactorData.attributes[idx],
        ...data
      }
    },

    updateStates(tab) {
      if (tab.label === this.$t('context_factor.edit.data_tab')) {
        this.$refs.attributeRules.convertFromTableData()
      }
      if (tab.label === this.$t('context_factor.edit.states_tab')) {
        this.$refs.attributeRules.convertToTableData()
      }
    },

    copyActiveContextFactorData() {
      this.contextFactorData = { ...this.activeContextFactor }
      this.contextFactorStatesData = ContextFactor.create({ ...this.activeContextFactor })
      this.contextFactorStatesData.attributes.forEach(function (attribute, index) {
        attribute.id = this.contextFactorData.attributes[index].id
      }, this)
    }
  },

  beforeMount() {
    this.copyActiveContextFactorData()
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

ul {
  max-height: 300px;
  overflow: hidden;
  overflow-y: auto;
}

li {
  list-style-type: none;
}

.el-form-item {
  margin-bottom: 15px;
  width: 35%;
}

#left-align {
  text-align: left;
}

.less-margin-top {
  margin-top: -20px;
}

.el-input__icon.fa {
  margin-left: 5px;
}

</style>
<!-- if this is in the scoped style it does not work -->
<style>
.el-form-item__content {
  width: 100%;
}
</style>
