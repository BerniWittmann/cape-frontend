import { mount } from '@vue/test-utils'
import { i18n } from '../../setupPlugins'

import ContextSituationRules from '@/components/context-situation/ContextSituationRules.vue'

describe('Components', () => {
  describe('ContextSituationRules', () => {
    let propsData
    let cmp
    let router
    let store

    beforeEach(() => {
      propsData = {
        value: 'aaaaaaaaaaaaaaaaaaaaaaa1.bbbbbbbbbbbbbbbbbbbbbbb1 && !aaaaaaaaaaaaaaaaaaaaaaa1.bbbbbbbbbbbbbbbbbbbbbbb2 || aaaaaaaaaaaaaaaaaaaaaaa2.bbbbbbbbbbbbbbbbbbbbbbb3'
      }
      store = {
        state: {
          contextFactor: {
            contextFactors: [{
              id: 'aaaaaaaaaaaaaaaaaaaaaaa1',
              name: 'CF 1',
              attributes: [{
                id: 'bbbbbbbbbbbbbbbbbbbbbbb1',
                key: 'Attr 1'
              }, {
                id: 'bbbbbbbbbbbbbbbbbbbbbbb2',
                key: 'Attr 2'
              }]
            }, {
              id: 'aaaaaaaaaaaaaaaaaaaaaaa2',
              name: 'CF 2',
              attributes: [{
                id: 'bbbbbbbbbbbbbbbbbbbbbbb3',
                key: 'Attr 3'
              }]
            }]
          }
        },
        dispatch: jest.fn().mockImplementation(() => ({
          then: (arg) => arg()
        }))
      }
      router = {
        push: jest.fn()
      }
      render()
    })

    function render() {
      cmp = mount(ContextSituationRules, {
        i18n,
        propsData,
        stubs: {
          transition: false,
          ElTooltip: '<div class="tooltip"><slot></slot></div>'
        },
        mocks: {
          $store: store,
          $router: router
        }
      })
    }

    it('renders', () => {
      expect(cmp.html()).toMatchSnapshot()
    })

    it('renders a cascader for the arguments', () => {
      const cascaders = cmp.findAll('.select--argument')
      expect(cascaders.length).toEqual(3)
      expect(cascaders.at(0).text()).toEqual('CF 1 - Attr 1')
      expect(cascaders.at(1).text()).toEqual('! CF 1 - Attr 2')
      expect(cascaders.at(2).text()).toEqual('CF 2 - Attr 3')
    })

    it('marks the negated cascaders', () => {
      const cascaders = cmp.findAll('.select--argument')
      expect(cascaders.at(0).classes('select--argument--negated')).toBeFalsy()
      expect(cascaders.at(1).classes('select--argument--negated')).toBeTruthy()
      expect(cascaders.at(2).classes('select--argument--negated')).toBeFalsy()
    })

    it('marks the non-negated cascaders', () => {
      const cascaders = cmp.findAll('.select--argument')
      expect(cascaders.at(0).classes('select--argument--not-negated')).toBeTruthy()
      expect(cascaders.at(1).classes('select--argument--not-negated')).toBeFalsy()
      expect(cascaders.at(2).classes('select--argument--not-negated')).toBeTruthy()
    })

    it('renders a select for the connectors', () => {
      const selects = cmp.findAll('.select--connector')
      expect(selects.length).toEqual(2)
      expect(selects.at(0).find('.el-input__inner').element.value).toEqual('context_situation.rules.connectors.and')
      expect(selects.at(1).find('.el-input__inner').element.value).toEqual('context_situation.rules.connectors.or')
    })

    it('does not render cascaders or selects if empty rule', () => {
      cmp.setProps({ value: '' })
      const cascaders = cmp.findAll('.select--argument')
      expect(cascaders.length).toEqual(0)
      const selects = cmp.findAll('.select--connector')
      expect(selects.length).toEqual(0)
    })

    describe('it can remove a condition', () => {
      it('has a button', () => {
        expect(cmp.contains('.el-button--danger')).toBeTruthy()
      })

      it('removes a connector and an argument', () => {
        const btn = cmp.find('.el-button--danger')
        btn.trigger('click')

        const cascaders = cmp.findAll('.select--argument')
        expect(cascaders.length).toEqual(2)
        expect(cascaders.at(0).text()).toEqual('CF 1 - Attr 1')
        expect(cascaders.at(1).text()).toEqual('! CF 1 - Attr 2')
        const selects = cmp.findAll('.select--connector')
        expect(selects.length).toEqual(1)
        expect(selects.at(0).find('.el-input__inner').element.value).toEqual('context_situation.rules.connectors.and')
      })

      it('only removes the condition if it is first condition', () => {
        cmp.setProps({ value: 'aaaaaaaaaaaaaaaaaaaaaaa1.bbbbbbbbbbbbbbbbbbbbbbb1' })
        const btn = cmp.find('.el-button--danger')
        btn.trigger('click')

        const cascaders = cmp.findAll('.select--argument')
        expect(cascaders.length).toEqual(0)
        const selects = cmp.findAll('.select--connector')
        expect(selects.length).toEqual(0)
      })

      it('does not display button if no conditions', () => {
        cmp.setProps({ value: '' })

        const btn = cmp.find('.el-button--danger')
        expect(btn.exists()).toBeFalsy()
      })
    })

    describe('it can add a condition', () => {
      beforeEach(() => {
        cmp.setProps({ value: 'aaaaaaaaaaaaaaaaaaaaaaa1.bbbbbbbbbbbbbbbbbbbbbbb1' })
      })
      it('has a button', () => {
        expect(cmp.contains('.el-button--success')).toBeTruthy()
      })

      it('adds a connector and an argument', () => {
        const btn = cmp.find('.el-button--success')
        btn.trigger('click')

        let cascaders = cmp.findAll('.select--argument')
        expect(cascaders.length).toEqual(2)
        let selects = cmp.findAll('.select--connector')
        expect(selects.length).toEqual(1)

        btn.trigger('click')

        cascaders = cmp.findAll('.select--argument')
        expect(cascaders.length).toEqual(3)
        selects = cmp.findAll('.select--connector')
        expect(selects.length).toEqual(2)
      })

      it('only adds an argument if is first condition', () => {
        cmp.setProps({ value: '' })
        const btn = cmp.find('.el-button--success')
        btn.trigger('click')

        let cascaders = cmp.findAll('.select--argument')
        expect(cascaders.length).toEqual(1)
        let selects = cmp.findAll('.select--connector')
        expect(selects.length).toEqual(0)
      })
    })

    describe('it can update values', () => {
      it('validates form if value is changed', () => {
        cmp.vm.$refs.contextSituationRuleForm.validate = jest.fn()
        const cascader = cmp.find('.select--argument')
        cascader.vm.$emit('change')

        expect(cmp.vm.$refs.contextSituationRuleForm.validate).toHaveBeenCalled()
      })

      it('emits change event if valid value is changed', () => {
        const cascader = cmp.find('.select--argument')
        cascader.vm.$emit('change')

        expect(cmp.emitted().change[0][0]).toEqual('aaaaaaaaaaaaaaaaaaaaaaa1.bbbbbbbbbbbbbbbbbbbbbbb1 && !aaaaaaaaaaaaaaaaaaaaaaa1.bbbbbbbbbbbbbbbbbbbbbbb2 || aaaaaaaaaaaaaaaaaaaaaaa2.bbbbbbbbbbbbbbbbbbbbbbb3')
      })

      it('does not emit change event if invalid value is changed', (done) => {
        const btn = cmp.find('.el-button--success')
        btn.trigger('click')
        const cascader = cmp.find('.select--argument')
        cascader.vm.$emit('change')

        cmp.vm.$nextTick(() => {
          expect(cmp.emitted().change).toBeFalsy()
          expect(cmp.html()).toMatchSnapshot()

          const err = cmp.find('.el-form-item__error')
          expect(err.exists()).toBeTruthy()
          expect(err.text()).toEqual('context_situation.rules.required')

          done()
        })
      })
    })

    it('can reset the form', () => {
      cmp.vm.$refs.contextSituationRuleForm.resetFields = jest.fn()
      const btn = cmp.find('.el-button--success')
      btn.trigger('click')
      btn.trigger('click')

      let cascaders = cmp.findAll('.select--argument')
      expect(cascaders.length).toEqual(5)
      let selects = cmp.findAll('.select--connector')
      expect(selects.length).toEqual(4)

      expect(cmp.vm.reset).toEqual(expect.any(Function))

      cmp.vm.reset()

      cascaders = cmp.findAll('.select--argument')
      expect(cascaders.length).toEqual(3)
      selects = cmp.findAll('.select--connector')
      expect(selects.length).toEqual(2)
      expect(cmp.vm.$refs.contextSituationRuleForm.resetFields).toHaveBeenCalled()
    })
  })
})
