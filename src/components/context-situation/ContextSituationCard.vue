<template>
  <el-card :class="{ 'context-situation-card': true, 'is-active': isActive }"
           @click.native.stop="navigateToContextSituation" :shadow="shadowMode">
    <div slot="header" class="clearfix">
      <input-edit
              :value="contextSituationData.name" :rules="rules.name"
              :placeholder="$t('context_situation.edit.name')"
      ></input-edit>
    </div>
    <div class="tags" v-if="isActive">
        <tag-editor v-model="contextSituationData.tags" @change="() => {}"></tag-editor>
    </div>
    <div class="tags" v-else>
      <tag v-for="tag in contextSituation.tags" :tag="tag" size="medium" :key="tag.id"></tag>
    </div>

    <ContextSituationRules v-if="isActive" :context-situation="contextSituationData"
                           class="top-space"></ContextSituationRules>

    <div v-if="isActive" class="top-space">
      <el-button type="danger" plain @click="resetCS" size="medium">
        {{ $t('context_situation.edit.reset') }}
      </el-button>
      <el-button type="danger" @click="deleteCS" size="medium">
        {{ $t('context_situation.edit.delete') }}
      </el-button>
      <el-button style="float: right" type="success" @click="saveCS" size="medium">{{
        $t('context_situation.edit.save') }}
      </el-button>
    </div>
  </el-card>
</template>

<script>
/* ============
 * Context Situation Card Component
 * ============
 *
 * A Card to view a single Context Situation
 */
import Tag from '@/components/Tag'
import TagEditor from '@/components/TagEditor'
import ContextSituationRules from './ContextSituationRules'
import ContextSituationService from '@/services/contextSituation'
import InputEdit from '@/components/InputEdit.vue'

export default {
  components: {
    ContextSituationRules,
    Tag,
    TagEditor,
    InputEdit
  },

  props: {
    contextSituation: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      contextSituationData: {},
      rules: {
        name: [
          { required: true, message: this.$t('context_situation.edit.validation.name.required'), trigger: 'blur' }
        ]
      }
    }
  },

  computed: {
    activeContextSituation() {
      return this.$store.state.contextSituation.activeContextSituation
    },

    isActive() {
      return this.activeContextSituation && this.activeContextSituation.id === this.contextSituation.id
    },

    shadowMode() {
      return this.isActive ? 'always' : 'hover'
    }
  },

  methods: {
    navigateToContextSituation() {
      if (!this.isActive) {
        this.contextSituationData = this.copyContextSituation(this.contextSituation)
        this.$router.push({
          name: 'context_situations.single',
          params: {
            contextSituationID: this.contextSituation.id
          }
        })
      }
    },

    saveCS() {
      // validation is done because of the way the input works, need to be updated if rules are no input anymore
      const data = { ...this.contextSituationData }
      ContextSituationService.update(data).then(result => {
        if (result) {
          this.$emit('deactivate')
        }
      })
    },

    resetCS() {
      this.contextSituationData = { ...this.contextSituation }
    },

    deleteCS() {
      this.$confirm(this.$t('context_situation.delete.message'), this.$t('context_situation.delete.warning'), {
        confirmButtonText: this.$t('context_situation.delete.ok'),
        cancelButtonText: this.$t('context_situation.delete.cancel'),
        type: 'warning',
        cancelButtonClass: 'is-plain el-button--info',
        confirmButtonClass: 'el-button--danger'
      }).then(() => {
        ContextSituationService.remove(this.activeContextSituation).then(() => {
          this.$router.back()
          ContextSituationService.getAll()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('context_situation.delete.cancellation')
        })
      })
    },

    copyContextSituation(csIn) {
      return {
        id: csIn.id,
        name: csIn.name,
        tags: csIn.tags.slice(),
        rules: csIn.rules
      }
    }
  },

  beforeMount() {
    this.contextSituationData = this.copyContextSituation(this.contextSituation)
  }
}

</script>

<style lang="scss" scoped>
.context-situation-card {
  margin: 10px;
  width: 300px;
  cursor: pointer;

  &.is-active {
    width: 100%;
    margin-bottom: 50px;
  }
}

.tag-space {
  margin-left: 5px;
}

.top-space {
  margin-top: 20px;
}

.title {
  font-size: large;
  font-weight: bold;
}

.el-form-item {
  margin-top: -10px;
  margin-bottom: -10px;
}

</style>
