import contextTypeModule from '@/vuex/modules/contextType'
import contextTypeActions from '@/vuex/modules/contextType/actions'
import contextTypeMutations from '@/vuex/modules/contextType/mutations'
import contextTypeGetters from '@/vuex/modules/contextType/getters'
import contextTypeState from '@/vuex/modules/contextType/state'

describe('Vuex', () => {
  describe('Modules', () => {
    describe('ContextType', () => {
      describe('Module', () => {
        it('has actions', () => {
          expect(contextTypeModule.actions).toEqual(contextTypeActions)
        })
        it('has mutations', () => {
          expect(contextTypeModule.mutations).toEqual(contextTypeMutations)
        })
        it('has getters', () => {
          expect(contextTypeModule.getters).toEqual(contextTypeGetters)
        })
        it('has a state', () => {
          expect(contextTypeModule.state).toEqual(contextTypeState)
        })
      })
    })
  })
})
