import getters from '@/vuex/common/getters'

describe('Vuex', () => {
  describe('Common', () => {
    describe('Getters', () => {
      it('returns all getters', () => {
        expect(Object.keys(getters)).toMatchSnapshot()
      })

      describe('graphEdges', () => {
        const graphEdges = getters.graphEdges
        let state
        beforeEach(() => {
          state = {
            process: {
              processes: [{ id: 'p1' }, { id: 'p2' }]
            },
            contextSituation: {
              contextSituations: [{ id: 'cS1' }]
            },
            contextFactor: {
              contextFactors: [{ id: 'cF1' }, { id: 'cF2' }]
            }
          }
        })

        it('returns an array', () => {
          expect(graphEdges(state)).toEqual(expect.any(Array))
        })
      })
    })
  })
})
