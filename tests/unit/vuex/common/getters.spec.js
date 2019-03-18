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
        let baseGetters
        beforeEach(() => {
          state = {
            foo: 'bar'
          }
          baseGetters = {
            graphEdgesProcessSituation: [{ id: 1 }, { id: 2 }],
            graphEdgesSituationFactor: [{ id: 3 }, { id: 4 }]
          }
        })

        it('returns an array', () => {
          expect(graphEdges(state, baseGetters)).toEqual(expect.any(Array))
          expect(graphEdges(state, baseGetters)).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }])
        })
      })

      describe('graphEdgesProcessSituation', () => {
        const getter = getters.graphEdgesProcessSituation
        let state
        beforeEach(() => {
          state = {
            injectionMapping: {
              injectionMappings: [{
                id: 'im1',
                processID: 'p1',
                contextSituation: {
                  id: 'cS1'
                }
              }, {
                id: 'im2',
                processID: 'p1',
                contextSituation: {
                  id: 'cS3'
                }
              }, {
                id: 'im3',
                processID: 'p2',
                contextSituation: {
                  id: 'cS3'
                }
              }, {
                id: 'im4',
                processID: 'p1',
                contextSituation: {
                  id: 'cS4'
                }
              }]
            }
          }
        })

        it('returns an array', () => {
          expect(getter(state)).toEqual(expect.any(Array))
        })

        it('returns an empty array if no injectionMappings are available', () => {
          state = {
            injectionMapping: {
              injectionMappings: []
            }
          }
          expect(getter(state)).toEqual([])
        })

        it('returns the edges between processes and situations', () => {
          expect(getter(state)).toEqual([
            { start: 'p1', end: 'cS1', type: 'process_situation' },
            { start: 'p1', end: 'cS3', type: 'process_situation' },
            { start: 'p2', end: 'cS3', type: 'process_situation' },
            { start: 'p1', end: 'cS4', type: 'process_situation' }
          ])
        })
      })

      describe('graphEdgesSituationFactor', () => {
        const getter = getters.graphEdgesSituationFactor
        let state
        beforeEach(() => {
          state = {
            contextSituation: {
              contextSituations: []
            }
          }
        })

        it('returns an array', () => {
          expect(getter(state)).toEqual(expect.any(Array))
        })

        it('returns an empty array if no contextSituations are available', () => {
          state = {
            contextSituation: {
              contextSituations: []
            }
          }
          expect(getter(state)).toEqual([])
        })

        it('returns an empty array if no rules are available', () => {
          state = {
            contextSituation: {
              contextSituations: [{
                id: 'cS1',
                rules: ''
              }, {
                id: 'cS2',
                rules: '000000000000000000000000'
              }, {
                id: 'cS3',
                rules: '12312414'
              }, {
                id: 'cS4',
                rules: 'invalid'
              }]
            }
          }
          expect(getter(state)).toEqual([])
        })
        it('returns the edges between situations and factors', () => {
          state = {
            contextSituation: {
              contextSituations: [{
                id: 'cS1',
                rules: '00000000000000000000000a.ffffffffffffffffffffffff'
              }, {
                id: 'cS2',
                rules: '!00000000000000000000000a.ffffffffffffffffffffffff'
              }, {
                id: 'cS3',
                rules: '00000000000000000000000a.ffffffffffffffffffffffff && !00000000000000000000000b.ffffffffffffffffffffffff'
              }, {
                id: 'cS4',
                rules: '00000000000000000000000c.ffffffffffffffffffffffff && !00000000000000000000000d.ffffffffffffffffffffffff || 00000000000000000000000e.ffffffffffffffffffffffff'
              }]
            }
          }
          expect(getter(state)).toEqual([
            { start: 'cS1', end: '00000000000000000000000a', type: 'situation_factor' },
            { start: 'cS2', end: '00000000000000000000000a', type: 'situation_factor' },
            { start: 'cS3', end: '00000000000000000000000a', type: 'situation_factor' },
            { start: 'cS3', end: '00000000000000000000000b', type: 'situation_factor' },
            { start: 'cS4', end: '00000000000000000000000c', type: 'situation_factor' },
            { start: 'cS4', end: '00000000000000000000000d', type: 'situation_factor' },
            { start: 'cS4', end: '00000000000000000000000e', type: 'situation_factor' }
          ])
        })
      })
    })
  })
})
