import processGetters from '@/vuex/modules/process/getters'

describe('Vuex', () => {
  describe('Modules', () => {
    describe('Process', () => {
      describe('Getters', () => {
        it('returns all getters', () => {
          expect(processGetters).toMatchSnapshot()
        })
      })
    })
  })
})
