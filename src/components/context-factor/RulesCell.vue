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
/*
 * @vuese
 * @group Components
 *
 * A Cell which allows to edit the Attribute Cell of the Rules in the Context Factor. Allows to edit Strings, Booleans and Numbers.
 */
export default {
  name: 'RulesCell',
  model: {
    prop: 'value',
    event: 'change'
  },

  props: {
    // The type of the input field
    type: {
      // `'Number'` / `'Boolean'` / `'String'`
      type: String,
      required: true
    },
    // The value of the input field
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
      },
      separator: '_'
    }
  },

  computed: {
    singleNumberMode() {
      return this.data.text === undefined || this.data.text.indexOf(this.separator) === -1
    },

    integerValue1: {
      get: function () {
        if (this.type === 'Number' && !this.singleNumberMode) {
          return (this.data.text.split(this.separator)[0].length > 0) ? this.data.text.split(this.separator)[0] : undefined
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
            if (this.integerValue2 !== undefined && (newInteger1Value + '') === (this.integerValue2 + '')) {
              // if equal set it to singleNumberMode
              this.data.text = newInteger1Value + ''
            } else {
              if (newInteger1Value > this.integerValue2) {
                // in case newIntegerValue1 is bigger than integerValue2
                this.data.text = this.data.text.split(this.separator)[1] + this.separator + newInteger1Value
              } else {
                if (this.data.text.indexOf(this.separator) === 0) {
                  // in case integerValue1 was undefined
                  this.data.text = newInteger1Value + this.data.text
                } else {
                  // in case integerValue1 was defined and not bigger
                  this.data.text = newInteger1Value + this.separator + this.data.text.split(this.separator)[1]
                }
              }
            }
          } else {
            // in case of undefined newIntegerValue1
            this.data.text = this.separator + this.data.text.split(this.separator)[1]
          }
        }
      }
    },

    integerValue2: {
      get: function () {
        if (this.type === 'Number' && !this.singleNumberMode) {
          return (this.data.text.split(this.separator)[1].length > 0) ? this.data.text.split(this.separator)[1] : undefined
        }
        return undefined
      },
      set: function (newInteger2Value) {
        if (newInteger2Value !== undefined) {
          if ((newInteger2Value + '') === (this.integerValue1 + '')) {
            this.data.text = newInteger2Value + ''
          } else {
            if (newInteger2Value < this.integerValue1) {
              this.data.text = newInteger2Value + this.separator + this.data.text.split(this.separator)[0]
            } else {
              if (this.data.text.indexOf(this.separator) === this.data.text.length - 1) {
                this.data.text += newInteger2Value
              } else {
                this.data.text = this.data.text.split(this.separator)[0] + this.separator + newInteger2Value
              }
            }
          }
        } else {
          this.data.text = this.data.text.split(this.separator)[0] + this.separator
        }
      }
    }
  },

  methods: {
    // @vuese
    // switches the view from a single number input to the double number input and back
    switchNumberView() {
      // the separator for the numbers must be added or removed
      if (this.singleNumberMode) {
        this.data.text += this.separator
      } else {
        this.data.text = this.data.text.split(this.separator)[0]
      }
    },

    // @vuese
    // updates a value change, checks string for forbidden characters (=, &, |) and allows to empty a boolean choice
    // @arg the input/selection
    updateValue(selected) {
      // check if boolean input value is none to remove the text and attribute
      if (this.type === 'Boolean' && selected === this.$t('context_factor.none')) this.data.text = ''
      this.data.text = this.data.text.replace(/=/g, '')
      this.data.text = this.data.text.replace(/&/g, '')
      this.data.text = this.data.text.replace(/\|/g, '')
      // Emitted on change of the value
      // @arg The updated value
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
        // Emitted on change of the value
        // @arg The updated value
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
