import cSMutations from '@/vuex/modules/contextSituation/mutations'
import * as mutationTypes from '@/vuex/modules/contextSituation/mutation-types'

describe('Vuex', () => {
  describe('Modules', () => {
    describe('contextSituation', () => {
      describe('Mutations', () => {
        let state
        beforeEach(() => {
          state = {
            processes: [],
            activeContextSituation: undefined
          }
        })

        describe('STORE', () => {
          it('stores the given Context Situations', () => {
            cSMutations[mutationTypes.STORE](state, [{ id: 1 }, { id: 2 }])

            expect(state.contextSituations).toEqual([{ id: 1 }, { id: 2 }])
          })

          it('stores an empty array for undefined processes', () => {
            cSMutations[mutationTypes.STORE](state, undefined)

            expect(state.contextSituations).toEqual([])
          })
        })

        describe('UPDATE', () => {
          beforeEach(() => {
            state.contextSituations = [{ id: 1, test: 'data' }, { id: 2 }]
          })
          it('updates the given context Situation', () => {
            cSMutations[mutationTypes.UPDATE](state, { id: 1, foo: 'bar' })

            expect(state.contextSituations).toEqual([{ id: 1, foo: 'bar' }, { id: 2 }])
          })

          it('does not update the given context Situation if its not available', () => {
            cSMutations[mutationTypes.UPDATE](state, { id: 3, foo: 'bar' })

            expect(state.contextSituations).toEqual([{ id: 1, test: 'data' }, { id: 2 }])
          })

          it('updates the activeContextSituation if it matches', () => {
            state.activeContextSituation = { id: 1 }
            cSMutations[mutationTypes.UPDATE](state, { id: 1, foo: 'bar' })

            expect(state.contextSituations).toEqual([{ id: 1, foo: 'bar' }, { id: 2 }])
            expect(state.activeContextSituation).toEqual({ id: 1, foo: 'bar' })
          })

          it('does not update the activeContextSituation if it does not match', () => {
            state.activeContextSituation = { id: 2 }
            cSMutations[mutationTypes.UPDATE](state, { id: 1, foo: 'bar' })

            expect(state.contextSituations).toEqual([{ id: 1, foo: 'bar' }, { id: 2 }])
            expect(state.activeContextSituation).toEqual({ id: 2 })
          })
        })

        describe('SET_ACTIVE', () => {
          beforeEach(() => {
            state.contextSituations = [{ id: 1, test: 'data' }, { id: 2 }]
          })
          it('sets a context Situation active', () => {
            cSMutations[mutationTypes.SET_ACTIVE](state, { id: 1, foo: 'bar' })

            expect(state.activeContextSituation).toEqual({ id: 1, test: 'data' })
          })

          it('does not set an active context Situation if it is not found', () => {
            state.activeContextSituation = { id: 2 }
            cSMutations[mutationTypes.SET_ACTIVE](state, { id: 3 })

            expect(state.activeContextSituation).toEqual(undefined)
          })

          it('overwrites an existing active context Situation', () => {
            state.activeContextSituation = { id: 2 }
            cSMutations[mutationTypes.SET_ACTIVE](state, { id: 1, foo: 'bar' })

            expect(state.activeContextSituation).toEqual({ id: 1, test: 'data' })
          })

          it('removes the active context Situation if none given', () => {
            state.activeContextSituation = { id: 2 }
            cSMutations[mutationTypes.SET_ACTIVE](state, undefined)

            expect(state.activeContextSituation).toEqual(undefined)
          })
        })
        describe('ADD', () => {
          beforeEach(() => {
            state.contextSituations = []
          })
          it('adds a context Situation to the store', () => {
            cSMutations[mutationTypes.ADD](state, { id: 1, foo: 'bar' })
            expect(state.contextSituations).toEqual([{ id: 1, foo: 'bar' }])
          })
        })
        describe('REMOVE', () => {
          it('removes a given context Situation', () => {
            state.contextSituations = [{ id: 1 }, { id: 2 }, { id: 3 }]
            cSMutations[mutationTypes.REMOVE](state, { id: 2 })

            expect(state.contextSituations).toEqual([{ id: 1 }, { id: 3 }])
          })
        })
      })
    })
  })
})
