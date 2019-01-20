import { shallowMount } from '@vue/test-utils'
import { i18n } from '../setupPlugins'

import ContextFactors from '@/pages/ContextFactors.vue'
import ContextFactorService from '@/services/contextFactor'

describe('Pages', () => {
  describe('ContextFactors.vue', () => {
    let store
    let router
    let message
    let cmp
    ContextFactorService.update = jest.fn()

    beforeEach(() => {
      router = {
        push: jest.fn()
      }
      message = {
        error: jest.fn()
      }
      store = {
        getters: {
          'contextFactor/contextFactorsTree': [
            {
              label: 'Pizza Donalds',
              contextFactor: {
                attributes: [],
                id: '5c3c83a5a0983a6a94272513',
                name: 'Pizza Donalds',
                __v: 0
              },
              children: [
                {
                  label: 'Oven',
                  contextFactor: {
                    attributes: [],
                    id: '5c3c83a5a0983a6a94272514',
                    name: 'Oven',
                    parentID: '5c3c83a5a0983a6a94272513',
                    __v: 0
                  },
                  children: [{
                    label: 'Telephone',
                    contextFactor: {
                      attributes: [],
                      id: '5c3c83a5a0983a6a94272516',
                      name: 'Telephone',
                      parentID: '5c3c83a5a0983a6a94272513',
                      __v: 0
                    },
                    children: []
                  }, {
                    label: 'Temperature Sensor',
                    contextFactor: {
                      attributes: [],
                      id: '5c3c83a5a0983a6a94272517',
                      name: 'Temperature Sensor',
                      parentID: '5c3c83a5a0983a6a94272514',
                      __v: 0
                    },
                    children: []
                  }, {
                    label: 'Serial Number',
                    contextFactor: {
                      attributes: [],
                      id: '5c3c83a5a0983a6a94272518',
                      name: 'Serial Number',
                      parentID: '5c3c83a5a0983a6a94272514',
                      __v: 0
                    },
                    children: []
                  }]
                }, {
                  label: 'Fryer',
                  contextFactor: {
                    attributes: [],
                    id: '5c3c83a5a0983a6a94272515',
                    name: 'Fryer',
                    parentID: '5c3c83a5a0983a6a94272513',
                    __v: 0
                  },
                  children: []
                }, {
                  label: 'Ventilator',
                  contextFactor: {
                    attributes: [],
                    id: '5c3c83a5a0983a6a94272519',
                    name: 'Ventilator',
                    parentID: '5c3c83a5a0983a6a94272514',
                    __v: 0
                  },
                  children: []
                }
              ]
            }
          ]
        },
        state: {
          contextFactor: {
            contextFactors: [{
              id: 12,
              name: 'CF'
            }]
          }
        }
      }
      render()
    })

    function render() {
      cmp = shallowMount(ContextFactors, {
        i18n,
        mocks: {
          $store: store,
          $router: router,
          $message: message
        }
      })
    }

    it('renders the tree', () => {
      expect(cmp.html()).toMatchSnapshot()
      expect(cmp.contains('eltree-stub')).toBeTruthy()
    })

    it('renders all contextFactors', () => {
      const data = cmp.find('eltree-stub').props('data')
      expect(data).toEqual(expect.any(Array))
      expect(data.length).toBeGreaterThan(0)
    })

    it('has an edit button', () => {
      cmp.vm.edit(store.getters['contextFactor/contextFactorsTree'][0])
      expect(router.push).toHaveBeenCalledWith({
        name: 'context_factors.edit',
        params: {
          contextFactorID: '5c3c83a5a0983a6a94272513'
        }
      })
    })

    it('renders the icon for a context Type', () => {
      expect(cmp.vm.getIconClasses({ contextFactor: { contextType: undefined } })).toEqual('fa fa-fw')
      expect(cmp.vm.getIconClasses({ contextFactor: { contextType: { icon: 'fa-heart' } } })).toEqual('fa fa-fw fa-heart')
    })

    describe('can filter for the tree nodes', () => {
      beforeEach(() => {
        cmp.vm.$refs.tree.filter = jest.fn()
      })
      it('displays all nodes if no search text given', () => {
        cmp.vm.filterText = ''
        expect(cmp.vm.$refs.tree.filter).toHaveBeenCalled()
        expect(cmp.vm.filterNode('', { label: 'test' })).toBeTruthy()
        expect(cmp.vm.filterNode(undefined, { label: 'test' })).toBeTruthy()
      })
      it('renders tree nodes that match the search text', () => {
        cmp.vm.filterText = 'Test'
        expect(cmp.vm.$refs.tree.filter).toHaveBeenCalled()
        expect(cmp.vm.filterNode('Test', { label: 'test' })).toBeTruthy()
        expect(cmp.vm.filterNode('Test', { label: 'TeST' })).toBeTruthy()
        expect(cmp.vm.filterNode('Test', { label: 'ab_TeSTdde' })).toBeTruthy()
        expect(cmp.vm.filterNode('TeST', { label: 'abtest' })).toBeTruthy()
        expect(cmp.vm.filterNode('Test', { label: 'wrong' })).toBeFalsy()
        expect(cmp.vm.filterNode('Test', { label: 'tesWRONGt' })).toBeFalsy()
      })
    })

    describe('it updates the tree structure on drag and drop', () => {
      it('updates a node, when it was dropped within another node', () => {
        cmp.vm.handleDrop(
          { data: { contextFactor: { id: '1', name: 'A', parentID: '15' } } },
          { data: { contextFactor: { id: '2', name: 'B', parentID: '99' } } },
          'inner'
        )
        expect(ContextFactorService.update).toHaveBeenCalledWith({
          id: '1', name: 'A', parentID: '2'
        })
      })
      it('updates a node, when it was dropped before another node', () => {
        cmp.vm.handleDrop(
          { data: { contextFactor: { id: '1', name: 'A', parentID: '15' } } },
          { data: { contextFactor: { id: '2', name: 'B', parentID: '99' } } },
          'before'
        )
        expect(ContextFactorService.update).toHaveBeenCalledWith({
          id: '1', name: 'A', parentID: '99'
        })
      })
      it('updates a node, when it was dropped after another node', () => {
        cmp.vm.handleDrop(
          { data: { contextFactor: { id: '1', name: 'A', parentID: '15' } } },
          { data: { contextFactor: { id: '2', name: 'B', parentID: '99' } } },
          'after'
        )
        expect(ContextFactorService.update).toHaveBeenCalledWith({
          id: '1', name: 'A', parentID: '99'
        })
      })
      it('can update a node to a root node', () => {
        cmp.vm.handleDrop(
          { data: { contextFactor: { id: '1', name: 'A', parentID: '15' } } },
          { data: { contextFactor: { id: '2', name: 'otherRoot', parentID: undefined } } },
          'before'
        )
        expect(ContextFactorService.update).toHaveBeenCalledWith({
          id: '1', name: 'A', parentID: undefined
        })
      })
      it('prevents dragging for a single root element', () => {
        expect(cmp.vm.allowDrag({
          data: {
            contextFactor: {
              id: '2',
              name: 'root',
              parentID: undefined
            }
          }
        })).toBeFalsy()
      })
      it('does not prevent dragging for non root elements', () => {
        expect(cmp.vm.allowDrag({ data: { contextFactor: { id: '2', name: 'inner', parentID: '19' } } })).toBeTruthy()
      })
      it('does not prevent dragging for multiple root elements', () => {
        store.getters['contextFactor/contextFactorsTree'].push({
          label: 'Other Root',
          contextFactor: {
            attributes: [],
            id: '5c3c83a5a0983a6a94272599',
            name: 'Other Root',
            __v: 0
          },
          children: []
        })
        expect(cmp.vm.allowDrag({
          data: {
            contextFactor: {
              id: '2',
              name: 'root',
              parentID: undefined
            }
          }
        })).toBeTruthy()
      })
    })
    describe('creating new context factors', () => {
      it('can create new context factor with parentID', () => {
        cmp.vm.newContextFactor.name = 'New CF'
        cmp.vm.$refs.newFactorForm.validate = jest.fn().mockImplementation((valid) => {
          valid(true)
        })
        cmp.vm.$refs.tree.getCurrentNode = jest.fn().mockImplementation(() => {
          return { contextFactor: { id: '12' } }
        })
        ContextFactorService.create = jest.fn().mockImplementation(() => ({
          then: (arg) => arg()
        }))
        cmp.vm.createNew()
        expect(ContextFactorService.create).toHaveBeenCalledWith({
          '_id': undefined,
          'attributes': [],
          'context_type': undefined,
          'name': 'New CF',
          'parentID': '12'
        })
      })
      it('can create new context factor as root', () => {
        cmp.vm.newContextFactor.name = 'New CF'
        cmp.vm.$refs.newFactorForm.validate = jest.fn().mockImplementation((valid) => {
          valid(true)
        })
        cmp.vm.$refs.tree.getCurrentNode = jest.fn().mockImplementation(() => {
          return undefined
        })
        ContextFactorService.create = jest.fn().mockImplementation(() => ({
          then: (arg) => arg()
        }))
        cmp.vm.createNew()
        expect(ContextFactorService.create).toHaveBeenCalledWith({
          '_id': undefined,
          'attributes': [],
          'context_type': undefined,
          'name': 'New CF',
          'parentID': undefined
        })
      })

      it('cannot create new context factor if validation failed', () => {
        cmp.vm.newContextFactor.name = 'New CF'
        cmp.vm.$refs.newFactorForm.validate = jest.fn().mockImplementation((valid) => {
          valid(false)
        })
        cmp.vm.$refs.tree.getCurrentNode = jest.fn().mockImplementation(() => {
          return undefined
        })
        ContextFactorService.create = jest.fn().mockImplementation(() => ({
          then: (arg) => arg()
        }))
        cmp.vm.createNew()
        expect(ContextFactorService.create).not.toHaveBeenCalled()
      })

      it('opens the new context factor in edit view', () => {
        cmp.vm.newContextFactor.name = 'New CF'
        cmp.vm.$refs.newFactorForm.validate = jest.fn().mockImplementation((valid) => {
          valid(true)
        })
        cmp.vm.$refs.tree.getCurrentNode = jest.fn().mockImplementation(() => {
          return undefined
        })
        ContextFactorService.create = jest.fn().mockImplementation(() => ({
          then: (arg) => arg()
        }))
        cmp.vm.createNew()
        expect(router.push).toHaveBeenCalledWith({
          name: 'context_factors.edit',
          params: {
            contextFactorID: 12
          }
        })
      })
    })
  })
})
