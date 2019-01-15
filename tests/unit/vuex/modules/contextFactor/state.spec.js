import cFState from '@/vuex/modules/contextFactor/state'

describe('Vuex', () => {
  describe('Modules', () => {
    describe('contextFactor', () => {
      describe('State', () => {
        it('has an empty base state', () => {
          expect(cFState).toMatchSnapshot()
        })
      })
    })
  })
})
