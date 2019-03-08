import { update, setActive, getGraphNodes, getByTags } from '@/vuex/common/helpers'

import Vue from 'vue'

Vue.i18n = { t: jest.fn().mockReturnValue('untagged') }

describe('Vuex', () => {
  describe('Common', () => {
    describe('Helpers', () => {
      describe('update', () => {
        let store
        let obj
        beforeEach(() => {
          store = {
            objects: [{ id: 1 }, { id: 2 }, { id: 3 }],
            activeObject: undefined
          }
          obj = {
            id: 2,
            foo: 'bar'
          }
        })

        it('it updates an existing object to the store array', () => {
          update(store, 'objects', 'activeObject', obj)

          expect(store.objects.length).toEqual(3)
          expect(store.objects[1]).toEqual(obj)
        })
        it('it does not change the array if it does not exist in the store array', () => {
          update(store, 'objects', 'activeObject', { id: 25, foo: 'bar' })

          expect(store.objects.length).toEqual(3)
          expect(store.objects).not.toContain({ id: 25, foo: 'bar' })
        })
        it('it updates the active Object if it is active', () => {
          store.activeObject = { id: 2 }
          update(store, 'objects', 'activeObject', obj)

          expect(store.activeObject).toEqual(obj)
        })
        it('it does not updates the active Object if it is not active', () => {
          store.activeObject = { id: 25 }
          update(store, 'objects', 'activeObject', obj)

          expect(store.activeObject).toEqual({ id: 25 })
        })
      })

      describe('setActive', () => {
        let store
        beforeEach(() => {
          store = {
            objects: [{ id: 1 }, { id: 2, foo: 'bar' }, { id: 3 }],
            activeObject: undefined
          }
        })

        it('if no data given it unsets the active Object', () => {
          store.activeObject = { id: 42 }
          setActive(store, 'objects', 'activeObject', undefined)

          expect(store.activeObject).toBeUndefined()
        })
        it('if data without id given it unsets the active Object', () => {
          store.activeObject = { id: 42 }
          setActive(store, 'objects', 'activeObject', {})

          expect(store.activeObject).toBeUndefined()
        })
        it('it sets the active Object from the store', () => {
          setActive(store, 'objects', 'activeObject', { id: 2 })

          expect(store.activeObject).toEqual({ id: 2, foo: 'bar' })
        })
        it('it unsets the active Object if object is not in the store', () => {
          store.activeObject = { id: 42 }

          setActive(store, 'objects', 'activeObject', { id: 91 })

          expect(store.activeObject).toBeUndefined()
        })
      })

      describe('getGraphNodes', () => {
        let objs
        beforeEach(() => {
          objs = [{ id: 1, name: 'Eins' }, { id: 2, name: 'Zwei', foo: 'bar' }, { id: 3, name: 'Drei' }]
        })

        it('if no data given it returns an empty array', () => {
          objs = []
          expect(getGraphNodes(objs, 'my_type', 'router_name', 'route_ID_key')).toEqual([])
        })
        it('returns the formatted data', () => {
          expect(getGraphNodes(objs, 'my_type', 'router_name', 'route_ID_key')).toEqual([
            {
              id: 1,
              name: 'Eins',
              type: 'my_type',
              route: {
                name: 'router_name',
                params: {
                  'route_ID_key': 1
                }
              }
            }, {
              id: 2,
              name: 'Zwei',
              type: 'my_type',
              route: {
                name: 'router_name',
                params: {
                  'route_ID_key': 2
                }
              }
            }, {
              id: 3,
              name: 'Drei',
              type: 'my_type',
              route: {
                name: 'router_name',
                params: {
                  'route_ID_key': 3
                }
              }
            }
          ])
        })
      })

      describe('getByTags', () => {
        let objs
        let tags
        beforeEach(() => {
          objs = [{
            id: '1',
            name: 'First Obj',
            tags: [{
              id: 't1'
            }, {
              id: 't2'
            }]
          }, {
            id: '2',
            name: 'Second Obj',
            tags: [{
              id: 't2'
            }]
          }, {
            id: '3',
            name: 'Third Obj',
            tags: [{
              id: 't3'
            }]
          }, {
            id: '4',
            name: 'Fourth Obj',
            tags: []
          }]
          tags = [{
            id: 't1',
            name: 'Tag 1'
          }, {
            id: 't2',
            name: 'Tag 2'
          }, {
            id: 't3',
            name: 'Tag 3'
          }, {
            id: 't4',
            name: 'Tag 4'
          }]
        })

        it('if no objects given it returns only the tagarray', () => {
          objs = []
          expect(getByTags(objs, tags)).toEqual([{
            value: '0',
            label: 'untagged',
            children: []
          }, {
            value: 't1',
            label: 'Tag 1',
            children: []
          }, {
            value: 't2',
            label: 'Tag 2',
            children: []
          }, {
            value: 't3',
            label: 'Tag 3',
            children: []
          }, {
            value: 't4',
            label: 'Tag 4',
            children: []
          }])
        })
        it('if no tags given it returns an array with only the untagged', () => {
          tags = []
          expect(getByTags(objs, tags)).toEqual([{
            value: '0',
            label: 'untagged',
            children: [{
              value: objs[3],
              label: objs[3].name,
              key: objs[3].id
            }]
          }])
        })
        it('returns the objects grouped by tags', () => {
          expect(getByTags(objs, tags)).toEqual([{
            value: '0',
            label: 'untagged',
            children: [{
              value: objs[3],
              label: objs[3].name,
              key: objs[3].id
            }]
          }, {
            value: 't1',
            label: 'Tag 1',
            children: [{
              value: objs[0],
              label: objs[0].name,
              key: objs[0].id
            }]
          }, {
            value: 't2',
            label: 'Tag 2',
            children: [{
              value: objs[0],
              label: objs[0].name,
              key: objs[0].id
            }, {
              value: objs[1],
              label: objs[1].name,
              key: objs[1].id
            }]
          }, {
            value: 't3',
            label: 'Tag 3',
            children: [{
              value: objs[2],
              label: objs[2].name,
              key: objs[2].id
            }]
          }, {
            value: 't4',
            label: 'Tag 4',
            children: []
          }])
        })
      })
    })
  })
})
