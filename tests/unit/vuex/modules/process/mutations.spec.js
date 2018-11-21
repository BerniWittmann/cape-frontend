import processMutations from '@/vuex/modules/process/mutations'
import * as mutationTypes from '@/vuex/modules/process/mutation-types'

describe('Vuex', () => {
  describe('Modules', () => {
    describe('Process', () => {
      describe('Mutations', () => {
        let state
        beforeEach(() => {
          state = {
            processes: [],
            activeProcess: undefined
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

        describe('UPDATE', () => {
          beforeEach(() => {
            state.processes = [{ id: 1, test: 'data' }, { id: 2 }]
          })
          it('updates the given process', () => {
            processMutations[mutationTypes.UPDATE](state, { id: 1, foo: 'bar' })

            expect(state.processes).toEqual([{ id: 1, foo: 'bar' }, { id: 2 }])
          })

          it('does not update the given process if its not available', () => {
            processMutations[mutationTypes.UPDATE](state, { id: 3, foo: 'bar' })

            expect(state.processes).toEqual([{ id: 1, test: 'data' }, { id: 2 }])
          })

          it('updates the activeProcess if it matches', () => {
            state.activeProcess = { id: 1 }
            processMutations[mutationTypes.UPDATE](state, { id: 1, foo: 'bar' })

            expect(state.processes).toEqual([{ id: 1, foo: 'bar' }, { id: 2 }])
            expect(state.activeProcess).toEqual({ id: 1, foo: 'bar' })
          })

          it('does not update the activeProcess if it does not match', () => {
            state.activeProcess = { id: 2 }
            processMutations[mutationTypes.UPDATE](state, { id: 1, foo: 'bar' })

            expect(state.processes).toEqual([{ id: 1, foo: 'bar' }, { id: 2 }])
            expect(state.activeProcess).toEqual({ id: 2 })
          })
        })

        describe('SET_ACTIVE', () => {
          beforeEach(() => {
            state.processes = [{ id: 1, test: 'data' }, { id: 2 }]
          })
          it('sets a process active', () => {
            processMutations[mutationTypes.SET_ACTIVE](state, { id: 1, foo: 'bar' })

            expect(state.activeProcess).toEqual({ id: 1, test: 'data' })
          })

          it('does not set an active Process if it is not found', () => {
            state.activeProcess = { id: 2 }
            processMutations[mutationTypes.SET_ACTIVE](state, { id: 3 })

            expect(state.activeProcess).toEqual(undefined)
          })

          it('overwrites an existing active Process', () => {
            state.activeProcess = { id: 2 }
            processMutations[mutationTypes.SET_ACTIVE](state, { id: 1, foo: 'bar' })

            expect(state.activeProcess).toEqual({ id: 1, test: 'data' })
          })

          it('removes the active Process if none given', () => {
            state.activeProcess = { id: 2 }
            processMutations[mutationTypes.SET_ACTIVE](state, undefined)

            expect(state.activeProcess).toEqual(undefined)
          })
        })
      })
    })
  })
})
