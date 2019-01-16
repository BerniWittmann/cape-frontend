import { shallowMount, mount } from '@vue/test-utils'
import { i18n } from '../setupPlugins'

import Settings from '@/pages/Settings.vue'
import TagSettings from '@/components/settings/TagSettings.vue'
import EmptySlotComponent from '../EmptySlotComponent.vue'

console.error = jest.fn()

// mock the random function to get always the same id for working snapshots
const mockMath = Object.create(global.Math)
mockMath.random = () => 0.5
global.Math = mockMath

describe('Pages', () => {
  describe('Settings', () => {
    it('renders', () => {
      const wrapper = shallowMount(Settings, {
        i18n,
        stubs: {
          'v-layout': EmptySlotComponent
        }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('updates the context type table layout on tab click', () => {
      Settings.updateContextType = jest.fn()
      let store = {
        state: {
          contextType: {
            contextTypes: [{
              id: '142',
              name: 'My first ContextType',
              icon: 'fa-heart'
            }]
          },
          tag: {
            tags: [{
              id: '142',
              name: 'My Tag',
              color: '#FF0000'
            }]
          }
        }
      }

      let cmp = mount(Settings, {
        i18n,
        mocks: {
          $store: store
          // sync: false
        }
      })

      expect(cmp.html()).toMatchSnapshot()
      const tabs = cmp.findAll('.el-tab-pane')
      expect(tabs.length).toBe(3)

      let tab = {
        label: 'settings.tags'
      }
      let m = jest.fn()

      cmp.vm.$refs.tagSettings.updateLayoutTable = m
      cmp.find('.el-tabs').vm.$emit('tab-click', tab)
      expect(m).toHaveBeenCalled()

      tab.label = 'settings.context_types'
      cmp.vm.$refs.contextTypeSettings.updateLayoutTable = m
      cmp.find('.el-tabs').vm.$emit('tab-click', tab)
      expect(m).toHaveBeenCalled()
    })
  })
})
