import imActions from '@/vuex/modules/injectionMapping/actions'
import * as mutationTypes from '@/vuex/modules/injectionMapping/mutation-types'

describe('Vuex', () => {
  describe('Modules', () => {
    describe('injectionMapping', () => {
      describe('Actions', () => {
        let store
        beforeEach(() => {
          store = {
            commit: jest.fn()
          }
        })
        describe('store', () => {
          it('stores the given injection Mappings', () => {
            imActions.store(store, [{ id: 1 }, { id: 2 }])

            expect(store.commit).toHaveBeenCalledWith(mutationTypes.STORE, [{ id: 1 }, { id: 2 }])
          })
        })
        describe('update', () => {
          it('updates the given injection Mapping', () => {
            imActions.update(store, { id: 1 })

            expect(store.commit).toHaveBeenCalledWith(mutationTypes.UPDATE, { id: 1 })
          })
        })
        describe('remove', () => {
          it('removes a single Injection Mapping', () => {
            imActions.remove(store, { id: 1 })

            expect(store.commit).toHaveBeenCalledWith(mutationTypes.REMOVE, { id: 1 })
          })
        })
      })
    })
  })
})
