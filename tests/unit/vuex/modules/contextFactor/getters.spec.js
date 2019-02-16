import contextFactorGetters from '@/vuex/modules/contextFactor/getters'

describe('Vuex', () => {
  describe('Modules', () => {
    describe('contextFactor', () => {
      describe('Getters', () => {
        it('returns all getters', () => {
          expect(Object.keys(contextFactorGetters)).toMatchSnapshot()
        })

        describe('contextFactorsTree', () => {
          const contextFactorsTree = contextFactorGetters.contextFactorsTree

          let state = {}
          beforeEach(() => {
            state.contextFactors = [{
              id: '1',
              name: 'Eins',
              parentID: undefined
            }, {
              id: '2',
              name: 'Eins - Eins',
              parentID: '1'
            }, {
              id: '3',
              name: 'Eins - Zwei',
              parentID: '1'
            }, {
              id: '4',
              name: 'Eins - Zwei - Eins',
              parentID: '3'
            }, {
              id: '5',
              name: 'Eins - Zwei - Zwei',
              parentID: '3'
            }, {
              id: '6',
              name: 'Eins - Zwei - Drei',
              parentID: '3'
            }, {
              id: '7',
              name: 'Eins - Eins - Eins',
              parentID: '2'
            }, {
              id: '8',
              name: 'Eins - Zwei',
              parentID: '1'
            }]
          })

          it('generates the contextFactors Tree', () => {
            const result = contextFactorsTree(state)
            expect(result).toEqual(expect.any(Array))
            expect(result).toMatchSnapshot()

            let node = result[0]
            expect(node).toEqual({ label: 'Eins', contextFactor: state.contextFactors[0], children: expect.any(Array) })

            node = node.children[0]
            expect(node).toEqual({ label: 'Eins - Eins', contextFactor: state.contextFactors[1], children: expect.any(Array) })

            node = node.children[0]
            expect(node).toEqual({ label: 'Eins - Eins - Eins', contextFactor: state.contextFactors[6], children: expect.any(Array) })

            node = result[0].children[1]
            expect(node).toEqual({ label: 'Eins - Zwei', contextFactor: state.contextFactors[2], children: expect.any(Array) })
            expect(node.children.length).toEqual(3)
          })

          it('returns empty array, if no contextFactors available', () => {
            state.contextFactors = []
            expect(contextFactorsTree(state)).toEqual([])
          })

          it('it generates the tree without children', () => {
            state.contextFactors = [{
              id: '1',
              name: 'Eins',
              parentID: undefined
            }, {
              id: '2',
              name: 'Zwei',
              parentID: undefined
            }]
            const result = contextFactorsTree(state)
            expect(result[0]).toEqual({ label: 'Eins', contextFactor: state.contextFactors[0], children: [] })
            expect(result[1]).toEqual({ label: 'Zwei', contextFactor: state.contextFactors[1], children: [] })
          })

          it('it can handle multiple root elements', () => {
            state.contextFactors.push({
              id: '9',
              name: 'Zwei',
              parentID: undefined
            })
            state.contextFactors.push({
              id: '10',
              name: 'Zwei - Eins',
              parentID: '9'
            })
            const result = contextFactorsTree(state)
            expect(result[0]).toEqual({ label: 'Eins', contextFactor: state.contextFactors[0], children: expect.any(Array) })
            expect(result[1]).toEqual({ label: 'Zwei', contextFactor: state.contextFactors[8], children: expect.any(Array) })

            expect(result[0].children.length).toBeGreaterThan(0)
            expect(result[1].children).toEqual([{
              label: 'Zwei - Eins',
              contextFactor: {
                id: '10',
                name: 'Zwei - Eins',
                parentID: '9'
              },
              children: []
            }])
          })
        })

        describe('contextFactorGraphNodes', () => {
          const contextFactorGraphNodes = contextFactorGetters.contextFactorGraphNodes
          let state
          beforeEach(() => {
            state = {
              contextFactors: [{
                id: '1',
                name: 'First Context Factor',
                data: { foo: 'bar' }
              }, {
                id: '2',
                name: 'Second Context Factor',
                data: { foo: 'bar' }
              }, {
                id: '3',
                name: 'Third Context Factor',
                data: { foo: 'bar' }
              }]
            }
          })

          it('returns the contextFactors modified for the graphs', () => {
            expect(contextFactorGraphNodes(state)).toEqual([
              {
                id: '1',
                name: 'First Context Factor',
                type: 'factor',
                route: {
                  name: 'context_factors.edit',
                  params: {
                    contextFactorID: '1'
                  }
                }
              }, {
                id: '2',
                name: 'Second Context Factor',
                type: 'factor',
                route: {
                  name: 'context_factors.edit',
                  params: {
                    contextFactorID: '2'
                  }
                }
              }, {
                id: '3',
                name: 'Third Context Factor',
                type: 'factor',
                route: {
                  name: 'context_factors.edit',
                  params: {
                    contextFactorID: '3'
                  }
                }
              }
            ])
          })

          it('empty if no contextFactors are available', () => {
            state.contextFactors = []
            expect(contextFactorGraphNodes(state)).toEqual([])
          })
        })
      })
    })
  })
})
