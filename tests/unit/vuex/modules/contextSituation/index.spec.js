import cSModule from '@/vuex/modules/contextSituation'
import cSActions from '@/vuex/modules/contextSituation/actions'
import cSMutations from '@/vuex/modules/contextSituation/mutations'
import cSGetters from '@/vuex/modules/contextSituation/getters'
import cSState from '@/vuex/modules/contextSituation/state'

describe('Vuex', () => {
  describe('Modules', () => {
    describe('contextSituation', () => {
      describe('Module', () => {
        it('is namespaced', () => {
          expect(cSModule.namespaced).toBeTruthy()
        })
        it('has actions', () => {
          expect(cSModule.actions).toEqual(cSActions)
        })
        it('has mutations', () => {
          expect(cSModule.mutations).toEqual(cSMutations)
        })
        it('has getters', () => {
          expect(cSModule.getters).toEqual(cSGetters)
        })
        it('has a state', () => {
          expect(cSModule.state).toEqual(cSState)
        })
      })
    })
  })
})
