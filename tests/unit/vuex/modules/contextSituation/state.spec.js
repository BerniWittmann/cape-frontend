import cSState from '@/vuex/modules/contextSituation/state'

describe('Vuex', () => {
  describe('Modules', () => {
    describe('contextSituation', () => {
      describe('State', () => {
        it('has an empty base state', () => {
          expect(cSState).toMatchSnapshot()
        })
      })
    })
  })
})
