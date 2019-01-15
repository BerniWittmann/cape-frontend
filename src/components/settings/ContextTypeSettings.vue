<template>
  <el-container>
    <el-aside width="180px">

      <el-table
              class="el-table---disable-row-hover"
              :data="contextTypes.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
              :header-cell-style="headerStyle"
              :cell-style="cellStyle"
              height="420">

        <el-table-column
                prop="contextTypes">

          <template slot="header" slot-scope="scope">
            <el-input
                    v-model="search"
                    size="mini"
                    :placeholder="$t('settings.context_type.search')"/>
          </template>

          <template slot-scope="scope">
            <context-type :contextType="scope.row" :closable="deletable"
                          @close="deleteContextType(scope.row)"></context-type>
          </template>

        </el-table-column>
      </el-table>

      <el-switch
              v-model="deletable"
              :active-text="$t('settings.context_type.deletable')">
      </el-switch>
    </el-aside>
    <el-main>
      <h2>{{ $t('settings.context_type.new') }}</h2>

      <context-type :contextType="contextType"></context-type>

      <el-form ref="contextTypeForm" :model="contextType" label-position="top" :rules="rules">

        <el-form-item :label="$t('settings.context_type.name')" prop="name" class="context-input">
          <el-input v-model="contextType.name"
                    @keyup.enter.native="submit"
                    @submit.native.prevent="submit"></el-input>
        </el-form-item>

        <el-form-item :label="$t('settings.context_type.icon')" prop="icon">
          <el-popover
                  placement="bottom"
                  width="420"
                  trigger="click"
                  v-model="showPopover">
            <f-a-icon-picker @click="showIcon" @close="showPopover = false"></f-a-icon-picker>
            <el-button id="context-type-icon" slot="reference" icon="el-icon-arrow-down">
              <i class="fa fa-lg" :class="contextType.icon"></i>
            </el-button>
          </el-popover>
        </el-form-item>

        <el-form-item>
          <el-button type="success" @click.native="submit">{{ $t('settings.context_type.submit') }}</el-button>
          <el-button type="danger" plain @click.native="reset">{{ $t('settings.context_type.reset') }}</el-button>
        </el-form-item>

      </el-form>
    </el-main>
  </el-container>
</template>

<script>
/* ============
 * ContextTypeSettings
 * ============
 *
 *  A component to edit the Context Types
 *
 */

import ContextType from '@/models/contextType'
import contextTypeService from '@/services/contextType'

import ContextTypeComponent from '@/components/ContextType'
import FAIconPicker from '@/components/settings/FAIconPicker'

export default {
  components: {
    ContextType: ContextTypeComponent,
    FAIconPicker: FAIconPicker
  },

  data() {
    return {
      search: '',
      deletable: false,
      showPopover: false,
      contextType: {
        name: undefined,
        icon: 'fa-heart'
      },
      rules: {
        name: [
          { required: true, message: this.$t('settings.context_type.validation.name.required'), trigger: 'blur' }
        ]
      }
    }
  },

  computed: {
    contextTypes() {
      return this.$store.state.contextType.contextTypes
    },

    headerStyle() {
      return { border: '0', padding: '0' }
    },
    cellStyle() {
      return { border: '0', paddingRight: '5px', paddingTop: '0', paddingBottom: '5px', float: 'right' }
    }
  },

  methods: {
    updateLayoutTable() {
      // necessary to update the layout and fit the ContextTypes right, doLayout() not working
      // resets deletable back to false
      this.deletable = true
      this.deletable = false
    },

    showIcon(icon) {
      this.contextType.icon = icon
    },

    submit() {
      // validation of icon not necessary because no icon can't be chosen and default is given
      this.$refs.contextTypeForm.validate((valid) => {
        if (valid) {
          const contextType = new ContextType(this.contextType)
          contextTypeService.create(contextType).then(() => {
            this.reset()
          })
        }
      })
    },

    reset() {
      this.contextType = {
        name: undefined,
        icon: 'fa-heart'
      }
      this.$refs.contextTypeForm.resetFields()
    },

    deleteContextType(contextType) {
      contextTypeService.remove(contextType)
    }
  }
}

</script>
<style scoped lang="scss">

.el-input {
  padding-left: 0;
}

.el-switch {
  margin-top: 10px;
}

#context-type-icon {
  color: $primary_color;
  margin-bottom: 40px;
}

.el-form {
  margin: auto;
  width: 420px;
}

.fa-lg {
  padding-left: 10px;
}

h2 {
  margin-top: 0px;
}

.el-main {
  padding-top: 0px;
}

.el-main > .context-type {
  margin-bottom: 15px;
}

</style>
