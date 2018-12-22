import contextTypeMutations from '@/vuex/modules/contextType/mutations'
import * as mutationTypes from '@/vuex/modules/contextType/mutation-types'

describe('Vuex', () => {
  describe('Modules', () => {
    describe('ContextType', () => {
      describe('Mutations', () => {
        let state
        beforeEach(() => {
          state = {
            contextTypes: []
          }
        })

        describe('STORE', () => {
          it('stores the given contextTypes', () => {
            contextTypeMutations[mutationTypes.STORE](state, [{ id: 1 }, { id: 2 }])

            expect(state.contextTypes).toEqual([{ id: 1 }, { id: 2 }])
          })

          it('stores an empty array for undefined contextTypes', () => {
            contextTypeMutations[mutationTypes.STORE](state, undefined)

            expect(state.contextTypes).toEqual([])
          })
        })

        describe('ADD', () => {
          it('adds a given contextType', () => {
            state.contextTypes = [{ id: 1 }, { id: 2 }]
            contextTypeMutations[mutationTypes.ADD](state, { id: 3 })

            expect(state.contextTypes).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }])
          })

          it('adds a given task to an empty array', () => {
            contextTypeMutations[mutationTypes.ADD](state, { id: 1 })

            expect(state.contextTypes).toEqual([{ id: 1 }])
          })
        })

        describe('REMOVE', () => {
          it('removes a given contextType', () => {
            state.contextTypes = [{ id: 1 }, { id: 2 }, { id: 3 }]
            contextTypeMutations[mutationTypes.REMOVE](state, { id: 2 })

            expect(state.contextTypes).toEqual([{ id: 1 }, { id: 3 }])
          })

          it('can handle an empty array', () => {
            contextTypeMutations[mutationTypes.REMOVE](state, { id: 1 })

            expect(state.contextTypes).toEqual([])
          })

          it('removes all contextTypes by the id', () => {
            state.contextTypes = [{ id: 1, foo: 'bar' }, { id: 2 }, { id: 1, fizz: 'bass' }]
            contextTypeMutations[mutationTypes.REMOVE](state, { id: 1 })

            expect(state.contextTypes).toEqual([{ id: 2 }])
          })
        })
      })
    })
  })
})
