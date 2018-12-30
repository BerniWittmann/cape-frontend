import tagModule from '@/vuex/modules/tag'
import tagActions from '@/vuex/modules/tag/actions'
import tagMutations from '@/vuex/modules/tag/mutations'
import tagGetters from '@/vuex/modules/tag/getters'
import tagState from '@/vuex/modules/tag/state'

describe('Vuex', () => {
  describe('Modules', () => {
    describe('Tag', () => {
      describe('Module', () => {
        it('is namespaced', () => {
          expect(tagModule.namespaced).toBeTruthy()
        })
        it('has actions', () => {
          expect(tagModule.actions).toEqual(tagActions)
        })
        it('has mutations', () => {
          expect(tagModule.mutations).toEqual(tagMutations)
        })
        it('has getters', () => {
          expect(tagModule.getters).toEqual(tagGetters)
        })
        it('has a state', () => {
          expect(tagModule.state).toEqual(tagState)
        })
      })
    })
  })
})
