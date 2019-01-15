import { mount } from '@vue/test-utils'
import { i18n } from '../setupPlugins'

import ContextFactorEditDialog from '@/dialogs/ContextFactorEditDialog.vue'
import ContextFactorService from '@/services/contextFactor'

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
            activeContextFactor: {
              id: '1',
              name: 'My Context Factor'
            }
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
          const input = cmp.find('input')
          expect(input.exists()).toBeTruthy()
        })

        it('shows validation error if no name given', (done) => {
          const input = cmp.find('input')
          input.setValue('')
          input.trigger('blur')
          cmp.vm.$nextTick(() => {
            expect(cmp.html()).toContain('context_factor.edit.validation.name.required')
            done()
          })
        })

        it('shows validation error if name is too short', (done) => {
          const input = cmp.find('input')
          input.setValue('a')
          input.trigger('blur')
          cmp.vm.$nextTick(() => {
            expect(cmp.html()).toContain('context_factor.edit.validation.name.min')
            done()
          })
        })
      })
    })

    it('has a cancel button', () => {
      const button = cmp.find('.el-button--text')
      expect(button.exists()).toBeTruthy()
      button.trigger('click')
      expect(router.back).toHaveBeenCalled()
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
        const input = cmp.find('input')
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

      it('does not save if the form is invalid', () => {
        const input = cmp.find('input')
        expect(input.exists()).toBeTruthy()
        input.setValue('')
        cmp.find('.el-button--success').trigger('click')
        expect(ContextFactorService.update).not.toHaveBeenCalled()
      })

      it('does save if the form is valid', () => {
        const input = cmp.find('input')
        expect(input.exists()).toBeTruthy()
        input.setValue('New Name')
        cmp.find('.el-button--success').trigger('click')
        expect(ContextFactorService.update).toHaveBeenCalledWith({
          id: '1',
          name: 'New Name'
        })
      })

      it('closes the dialog after successful save', () => {
        const input = cmp.find('input')
        expect(input.exists()).toBeTruthy()
        input.setValue('New Name')
        cmp.find('.el-button--success').trigger('click')
        expect(ContextFactorService.update).toHaveBeenCalledWith({
          id: '1',
          name: 'New Name'
        })
        expect(router.back).toHaveBeenCalled()
      })

      it('does not close the dialog after unsuccessful save', (done) => {
        ContextFactorService.update = jest.fn().mockImplementation(() => ({
          then: (arg) => arg(false)
        }))
        const input = cmp.find('input')
        expect(input.exists()).toBeTruthy()
        input.setValue('New Name')
        cmp.find('.el-button--success').trigger('click')
        expect(ContextFactorService.update).toHaveBeenCalled()
        expect(router.back).not.toHaveBeenCalled()
        done()
      })
    })
  })
})
