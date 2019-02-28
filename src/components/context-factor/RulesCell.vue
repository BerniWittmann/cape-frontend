<template>
  <div id="attribute_cell">
    <div v-if="type === 'Boolean'">
      <el-select v-model="data.text" class="fill" @change="updateValue" clearable ref="select">
        <el-option
                v-for="item in booleanOptions"
                :key="item.value"
                :label="item.value"
                :value="item.value">
        </el-option>
        <el-option
                :value="$t('context_factor.none')"
                :label="$t('context_factor.none')"></el-option>
      </el-select>
    </div>
    <div v-if="type === 'String'">
      <el-input v-model="data.text" clearable class="fill" @change="updateValue"></el-input>
    </div>
    <div v-if="type === 'Number' && singleNumberMode" class="n-in">
      <el-button icon="el-icon-d-caret" plain @click="switchNumberView" size="mini" class="switchButton"></el-button>
      <el-input-number v-model="integerValue1" clearable class="n_input fill" @change="updateValue"
                       :controls="false"></el-input-number>
    </div>
    <div v-if="type === 'Number' && !singleNumberMode" class="n-in">
      <el-button icon="el-icon-d-caret" plain @click="switchNumberView" size="mini" class="switchButton"></el-button>
      <el-input-number v-model="integerValue1" clearable class="n-input" @change="updateValue"
                       :controls="false"></el-input-number>
      <span class="separator"> - </span>
      <el-input-number v-model="integerValue2" clearable class="n-input" @change="updateValue"
                       :controls="false"></el-input-number>
    </div>
  </div>
</template>

<script>
/* ============
 * RulesCell
 * ============
 *
 * A Cell which allows to edit the Attribute Cell of the Rules in the Context Factor
 *
 */
export default {
  name: 'RulesCell',
  model: {
    prop: 'value',
    event: 'change'
  },

  props: {
    // The Value of the input field
    type: {
      type: String,
      required: true
    },
    value: {
      type: String
    }
  },

  data() {
    return {
      booleanOptions: [{
        value: 'TRUE'
      }, {
        value: 'FALSE'
      }],
      data: {
        text: ''
      }
    }
  },

  computed: {
    singleNumberMode() {
      return this.data.text === undefined || this.data.text.indexOf('-') === -1
    },

    integerValue1: {
      get: function () {
        if (this.type === 'Number' && !this.singleNumberMode) {
          return this.data.text.split('-')[0].length > 0 ? this.data.text.split('-')[0] : undefined
        }
        if (this.type === 'Number' && this.singleNumberMode) {
          return this.data.text
        }
        return undefined
      },
      set: function (newInteger1Value) {
        if (this.singleNumberMode) {
          this.data.text = newInteger1Value + ''
        } else {
          if (newInteger1Value !== undefined) {
            if (newInteger1Value > this.integerValue2 && this.integerValue2 !== undefined) {
              let temp = this.integerValue2
              this.integerValue2 = newInteger1Value
              newInteger1Value = temp
              this.data.text = this.data.text.split('-')[0] + '-' + this.integerValue2
            }
            if (this.data.text.indexOf('-') === 0) {
              this.data.text = newInteger1Value + this.data.text
            } else {
              this.data.text = newInteger1Value + '-' + this.data.text.split('-')[1]
            }
          }
        }
      }
    },

    integerValue2: {
      get: function () {
        if (this.type === 'Number' && !this.singleNumberMode) {
          return this.data.text.split('-')[1].length > 0 ? this.data.text.split('-')[1] : undefined
        }
        return undefined
      },
      set: function (newInteger2Value) {
        if (newInteger2Value !== undefined) {
          if (newInteger2Value < this.integerValue1) {
            let temp = this.integerValue1
            this.integerValue1 = newInteger2Value
            newInteger2Value = temp
          }
          if (this.data.text.indexOf('-') === this.data.text.length - 1) {
            this.data.text += newInteger2Value
          } else {
            this.data.text = this.data.text.split('-')[0] + '-' + newInteger2Value
          }
        }
      }
    }
  },

  methods: {
    switchNumberView() {
      // the separator for the numbers must be added or removed
      if (this.singleNumberMode) {
        this.data.text += '-'
      } else {
        this.data.text = this.data.text.split('-')[0]
      }
    },

    updateValue(selected) {
      // check if boolean input value is none to remove the text and attribute
      if (selected === this.$t('context_factor.none')) this.data.text = ''
      this.$emit('change', this.data.text)
    }
  },

  watch: {
    value: {
      deep: true,
      immediate: true,
      handler: function (newValue) {
        if (this.type === 'Boolean' && newValue !== 'TRUE' && newValue !== 'FALSE') newValue = undefined
        this.data.text = newValue
        this.$emit('change', this.data.text)
      }
    }
  }
}
</script>

<style scoped lang="scss">

.switchButton {
  padding: 2px;
  margin-right: 5px;
}

.separator {
  margin: 5px;
}

.n-input {
  flex: 1
}

.n-in {
  display: flex;
}

.fill {
  width: 100%;
}

</style>
