import processGetters from '@/vuex/modules/process/getters'

import Vue from 'vue'

Vue.i18n = { t: jest.fn().mockReturnValue('untagged') }

describe('Vuex', () => {
  describe('Modules', () => {
    describe('Process', () => {
      describe('Getters', () => {
        it('returns all getters', () => {
          expect(processGetters).toMatchSnapshot()
        })

        describe('processGraphNodes', () => {
          const processGraphNodes = processGetters.processGraphNodes
          let state
          beforeEach(() => {
            state = {
              processes: [{
                id: '1',
                name: 'First Process',
                data: { foo: 'bar' }
              }, {
                id: '2',
                name: 'Second Process',
                data: { foo: 'bar' }
              }, {
                id: '3',
                name: 'Third Process',
                data: { foo: 'bar' }
              }]
            }
          })

          it('returns the processes modified for the graphs', () => {
            expect(processGraphNodes(state)).toEqual([
              {
                id: '1',
                name: 'First Process',
                type: 'process',
                route: {
                  name: 'process.preview',
                  params: {
                    processID: '1'
                  }
                }
              }, {
                id: '2',
                name: 'Second Process',
                type: 'process',
                route: {
                  name: 'process.preview',
                  params: {
                    processID: '2'
                  }
                }
              }, {
                id: '3',
                name: 'Third Process',
                type: 'process',
                route: {
                  name: 'process.preview',
                  params: {
                    processID: '3'
                  }
                }
              }
            ])
          })

          it('empty if no processes are available', () => {
            state.processes = []
            expect(processGraphNodes(state)).toEqual([])
          })
        })

        describe('processesByTags', () => {
          const processesByTags = processGetters.processesByTags
          let state
          let rootState
          beforeEach(() => {
            state = {
              processes: [{
                id: '1',
                name: 'First Process',
                tags: [{
                  id: 't1'
                }, {
                  id: 't2'
                }]
              }, {
                id: '2',
                name: 'Second Process',
                tags: [{
                  id: 't2'
                }]
              }, {
                id: '3',
                name: 'Third Process',
                tags: [{
                  id: 't3'
                }]
              }, {
                id: '4',
                name: 'Fourth Process',
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

          it('returns empty tags if no processes', () => {
            state.processes = []
            expect(processesByTags(state, {}, rootState)).toEqual([{
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

          it('returns the processes filtered by tags', () => {
            expect(processesByTags(state, {}, rootState)).toEqual([{
              value: '0',
              label: 'untagged',
              children: [{
                value: state.processes[3],
                label: state.processes[3].name,
                key: state.processes[3].id
              }]
            }, {
              value: 't1',
              label: 'Tag 1',
              children: [{
                value: state.processes[0],
                label: state.processes[0].name,
                key: state.processes[0].id
              }]
            }, {
              value: 't2',
              label: 'Tag 2',
              children: [{
                value: state.processes[0],
                label: state.processes[0].name,
                key: state.processes[0].id
              }, {
                value: state.processes[1],
                label: state.processes[1].name,
                key: state.processes[1].id
              }]
            }, {
              value: 't3',
              label: 'Tag 3',
              children: [{
                value: state.processes[2],
                label: state.processes[2].name,
                key: state.processes[2].id
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
