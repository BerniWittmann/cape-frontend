<template>
  <el-container class="font-awesome-chooser">
    <el-header>
      <el-input v-model="search" placeholder="Type to search" size="mini"></el-input>
      <el-button icon="el-icon-close" @click="emitClose" size="mini">Close</el-button>
    </el-header>
    <el-main id="icon-overview">
      <div v-for="(icon, index) in faIcons" class="icon-item" @click="emitIcon(icon)" :key="index">
        <div class="icon">
          <i class="fa fa-lg" :class="icon" id="fa-icon"></i>
        </div>
        <div class="text-space">
          <div class="text">{{ betterIconName(icon) }}</div>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
/* ============
 * FontAwesomeIconChooser
 * ============
 *
 *  A component to choose an icon from all available FontAwesome Icons.
 *  Used in a popover
 */

import FontAwesomeIcons from '@/utils/fontAwesomeIcons'

export default {
  data() {
    return {
      search: ''
    }
  },

  computed: {
    faIcons() {
      return FontAwesomeIcons.filter(icons => !this.search || icons.toLowerCase().includes(this.search.toLowerCase()))
    }
  },

  methods: {
    betterIconName(faName) {
      return faName.substring(3)
    },

    emitIcon(icon) {
      this.$emit('click', icon)
      this.$emit('close')
    },

    emitClose() {
      this.$emit('close')
    }
  }
}
</script>

<style scoped lang="scss">

.el-input {
  margin-bottom: 10px;
  width: 80%;
}

.el-button {
  width: 20%;
}

$size: 80px;
$columns: 5;

#icon-overview {
  margin: 0;
  padding: 0;
  display: grid;
  width: calc(#{$size} * #{$columns} + 19px);
  height: calc(#{$size} * 4);
  max-height: calc(#{$size} * 4);
  grid-template-columns: repeat($columns, $size);
  grid-auto-rows: $size;
  border: solid #2c3e50 1px;
  text-align: center;
}

.icon-item {
  border: solid #2c3e50 0.25px;
}

#fa-icon {
  margin: 0;
}

.icon-item > .icon {
  padding-top: calc(0.15 * #{$size});
  font-size: calc(0.3 * #{$size});
  margin: 0;
  color: $primary_color;
}

.icon-item > .text-space {
  width: $size;
  height: calc(0.5 * #{$size});
  position: relative;
}

.icon-item > .text-space > .text {
  text-align: center;
  font-size: calc(0.13 * #{$size});
  padding: calc(0.05 * #{$size});
  margin: 0;
  position: absolute;
  top: 50%;
  width: calc(0.9 * #{$size});
  transform: translate(0, -50%);
}

.icon-item:hover {
  color: #FFFFFF;
  background-color: $primary_color;
}

.icon-item:hover #fa-icon {
  color: #FFFFFF;
}

.icon-item .selected {
  color: #2c3e50;
}

</style>
