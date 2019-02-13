<template>
  <el-card :class="{ 'context-situation-card': true, 'is-active': isActive }"
           @click.native.stop="navigateToContextSituation" :shadow="shadowMode">
    <div slot="header" class="clearfix">
      <el-form ref="csForm" :model="contextSituationData" label-position="top" :rules="rules" status-icon inline
               @submit.native.prevent>
        <el-form-item class="use-space">
          <span v-if="!isActive">
            <span class="title">{{ contextSituation.name }}</span>
          </span>
          <span v-else>
            <span class="title" v-if="!nameInputVisible">{{ contextSituationData.name }}</span>
            <span v-else>
              <el-form-item prop="name">
                <el-input
                        v-model="contextSituationData.name"
                        ref="nameInput"
                        size="mini"
                        :placeholder="$t('context_situation.edit.name')"
                        @blur="hideInput"
                        @keyup.enter.native="hideInput"
                        @submit.native.prevent="hideInput"
                        class="input"
                ></el-input>
              </el-form-item>
            </span>
            <el-button
                    type="text"
                    icon="el-icon-edit"
                    @click="showInput"
                    v-show="isActive"
                    v-if="!nameInputVisible"
                    class="black-color tag-space"
            ></el-button>
          </span>
          <el-button v-if="isActive" style="float: right" type="text" icon="el-icon-close"
                     @click.native.stop="$emit('deactivate')"></el-button>
          <el-button v-if="!isActive" style="float: right" type="text"
                     icon="el-icon-arrow-right"></el-button>
        </el-form-item>
      </el-form>
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

export default {
  components: {
    ContextSituationRules,
    Tag,
    TagEditor
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
      nameInputVisible: false,
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

    showInput() {
      this.nameInputVisible = true
      this.$nextTick(_ => {
        this.$refs.nameInput.$refs.input.focus()
      })
    },

    hideInput() {
      this.$refs.csForm.validate((valid) => {
        if (valid) {
          this.nameInputVisible = false
        }
      })
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
      this.$refs.csForm.resetFields()
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

.input {
  width: 300px;
  margin-top: 10px;
}

.use-space {
  width: 100%;
}

.black-color {
  color: #000000;
}

</style>
