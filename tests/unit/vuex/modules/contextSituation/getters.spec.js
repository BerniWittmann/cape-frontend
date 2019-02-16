import contextSituationGetters from '@/vuex/modules/contextSituation/getters'

describe('Vuex', () => {
  describe('Modules', () => {
    describe('contextSituation', () => {
      describe('Getters', () => {
        it('returns all getters', () => {
          expect(Object.keys(contextSituationGetters)).toMatchSnapshot()
        })

        describe('contextSituationGraphNodes', () => {
          const contextSituationGraphNodes = contextSituationGetters.contextSituationGraphNodes
          let state
          beforeEach(() => {
            state = {
              contextSituations: [{
                id: '1',
                name: 'First Context Situation',
                data: { foo: 'bar' }
              }, {
                id: '2',
                name: 'Second Context Situation',
                data: { foo: 'bar' }
              }, {
                id: '3',
                name: 'Third Context Situation',
                data: { foo: 'bar' }
              }]
            }
          })

          it('returns the contextSituations modified for the graphs', () => {
            expect(contextSituationGraphNodes(state)).toEqual([
              {
                id: '1',
                name: 'First Context Situation',
                type: 'situation',
                route: {
                  name: 'context_situations.single',
                  params: {
                    contextSituationID: '1'
                  }
                }
              }, {
                id: '2',
                name: 'Second Context Situation',
                type: 'situation',
                route: {
                  name: 'context_situations.single',
                  params: {
                    contextSituationID: '2'
                  }
                }
              }, {
                id: '3',
                name: 'Third Context Situation',
                type: 'situation',
                route: {
                  name: 'context_situations.single',
                  params: {
                    contextSituationID: '3'
                  }
                }
              }
            ])
          })

          it('empty if no contextSituations are available', () => {
            state.contextSituations = []
            expect(contextSituationGraphNodes(state)).toEqual([])
          })
        })
      })
    })
  })
})
