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
        describe('update', () => {
          it('updates the given context Factor', () => {
            processActions.update(store, { id: 1 })

            expect(store.commit).toHaveBeenCalledWith(mutationTypes.UPDATE, { id: 1 })
          })
        })
        describe('setActive', () => {
          it('sets the given context Factor active', () => {
            processActions.setActive(store, { id: 1 })

            expect(store.commit).toHaveBeenCalledWith(mutationTypes.SET_ACTIVE, { id: 1 })
          })
        })
        describe('unsetActive', () => {
          it('unsets the active context Factor', () => {
            processActions.unsetActive(store)

            expect(store.commit).toHaveBeenCalledWith(mutationTypes.SET_ACTIVE, undefined)
          })
        })
      })
    })
  })
})
