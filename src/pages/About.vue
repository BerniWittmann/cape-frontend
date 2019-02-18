<template>
  <v-layout>
    <div class="about">
      <h1>{{ $t('about.title') }}</h1>
      <p>{{ $t('about.description') }}</p>
      <a href="https://www.uni-ulm.de/in/iui-dbis/forschung/laufende-projekte/cape/" target="_blank">
        <el-button type="primary">{{ $t('about.project_page')}}</el-button>
      </a>
      <p>{{ $t('about.wiki_description') }}</p>
      <a href="https://portal.dbis.info/confluence/display/CM" target="_blank">
        <el-button type="primary">{{ $t('about.wiki')}}</el-button>
      </a>
      <p>{{ $t('about.source_description') }}</p>
      <a href="https://gitlab.com/cape-modeler/frontend" target="_blank">
        <el-button type="primary">{{ $t('about.source')}}</el-button>
      </a>
    </div>
  </v-layout>
</template>

<script>
import DefaultLayout from '@/layouts/Default.vue'
/*
 * @vuese
 * @group Pages
 *
 * A page which explains the project and has other additional information
 */
export default {
  name: 'AboutPage',
  components: {
    VLayout: DefaultLayout
  }
}
</script>

<style scoped lang="scss">
.about {
  text-align: center;
}
</style>
