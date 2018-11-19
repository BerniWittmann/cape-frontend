import tagActions from '@/vuex/modules/tag/actions'
import * as mutationTypes from '@/vuex/modules/tag/mutation-types'

describe('Vuex', () => {
  describe('Modules', () => {
    describe('Tag', () => {
      describe('Actions', () => {
        let store
        beforeEach(() => {
          store = {
            commit: jest.fn()
          }
        })

        describe('store', () => {
          it('stores the given tags', () => {
            tagActions.store(store, [{ id: 1 }, { id: 2 }])

            expect(store.commit).toHaveBeenCalledWith(mutationTypes.STORE, [{ id: 1 }, { id: 2 }])
          })
        })

        describe('add', () => {
          it('adds a single tag', () => {
            tagActions.add(store, { id: 1 })

            expect(store.commit).toHaveBeenCalledWith(mutationTypes.ADD, { id: 1 })
          })
        })

        describe('remove', () => {
          it('removes a single tag', () => {
            tagActions.remove(store, { id: 1 })

            expect(store.commit).toHaveBeenCalledWith(mutationTypes.REMOVE, { id: 1 })
          })
        })
      })
    })
  })
})
