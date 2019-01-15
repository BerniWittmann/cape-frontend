import processGetters from '@/vuex/modules/process/getters'

describe('Vuex', () => {
  describe('Modules', () => {
    describe('contextFactor', () => {
      describe('Getters', () => {
        it('returns all getters', () => {
          expect(processGetters).toMatchSnapshot()
        })
      })
    })
  })
})
