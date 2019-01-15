import cFModule from '@/vuex/modules/contextFactor'
import cFActions from '@/vuex/modules/contextFactor/actions'
import cFMutations from '@/vuex/modules/contextFactor/mutations'
import cFGetters from '@/vuex/modules/contextFactor/getters'
import cFState from '@/vuex/modules/contextFactor/state'

describe('Vuex', () => {
  describe('Modules', () => {
    describe('contextFactor', () => {
      describe('Module', () => {
        it('is namespaced', () => {
          expect(cFModule.namespaced).toBeTruthy()
        })
        it('has actions', () => {
          expect(cFModule.actions).toEqual(cFActions)
        })
        it('has mutations', () => {
          expect(cFModule.mutations).toEqual(cFMutations)
        })
        it('has getters', () => {
          expect(cFModule.getters).toEqual(cFGetters)
        })
        it('has a state', () => {
          expect(cFModule.state).toEqual(cFState)
        })
      })
    })
  })
})
