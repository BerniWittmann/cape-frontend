import { shallowMount } from '@vue/test-utils'
import { i18n } from '../../setupPlugins'

import RulesCell from '@/components/context-factor/RulesCell.vue'

describe('Components', () => {
  describe('RulesCell', () => {
    let cmp
    let props
    beforeEach(() => {
      jest.clearAllMocks()
      props = {
        type: 'String'
      }
      render()
    })

    function render() {
      cmp = shallowMount(RulesCell, {
        i18n,
        propsData: props
      })
    }

    describe('its of type String', () => {
      beforeEach(() => {
        props.type = 'String'
        cmp.setProps(props)
      })
      it('renders', () => {
        expect(cmp.html()).toMatchSnapshot()
      })
      it('renders an input field', () => {
        const input = cmp.find('elinput-stub')
        expect(input.exists()).toBeTruthy()
      })
      it('updates the value on change', () => {
        cmp.vm.data.text = 'My Value'
        cmp.find('elinput-stub').vm.$emit('change')
        expect(cmp.emitted().change).toBeTruthy()
        expect(cmp.emitted().change[1][0]).toEqual('My Value')
      })
      it('integerValues have no value', () => {
        expect(cmp.vm.integerValue1).toBeUndefined()
        expect(cmp.vm.integerValue2).toBeUndefined()
      })
    })

    describe('its of type Number', () => {
      beforeEach(() => {
        props.type = 'Number'
        cmp.setProps(props)
      })
      it('renders', () => {
        expect(cmp.html()).toMatchSnapshot()
      })
      it('renders an input field', () => {
        const input = cmp.find('elinputnumber-stub')
        expect(input.exists()).toBeTruthy()
      })
      it('updates the value on change', () => {
        cmp.vm.data.text = '12'
        cmp.find('elinputnumber-stub').vm.$emit('change')
        expect(cmp.emitted().change).toBeTruthy()
        expect(cmp.emitted().change[1][0]).toEqual('12')
      })
      it('can switch number mode', () => {
        expect(cmp.findAll('elinputnumber-stub').length).toEqual(1)
        const btn = cmp.find('.switchButton')
        expect(btn.exists()).toBeTruthy()
        btn.vm.$emit('click')
        expect(cmp.html()).toMatchSnapshot()
        expect(cmp.findAll('elinputnumber-stub').length).toEqual(2)
      })
      describe('is in interval mode', () => {
        beforeEach(() => {
          const btn = cmp.find('.switchButton')
          expect(btn.exists()).toBeTruthy()
          btn.vm.$emit('click')
          expect(cmp.findAll('elinputnumber-stub').length).toEqual(2)
        })
        it('correctly displays the interval', () => {
          cmp.vm.data.text = '14_15'
          expect(cmp.vm.integerValue1).toEqual('14')
          expect(cmp.vm.integerValue2).toEqual('15')
        })
        it('handles invalid text', () => {
          cmp.vm.data.text = '14'
          expect(cmp.vm.integerValue1).toEqual('14')
          expect(cmp.vm.integerValue2).toBeUndefined()

          cmp.vm.integerValue1 = '12'
          cmp.vm.integerValue2 = '99'
          expect(cmp.vm.data.text).toEqual('12_99')

          cmp.vm.data.text = '_'
          expect(cmp.vm.integerValue1).toBeUndefined()
          expect(cmp.vm.integerValue2).toBeUndefined()
        })
        it('handles undefined values', () => {
          cmp.vm.integerValue1 = undefined
          cmp.vm.integerValue2 = undefined
          expect(cmp.vm.data.text).toEqual('_')

          cmp.vm.data.text = '_'
          cmp.vm.integerValue1 = '99'
          expect(cmp.vm.data.text).toEqual('99_')
        })
        it('can switch number mode', () => {
          const btn = cmp.find('.switchButton')
          expect(btn.exists()).toBeTruthy()
          btn.vm.$emit('click')
          expect(cmp.html()).toMatchSnapshot()
          expect(cmp.findAll('elinputnumber-stub').length).toEqual(1)
        })
        it('updates the value on change', () => {
          cmp.vm.integerValue1 = 12
          cmp.vm.integerValue2 = 23
          cmp.find('elinputnumber-stub').vm.$emit('change')
          expect(cmp.emitted().change).toBeTruthy()
          expect(cmp.emitted().change[1][0]).toEqual('12_23')
        })
        it('corrects the interval border ordering', () => {
          cmp.vm.integerValue2 = 30
          cmp.vm.integerValue1 = 90
          expect(cmp.vm.data.text).toEqual('30_90')
        })
        it('corrects the interval border ordering', () => {
          cmp.vm.integerValue1 = 99
          cmp.vm.integerValue2 = 30
          cmp.vm.integerValue1 = 1
          cmp.find('elinputnumber-stub').vm.$emit('change')
          expect(cmp.emitted().change).toBeTruthy()
          expect(cmp.emitted().change[1][0]).toEqual('1_99')
        })
      })
    })

    describe('its of type Boolean', () => {
      beforeEach(() => {
        props.type = 'Boolean'
        cmp.setProps(props)
      })
      it('renders', () => {
        expect(cmp.html()).toMatchSnapshot()
      })
      it('renders a select', () => {
        const select = cmp.find('elselect-stub')
        expect(select.exists()).toBeTruthy()
        const options = select.findAll('eloption-stub')
        expect(options.length).toEqual(3)
        expect(options.at(0).attributes('value')).toEqual('TRUE')
        expect(options.at(1).attributes('value')).toEqual('FALSE')
        expect(options.at(2).attributes('value')).toEqual('context_factor.none')
      })
      it('updates the value on change', () => {
        cmp.vm.data.text = 'TRUE'
        cmp.find('elselect-stub').vm.$emit('change')
        expect(cmp.emitted().change).toBeTruthy()
        expect(cmp.emitted().change[1][0]).toEqual('TRUE')
      })
      it('updates the empty value on change', () => {
        cmp.vm.data.text = 'TRUE'
        cmp.find('elselect-stub').vm.$emit('change', 'context_factor.none')
        expect(cmp.emitted().change).toBeTruthy()
        expect(cmp.emitted().change[1][0]).toEqual('')
      })
      it('handles an invalid value update', () => {
        cmp.setProps({ value: 'invalid' })
        expect(cmp.vm.data.text).toBeUndefined()
        expect(cmp.emitted().change).toBeTruthy()
        expect(cmp.emitted().change[1][0]).toEqual(undefined)
      })
    })
  })
})
