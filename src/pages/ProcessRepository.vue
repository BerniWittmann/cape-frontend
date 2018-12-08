<template>
  <v-layout>
    <el-row justify="end" :gutter="20">
      <el-col :span="12">
        <router-link :to="{name: 'process.new'}">
          <el-button icon="el-icon-plus">{{ $t('process.create_new') }}</el-button>
        </router-link>
        <el-upload class="process-import-upload"
                   :action="uploadURL"
                   accept=".bpmn,.xml"
                   drag ref="processImportUpload"
                   :on-success="handleImportSuccess"
                   :on-error="handleImportError">
          <el-button icon="el-icon-upload">{{ $t('process.import.button_text') }}</el-button>
        </el-upload>
      </el-col>
      <el-col :span="6" :offset="4">
        <el-input
                :placeholder="$t('process.search')"
                v-model="search">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="24">
        <el-table
                :data="processes"
                :default-sort="{prop: 'lastEditedAt', order: 'descending'}"
                @row-click="navigateToPreview">
          <el-table-column
                  prop="name"
                  :label="$t('process.name')"
                  sortable
                  :sort-method=nameCompare>
          </el-table-column>
          <el-table-column
                  prop="createdAt"
                  :label="$t('process.created_at')"
                  sortable>
            <template slot-scope="scope">
              {{ formatDateTime(scope.row.createdAt) }}
            </template>
          </el-table-column>
          <el-table-column
                  prop="lastEditedAt"
                  :label="$t('process.last_edited_at')"
                  sortable>
            <template slot-scope="scope">
              {{ formatDateTime(scope.row.lastEditedAt) }}
            </template>
          </el-table-column>
          <el-table-column
                  prop="tags"
                  :label="$t('process.tags')"
                  :filters="availableTags"
                  :filter-method="filterTag"
                  filter-placement="bottom-end">
            <template slot-scope="scope">
              <tag v-for="tag in scope.row.tags" :key="tag.id" :tag="tag" class="row-tag"></tag>
            </template>
          </el-table-column>
          <el-table-column
                  width="60">
            <template slot-scope="scope">
              <el-tooltip :content="$t('process.edit.tooltip')" placement="top">
                <el-button
                        @click.native.prevent.stop="edit(scope.row)"
                        circle size="mini"
                        icon="el-icon-edit"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </v-layout>
</template>

<script>
/* ============
 * Process Repository Page
 * ============
 *
 * The Process Repository Page
 */
import { DATE_TIME_FORMAT } from '@/utils/constants'
import DefaultLayout from '@/layouts/Default.vue'
import Tag from '@/components/Tag.vue'

export default {
  components: {
    VLayout: DefaultLayout,
    Tag
  },

  data() {
    return {
      search: ''
    }
  },

  computed: {
    allProcesses() {
      return this.$store.state.process.processes
    },

    processes() {
      return this.allProcesses.filter(p => {
        if (!this.search || this.search.length === 0) return true

        return p.name.toLowerCase().includes(this.search.toLowerCase())
      })
    },

    availableTags() {
      let tags = {}

      this.allProcesses.forEach(p => {
        p.tags.forEach(t => {
          if (!tags[t.id]) {
            tags[t.id] = { value: t.id, text: t.name }
          }
        })
      })

      return Object.values(tags)
    },

    uploadURL() {
      return process.env.VUE_APP_API_LOCATION + 'processes/get_process_data_from_file'
    }
  },

  methods: {
    formatDateTime(datetimeObj) {
      return datetimeObj.format(DATE_TIME_FORMAT)
    },

    filterTag(value, row) {
      return row.tags.find(t => t.id === value)
    },

    edit(process) {
      this.$router.push({
        name: 'process.edit',
        params: {
          processID: process.id
        }
      })
    },

    navigateToPreview(process) {
      this.$router.push({
        name: 'process.preview',
        params: {
          processID: process.id
        }
      })
    },
    nameCompare(a, b) {
      if (!a || !a.name || !b || !b.name) return 0
      const lca = a.name.toLowerCase()
      const lcb = b.name.toLowerCase()
      return lca > lcb ? 1 : (lca < lcb ? -1 : 0)
    },

    handleImportSuccess(data) {
      this.$router.push({
        name: 'process.new',
        params: {
          processData: data
        }
      })
      this.$refs.processImportUpload.clearFiles()
    },

    handleImportError() {
      this.$message.error(this.$t('process.import.failed'))
    }
  }
}
</script>

<style lang="scss">
.process-import-upload {
  display: inline-flex;
  margin-left: 10px;

  .el-upload-dragger {
    .el-icon-upload {
      font-size: 14px;
      line-height: 1;
      margin: 0;
    }

    border: none;
    width: auto;
    height: auto;
  }
}
</style>
