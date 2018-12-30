import processModule from '@/vuex/modules/process'
import processActions from '@/vuex/modules/process/actions'
import processMutations from '@/vuex/modules/process/mutations'
import processGetters from '@/vuex/modules/process/getters'
import processState from '@/vuex/modules/process/state'

describe('Vuex', () => {
  describe('Modules', () => {
    describe('Process', () => {
      describe('Module', () => {
        it('is namespaced', () => {
          expect(processModule.namespaced).toBeTruthy()
        })
        it('has actions', () => {
          expect(processModule.actions).toEqual(processActions)
        })
        it('has mutations', () => {
          expect(processModule.mutations).toEqual(processMutations)
        })
        it('has getters', () => {
          expect(processModule.getters).toEqual(processGetters)
        })
        it('has a state', () => {
          expect(processModule.state).toEqual(processState)
        })
      })
    })
  })
})
