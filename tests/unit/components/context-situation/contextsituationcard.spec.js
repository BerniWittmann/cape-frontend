import { config, mount, TransitionStub } from '@vue/test-utils'
import { i18n } from '../../setupPlugins'

import Tag from '@/components/Tag.vue'
import TagEditor from '@/components/TagEditor.vue'
import InputEdit from '@/components/InputEdit.vue'
import ContextSituationCard from '@/components/context-situation/ContextSituationCard.vue'
import ContextSituationService from '@/services/contextSituation'

describe('Components', () => {
  describe('ContextSituationCard', () => {
    let propsData
    let cmp
    let router
    let store
    config.stubs.transition = false
    console.warn = jest.fn()

    beforeEach((done) => {
      jest.useRealTimers()
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
          tag: {
            tags: [{
              id: '42',
              name: 'First Tag',
              color: '#FF0000'
            }, {
              id: '43',
              name: 'Second Tag',
              color: '#FFFF00'
            }, {
              id: '44',
              name: 'Third Tag',
              color: '#0FFF00'
            }, {
              id: '45',
              name: 'Fourth Tag',
              color: '#00FFF0'
            }]
          },
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
        push: jest.fn(),
        back: jest.fn()
      }
      render(done)
    })

    function render(done = () => {}) {
      config.stubs.transition = TransitionStub
      cmp = mount(ContextSituationCard, {
        i18n,
        propsData,
        mocks: {
          $store: store,
          $router: router
        },
        sync: false
      })
      cmp.vm.$nextTick(done)
    }

    describe('it is not active', () => {
      beforeEach(() => {
        store.state.contextSituation.activeContextSituation = undefined
      })

      it('renders', () => {
        expect(cmp.html()).toMatchSnapshot()
      })

      it('does not contain the active class', () => {
        expect(cmp.contains('.is-active')).toBeFalsy()
      })

      it('is also inactive for other active Context Situation', () => {
        store.state.contextSituation.activeContextSituation = { id: '999999' }
        render()

        expect(cmp.vm.isActive).toBeFalsy()
        expect(cmp.contains('.is-active')).toBeFalsy()
      })

      it('displays the name', () => {
        expect(cmp.text()).toContain('My Context Situation')
      })

      it('does not display the rules', () => {
        const rules = cmp.find('contextsituationrules-stub')
        expect(rules.exists()).toBeFalsy()
      })

      it('displays the tags', () => {
        const tags = cmp.findAll(Tag)

        expect(tags.length).toEqual(2)
        expect(tags.at(0).props('tag')).toEqual(store.state.tag.tags[1])
        expect(tags.at(1).props('tag')).toEqual(store.state.tag.tags[2])
        expect(tags.at(0).props('size')).toEqual('medium')
        expect(tags.at(1).props('size')).toEqual('medium')
      })

      it('displays a shadow on hover', () => {
        expect(cmp.find('.el-card')).toBeTruthy()
        expect(cmp.find('is-hover-shadow')).toBeTruthy()
      })

      it('navigates to route when clicked', () => {
        cmp.find('.el-card').trigger('click')

        expect(router.push).toHaveBeenCalledWith({
          name: 'context_situations.single',
          params: {
            contextSituationID: '142'
          }
        })
      })
    })

    describe('it is active', () => {
      it('renders', () => {
        expect(cmp.html()).toMatchSnapshot()
      })

      it('has the active class', () => {
        expect(cmp.contains('.is-active')).toBeTruthy()
      })

      it('displays the name', () => {
        expect(cmp.text()).toContain('My Context Situation')
      })

      it('does display the rules', () => {
        const rules = cmp.find('.context-situation-rules')
        expect(rules.exists()).toBeTruthy()
      })

      it('displays the tags', () => {
        const tags = cmp.findAll(Tag)
        expect(tags.length).toEqual(2)
        expect(tags.at(0).props('tag')).toEqual(store.state.tag.tags[1])
        expect(tags.at(1).props('tag')).toEqual(store.state.tag.tags[2])
      })

      it('displays a shadow', () => {
        expect(cmp.find('.el-card')).toBeTruthy()
        expect(cmp.find('.is-always-shadow')).toBeTruthy()
      })

      it('doesnt navigate to route when clicked and active', () => {
        cmp.find('.el-card').trigger('click')
        expect(router.push).not.toHaveBeenCalled()
      })

      describe('allows to edit the name of the context situation', () => {
        it('renders the input edit component for the name', () => {
          const input = cmp.find(InputEdit)
          expect(input.exists()).toBeTruthy()
        })
        it('allows to edit the input for the title', (done) => {
          const editTitleButton = cmp.find('button.black-color')
          expect(editTitleButton.exists).toBeTruthy()
          editTitleButton.trigger('click')
          cmp.vm.$nextTick(() => {
            expect(cmp.html()).toMatchSnapshot()
            expect(cmp.find('.el-input__inner').exists).toBeTruthy()
            done()
          })
        })

        it('hides the input after editing title', (done) => {
          const editTitleButton = cmp.find('button.black-color')
          expect(editTitleButton.exists).toBeTruthy()
          editTitleButton.trigger('click')
          cmp.vm.$nextTick(() => {
            expect(cmp.html()).toMatchSnapshot()
            const input = cmp.find('.el-input__inner')
            input.setValue('My new Context Situation Name')
            input.trigger('keyup', { key: 'Enter' })
            cmp.vm.$nextTick(() => {
              expect(cmp.html()).toMatchSnapshot()
              done()
            })
          })
        })

        it('does not hide the input after editing title if its invalid', (done) => {
          const editTitleButton = cmp.find('button.black-color')
          expect(editTitleButton.exists).toBeTruthy()
          editTitleButton.trigger('click')
          cmp.vm.$nextTick(() => {
            expect(cmp.html()).toMatchSnapshot()
            const input = cmp.find('.el-input__inner')
            input.setValue('')
            input.trigger('keyup', { key: 'Enter' })
            cmp.vm.$nextTick(() => {
              expect(cmp.html()).toMatchSnapshot()
              done()
            })
          })
        })

        it('checks the input to not be empty', (done) => {
          const editTitleButton = cmp.find('button.black-color')
          editTitleButton.trigger('click')
          cmp.vm.$nextTick(() => {
            expect(cmp.html()).toMatchSnapshot()
            const input = cmp.find('.el-input__inner')
            input.setValue('')
            input.trigger('keypress', { key: 'Enter' })
            expect(cmp.html()).toMatchSnapshot()
            expect(cmp.find('.el-input__inner').exists).toBeTruthy()
            done()
          })
        })
      })

      it('renders the tag editor', () => {
        expect(cmp.contains(TagEditor)).toBeTruthy()
      })

      it('allows to reset the context situation', () => {
        expect(cmp.find('.el-button--danger.is-plain').exists()).toBeTruthy()
        cmp.vm.contextSituationData.name = 'Different'
        cmp.vm.resetCS()
        expect(cmp.vm.contextSituationData.name).toBe(propsData.contextSituation.name)
      })

      it('allows to submit the context situation', () => {
        expect(cmp.find('.el-button--success').exists()).toBeTruthy()
        ContextSituationService.update = jest.fn().mockImplementation(() => ({
          then: (arg) => arg()
        }))
        cmp.vm.saveCS()
        expect(ContextSituationService.update).toHaveBeenCalled()
      })

      it('emits a deactivate event after submitting the context situation', () => {
        expect(cmp.find('.el-button--success').exists()).toBeTruthy()
        ContextSituationService.update = jest.fn().mockImplementation(() => ({
          then: (arg) => arg(true)
        }))
        cmp.vm.saveCS()
        expect(cmp.emitted().deactivate).toBeTruthy()
      })

      describe('allows to delete the context situation', () => {
        describe('can be deleted', () => {
          beforeEach(() => {
            cmp.vm.$confirm = jest.fn().mockImplementation(() => ({
              then: (arg) => {
                return {
                  catch: () => {
                  }
                }
              }
            }))
            ContextSituationService.remove = jest.fn().mockImplementation(() => ({
              then: (arg) => arg()
            }))
            cmp.vm.$message = jest.fn()
          })
          it('deletes the active Context Situation', () => {
            ContextSituationService.getAll = jest.fn().mockImplementation(() => {
            })
            cmp.vm.$confirm = jest.fn().mockImplementation(() => ({
              then: (arg) => {
                arg()
                return {
                  catch: () => {
                  }
                }
              }
            }))
            cmp.findAll('.el-button--danger').at(1).trigger('click')
            expect(ContextSituationService.remove).toHaveBeenCalledWith(store.state.contextSituation.activeContextSituation)
            expect(router.back).toHaveBeenCalled()
            expect(ContextSituationService.getAll).toHaveBeenCalled()
          })
          it('show as confirmation dialog', () => {
            expect(cmp.html()).toMatchSnapshot()
            const button = cmp.findAll('.el-button--danger').at(1)
            expect(button.exists()).toBeTruthy()
            button.trigger('click')
            expect(cmp.vm.$confirm).toHaveBeenCalledWith('context_situation.delete.message', 'context_situation.delete.warning',
              {
                'cancelButtonText': 'context_situation.delete.cancel',
                'confirmButtonText': 'context_situation.delete.ok',
                'type': 'warning',
                'cancelButtonClass': 'is-plain el-button--info',
                'confirmButtonClass': 'el-button--danger'
              })
          })
          it('does not delete the process if canceled', () => {
            cmp.vm.$confirm = jest.fn().mockImplementation(() => ({
              then: () => {
                return {
                  catch: (arg) => {
                    arg()
                  }
                }
              }
            }))
            cmp.findAll('.el-button--danger').at(1).trigger('click')
            expect(cmp.vm.$message).toHaveBeenCalledWith({ 'message': 'context_situation.delete.cancellation', 'type': 'info' })
            expect(ContextSituationService.remove).not.toHaveBeenCalled()
          })
        })
      })
    })
  })
})
