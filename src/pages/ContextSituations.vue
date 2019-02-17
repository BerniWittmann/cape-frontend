<template>
  <v-layout>
    <el-row justify="end" :gutter="20">
      <el-col :span="16">
        <el-form ref='newFactorForm' :model="newContextSituation" label-position="top" :rules="rules" status-icon inline
                 @submit.native.prevent>
          <el-form-item prop="name">
            <el-input
                    :placeholder="$t('context_situation.new_context_situation_name')"
                    v-model="newContextSituation.name">
            </el-input>
          </el-form-item>
          <el-button icon="el-icon-plus" @click="createNew">{{ $t('context_situation.create_new') }}</el-button>
        </el-form>
      </el-col>
      <el-col :span="3">
        <el-select v-if="tags.length > 0"
                :placeholder="$t('context_situation.select_placeholder')"
                v-model="selectedTags" clearable multiple collapse-tags>
          <i slot="prefix" class="el-input__icon el-icon-view"></i>
          <el-option v-for="tag in tags" :key="tag.id" :label="tag.name" :value="tag.id">
            <Tag :tag="tag" size="mini"></Tag>
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="5">
        <el-input
                :placeholder="$t('context_situation.filter_placeholder')"
                v-model="filterText" clearable>
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </el-col>
    </el-row>
    <el-row :gutter="20" @click.native="unsetActiveContextSituation" ref="context-situation-cards">
      <el-col :span="24">
        <transition-group tag="div" name="context-situation-cards" class="context-situation-cards">
          <context-situation-card v-for="situation in contextSituations"
                                  :key="situation.id"
                                  :context-situation="situation"
                                  v-on:deactivate="unsetActiveContextSituation"></context-situation-card>
        </transition-group>
        <transition name="el-fade-in">
          <p v-if="contextSituations.length === 0">{{ $t('context_situation.none_found') }}</p>
        </transition>
      </el-col>
    </el-row>
  </v-layout>
</template>

<script>
import { scrollToTop, hasCommonElement } from '@/utils/helpers'
import DefaultLayout from '@/layouts/Default.vue'
import ContextSituationCard from '@/components/context-situation/ContextSituationCard.vue'
import ContextSituationService from '@/services/contextSituation'
import Tag from '@/components/Tag'
import ContextSituation from '@/models/contextSituation'

export default {
  components: {
    VLayout: DefaultLayout,
    ContextSituationCard,
    Tag
  },

  data() {
    return {
      filterText: undefined,
      selectedTags: [],
      newContextSituation: {
        name: undefined
      },
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

    allContextSituations() {
      return this.$store.state.contextSituation.contextSituations
    },

    filteredContextSituations() {
      if (!this.filterText && !this.selectedTags) return this.allContextSituations

      return this.allContextSituations.filter((current) => {
        if (this.activeContextSituation && current.id === this.activeContextSituation.id) return true

        if (this.selectedTags.length > 0) {
          const tagIDs = current.tags.map((t) => t.id)
          if (!hasCommonElement(tagIDs, this.selectedTags)) return false
        }

        if (!this.filterText) return true
        return current.name.toLowerCase().includes(this.filterText.toLowerCase())
      })
    },

    contextSituations() {
      return [...this.filteredContextSituations].sort((a, b) => {
        if (this.activeContextSituation) {
          if (a.id === this.activeContextSituation.id) return -1
          if (b.id === this.activeContextSituation.id) return 1
        }

        return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
      })
    },

    tags() {
      return this.$store.state.tag.tags
    }
  },

  methods: {
    createNew() {
      this.$refs.newFactorForm.validate((valid) => {
        if (valid) {
          let data = new ContextSituation({ name: this.newContextSituation.name })
          ContextSituationService.create(data).then(() => {
            this.$router.push({
              name: 'context_situations.single',
              params: {
                contextSituationID: this.$store.state.contextSituation.contextSituations[this.$store.state.contextSituation.contextSituations.length - 1].id
              }
            })
          })
        }
      })
      this.$refs.newFactorForm.resetFields()
    },

    unsetActiveContextSituation() {
      this.$store.dispatch('contextSituation/unsetActive')
      this.$router.push({
        name: 'context_situations'
      })
    }
  },

  beforeRouteUpdate(to, from, next) {
    if (to.name === 'context_situations.single') {
      scrollToTop()
      ContextSituationService.get({ id: to.params.contextSituationID }).then(next)
    } else {
      this.$store.dispatch('contextSituation/unsetActive').then(next)
    }
  },

  beforeRouteLeave(to, from, next) {
    this.$store.dispatch('contextSituation/unsetActive').then(next)
  },

  beforeRouteEnter(to, from, next) {
    scrollToTop()
    next()
  }
}

</script>

<style lang="scss">
.context-situation-cards {
  margin-top: 20px;
  overflow: hidden;
  display: flex;
  flex-wrap: wrap;
  align-content: space-around;
}

.context-situation-cards-move {
  transition: transform 0.500s ease-in-out !important;
}
</style>
