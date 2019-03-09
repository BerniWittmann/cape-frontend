import iMMutations from '@/vuex/modules/injectionMapping/mutations'
import * as mutationTypes from '@/vuex/modules/injectionMapping/mutation-types'

describe('Vuex', () => {
  describe('Modules', () => {
    describe('injectionMapping', () => {
      describe('Mutations', () => {
        let state
        beforeEach(() => {
          state = {
            injectionMappings: []
          }
        })

        describe('STORE', () => {
          it('stores the given Injection Mappings', () => {
            iMMutations[mutationTypes.STORE](state, [{ id: 1 }, { id: 2 }])

            expect(state.injectionMappings).toEqual([{ id: 1 }, { id: 2 }])
          })

          it('stores an empty array for undefined processes', () => {
            iMMutations[mutationTypes.STORE](state, undefined)

            expect(state.injectionMappings).toEqual([])
          })
        })

        describe('UPDATE', () => {
          beforeEach(() => {
            state.injectionMappings = [{ id: 1, test: 'data' }, { id: 2 }]
          })
          it('updates the given injection Mapping', () => {
            iMMutations[mutationTypes.UPDATE](state, { id: 1, foo: 'bar' })

            expect(state.injectionMappings).toEqual([{ id: 1, foo: 'bar' }, { id: 2 }])
          })

          it('does not update the given injection Mapping if its not available', () => {
            iMMutations[mutationTypes.UPDATE](state, { id: 3, foo: 'bar' })

            expect(state.injectionMappings).toEqual([{ id: 1, test: 'data' }, { id: 2 }])
          })

          it('updates the activeInjectionMapping if it matches', () => {
            state.activeInjectionMapping = { id: 1 }
            iMMutations[mutationTypes.UPDATE](state, { id: 1, foo: 'bar' })

            expect(state.injectionMappings).toEqual([{ id: 1, foo: 'bar' }, { id: 2 }])
            expect(state.activeInjectionMapping).toEqual({ id: 1, foo: 'bar' })
          })

          it('does not update the activeInjectionMapping if it does not match', () => {
            state.activeInjectionMapping = { id: 2 }
            iMMutations[mutationTypes.UPDATE](state, { id: 1, foo: 'bar' })

            expect(state.injectionMappings).toEqual([{ id: 1, foo: 'bar' }, { id: 2 }])
            expect(state.activeInjectionMapping).toEqual({ id: 2 })
          })
        })
        describe('REMOVE', () => {
          it('removes a given Injection Mapping', () => {
            state.injectionMappings = [{ id: 1 }, { id: 2 }, { id: 3 }]
            iMMutations[mutationTypes.REMOVE](state, { id: 2 })
            expect(state.injectionMappings).toEqual([{ id: 1 }, { id: 3 }])
          })
        })
      })
    })
  })
})
