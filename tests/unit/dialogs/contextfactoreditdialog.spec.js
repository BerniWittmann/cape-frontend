import { mount } from '@vue/test-utils'
import { i18n } from '../setupPlugins'

import ContextFactorEditDialog from '@/dialogs/ContextFactorEditDialog.vue'
import ContextFactorService from '@/services/contextFactor'
import ContextFactor from '@/models/contextFactor'
import ContextType from '@/models/contextType'
import ContextAttribute from '@/models/contextAttribute'
import InputType from '@/components/InputType'

describe('Dialogs', () => {
  describe('Context Factor Edit Dialog', () => {
    let store
    let cmp

    console.warn = jest.fn()
    ContextFactorService.update = jest.fn().mockImplementation(() => ({
      then: (arg) => arg(true)
    }))

    const router = {
      back: jest.fn(),
      push: jest.fn()
    }
    beforeEach((done) => {
      store = {
        state: {
          contextFactor: {
            activeContextFactor: new ContextFactor({
              id: '1',
              name: 'My Context Factor',
              contextType: undefined,
              attributes: [{
                id: 'ca1',
                key: 'foo',
                value: 'bar'
              }]
            }),
            contextFactors: [new ContextFactor({
              id: '1',
              name: 'My Context Factor',
              contextType: undefined,
              attributes: [{
                id: 'ca1',
                key: 'foo',
                value: 'bar',
                type: 'String'
              }]
            })]
          },
          contextType: {
            contextTypes: [new ContextType({
              id: 'ct1',
              name: 'Context Type 1',
              icon: 'fa-heart'
            }), new ContextType({
              id: 'ct2',
              name: 'Context Type 2',
              icon: 'fa-gear'
            })]
          }
        }
      }
      jest.clearAllMocks()
      render()
      cmp.vm.$nextTick(() => {
        done()
      })
    })

    function render() {
      cmp = mount(ContextFactorEditDialog, {
        i18n,
        mocks: {
          $store: store,
          $router: router
        },
        stubs: {
          ElTooltip: '<div><slot></slot></div>',
          ElSelect: '<div id="select-context-type"><slot></slot></div>',
          ElOption: '<div class="select-context-type-option"><slot></slot></div>'
        }
      })
    }

    it('can render', () => {
      expect(cmp.html()).toMatchSnapshot()
    })

    describe('it renders the form', () => {
      it('contains the form', () => {
        expect(cmp.contains('form')).toBeTruthy()
      })

      describe('it has a field for the name', () => {
        it('the field is rendered', () => {
          const input = cmp.findAll('input').at(0)
          expect(input.exists()).toBeTruthy()
        })

        it('shows validation error if no name given', (done) => {
          const input = cmp.findAll('input').at(0)
          input.setValue('')
          input.trigger('blur')
          cmp.vm.$nextTick(() => {
            expect(cmp.html()).toContain('context_factor.edit.validation.name.required')
            done()
          })
        })

        it('shows validation error if name is too short', (done) => {
          const input = cmp.findAll('input').at(0)
          input.setValue('a')
          input.trigger('blur')
          cmp.vm.$nextTick(() => {
            expect(cmp.html()).toContain('context_factor.edit.validation.name.min')
            done()
          })
        })
      })

      describe('it has a field for the context Type', () => {
        it('the field is rendered', () => {
          const input = cmp.find('#select-context-type')
          expect(input.exists()).toBeTruthy()
          expect(input.html()).toMatchSnapshot()
        })

        it('renders the options', () => {
          const input = cmp.find('#select-context-type').findAll('.select-context-type-option')
          expect(input.length).toEqual(3)
        })

        it('has a none option to clear the select', () => {
          const input = cmp.findAll('.select-context-type-option')
          expect(input.at(2).exists()).toBeTruthy()
          cmp.vm.contextFactorData.contextType = cmp.vm.$store.state.contextType.contextTypes[0]
          cmp.vm.selectChange(cmp.vm.contextFactorData.contextType)
          expect(cmp.vm.contextFactorData.contextType).toMatchObject({ 'icon': 'fa-heart', 'name': 'Context Type 1' })
          expect(input.at(2).attributes('value')).toBe('context_factor.none')
          cmp.vm.selectChange(input.at(2).attributes('value'))
          expect(cmp.vm.contextFactorData.contextType).toBeUndefined()
        })

        it('shows correct icon class for context type', () => {
          cmp.vm.contextFactorData.contextType = cmp.vm.$store.state.contextType.contextTypes[0]
          expect(cmp.vm.selectIconClass).toEqual(['el-input__icon', 'fa', 'fa-fw', 'fa-heart'])
          cmp.vm.contextFactorData.contextType = undefined
          expect(cmp.vm.selectIconClass).toEqual('')
        })
      })

      describe('it renders the attributes', () => {
        it('the form is rendered', () => {
          const form = cmp.find('.el-form--inline')
          expect(form.exists()).toBeTruthy()
          expect(form.html()).toMatchSnapshot()
        })

        it('it has a key input', () => {
          const form = cmp.findAll('.el-form--inline').at(1)
          const input = form.findAll('input').at(0)
          expect(input.exists()).toBeTruthy()
          input.setValue('new Key')
          expect(cmp.vm.contextFactorData.attributes[0].key).toEqual('new Key')
        })

        it('shows error on empty key input', (done) => {
          const form = cmp.findAll('.el-form--inline').at(1)
          const input = form.findAll('input').at(0)
          expect(input.exists()).toBeTruthy()
          expect(form.html()).not.toContain('context_factor.edit.validation.attribute.key.required')
          input.setValue('')
          input.trigger('blur')
          cmp.vm.$nextTick(() => {
            expect(form.html()).toContain('context_factor.edit.validation.attribute.key.required')
            done()
          })
        })

        it('has an input for the type and value', () => {
          const form = cmp.findAll('.el-form--inline').at(1)
          const input = form.find(InputType)
          expect(input.exists()).toBeTruthy()

          input.vm.$emit('change', { value: '123', type: 'Number' })
          expect(cmp.vm.contextFactorData.attributes[0].value).toEqual('123')
          expect(cmp.vm.contextFactorData.attributes[0].type).toEqual('Number')
        })

        it('can add an attribute', (done) => {
          const button = cmp.find('.el-button--default')
          expect(button.exists()).toBeTruthy()
          button.trigger('click')
          cmp.vm.$nextTick(() => {
            let forms = cmp.findAll('.el-form--inline')
            expect(cmp.html()).toMatchSnapshot()
            expect(forms.length).toEqual(3)
            button.trigger('click')
            forms = cmp.findAll('.el-form--inline')
            expect(forms.length).toEqual(4)
            done()
          })
        })

        it('can remove an attribute', (done) => {
          const button = cmp.findAll('.el-form--inline').at(0).find('.el-button--info')
          expect(button.exists()).toBeTruthy()
          button.trigger('click')
          cmp.vm.$nextTick(() => {
            let forms = cmp.findAll('.el-form--inline')
            expect(cmp.html()).toMatchSnapshot()
            expect(forms.length).toEqual(1)
            done()
          })
        })

        it('resets the attributes forms on remove', (done) => {
          cmp.vm.contextFactorData.attributes.push(new ContextAttribute({}))
          cmp.vm.contextFactorData.attributes.push(new ContextAttribute({}))

          cmp.vm.$nextTick(() => {
            cmp.vm.$refs['contextAttributeForm0'][0].resetFields = jest.fn()
            cmp.vm.$refs['contextAttributeForm1'][0].resetFields = jest.fn()
            cmp.vm.$refs['contextAttributeForm2'][0].resetFields = jest.fn()

            const button = cmp.findAll('.el-form--inline').at(0).find('.el-button--info')
            expect(button.exists()).toBeTruthy()
            button.trigger('click')
            cmp.vm.$nextTick(() => {
              expect(cmp.vm.$refs['contextAttributeForm0'][0].resetFields).toHaveBeenCalled()
              expect(cmp.vm.$refs['contextAttributeForm1'][0].resetFields).toHaveBeenCalled()
              done()
            })
          })
        })
      })
    })

    it('has a reset button', () => {
      const button = cmp.findAll('.el-button').at(0)
      expect(button.exists()).toBeTruthy()
      cmp.vm.contextFactorData.name = 'different'
      cmp.vm.contextFactorData.parentID = 'new'
      cmp.vm.contextFactorData.contextType = cmp.vm.$store.state.contextType.contextTypes[0]
      cmp.vm.contextFactorData.attributes = [new ContextAttribute({})]
      button.trigger('click')
      cmp.vm.reset()
      expect(cmp.vm.contextFactorData).toMatchObject({
        'attributes': [{ 'key': 'foo', 'value': 'bar' }],
        'name': 'My Context Factor',
        'parentID': undefined
      })
    })

    it('has a save button', () => {
      const button = cmp.find('.el-button--success')
      expect(button.exists()).toBeTruthy()
    })

    it('closes if activeContextFactor is unset', () => {
      cmp.vm.showContextFactorEdit = undefined
      expect(router.back).toHaveBeenCalled()
    })

    describe('it can be saved', () => {
      it('validates the form on submit', (done) => {
        const input = cmp.findAll('input').at(0)
        input.setValue('')
        cmp.vm.$nextTick(() => {
          expect(cmp.html()).not.toContain('context_factor.edit.validation.name.required')
          cmp.find('.el-button--success').trigger('click')
          cmp.vm.$nextTick(() => {
            expect(cmp.html()).toContain('context_factor.edit.validation.name.required')
            done()
          })
        })
      })

      it('validates the attribute inputs on submit', (done) => {
        cmp.vm.contextFactorData.attributes.push(new ContextAttribute({}))
        cmp.vm.$nextTick(() => {
          const inputs = cmp.findAll(InputType)

          inputs.wrappers.forEach((input) => {
            input.vm.validate = jest.fn()
          })

          cmp.find('.el-button--success').trigger('click')

          inputs.wrappers.forEach((input) => {
            expect(input.vm.validate).toHaveBeenCalled()
          })
          done()
        })
      })

      it('does not save if the form is invalid', () => {
        const input = cmp.findAll('input').at(0)
        expect(input.exists()).toBeTruthy()
        input.setValue('')
        cmp.find('.el-button--success').trigger('click')
        expect(ContextFactorService.update).not.toHaveBeenCalled()
      })

      it('does save if the form is valid', () => {
        const input = cmp.findAll('input').at(0)
        expect(input.exists()).toBeTruthy()
        input.setValue('New Name')
        cmp.find('.el-button--success').trigger('click')
        const data = store.state.contextFactor.activeContextFactor
        expect(ContextFactorService.update).toHaveBeenCalledWith(new ContextFactor({
          ...data,
          name: 'New Name'
        }))
      })

      it('closes the dialog after successful save', () => {
        const input = cmp.findAll('input').at(0)
        expect(input.exists()).toBeTruthy()
        input.setValue('New Name')
        cmp.find('.el-button--success').trigger('click')
        const data = store.state.contextFactor.activeContextFactor
        expect(ContextFactorService.update).toHaveBeenCalledWith(new ContextFactor({
          ...data,
          name: 'New Name'
        }))
        expect(router.back).toHaveBeenCalled()
      })

      it('does not close the dialog after unsuccessful save', (done) => {
        ContextFactorService.update = jest.fn().mockImplementation(() => ({
          then: (arg) => arg(false)
        }))
        const input = cmp.findAll('input').at(0)
        expect(input.exists()).toBeTruthy()
        input.setValue('New Name')
        cmp.find('.el-button--success').trigger('click')
        expect(ContextFactorService.update).toHaveBeenCalled()
        expect(router.back).not.toHaveBeenCalled()
        done()
      })

      it('can save the dialog with a context Type', () => {
        cmp.vm.contextFactorData.contextType = store.state.contextType.contextTypes[1]
        cmp.find('.el-button--success').trigger('click')
        const data = store.state.contextFactor.activeContextFactor
        expect(ContextFactorService.update).toHaveBeenCalledWith(new ContextFactor({
          ...data,
          context_type: store.state.contextType.contextTypes[1]
        }))
      })
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
          ContextFactorService.remove = jest.fn().mockImplementation(() => ({
            then: (arg) => arg()
          }))
          cmp.vm.$message = jest.fn()
        })
        it('deletes the active Context Factor', () => {
          ContextFactorService.getAll = jest.fn().mockImplementation(() => {
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
          expect(ContextFactorService.remove).toHaveBeenCalledWith(store.state.contextFactor.activeContextFactor)
          expect(router.back).toHaveBeenCalled()
          expect(ContextFactorService.getAll).toHaveBeenCalled()
        })
        it('show as confirmation dialog', () => {
          expect(cmp.html()).toMatchSnapshot()
          const button = cmp.findAll('.el-button--danger').at(1)
          expect(button.exists()).toBeTruthy()
          button.trigger('click')
          expect(cmp.vm.$confirm).toHaveBeenCalledWith('context_factor.delete.message', 'context_factor.delete.warning',
            {
              'cancelButtonText': 'context_factor.delete.cancel',
              'confirmButtonText': 'context_factor.delete.ok',
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
          expect(cmp.vm.$message).toHaveBeenCalledWith({
            'message': 'context_factor.delete.cancellation',
            'type': 'info'
          })
          expect(ContextFactorService.remove).not.toHaveBeenCalled()
        })
      })
    })
  })
})
