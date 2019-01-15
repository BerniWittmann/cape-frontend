import processActions from '@/vuex/modules/contextFactor/actions'
import * as mutationTypes from '@/vuex/modules/contextFactor/mutation-types'

describe('Vuex', () => {
  describe('Modules', () => {
    describe('contextFactor', () => {
      describe('Actions', () => {
        let store
        beforeEach(() => {
          store = {
            commit: jest.fn()
          }
        })
        describe('store', () => {
          it('stores the given context Factors', () => {
            processActions.store(store, [{ id: 1 }, { id: 2 }])

            expect(store.commit).toHaveBeenCalledWith(mutationTypes.STORE, [{ id: 1 }, { id: 2 }])
          })
        })
      })
    })
  })
})
