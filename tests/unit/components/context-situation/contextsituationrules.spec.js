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
        contextSituation: {
          id: '142',
          name: 'My Context Situation',
          rules: 'The Rules String',
          tags: [{
            id: '43',
            name: 'Second Tag',
            color: '#FFFF00'
          }, {
            id: '44',
            name: 'Third Tag',
            color: '#0FFF00'
          }]
        }
      }
      store = {
        state: {
          contextSituation: {
            activeContextSituation: {
              id: '142',
              name: 'My Context Situation',
              rules: 'The Rules String'
            }
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
        mocks: {
          $store: store,
          $router: router
        }
      })
    }

    describe('context situation rules management', () => {
      beforeEach(() => {
        store.state.contextSituation.activeContextSituation = undefined
      })

      it('renders', () => {
        expect(cmp.html()).toMatchSnapshot()
      })

      it('shows the rules of the context situation', () => {
        expect(cmp.text()).toContain('The Rules String')
      })

      describe('allows to edit the rules of the context situation', () => {
        it('open input for the rules', (done) => {
          const editRulesButton = cmp.find('button.black-color')
          expect(cmp.vm.rulesInputVisible).not.toBeTruthy()
          expect(editRulesButton.exists).toBeTruthy()
          editRulesButton.trigger('click')
          expect(cmp.vm.rulesInputVisible).toBeTruthy()
          cmp.vm.$nextTick(() => {
            expect(cmp.html()).toMatchSnapshot()
            expect(cmp.find('.el-input__inner').exists).toBeTruthy()
            done()
          })
        })

        it('hides the input after editing the rules', (done) => {
          cmp.vm.$refs.csRulesForm.validate = jest.fn().mockImplementation(arg => arg(true))
          const editRulesButton = cmp.find('button.black-color')
          expect(editRulesButton.exists).toBeTruthy()

          editRulesButton.trigger('click')
          cmp.vm.$nextTick(() => {
            expect(cmp.html()).toMatchSnapshot()
            const input = cmp.find('.el-input__inner')
            input.setValue('My new Rule')
            expect(cmp.vm.contextSituation.rules).toEqual('My new Rule')
            expect(cmp.vm.rulesInputVisible).toBeTruthy()
            input.trigger('keyup', { key: 'Enter' })
            expect(cmp.vm.$refs.csRulesForm.validate).toHaveBeenCalled()
            expect(cmp.vm.rulesInputVisible).not.toBeTruthy()
            done()
          })
        })

        it('does not hid the input after editing the rules if its invalid', (done) => {
          cmp.vm.$refs.csRulesForm.validate = jest.fn().mockImplementation(arg => arg(false))
          const editRulesButton = cmp.find('button.black-color')
          expect(editRulesButton.exists).toBeTruthy()

          editRulesButton.trigger('click')
          cmp.vm.$nextTick(() => {
            expect(cmp.html()).toMatchSnapshot()
            const input = cmp.find('.el-input__inner')
            input.setValue('My new Rule')
            expect(cmp.vm.contextSituation.rules).toEqual('My new Rule')
            expect(cmp.vm.rulesInputVisible).toBeTruthy()
            input.trigger('keyup', { key: 'Enter' })
            expect(cmp.vm.$refs.csRulesForm.validate).toHaveBeenCalled()
            expect(cmp.vm.rulesInputVisible).toBeTruthy()
            done()
          })
        })

        it('checks the input to not be empty', (done) => {
          const editRulesButton = cmp.find('button.black-color')
          editRulesButton.trigger('click')
          cmp.vm.$nextTick(() => {
            expect(cmp.html()).toMatchSnapshot()
            const input = cmp.find('.el-input__inner')
            input.setValue('')
            input.trigger('keypress', { key: 'Enter' })
            expect(cmp.html()).toMatchSnapshot()
            expect(cmp.find('.el-input__inner').exists).toBeTruthy()
            expect(cmp.vm.rulesInputVisible).toBeTruthy()
            done()
          })
        })
      })
    })
  })
})
