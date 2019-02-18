<template>
  <el-container>
    <el-aside width="240px">
      <el-table
              class="el-table---disable-row-hover"
              :data="tags.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
              :header-cell-style="headerStyle"
              :cell-style="cellStyle"
              height="420">

        <el-table-column
                prop="tags">

          <template slot="header" slot-scope="scope">
            <el-input
                    v-model="search"
                    size="mini"
                    :placeholder="$t('settings.tag.search')">
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </template>

          <template slot-scope="scope">
            <tag :tag="scope.row" :closable="deletable"
                          @close="deleteTag(scope.row)"></tag>
          </template>

        </el-table-column>
      </el-table>

      <el-switch
              v-model="deletable"
              :active-text="$t('settings.tag.deletable')">
      </el-switch>
    </el-aside>
    <el-main>

      <h3>{{ $t('settings.tag.new') }}</h3>

      <tag :tag="tag"></tag>

      <el-form ref="tagForm" :model="tag" label-position="top" :rules="rules">

        <el-form-item :label="$t('settings.tag.name')" prop="name">
          <el-input v-model="tag.name"
                    @keyup.enter.native="submit"
                    @submit.native.prevent="submit"></el-input>
        </el-form-item>

        <el-form-item :label="$t('settings.tag.color')" prop="color">
          <el-color-picker v-model="tag.color"></el-color-picker>
        </el-form-item>

        <el-form-item>
          <el-button type="success" @click.native="submit">{{ $t('settings.tag.submit') }}</el-button>
          <el-button type="danger" plain @click.native="reset">{{ $t('settings.tag.reset') }}</el-button>
        </el-form-item>

      </el-form>
    </el-main>
  </el-container>
</template>

<script>
import { DEFAULT_TAG_COLOR } from '@/utils/constants'
import Tag from '@/models/tag'
import tagService from '@/services/tag'

import TagComponent from '@/components/Tag.vue'

/*
 * @vuese
 * @group Components
 *
 * A Settings Tab to edit the tags
 */
export default {
  name: 'TagSettings',
  components: {
    Tag: TagComponent
  },

  data() {
    return {
      search: '',
      deletable: false,
      tag: {
        name: undefined,
        color: DEFAULT_TAG_COLOR
      },
      rules: {
        name: [
          { required: true, message: this.$t('settings.tag.validation.name.required'), trigger: 'blur' }
        ],
        color: [
          { required: true, message: this.$t('settings.tag.validation.color.required'), trigger: 'blur' }
        ]
      }
    }
  },

  methods: {
    // @vuese
    // Update the Table Layout
    updateLayoutTable() {
      // necessary to update the layout and fit the ContextTypes right, doLayout() not working
      // resets deletable back to false
      this.deletable = true
      this.deletable = false
    },

    submit() {
      this.$refs.tagForm.validate((valid) => {
        if (valid) {
          const tag = new Tag(this.tag)
          tagService.create(tag).then(() => {
            this.reset()
          })
        }
      })
    },

    reset() {
      this.tag = {
        name: undefined,
        color: DEFAULT_TAG_COLOR
      }
      this.$refs.tagForm.resetFields()
    },

    deleteTag(tag) {
      tagService.remove(tag)
    }
  },

  computed: {
    tags() {
      return this.$store.state.tag.tags
    },

    headerStyle() {
      return { border: '0', padding: '0' }
    },
    cellStyle() {
      return { border: '0', paddingRight: '5px', paddingTop: '0', paddingBottom: '5px', float: 'right' }
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

.el-form {
  margin: auto;
  width: 420px;
}

h2 {
  margin-top: 0px;
}

.el-main {
  padding-top: 0px;
}

</style>
