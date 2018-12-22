import { mount } from '@vue/test-utils'
import { i18n } from '../../setupPlugins'

import ContextTypeSettings from '@/components/settings/ContextTypeSettings.vue'
import ContextType from '@/components/ContextType.vue'
import FAIconPicker from '@/components/settings/FAIconPicker.vue'

import contextTypeService from '@/services/contextType'

// mock the random function to get always the same id for working snapshots
const mockMath = Object.create(global.Math)
mockMath.random = () => 0.5
global.Math = mockMath

describe('Components', () => {
  describe('ContextTypeSettings', () => {
    let store
    let cmp

    contextTypeService.remove = jest.fn()
    contextTypeService.create = jest.fn().mockImplementation(() => ({
      then: (arg) => arg()
    }))

    beforeEach((done) => {
      store = {
        state: {
          contextType: {
            contextTypes: [{
              id: '142',
              name: 'My first ContextType',
              icon: 'fa-heart'
            }, {
              id: '3',
              name: 'Context Type',
              icon: 'fa-play'
            }]
          }
        }
      }
      render(done)
    })

    function render(done) {
      cmp = mount(ContextTypeSettings, {
        i18n,
        mocks: {
          $store: store
        } // ,
        // sync: false
      })
      cmp.vm.$nextTick(done)
    }

    it('renders', () => {
      expect(cmp.html()).toMatchSnapshot()
    })

    it('renders all available ContextTypes', () => {
      // correctness is tested in the component ContextType
      const contextTypes = cmp.findAll(ContextType)
      expect(contextTypes.length).toEqual(3)
      expect(contextTypes.at(0).props('contextType')).toEqual(store.state.contextType.contextTypes[0])
      expect(contextTypes.at(1).props('contextType')).toEqual(store.state.contextType.contextTypes[1])
    })

    it('the existing contextTypes can be deleted', () => {
      const contextTypes = cmp.findAll(ContextType)
      expect(contextTypes.length).toEqual(3)

      // store.state.contextType.contextTypes[0].closable = true
      cmp.vm.deletable = true

      expect(contextTypes.at(0).props('closable')).toBe(true)
      expect(contextTypes.at(1).props('closable')).toBe(true)
      expect(contextTypes.at(2).props('closable')).toBe(false)

      contextTypes.at(1).vm.$emit('close')

      expect(contextTypeService.remove).toHaveBeenCalledWith(store.state.contextType.contextTypes[1])
    })

    it('displays a preview of the contextType', () => {
      cmp.findAll('.el-input__inner').at(1).setValue('My new Context Type')
      cmp.vm.contextType.icon = 'fa-heart'

      const contextTypes = cmp.findAll(ContextType)
      expect(contextTypes.length).toEqual(3)
      expect(contextTypes.at(2).props('contextType')).toEqual({
        icon: 'fa-heart',
        name: 'My new Context Type'
      })
    })

    it('shows an error if no name given on submit', () => {
      console.warn = jest.fn()
      cmp.vm.submit()

      const warning = cmp.find('.el-form-item__error')
      expect(warning.exists()).toBeTruthy()
      expect(warning.text()).toContain('settings.context_type.validation.name.required')
    })

    it('shows a icon picker', () => {
      expect(cmp.contains(FAIconPicker)).toBeTruthy()
    })

    it('validates the form on submit', () => {
      cmp.vm.submit()

      expect(cmp.contains('.el-form-item__error')).toBeTruthy()
    })

    it('the form has a submit and a cancel button', () => {
      expect(cmp.findAll('.el-form-item > .el-form-item__content > .el-button').length).toEqual(2)
    })

    it('the form can be reset', () => {
      cmp.findAll('.el-input__inner').at(1).setValue('My new Context Type')
      cmp.vm.contextType.icon = 'fa-stop'
      expect(cmp.vm.contextType.name).toEqual('My new Context Type')

      cmp.vm.reset()

      expect(cmp.vm.contextType.name).toEqual(undefined)
      expect(cmp.vm.contextType.icon).toEqual('fa-heart')
    })

    it('the form can be submitted', () => {
      cmp.findAll('.el-input__inner').at(1).setValue('My new Context Type')
      cmp.vm.contextType.icon = 'fa-heart'
      cmp.vm.submit()

      expect(contextTypeService.create).toHaveBeenCalledWith({
        _id: undefined,
        icon: 'fa-heart',
        name: 'My new Context Type'
      })
    })

    it('the form is reset after submitting', () => {
      cmp.findAll('.el-input__inner').at(1).setValue('My new Context Type')
      cmp.vm.contextType.icon = 'fa-stop'
      cmp.vm.submit()
      expect(cmp.vm.contextType.icon).toEqual('fa-heart')
      expect(cmp.vm.contextType.name).toEqual(undefined)
    })

    it('hides the hover on the list of context types', () => {
      Object.defineProperty(global, 'document', {})
      var t = document.createElement('div')
      t.className = 'el-table--enable-row-hover'
      document.body.append(t)

      expect(document.getElementsByClassName('el-table--enable-row-hover').length).toBeLessThan(2)
      cmp.vm.hideHover()
      expect(document.getElementsByClassName('el-table--enable-row-hover').length).toBeLessThan(1)
      cmp.vm.hideHover()
      expect(document.getElementsByClassName('el-table--enable-row-hover').length).toBeLessThan(1)
    })

    it('has function to update the layout of the table by resetting the deletable feature', () => {
      expect(cmp.vm.deletable).toBe(false)
      cmp.vm.updateLayoutTable()
      cmp.vm.deletable = true
      cmp.vm.updateLayoutTable()
      expect(cmp.vm.deletable).toBe(false)
    })

    it('can set the icon that can be changed', () => {
      expect(cmp.vm.contextType.icon).not.toEqual('fa-stop')
      cmp.vm.showIcon('fa-stop')
      expect(cmp.vm.contextType.icon).toEqual('fa-stop')
    })
  })
})
