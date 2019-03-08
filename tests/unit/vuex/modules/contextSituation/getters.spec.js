import contextSituationGetters from '@/vuex/modules/contextSituation/getters'

import Vue from 'vue'

Vue.i18n = { t: jest.fn().mockReturnValue('untagged') }

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

        describe('contextSituationsByTags', () => {
          const contextSituationsByTags = contextSituationGetters.contextSituationsByTags
          let state
          let rootState
          beforeEach(() => {
            state = {
              contextSituations: [{
                id: '1',
                name: 'First Context Situation',
                tags: [{
                  id: 't1'
                }, {
                  id: 't2'
                }]
              }, {
                id: '2',
                name: 'Second Context Situation',
                tags: [{
                  id: 't2'
                }]
              }, {
                id: '3',
                name: 'Third Context Situation',
                tags: [{
                  id: 't3'
                }]
              }, {
                id: '4',
                name: 'Fourth Context Situation',
                tags: []
              }]
            }
            rootState = {
              tag: {
                tags: [{
                  id: 't1',
                  name: 'Tag 1'
                }, {
                  id: 't2',
                  name: 'Tag 2'
                }, {
                  id: 't3',
                  name: 'Tag 3'
                }, {
                  id: 't4',
                  name: 'Tag 4'
                }]
              }
            }
          })

          it('returns empty tags if no situations', () => {
            state.contextSituations = []
            expect(contextSituationsByTags(state, {}, rootState)).toEqual([{
              value: '0',
              label: 'untagged',
              children: []
            }, {
              value: 't1',
              label: 'Tag 1',
              children: []
            }, {
              value: 't2',
              label: 'Tag 2',
              children: []
            }, {
              value: 't3',
              label: 'Tag 3',
              children: []
            }, {
              value: 't4',
              label: 'Tag 4',
              children: []
            }])
          })

          it('returns the situations filtered by tags', () => {
            expect(contextSituationsByTags(state, {}, rootState)).toEqual([{
              value: '0',
              label: 'untagged',
              children: [{
                value: state.contextSituations[3],
                label: state.contextSituations[3].name,
                key: state.contextSituations[3].id
              }]
            }, {
              value: 't1',
              label: 'Tag 1',
              children: [{
                value: state.contextSituations[0],
                label: state.contextSituations[0].name,
                key: state.contextSituations[0].id
              }]
            }, {
              value: 't2',
              label: 'Tag 2',
              children: [{
                value: state.contextSituations[0],
                label: state.contextSituations[0].name,
                key: state.contextSituations[0].id
              }, {
                value: state.contextSituations[1],
                label: state.contextSituations[1].name,
                key: state.contextSituations[1].id
              }]
            }, {
              value: 't3',
              label: 'Tag 3',
              children: [{
                value: state.contextSituations[2],
                label: state.contextSituations[2].name,
                key: state.contextSituations[2].id
              }]
            }, {
              value: 't4',
              label: 'Tag 4',
              children: []
            }])
          })
        })
      })
    })
  })
})
