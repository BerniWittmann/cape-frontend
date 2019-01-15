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
            activeProcess: undefined
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
      })
    })
  })
})
