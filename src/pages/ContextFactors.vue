<template>
  <v-layout>
    <el-row justify="end" :gutter="20">
      <el-col :span="10">
      <el-form ref='newFactorForm' :model="newContextFactor" label-position="top" :rules="rules" status-icon inline
               @submit.native.prevent>
        <el-form-item prop="name">
          <el-input
                  :placeholder="$t('context_factor.new_context_factor_name')"
                  v-model="newContextFactor.name">
          </el-input>
        </el-form-item>
        <el-button icon="el-icon-plus" @click="createNew">{{ $t('context_factor.create_new') }}</el-button>
      </el-form>
      </el-col>
      <el-col :span="6" :offset="8">
        <el-input
                :placeholder="$t('context_factor.filter_placeholder')"
                v-model="filterText" clearable>
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="24">
        <el-tree ref="tree" :data="contextTree" :default-expand-all="true" accordion highlight-current
                 @node-drop="handleDrop" draggable :allow-drag="allowDrag" :filter-node-method="filterNode">
                <span class="custom-tree-node" slot-scope="{ node, data }">
                  <i :class="getIconClasses(data)"></i>
                  <span>{{ node.label }}</span>
                  <span class="align-right">
                    <el-button
                            type="text"
                            @click="edit(data)">
                      {{ $t('context_factor.edit.link')}}
                    </el-button>
                  </span>
                </span>
        </el-tree>
      </el-col>
    </el-row>
  </v-layout>
</template>

<script>
import DefaultLayout from '@/layouts/Default.vue'
import ContextFactor from '@/models/contextFactor'
import ContextFactorService from '@/services/contextFactor'

export default {
  components: {
    VLayout: DefaultLayout
  },

  data() {
    return {
      filterText: undefined,
      newContextFactor: {
        name: undefined
      },
      rules: {
        name: [
          { required: true, message: this.$t('context_factor.edit.validation.name.required'), trigger: 'blur' }
        ]
      }
    }
  },

  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },

  computed: {
    contextTree() {
      return this.$store.getters['contextFactor/contextFactorsTree']
    },
    hasMultipleRootElements() {
      return this.contextTree.length > 1
    }
  },

  methods: {
    edit(data) {
      this.$router.push({
        name: 'context_factors.edit',
        params: {
          contextFactorID: data.contextFactor.id
        }
      })
    },

    handleDrop(draggingNode, dropNode, dropType) {
      let newParentID
      if (dropType === 'inner') {
        newParentID = dropNode.data.contextFactor.id
      } else {
        newParentID = dropNode.data.contextFactor.parentID
      }
      draggingNode.data.contextFactor.parentID = newParentID
      ContextFactorService.update(draggingNode.data.contextFactor)
    },

    allowDrag(draggingNode) {
      return this.hasMultipleRootElements || draggingNode.data.contextFactor.parentID
    },

    filterNode(value, data) {
      if (!value || value.length === 0) return true
      return data.label.toLowerCase().includes(value.toLowerCase())
    },

    getIconClasses(data) {
      const result = ['fa', 'fa-fw']
      if (data.contextFactor && data.contextFactor.contextType && data.contextFactor.contextType.icon) {
        result.push(data.contextFactor.contextType.icon)
      }
      return result.join(' ')
    },

    createNew() {
      this.$refs.newFactorForm.validate((valid) => {
        if (valid) {
          const selNode = this.$refs.tree.getCurrentNode()

          let data
          if (selNode) {
            data = new ContextFactor({ name: this.newContextFactor.name, parentID: selNode.contextFactor.id })
          } else {
            data = new ContextFactor({ name: this.newContextFactor.name })
          }

          ContextFactorService.create(data).then(() => {
            this.$router.push({
              name: 'context_factors.edit',
              params: {
                contextFactorID: this.$store.state.contextFactor.contextFactors[this.$store.state.contextFactor.contextFactors.length - 1].id
              }
            })
          })
        }
      })
    }
  }
}

</script>

<style scoped lang="scss">
.custom-tree-node {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: row;

  .align-right {
    margin-left: auto;
    margin-right: 15px;
  }
}

.el-row {
  margin-bottom: 10px;

  &:last-of-type {
    margin-bottom: 0;
  }
}

#move_left {
  margin-left: -20px;
}

</style>
