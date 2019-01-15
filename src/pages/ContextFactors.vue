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
  computed: {
    contextTree() {
      return this.$store.getters['contextFactor/contextFactorsTree']
    }
  }
}

</script>

<style scoped lang="scss">
.contextFactors {
  text-align: center;
}
</style>
