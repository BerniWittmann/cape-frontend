import { mount } from '@vue/test-utils'
import { i18n } from '../../setupPlugins'

import InputEdit from '@/components/InputEdit.vue'
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
        it('renders the input edit component for the name', () => {
          const input = cmp.find(InputEdit)
          expect(input.exists()).toBeTruthy()
        })
        it('open input for the rules', (done) => {
          const editRulesButton = cmp.find('button.black-color')
          expect(editRulesButton.exists).toBeTruthy()
          editRulesButton.trigger('click')
          cmp.vm.$nextTick(() => {
            expect(cmp.html()).toMatchSnapshot()
            expect(cmp.find('.el-input__inner').exists).toBeTruthy()
            done()
          })
        })

        it('hides the input after editing the rules', (done) => {
          const editRulesButton = cmp.find('button.black-color')
          expect(editRulesButton.exists).toBeTruthy()

          editRulesButton.trigger('click')
          cmp.vm.$nextTick(() => {
            expect(cmp.html()).toMatchSnapshot()
            const input = cmp.find('.el-input__inner')
            input.setValue('My new Rule')
            input.trigger('keyup', { key: 'Enter' })
            cmp.vm.$nextTick(() => {
              expect(cmp.html()).toMatchSnapshot()
              done()
            })
          })
        })

        it('does not hid the input after editing the rules if its invalid', (done) => {
          const editRulesButton = cmp.find('button.black-color')
          expect(editRulesButton.exists).toBeTruthy()

          editRulesButton.trigger('click')
          cmp.vm.$nextTick(() => {
            expect(cmp.html()).toMatchSnapshot()
            const input = cmp.find('.el-input__inner')
            input.setValue('My new Rule')
            input.trigger('keyup', { key: 'Enter' })
            cmp.vm.$nextTick(() => {
              expect(cmp.html()).toMatchSnapshot()
              done()
            })
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
            cmp.vm.$nextTick(() => {
              expect(cmp.html()).toMatchSnapshot()
              done()
            })
          })
        })
      })
    })
  })
})
