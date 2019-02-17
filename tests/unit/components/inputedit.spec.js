import { mount } from '@vue/test-utils'
import { i18n } from '../setupPlugins'

import InputEdit from '@/components/InputEdit.vue'

describe('Components', () => {
  describe('InputEdit', () => {
    let propsData
    let cmp

    beforeEach(() => {
      propsData = {
        value: 'Test Text',
        rules: [
          { required: true, message: 'Text is required!', trigger: 'blur' }
        ]
      }
      console.warn = jest.fn()
      render()
    })

    function render() {
      cmp = mount(InputEdit, {
        i18n,
        propsData
      })
    }

    it('renders', () => {
      expect(cmp.html()).toMatchSnapshot()
    })

    it('shows the text', () => {
      expect(cmp.text()).toContain('Test Text')
    })

    it('has an edit button', () => {
      const btn = cmp.find('button')
      expect(btn.exists()).toBeTruthy()
    })

    describe('it can edit the text', () => {
      beforeEach(() => {
        const btn = cmp.find('button')
        expect(btn.exists()).toBeTruthy()

        btn.trigger('click')
      })

      it('hides the edit button', () => {
        const btn = cmp.find('button')
        expect(btn.exists()).toBeFalsy()
      })

      it('shows an input field ', () => {
        expect(cmp.html()).toMatchSnapshot()
        expect(cmp.contains('form')).toBeTruthy()
        expect(cmp.contains('input')).toBeTruthy()
      })

      it('can change the text', () => {
        const input = cmp.find('input')
        input.setValue('My New Text')
        input.trigger('blur')

        expect(cmp.html()).toMatchSnapshot()
        expect(cmp.text()).toContain('My New Text')
      })

      it('hides the input on blur', () => {
        const input = cmp.find('input')
        input.setValue('My New Text')
        input.trigger('blur')

        expect(cmp.html()).toMatchSnapshot()
        expect(cmp.contains('form')).toBeFalsy()
        expect(cmp.contains('input')).toBeFalsy()
        const btn = cmp.find('button')
        expect(btn.exists()).toBeTruthy()
      })

      it('validates the input', (done) => {
        const input = cmp.find('input')
        input.setValue('')
        input.trigger('blur')

        expect(cmp.contains('form')).toBeTruthy()
        expect(cmp.contains('input')).toBeTruthy()
        const btn = cmp.find('button')
        expect(btn.exists()).toBeFalsy()

        cmp.vm.$nextTick(() => {
          expect(cmp.html()).toMatchSnapshot()
          const message = cmp.find('.el-form-item__error')
          expect(message.exists()).toBeTruthy()
          expect(message.text()).toEqual('Text is required!')
          done()
        })
      })

      it('does not validate the input if no rule given', (done) => {
        propsData.rules = undefined
        render()
        const button = cmp.find('button')
        expect(button.exists()).toBeTruthy()

        button.trigger('click')

        const input = cmp.find('input')
        input.setValue('')
        input.trigger('blur')

        expect(cmp.contains('form')).toBeFalsy()
        expect(cmp.contains('input')).toBeFalsy()
        const btn = cmp.find('button')
        expect(btn.exists()).toBeTruthy()

        cmp.vm.$nextTick(() => {
          expect(cmp.html()).toMatchSnapshot()
          const message = cmp.find('.el-form-item__error')
          expect(message.exists()).toBeFalsy()
          expect(cmp.text()).not.toContain('Test Text')
          done()
        })
      })
    })
  })
})
