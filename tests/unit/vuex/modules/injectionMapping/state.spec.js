import iMState from '@/vuex/modules/injectionMapping/state'

describe('Vuex', () => {
  describe('Modules', () => {
    describe('injectionMapping', () => {
      describe('State', () => {
        it('has an empty base state', () => {
          expect(iMState).toMatchSnapshot()
        })
      })
    })
  })
})
