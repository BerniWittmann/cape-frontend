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
      })
    })
  })
})
