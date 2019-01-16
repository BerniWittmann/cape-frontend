<template>
  <v-layout>
    <el-row>
      <el-col :span="20" :offset="2">
        <h3>{{$t('context_factor.title')}}</h3>
        <el-row>
          <el-col>
            <el-input
                    :placeholder="$t('context_factor.filter_placeholder')"
                    v-model="filterText" clearable>
            </el-input>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-tree ref="tree" :data="contextTree" :default-expand-all="true" accordion
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
      </el-col>
    </el-row>
  </v-layout>
</template>

<script>
import DefaultLayout from '@/layouts/Default.vue'
import ContextFactorService from '@/services/contextFactor'

export default {
  components: {
    VLayout: DefaultLayout
  },
  data() {
    return {
      filterText: undefined
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
</style>
