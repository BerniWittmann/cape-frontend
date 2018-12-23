import { mount } from '@vue/test-utils'
import { i18n } from '../../setupPlugins'
import { Checkbox } from 'element-ui'

import ProcessModelerSettings from '@/components/settings/ProcessModelerSettings.vue'

import * as helpers from '@/utils/helpers'

describe('Components', () => {
  describe('ProcessModelerSettings', () => {
    let cmp

    helpers.hasProcessModelerRulesEnabled = jest.fn().mockReturnValue(true)

    beforeEach(() => {
      render()
    })

    function render() {
      cmp = mount(ProcessModelerSettings, {
        i18n,
        stubs: {
          Checkbox
        }
      })
    }

    it('renders', () => {
      expect(cmp.html()).toMatchSnapshot()
    })

    describe('it can toggle the custom Rules', () => {
      describe('loads the existing state on render', () => {
        it('loads the active state', () => {
          helpers.hasProcessModelerRulesEnabled = jest.fn().mockReturnValue(true)
          render()

          expect(cmp.html()).toMatchSnapshot()
          expect(cmp.find('.el-checkbox__input').classes('is-checked')).toBeTruthy()
        })

        it('loads the inactive state', () => {
          helpers.hasProcessModelerRulesEnabled = jest.fn().mockReturnValue(false)
          render()

          expect(cmp.html()).toMatchSnapshot()
          expect(cmp.find('.el-checkbox__input').classes('is-checked')).toBeFalsy()
        })
      })

      describe('it writes the state to a cookie', () => {
        it('can activate the state', () => {
          helpers.hasProcessModelerRulesEnabled = jest.fn().mockReturnValue(false)
          render()
          cmp.find('input').setChecked(true)

          expect(document.cookie).toEqual('enableProcessValidation=false')
        })

        it('can deactivate the state', () => {
          helpers.hasProcessModelerRulesEnabled = jest.fn().mockReturnValue(true)
          render()
          cmp.find('input').setChecked(false)

          expect(document.cookie).toEqual('enableProcessValidation=true')
        })
      })
    })
  })
})
