import processState from '@/vuex/modules/process/state'

describe('Vuex', () => {
  describe('Modules', () => {
    describe('Process', () => {
      describe('State', () => {
        it('has an empty base state', () => {
          expect(processState).toMatchSnapshot()
        })
      })
    })
  })
})
