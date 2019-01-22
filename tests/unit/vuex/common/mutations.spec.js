import { update, setActive } from '@/vuex/common/mutations'

describe('Vuex', () => {
  describe('Common', () => {
    describe('Mutations', () => {
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
    })
  })
})
