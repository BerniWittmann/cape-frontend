import processActions from '@/vuex/modules/process/actions'
import * as mutationTypes from '@/vuex/modules/process/mutation-types'

describe('Vuex', () => {
  describe('Modules', () => {
    describe('Process', () => {
      describe('Actions', () => {
        let store
        beforeEach(() => {
          store = {
            commit: jest.fn()
          }
        })

        describe('store', () => {
          it('stores the given processes', () => {
            processActions.store(store, [{ id: 1 }, { id: 2 }])

            expect(store.commit).toHaveBeenCalledWith(mutationTypes.STORE, [{ id: 1 }, { id: 2 }])
          })
        })

        describe('update', () => {
          it('updates the process', () => {
            processActions.update(store, { id: 1, foo: 'bar' })

            expect(store.commit).toHaveBeenCalledWith(mutationTypes.UPDATE, { id: 1, foo: 'bar' })
          })
        })

        describe('setActive', () => {
          it('sets a process active', () => {
            processActions.setActive(store, { id: 1, foo: 'bar' })

            expect(store.commit).toHaveBeenCalledWith(mutationTypes.SET_ACTIVE, { id: 1, foo: 'bar' })
          })
        })

        describe('unsetActive', () => {
          it('sets a process to not active', () => {
            processActions.unsetActive(store)

            expect(store.commit).toHaveBeenCalledWith(mutationTypes.SET_ACTIVE, undefined)
          })
        })
      })
    })
  })
})
