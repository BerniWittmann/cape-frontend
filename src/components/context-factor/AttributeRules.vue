<template>
  <div class="attr-rules-margin">
    <div v-if="attrExists">
      <el-row :gutter="20">
        <el-form ref='newStateForm' :model="newState" label-position="top" :rules="rules" status-icon inline
                 @submit.native.prevent>
          <el-form-item prop="stateName">
            <el-input class="input" ref="stateInput" size="small"
                      v-model="newState.stateName"
                      :placeholder="$t('context_factor.edit.states.name')"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="b-margin" icon="el-icon-plus" @click="addNewState" size="small">
              {{ $t('context_factor.edit.states.add') }}
            </el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row :gutter="20">
        <el-table :data="tableData" border>

          <el-table-column
                  v-for="(ca, index) in contextFactor.attributes" :prop="ca.id"
                  align="center" :key="index" :resizable="false"
                  :min-width="200">
            <template slot="header" slot-scope="scope">
              <span v-if="show">{{ ca.key }}</span>
            </template>
            <template slot-scope="scope">
              <RulesCell v-if="show" :value="scope.row[ca.id]" :type="ca.type"
                         @change="(nv) => {scope.row[ca.id] = nv}"></RulesCell>
            </template>
          </el-table-column>

          <el-table-column
                  :label="$t('context_factor.edit.state')"
                  sortable
                  :sort-method=nameCompare
                  fixed="right"
                  align="center"
                  :min-width="150"
                  :resizable="false"
                  class-name="state-column">
            <template slot-scope="scope">
              <div class="parent">
                <input-edit class="state-input" :value="scope.row.state" @change="(nst) => {scope.row.state = nst}"
                            :rules="rules.stateName"
                            size="mini"></input-edit>
                <span class="btn">
              <el-button size="mini" icon="el-icon-delete" type="danger" class="delete-btn"
                         @click="deleteState(scope.$index)"></el-button>
            </span></div>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </div>
    <div v-else>
      <i class="el-icon-warning"></i>
      <span>{{ $t('context_factor.edit.states.no_attributes') }}</span>
    </div>
  </div>
</template>

<script>
/* ============
 * AttributeRules
 * ============
 *
 *  The component to allow to view and edit the Attributes and Rules for the States of a Context Factor
 */

import RulesCell from '@/components/context-factor/RulesCell'
import InputEdit from '@/components/InputEdit.vue'

/*
 * @vuese
 * @group Components/Context-Factor
 *
 * The component to allow to view and edit the Attributes and Rules for the States of a Context Factor
 */

export default {
  name: 'AttributeRules',
  components: {
    RulesCell,
    InputEdit
  },

  props: {
    // gets the Context Factor
    contextFactor: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      // Data in Backend
      newState: {
        stateName: undefined
      },
      rules: {
        stateName: [
          { required: true, message: this.$t('context_factor.edit.validation.stateName.required'), trigger: 'blur' }
        ]
      },
      // Data for Table used in Frontend, after Parsing
      tableData: [],
      show: true
    }
  },

  computed: {},

  methods: {
    attrExists() {
      return this.contextFactor.attributes.length > 0
    },

    addNewState() {
      this.$refs.newStateForm.validate((valid) => {
        if (valid) {
          let newRow = { state: this.newState.stateName }
          for (let ca of this.contextFactor.attributes) {
            newRow[ca.id] = ''
          }
          this.tableData.push(newRow)
          this.newState.stateName = ''
        }
      })
    },

    convertToTableData() {
      // on tab click
      if (this.contextFactor.contextRules !== undefined) {
        let tableD = []
        for (let i = 0; i < this.contextFactor.contextRules.length; i++) {
          let row = { state: this.contextFactor.contextRules[i].state }
          for (let cr of this.contextFactor.contextRules[i].rule.split('&&')) {
            // possible separators are: == or <= or >=
            if (cr.indexOf('==') >= 0) {
              let ct = cr.split('==')[0]
              row[ct] = cr.split('==')[1]
            } else {
              if (cr.indexOf('<=') >= 0) {
                let ct = cr.split('<=')[0]
                row[ct] = (row[ct] !== undefined) ? row[ct] + cr.split('<=')[1] : '-' + cr.split('<=')[1]
              }
              if (cr.indexOf('>=') >= 0) {
                let ct = cr.split('>=')[0]
                row[ct] = (row[ct] !== undefined) ? cr.split('>=')[1] + row[ct] : cr.split('>=')[1] + '-'
              }
            }
          }
          tableD.push(row)
        }
        this.tableData = tableD
      }
    },

    nameCompare(a, b) {
      if (!a || !a.state || !b || !b.state) return 0
      const lca = a.state.toLowerCase()
      const lcb = b.state.toLowerCase()
      return lca > lcb ? 1 : (lca < lcb ? -1 : 0)
    },

    convertFromTableData() {
      // on save and tab click
      let cRules = []
      for (let cs of this.tableData) {
        let cr = {
          state: cs.state,
          rule: ''
        }
        for (let ca of this.contextFactor.attributes) {
          if (cs[ca.id] !== undefined && cs[ca.id].length > 0) {
            if (cr.rule.length > 0) {
              cr.rule += '&&'
            }
            switch (ca.type) {
              case 'Boolean':
                cr.rule += ca.id + '==' + cs[ca.id]
                break
              case 'String':
                cr.rule += ca.id + '==' + cs[ca.id]
                break
              default:
                let sPos = cs[ca.id].indexOf('-')
                if (sPos < 0) {
                  if (cs[ca.id] + '' !== 'undefined') {
                    cr.rule += ca.id + '==' + cs[ca.id]
                  }
                } else {
                  let ct = cs[ca.id].split('-')
                  if (ct[0] === ct[1]) {
                    if (ct[0] + '' !== 'undefined') {
                      cr.rule += ca.id + '==' + ct[0]
                    }
                  } else {
                    let k = 0
                    for (let i = 0; i < ct.length; i++) {
                      if (ct[i].length > 0) {
                        if (k > 0) {
                          cr.rule += '&&'
                        }
                        if (cs[ca.id].indexOf(ct[i]) < sPos) {
                          // >=
                          if (ct[i] + '' !== 'undefined') {
                            cr.rule += ca.id + '>=' + ct[i]
                          }
                          k++
                        } else {
                          // <=
                          if (ct[i] + '' !== 'undefined') {
                            cr.rule += ca.id + '<=' + ct[i]
                          }
                          k++
                        }
                      }
                    }
                  }
                }
            }
          }
        }
        cRules.push(cr)
      }
      this.contextFactor.contextRules = cRules
    },

    deleteState(stateIndex) {
      this.$confirm(this.$t('context_factor.edit.states.delete.message'), this.$t('context_factor.edit.states.delete.warning'), {
        confirmButtonText: this.$t('context_factor.edit.states.delete.ok'),
        cancelButtonText: this.$t('context_factor.edit.states.delete.cancel'),
        type: 'warning',
        cancelButtonClass: 'is-plain el-button--info',
        confirmButtonClass: 'el-button--danger'
      }).then(() => {
        this.tableData.splice(stateIndex, 1)
        this.convertFromTableData()
        this.$message({
          type: 'success',
          message: this.$t('context_factor.edit.states.delete.confirmation')
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('context_factor.edit.states.delete.cancellation')
        })
      })
    },

    reRender() {
      // needed to ensure that data shown is updated
      this.show = false
      this.$nextTick(() => {
        this.show = true
        this.$nextTick(() => {
        })
      })
    }
  },

  beforeMount() {
    this.convertToTableData()
  }
}
</script>

<style scoped lang="scss">

.attr-rules-margin {
  margin-left: 10px;
  margin-right: 10px;
}

.state-input {
  width: 100%;
}

.parent {
  display: flex;
}

.btn {
  display: inline-block;
  text-align: right;
  align-self: center;
}

.delete-btn {
  padding: 4px;
}

</style>
<style>
.el-table .state-column {
  background-color: #f5f6fa;
}
</style>
