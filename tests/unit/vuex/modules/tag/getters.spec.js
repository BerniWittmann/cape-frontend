import tagGetters from '@/vuex/modules/tag/getters'

describe('Vuex', () => {
  describe('Modules', () => {
    describe('Tag', () => {
      describe('Getters', () => {
        it('returns all getters', () => {
          expect(tagGetters).toMatchSnapshot()
        })
      })
    })
  })
})
