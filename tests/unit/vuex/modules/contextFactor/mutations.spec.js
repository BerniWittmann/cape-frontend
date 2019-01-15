import cFMutations from '@/vuex/modules/contextFactor/mutations'
import * as mutationTypes from '@/vuex/modules/contextFactor/mutation-types'

describe('Vuex', () => {
  describe('Modules', () => {
    describe('contextFactor', () => {
      describe('Mutations', () => {
        let state
        beforeEach(() => {
          state = {
            processes: [],
            activeContextFactor: undefined
          }
        })

        describe('STORE', () => {
          it('stores the given Context Factors', () => {
            cFMutations[mutationTypes.STORE](state, [{ id: 1 }, { id: 2 }])

            expect(state.contextFactors).toEqual([{ id: 1 }, { id: 2 }])
          })

          it('stores an empty array for undefined processes', () => {
            cFMutations[mutationTypes.STORE](state, undefined)

            expect(state.contextFactors).toEqual([])
          })
        })

        describe('UPDATE', () => {
          beforeEach(() => {
            state.contextFactors = [{ id: 1, test: 'data' }, { id: 2 }]
          })
          it('updates the given context Factor', () => {
            cFMutations[mutationTypes.UPDATE](state, { id: 1, foo: 'bar' })

            expect(state.contextFactors).toEqual([{ id: 1, foo: 'bar' }, { id: 2 }])
          })

          it('does not update the given context Factor if its not available', () => {
            cFMutations[mutationTypes.UPDATE](state, { id: 3, foo: 'bar' })

            expect(state.contextFactors).toEqual([{ id: 1, test: 'data' }, { id: 2 }])
          })

          it('updates the activeContextFactor if it matches', () => {
            state.activeContextFactor = { id: 1 }
            cFMutations[mutationTypes.UPDATE](state, { id: 1, foo: 'bar' })

            expect(state.contextFactors).toEqual([{ id: 1, foo: 'bar' }, { id: 2 }])
            expect(state.activeContextFactor).toEqual({ id: 1, foo: 'bar' })
          })

          it('does not update the activeContextFactor if it does not match', () => {
            state.activeContextFactor = { id: 2 }
            cFMutations[mutationTypes.UPDATE](state, { id: 1, foo: 'bar' })

            expect(state.contextFactors).toEqual([{ id: 1, foo: 'bar' }, { id: 2 }])
            expect(state.activeContextFactor).toEqual({ id: 2 })
          })
        })

        describe('SET_ACTIVE', () => {
          beforeEach(() => {
            state.contextFactors = [{ id: 1, test: 'data' }, { id: 2 }]
          })
          it('sets a context Factor active', () => {
            cFMutations[mutationTypes.SET_ACTIVE](state, { id: 1, foo: 'bar' })

            expect(state.activeContextFactor).toEqual({ id: 1, test: 'data' })
          })

          it('does not set an active context Factor if it is not found', () => {
            state.activeContextFactor = { id: 2 }
            cFMutations[mutationTypes.SET_ACTIVE](state, { id: 3 })

            expect(state.activeContextFactor).toEqual(undefined)
          })

          it('overwrites an existing active context Factor', () => {
            state.activeContextFactor = { id: 2 }
            cFMutations[mutationTypes.SET_ACTIVE](state, { id: 1, foo: 'bar' })

            expect(state.activeContextFactor).toEqual({ id: 1, test: 'data' })
          })

          it('removes the active context Factor if none given', () => {
            state.activeContextFactor = { id: 2 }
            cFMutations[mutationTypes.SET_ACTIVE](state, undefined)

            expect(state.activeContextFactor).toEqual(undefined)
          })
        })
      })
    })
  })
})
