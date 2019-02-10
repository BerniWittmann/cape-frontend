import csActions from '@/vuex/modules/contextSituation/actions'
import * as mutationTypes from '@/vuex/modules/contextSituation/mutation-types'

describe('Vuex', () => {
  describe('Modules', () => {
    describe('contextSituation', () => {
      describe('Actions', () => {
        let store
        beforeEach(() => {
          store = {
            commit: jest.fn()
          }
        })
        describe('store', () => {
          it('stores the given context Situations', () => {
            csActions.store(store, [{ id: 1 }, { id: 2 }])

            expect(store.commit).toHaveBeenCalledWith(mutationTypes.STORE, [{ id: 1 }, { id: 2 }])
          })
        })
        describe('update', () => {
          it('updates the given context Situation', () => {
            csActions.update(store, { id: 1 })

            expect(store.commit).toHaveBeenCalledWith(mutationTypes.UPDATE, { id: 1 })
          })
        })
        describe('setActive', () => {
          it('sets the given context Situation active', () => {
            csActions.setActive(store, { id: 1 })

            expect(store.commit).toHaveBeenCalledWith(mutationTypes.SET_ACTIVE, { id: 1 })
          })
        })
        describe('unsetActive', () => {
          it('unsets the active context Situation', () => {
            csActions.unsetActive(store)

            expect(store.commit).toHaveBeenCalledWith(mutationTypes.SET_ACTIVE, undefined)
          })
        })
        describe('add', () => {
          it('adds a context situation', () => {
            csActions.add(store, { id: 1 })
            expect(store.commit).toHaveBeenCalledWith(mutationTypes.ADD, { id: 1 })
          })
        })
      })
    })
  })
})
