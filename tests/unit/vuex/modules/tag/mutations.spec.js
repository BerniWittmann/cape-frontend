import tagMutations from '@/vuex/modules/tag/mutations'
import * as mutationTypes from '@/vuex/modules/tag/mutation-types'

describe('Vuex', () => {
  describe('Modules', () => {
    describe('Tag', () => {
      describe('Mutations', () => {
        let state
        beforeEach(() => {
          state = {
            tags: []
          }
        })

        describe('STORE', () => {
          it('stores the given tags', () => {
            tagMutations[mutationTypes.STORE](state, [{ id: 1 }, { id: 2 }])

            expect(state.tags).toEqual([{ id: 1 }, { id: 2 }])
          })

          it('stores an empty array for undefined tags', () => {
            tagMutations[mutationTypes.STORE](state, undefined)

            expect(state.tags).toEqual([])
          })
        })

        describe('ADD', () => {
          it('adds a given tag', () => {
            state.tags = [{ id: 1 }, { id: 2 }]
            tagMutations[mutationTypes.ADD](state, { id: 3 })

            expect(state.tags).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }])
          })

          it('adds a given task to an empty array', () => {
            tagMutations[mutationTypes.ADD](state, { id: 1 })

            expect(state.tags).toEqual([{ id: 1 }])
          })
        })

        describe('REMOVE', () => {
          it('removes a given tag', () => {
            state.tags = [{ id: 1 }, { id: 2 }, { id: 3 }]
            tagMutations[mutationTypes.REMOVE](state, { id: 2 })

            expect(state.tags).toEqual([{ id: 1 }, { id: 3 }])
          })

          it('can handle an empty array', () => {
            tagMutations[mutationTypes.REMOVE](state, { id: 1 })

            expect(state.tags).toEqual([])
          })

          it('removes all tags by the id', () => {
            state.tags = [{ id: 1, foo: 'bar' }, { id: 2 }, { id: 1, fizz: 'bass' }]
            tagMutations[mutationTypes.REMOVE](state, { id: 1 })

            expect(state.tags).toEqual([{ id: 2 }])
          })
        })
      })
    })
  })
})
