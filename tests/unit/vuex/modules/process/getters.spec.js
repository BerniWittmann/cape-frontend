import processGetters from '@/vuex/modules/process/getters'

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
      })
    })
  })
})
