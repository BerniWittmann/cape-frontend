import contextSituationGetters from '@/vuex/modules/contextSituation/getters'

describe('Vuex', () => {
  describe('Modules', () => {
    describe('contextSituation', () => {
      describe('Getters', () => {
        it('returns all getters', () => {
          expect(Object.keys(contextSituationGetters)).toMatchSnapshot()
        })
      })
    })
  })
})
