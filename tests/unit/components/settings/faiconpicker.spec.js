import { mount } from '@vue/test-utils'
import { i18n } from '../../setupPlugins'

import FontAwesomeChooser from '@/components/settings/FAIconPicker.vue'
import FontAwesomeIcons from '@/utils/fontAwesomeIcons'

jest.mock('@/utils/fontAwesomeIcons', () => (
  [
    'fa-glass',
    'fa-music',
    'fa-search',
    'fa-envelope-o',
    'fa-heart'
  ]
))

describe('Components', () => {
  describe('Font Awesome Icon Picker', () => {
    let propsData
    let cmp

    beforeEach(() => {
      propsData = {
        search: ''
      }
      render()
    })

    function render() {
      cmp = mount(FontAwesomeChooser, {
        i18n,
        propsData
      })
    }

    it('renders', () => {
      expect(cmp.html()).toMatchSnapshot()
      const fontAwesomeChooserComponent = cmp.find('.font-awesome-chooser')
      expect(fontAwesomeChooserComponent.exists()).toBe(true)
    })

    it('renders the search', () => {
      expect(cmp.find('.el-input').exists()).toBe(true)
    })

    it('renders the close button', () => {
      const closeBtn = cmp.find('.el-button')
      expect(closeBtn.exists()).toBe(true)
    })

    it('renders all icons', () => {
      expect(cmp.find('icon-overview').exists())
      FontAwesomeIcons.forEach(function (icon) {
        expect(cmp.find('.' + icon).exists()).toBe(true)
      })
      expect(cmp.findAll('.icon-item').length).toEqual(FontAwesomeIcons.length)
    })

    it('renders readable icon names', () => {
      for (let i = 0; i < FontAwesomeIcons.length; i++) {
        const text = cmp.findAll('.text').at(i)
        expect(text.exists()).toBe(true)
        expect(text.text()).toEqual(FontAwesomeIcons[i].substring(3))
      }
    })

    it('can handle an empty icon list', () => {
      cmp.vm.search = 'someTextToMakeNoIconsToBeShown'
      expect(cmp.find('icon-overview').exists())
      expect(cmp.findAll('.icon-item')).toEqual({})
    })

    it('can search the icons', () => {
      cmp.vm.search = 'mus'
      expect(cmp.find('.fa-music').exists()).toBe(true)
      expect(cmp.findAll('.icon-item').length).toEqual(1)
    })

    it('emits an event if closed', () => {
      expect(cmp.emitted('close')).toBeFalsy()
      const closeBtn = cmp.find('.el-button')
      closeBtn.trigger('click')
      expect(cmp.emitted('close')).toBeTruthy()
    })

    it('emits an event with the icon if an icon is clicked', () => {
      expect(cmp.emitted('click')).toBeFalsy()
      cmp.find('.icon-item').trigger('click')
      expect(cmp.emitted('click')).toBeTruthy()
      expect(cmp.emitted('click')[0]).toEqual(['fa-glass'])
    })

    it('closes if an icon is chosen', () => {
      expect(cmp.emitted('close')).toBeFalsy()
      cmp.find('.icon-item').trigger('click')
      expect(cmp.emitted('close')).toBeTruthy()
    })
  })
})
