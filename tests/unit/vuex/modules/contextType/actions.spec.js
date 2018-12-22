import contextTypeActions from '@/vuex/modules/contextType/actions'
import * as mutationTypes from '@/vuex/modules/contextType/mutation-types'

describe('Vuex', () => {
  describe('Modules', () => {
    describe('ContextType', () => {
      describe('Actions', () => {
        let store
        beforeEach(() => {
          store = {
            commit: jest.fn()
          }
        })

        describe('store', () => {
          it('stores the given contextTypes', () => {
            contextTypeActions.store(store, [{ id: 1 }, { id: 2 }])

            expect(store.commit).toHaveBeenCalledWith(mutationTypes.STORE, [{ id: 1 }, { id: 2 }])
          })
        })

        describe('add', () => {
          it('adds a single contextType', () => {
            contextTypeActions.add(store, { id: 1 })

            expect(store.commit).toHaveBeenCalledWith(mutationTypes.ADD, { id: 1 })
          })
        })

        describe('remove', () => {
          it('removes a single contextType', () => {
            contextTypeActions.remove(store, { id: 1 })

            expect(store.commit).toHaveBeenCalledWith(mutationTypes.REMOVE, { id: 1 })
          })
        })
      })
    })
  })
})
