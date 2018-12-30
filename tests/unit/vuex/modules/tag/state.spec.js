import tagState from '@/vuex/modules/tag/state'

describe('Vuex', () => {
  describe('Modules', () => {
    describe('Tag', () => {
      describe('State', () => {
        it('has an empty base state', () => {
          expect(tagState).toMatchSnapshot()
        })
      })
    })
  })
})
