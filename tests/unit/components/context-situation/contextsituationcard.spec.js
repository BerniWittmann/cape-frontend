import { shallowMount } from '@vue/test-utils'
import { i18n } from '../../setupPlugins'

import Tag from '@/components/Tag.vue'
import ContextSituationCard from '@/components/context-situation/ContextSituationCard.vue'

describe('Components', () => {
  describe('ContextSituationCard', () => {
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
        push: jest.fn()
      }
      render()
    })

    function render() {
      cmp = shallowMount(ContextSituationCard, {
        i18n,
        propsData,
        mocks: {
          $store: store,
          $router: router
        }
      })
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
        const rules = cmp.find('.rules')
        expect(rules.exists()).toBeTruthy()
        expect(rules.isVisible()).toBeFalsy()
        expect(rules.text()).toEqual('The Rules String')
      })

      it('displays the tags', () => {
        const tags = cmp.findAll(Tag)

        expect(tags.length).toEqual(2)
        expect(tags.at(0).props('tag')).toEqual(store.state.tag.tags[1])
        expect(tags.at(1).props('tag')).toEqual(store.state.tag.tags[2])
        expect(tags.at(0).props('size')).toEqual('small')
        expect(tags.at(1).props('size')).toEqual('small')
      })

      it('displays a shadow on hover', () => {
        const card = cmp.find('elcard-stub')
        expect(card.attributes('shadow')).toEqual('hover')
      })

      it('navigates to route when clicked', () => {
        cmp.find('elcard-stub').trigger('click')

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
        const rules = cmp.find('.rules')
        expect(rules.exists()).toBeTruthy()
        expect(rules.isVisible()).toBeTruthy()
        expect(rules.text()).toEqual('The Rules String')
      })

      it('displays the tags', () => {
        const tags = cmp.findAll(Tag)

        expect(tags.length).toEqual(2)
        expect(tags.at(0).props('tag')).toEqual(store.state.tag.tags[1])
        expect(tags.at(1).props('tag')).toEqual(store.state.tag.tags[2])
        expect(tags.at(0).props('size')).toEqual('normal')
        expect(tags.at(1).props('size')).toEqual('normal')
      })

      it('displays a shadow', () => {
        const card = cmp.find('elcard-stub')
        expect(card.attributes('shadow')).toEqual('always')
      })

      it('navigates to route when clicked', () => {
        cmp.find('elcard-stub').trigger('click')

        expect(router.push).toHaveBeenCalledWith({
          name: 'context_situations.single',
          params: {
            contextSituationID: '142'
          }
        })
      })
    })
  })
})
