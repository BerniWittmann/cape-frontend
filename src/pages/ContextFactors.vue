<template>
  <v-layout>
    <el-row>
      <el-col :span="20" :offset="2">
        <div class="contextFactors">
          <h3>{{$t('context_factor.title')}}</h3>
          <el-tree :data="contextTree" ></el-tree>
        </div>
      </el-col>
    </el-row>
  </v-layout>
</template>

<script>
import DefaultLayout from '@/layouts/Default.vue'

export default {
  components: {
    VLayout: DefaultLayout
  },
  methods: {
    getChildren(contextFactor) {
      return this.allContextFactors.filter(cF => cF.parentID === contextFactor.id)
    },
    constructChildren(contextFactor) {
      let a = this.getChildren(contextFactor)
      let b = []
      for (let i = 0; i < a.length; i++) {
        b.push({ label: a[i].name, contextFactor: a[i], children: this.constructChildren(a[i]) })
      }
      return b
    }
  },
  computed: {
    allContextFactors() {
      return this.$store.state.contextFactor.contextFactors
    },
    root() {
      return this.allContextFactors.find(cF => typeof cF.parentID === 'undefined')
    },
    contextTree() {
      return [{
        contextFactor: this.root,
        children: this.constructChildren(this.root),
        label: this.root.name
      }]
    }
  }
}

</script>

<style scoped lang="scss">
.contextFactors {
  text-align: center;
}
</style>
