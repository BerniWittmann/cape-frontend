import iMModule from '@/vuex/modules/injectionMapping'
import iMActions from '@/vuex/modules/injectionMapping/actions'
import iMMutations from '@/vuex/modules/injectionMapping/mutations'
import iMGetters from '@/vuex/modules/injectionMapping/getters'
import iMState from '@/vuex/modules/injectionMapping/state'

describe('Vuex', () => {
  describe('Modules', () => {
    describe('injectionMapping', () => {
      describe('Module', () => {
        it('is namespaced', () => {
          expect(iMModule.namespaced).toBeTruthy()
        })
        it('has actions', () => {
          expect(iMModule.actions).toEqual(iMActions)
        })
        it('has mutations', () => {
          expect(iMModule.mutations).toEqual(iMMutations)
        })
        it('has getters', () => {
          expect(iMModule.getters).toEqual(iMGetters)
        })
        it('has a state', () => {
          expect(iMModule.state).toEqual(iMState)
        })
      })
    })
  })
})
