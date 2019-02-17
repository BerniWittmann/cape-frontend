import { shallowMount } from '@vue/test-utils'
import { i18n } from '../setupPlugins'

import Tag from '@/components/Tag.vue'
import ContextSituationCard from '@/components/context-situation/ContextSituationCard.vue'
import ContextSituations from '@/pages/ContextSituations.vue'
import ContextSituationService from '@/services/contextSituation'

import * as helpers from '@/utils/helpers'

jest.mock('@/utils/helpers')

const situations = [{
  id: 1,
  name: 'CS A',
  tags: [{
    id: 101,
    name: 'Tag 1',
    color: '#FF0000'
  }]
}, {
  id: 2,
  name: 'CS F',
  tags: [{
    id: 101,
    name: 'Tag 1',
    color: '#FF0000'
  }, {
    id: 102,
    name: 'Tag 2',
    color: '#FFF000'
  }]
}, {
  id: 3,
  name: 'CS C',
  tags: [{
    id: 102,
    name: 'Tag 2',
    color: '#FFF000'
  }, {
    id: 103,
    name: 'Tag 3',
    color: '#00FFF0'
  }]
}, {
  id: 4,
  name: 'CS D',
  tags: []
}, {
  id: 5,
  name: 'CS E',
  tags: []
}, {
  id: 6,
  name: 'CS B',
  tags: [{
    id: 101,
    name: 'Tag 1',
    color: '#FF0000'
  }, {
    id: 103,
    name: 'Tag 3',
    color: '#00FFF0'
  }]
}]

describe('Pages', () => {
  describe('ContextSituations.vue', () => {
    let store
    let router
    let cmp
    ContextSituationService.get = jest.fn().mockReturnValue({ then: (arg) => arg() })

    beforeEach(() => {
      router = {
        push: jest.fn()
      }
      store = {
        state: {
          tag: {
            tags: [{
              id: 101,
              name: 'Tag 1',
              color: '#FF0000'
            }, {
              id: 102,
              name: 'Tag 2',
              color: '#FFF000'
            }, {
              id: 103,
              name: 'Tag 3',
              color: '#00FFF0'
            }, {
              id: 104,
              name: 'Tag 4',
              color: '#000000'
            }]
          },
          contextSituation: {
            activeContextSituation: undefined,
            contextSituations: situations
          }
        },
        dispatch: jest.fn().mockReturnValue({ then: (arg) => arg() })
      }
      render()
    })

    function render() {
      cmp = shallowMount(ContextSituations, {
        i18n,
        mocks: {
          $store: store,
          $router: router
        }
      })
    }

    it('renders', () => {
      expect(cmp.html()).toMatchSnapshot()
    })

    it('renders the Situations', () => {
      const situations = cmp.findAll(ContextSituationCard)

      expect(situations.length).toEqual(6)

      expect(situations.at(0).props('contextSituation')).toEqual(store.state.contextSituation.contextSituations[0])
      expect(situations.at(1).props('contextSituation')).toEqual(store.state.contextSituation.contextSituations[5])
      expect(situations.at(2).props('contextSituation')).toEqual(store.state.contextSituation.contextSituations[2])
      expect(situations.at(3).props('contextSituation')).toEqual(store.state.contextSituation.contextSituations[3])
      expect(situations.at(4).props('contextSituation')).toEqual(store.state.contextSituation.contextSituations[4])
      expect(situations.at(5).props('contextSituation')).toEqual(store.state.contextSituation.contextSituations[1])
    })

    describe('renders the active Situation first', () => {
      for (let i = 0; i < situations.length; i++) {
        it('holds for situation ' + i, () => {
          store.state.contextSituation.activeContextSituation = store.state.contextSituation.contextSituations[i]

          const situations = cmp.findAll(ContextSituationCard)

          expect(situations.length).toEqual(6)

          expect(situations.at(0).props('contextSituation')).toEqual(store.state.contextSituation.contextSituations[i])
        })
      }
    })

    describe('it can filter by tags', () => {
      it('renders a select for the tags', () => {
        const sel = cmp.find('elselect-stub')

        expect(sel.exists()).toBeTruthy()
        expect(sel.attributes('clearable')).toEqual('true')

        const opts = sel.findAll('eloption-stub')
        expect(opts.length).toEqual(4)

        for (let i = 0; i < opts.length; i++) {
          const opt = opts.at(i)
          const tag = store.state.tag.tags[i]

          expect(opt.contains(Tag)).toBeTruthy()
          expect(opt.find(Tag).props('tag')).toEqual(tag)
          expect(opt.attributes('label')).toEqual(tag.name)
          expect(opt.attributes('value')).toEqual(tag.id.toString())
        }
      })

      it('does not render the select field if no tags available', () => {
        store.state.tag.tags = []
        render()
        expect(cmp.contains('elselect-stub')).toBeFalsy()
      })

      it('only displays situations with the correct tags', () => {
        cmp.vm.selectedTags = [101]
        const situations = cmp.findAll(ContextSituationCard)

        expect(situations.length).toEqual(3)

        expect(situations.at(0).props('contextSituation')).toEqual(store.state.contextSituation.contextSituations[0])
        expect(situations.at(1).props('contextSituation')).toEqual(store.state.contextSituation.contextSituations[5])
        expect(situations.at(2).props('contextSituation')).toEqual(store.state.contextSituation.contextSituations[1])
      })

      it('can select multiple tags', () => {
        const sel = cmp.find('elselect-stub')

        expect(sel.exists()).toBeTruthy()
        expect(sel.attributes('multiple')).toEqual('true')

        cmp.vm.selectedTags = [101, 103]

        const situations = cmp.findAll(ContextSituationCard)

        expect(situations.length).toEqual(4)

        expect(situations.at(0).props('contextSituation')).toEqual(store.state.contextSituation.contextSituations[0])
        expect(situations.at(1).props('contextSituation')).toEqual(store.state.contextSituation.contextSituations[5])
        expect(situations.at(2).props('contextSituation')).toEqual(store.state.contextSituation.contextSituations[2])
        expect(situations.at(3).props('contextSituation')).toEqual(store.state.contextSituation.contextSituations[1])
      })

      it('displays message with none found', () => {
        cmp.vm.selectedTags = [104]
        const situations = cmp.findAll(ContextSituationCard)

        expect(situations.length).toEqual(0)

        const text = cmp.find('p')
        expect(text.exists()).toBeTruthy()
        expect(text.text()).toEqual('context_situation.none_found')
      })

      it('still renders the active Situation although it does not have the correct tag', () => {
        store.state.contextSituation.activeContextSituation = store.state.contextSituation.contextSituations[3]
        const sel = cmp.find('elselect-stub')

        expect(sel.exists()).toBeTruthy()
        expect(sel.attributes('multiple')).toEqual('true')

        cmp.vm.selectedTags = [101, 103]

        const situations = cmp.findAll(ContextSituationCard)

        expect(situations.length).toEqual(5)

        expect(situations.at(0).props('contextSituation')).toEqual(store.state.contextSituation.contextSituations[3])
        expect(situations.at(1).props('contextSituation')).toEqual(store.state.contextSituation.contextSituations[0])
        expect(situations.at(2).props('contextSituation')).toEqual(store.state.contextSituation.contextSituations[5])
        expect(situations.at(3).props('contextSituation')).toEqual(store.state.contextSituation.contextSituations[2])
        expect(situations.at(4).props('contextSituation')).toEqual(store.state.contextSituation.contextSituations[1])
      })
    })
    describe('creating new context Situation', () => {
      it('can create new context Situation', () => {
        cmp.vm.newContextSituation.name = 'New CS'
        cmp.vm.$refs.newFactorForm.resetFields = jest.fn()
        cmp.vm.$refs.newFactorForm.validate = jest.fn().mockImplementation((valid) => {
          valid(true)
        })
        ContextSituationService.create = jest.fn().mockImplementation(() => ({
          then: (arg) => arg()
        }))
        ContextSituationService.getAll = jest.fn()
        cmp.vm.createNew()
        expect(ContextSituationService.create).toHaveBeenCalledWith({
          '_id': undefined,
          'tags': [],
          'rules': undefined,
          'name': 'New CS'
        })
      })

      it('cannot create new context Situation if validation failed', () => {
        cmp.vm.newContextSituation.name = 'New CS'
        cmp.vm.$refs.newFactorForm.validate = jest.fn().mockImplementation((valid) => {
          valid(false)
        })
        ContextSituationService.create = jest.fn().mockImplementation(() => ({
          then: (arg) => arg()
        }))
        cmp.vm.$refs.newFactorForm.resetFields = jest.fn()
        cmp.vm.createNew()
        expect(ContextSituationService.create).not.toHaveBeenCalled()
      })
    })

    describe('it can filter by search Text', () => {
      it('renders a input for the text', () => {
        const input = cmp.findAll('elinput-stub').at(1)
        expect(input.exists()).toBeTruthy()
        expect(input.attributes('clearable')).toEqual('true')
      })

      it('only displays situations with the correct name', () => {
        cmp.vm.filterText = 'b'
        const situations = cmp.findAll(ContextSituationCard)

        expect(situations.length).toEqual(1)

        expect(situations.at(0).props('contextSituation')).toEqual(store.state.contextSituation.contextSituations[5])
      })

      it('displays all situations with no name', () => {
        cmp.vm.filterText = ''
        const situations = cmp.findAll(ContextSituationCard)

        expect(situations.length).toEqual(6)
      })

      it('displays message with none found', () => {
        cmp.vm.filterText = 'arbitrary so that it does not find'
        const situations = cmp.findAll(ContextSituationCard)

        expect(situations.length).toEqual(0)

        const text = cmp.find('p')
        expect(text.exists()).toBeTruthy()
        expect(text.text()).toEqual('context_situation.none_found')
      })

      it('still renders the active Situation although it does not have the correct name', () => {
        store.state.contextSituation.activeContextSituation = store.state.contextSituation.contextSituations[3]
        const sel = cmp.find('elselect-stub')

        expect(sel.exists()).toBeTruthy()
        expect(sel.attributes('multiple')).toEqual('true')

        cmp.vm.filterText = 'A'

        const situations = cmp.findAll(ContextSituationCard)

        expect(situations.length).toEqual(2)

        expect(situations.at(0).props('contextSituation')).toEqual(store.state.contextSituation.contextSituations[3])
        expect(situations.at(1).props('contextSituation')).toEqual(store.state.contextSituation.contextSituations[0])
      })
    })

    it('when clicking the background it unselects the currently active Situation', () => {
      store.state.contextSituation.activeContextSituation = store.state.contextSituation.contextSituations[3]

      const bg = cmp.find({ ref: 'context-situation-cards' })
      bg.trigger('click')

      expect(router.push).toHaveBeenCalledWith({
        name: 'context_situations'
      })
      expect(store.dispatch).toHaveBeenCalledWith('contextSituation/unsetActive')
    })

    describe('navigation Guards', () => {
      let next
      beforeEach(() => {
        next = jest.fn()
        jest.spyOn(helpers, 'scrollToTop')
        jest.clearAllMocks()
      })
      describe('beforeRouteEnter', () => {
        it('it has the beforeRouteEnter Hook', () => {
          expect(cmp.vm.$options.beforeRouteEnter).toEqual(expect.any(Function))
        })

        it('scrolls to top', () => {
          cmp.vm.$options.beforeRouteEnter({}, {}, next)

          expect(helpers.scrollToTop).toHaveBeenCalled()
          expect(next).toHaveBeenCalled()
        })
      })

      describe('beforeRouteUpdate', () => {
        it('it has the beforeRouteUpdate Hook', () => {
          expect(cmp.vm.$options.beforeRouteUpdate).toEqual(expect.any(Function))
        })

        it('loads the correct situation when going to the situation route', () => {
          cmp.vm.$options.beforeRouteUpdate.call({ $store: store }, {
            name: 'context_situations.single',
            params: { contextSituationID: '42' }
          }, {}, next)

          expect(ContextSituationService.get).toHaveBeenCalledWith({ id: '42' })
          expect(helpers.scrollToTop).toHaveBeenCalled()
          expect(store.dispatch).not.toHaveBeenCalled()
          expect(next).toHaveBeenCalled()
        })

        it('unsets the active Context Situation for other routes', () => {
          cmp.vm.$options.beforeRouteUpdate.call({ $store: store }, { name: 'other' }, {}, next)

          expect(store.dispatch).toHaveBeenCalledWith('contextSituation/unsetActive')
          expect(helpers.scrollToTop).not.toHaveBeenCalled()
          expect(ContextSituationService.get).not.toHaveBeenCalled()
          expect(next).toHaveBeenCalled()
        })
      })

      describe('beforeRouteLeave', () => {
        it('it has the beforeRouteLeave Hook', () => {
          expect(cmp.vm.$options.beforeRouteLeave).toEqual(expect.any(Function))
        })

        it('unsets the active Context Situation', () => {
          cmp.vm.$options.beforeRouteLeave.call({ $store: store }, {}, {}, next)

          expect(store.dispatch).toHaveBeenCalledWith('contextSituation/unsetActive')
          expect(next).toHaveBeenCalled()
        })
      })
    })
  })
})
