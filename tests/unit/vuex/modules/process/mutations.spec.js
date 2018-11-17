import processMutations from '@/vuex/modules/process/mutations'
import * as mutationTypes from '@/vuex/modules/process/mutation-types'

describe('Vuex', () => {
  describe('Modules', () => {
    describe('Process', () => {
      describe('Mutations', () => {
        let state
        beforeEach(() => {
          state = {
            processes: []
          }
        })

        describe('STORE', () => {
          it('stores the given processes', () => {
            processMutations[mutationTypes.STORE](state, [{ id: 1 }, { id: 2 }])

            expect(state.processes).toEqual([{ id: 1 }, { id: 2 }])
          })

          it('stores an empty array for undefined processes', () => {
            processMutations[mutationTypes.STORE](state, undefined)

            expect(state.processes).toEqual([])
          })
        })
      })
    })
  })
})
