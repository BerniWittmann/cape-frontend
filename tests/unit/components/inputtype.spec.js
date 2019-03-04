import { mount, config } from '@vue/test-utils'
import { i18n, monkeyPatchTransitions } from '../setupPlugins'

import InputType from '@/components/InputType.vue'

describe('Components', () => {
  describe('InputType', () => {
    monkeyPatchTransitions()

    config.transition = false
    let propsData
    let cmp

    beforeEach(() => {
      propsData = {
        value: 'Test Text',
        type: 'String'
      }
      // console.warn = jest.fn()
      render()
    })

    function render(stubs = {}) {
      cmp = mount(InputType, {
        i18n,
        propsData,
        stubs: {
          transition: false,
          ...stubs
        }
      })
    }

    it('renders', () => {
      expect(cmp.html()).toMatchSnapshot()
    })

    it('has a prop to hide the type select', () => {
      propsData.showTypeSelect = false
      render()

      expect(cmp.html()).toMatchSnapshot()
      expect(cmp.contains('.el-select')).toBeFalsy()
    })

    it('has a prop to control the size', () => {
      propsData.size = 'small'
      render()

      expect(cmp.html()).toMatchSnapshot()
      expect(cmp.contains('.el-form-item--small')).toBeTruthy()
      expect(cmp.contains('.el-select--small')).toBeTruthy()
      expect(cmp.contains('.el-input--small')).toBeTruthy()
    })

    describe('it can change the type', () => {
      it('displays a select to change the type', () => {
        const select = cmp.find('.el-select')
        expect(select.exists()).toBeTruthy()
        const options = select.findAll('.el-select-dropdown__item')
        expect(options.at(0).text()).toEqual('types.string')
        expect(options.at(1).text()).toEqual('types.number')
        expect(options.at(2).text()).toEqual('types.boolean')
      })
      describe('it can change the type to a string', () => {
        it('can change the type to string', () => {
          propsData.type = 'Number'
          render()

          expect(cmp.vm.data.type).not.toEqual('String')

          cmp.find('.el-select-dropdown__item').trigger('click')

          expect(cmp.vm.data.type).toEqual('String')
        })

        describe('validates the field on change', () => {
          beforeEach(() => {
            propsData.type = 'String'
            render()
          })
          it('shows no error if no input given', (done) => {
            const input = cmp.findAll('input').at(1)
            expect(input.exists()).toBeTruthy()
            input.setValue('')
            input.trigger('blur')
            input.trigger('change')

            cmp.vm.$nextTick(() => {
              expect(cmp.html()).toMatchSnapshot()
              const err = cmp.find('.el-form-item__error')
              expect(err.exists()).toBeFalsy()
              expect(cmp.emitted().change[0][0]).toEqual({
                type: 'String',
                value: ''
              })
              done()
            })
          })
          it('emits change event if valid', () => {
            const input = cmp.findAll('input').at(1)
            expect(input.exists()).toBeTruthy()
            input.setValue('my New Value')
            input.trigger('change')

            expect(cmp.emitted().change[0][0]).toEqual({
              type: 'String',
              value: 'my New Value'
            })
          })
        })
      })

      describe('it can change the type to a boolean', () => {
        it('can change the type to boolean', () => {
          propsData.type = 'String'
          render()

          expect(cmp.vm.data.type).not.toEqual('Boolean')

          cmp.findAll('.el-select-dropdown__item').at(2).trigger('click')

          expect(cmp.vm.data.type).toEqual('Boolean')
        })

        it('renders a select field', () => {
          propsData.type = 'Boolean'
          render()

          expect(cmp.html()).toMatchSnapshot()
          const selectGroup = cmp.find('.select-group')
          expect(selectGroup.exists()).toBeTruthy()
          expect(selectGroup.findAll('.el-select').length).toEqual(2)
          const select = selectGroup.findAll('.el-select').at(1)
          expect(select.exists()).toBeTruthy()
          const options = select.findAll('.el-select-dropdown__item')
          expect(options.length).toEqual(2)
          expect(options.at(0).props('value')).toEqual('TRUE')
          expect(options.at(0).props('label')).toEqual('TRUE')
          expect(options.at(0).text()).toEqual('TRUE')
          expect(options.at(1).props('value')).toEqual('FALSE')
          expect(options.at(1).props('label')).toEqual('FALSE')
          expect(options.at(1).text()).toEqual('FALSE')
        })

        describe('validates the field on change', () => {
          beforeEach(() => {
            propsData.type = 'Boolean'
            render()
          })
          it('shows no error if no input given', (done) => {
            const input = cmp.findAll('.el-select').at(1)
            expect(input.exists()).toBeTruthy()
            cmp.vm.data.value = ''
            input.vm.$emit('change')

            cmp.vm.$nextTick(() => {
              expect(cmp.html()).toMatchSnapshot()
              const err = cmp.find('.el-form-item__error')
              expect(err.exists()).toBeFalsy()
              expect(cmp.emitted().change).toBeTruthy()
              expect(cmp.emitted().change[0][0]).toEqual({
                type: 'Boolean',
                value: ''
              })
              done()
            })
          })
          it('shows error if invalid input', (done) => {
            render()
            const input = cmp.findAll('.el-select').at(1)
            expect(input.exists()).toBeTruthy()
            cmp.vm.data.value = 'F4LsE'
            input.vm.$emit('change')

            cmp.vm.$nextTick(() => {
              expect(cmp.html()).toMatchSnapshot()
              const err = cmp.find('.el-form-item__error')
              expect(err.exists()).toBeTruthy()
              expect(err.text()).toEqual('input_type.boolean')
              expect(cmp.emitted().change).toEqual(undefined)
              done()
            })
          })
          it('emits change event if value is FALSE', () => {
            const input = cmp.findAll('.el-select').at(1)
            expect(input.exists()).toBeTruthy()
            cmp.vm.data.value = 'FALSE'
            input.vm.$emit('change')

            expect(cmp.emitted().change[0][0]).toEqual({
              type: 'Boolean',
              value: 'FALSE'
            })
          })
          it('emits change event if value is TRUE', () => {
            const input = cmp.findAll('.el-select').at(1)
            expect(input.exists()).toBeTruthy()
            cmp.vm.data.value = 'TRUE'
            input.vm.$emit('change')

            expect(cmp.emitted().change[0][0]).toEqual({
              type: 'Boolean',
              value: 'TRUE'
            })
          })
        })
      })

      describe('it can change the type to a number', () => {
        it('can change the type to boolean', () => {
          propsData.type = 'String'
          render()

          expect(cmp.vm.data.type).not.toEqual('Number')

          cmp.findAll('.el-select-dropdown__item').at(1).trigger('click')

          expect(cmp.vm.data.type).toEqual('Number')
        })

        describe('validates the field on change', () => {
          beforeEach(() => {
            propsData.type = 'Number'
            render()
          })
          it('shows no error if no input given', (done) => {
            cmp.destroy()
            render()

            const input = cmp.findAll('input').at(1)
            expect(input.exists()).toBeTruthy()
            input.setValue('')
            input.trigger('blur')
            input.trigger('change')

            cmp.vm.$nextTick(() => {
              expect(cmp.html()).toMatchSnapshot()
              const err = cmp.find('.el-form-item__error')
              expect(err.exists()).toBeFalsy()
              expect(cmp.emitted().change[0][0]).toEqual({
                type: 'Number',
                value: ''
              })
              done()
            })
          })
          it('shows error if invalid input', (done) => {
            render()
            const input = cmp.findAll('input').at(1)
            expect(input.exists()).toBeTruthy()
            input.setValue('string')
            input.trigger('blur')
            input.trigger('change')

            cmp.vm.$nextTick(() => {
              expect(cmp.html()).toMatchSnapshot()
              const err = cmp.find('.el-form-item__error')
              expect(err.exists()).toBeTruthy()
              expect(err.text()).toEqual('input_type.number')
              expect(cmp.emitted().change).toEqual(undefined)
              done()
            })
          })
          it('emits change event if value is a number', () => {
            const input = cmp.findAll('input').at(1)
            expect(input.exists()).toBeTruthy()
            input.setValue('12411')
            input.trigger('change')

            expect(cmp.emitted().change[0][0]).toEqual({
              type: 'Number',
              value: '12411'
            })
          })
          it('emits change event if value is a negative float number', () => {
            const input = cmp.findAll('input').at(1)
            expect(input.exists()).toBeTruthy()
            input.setValue('-3.141')
            input.trigger('change')

            expect(cmp.emitted().change[0][0]).toEqual({
              type: 'Number',
              value: '-3.141'
            })
          })
        })
      })
    })

    it('has a method to validate the form', () => {
      const fn = cmp.vm.validate
      expect(fn).toEqual(expect.any(Function))
      cmp.vm.$refs.inputTypeForm.validate = jest.fn()
      const cb = jest.fn()

      fn(cb)
      expect(cmp.vm.$refs.inputTypeForm.validate).toHaveBeenCalledWith(cb)
    })
  })
})
