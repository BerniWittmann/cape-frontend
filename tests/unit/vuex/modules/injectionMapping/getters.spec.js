import injectionMappingGetters from '@/vuex/modules/injectionMapping/getters'

describe('Vuex', () => {
  describe('Modules', () => {
    describe('injectionMapping', () => {
      describe('Getters', () => {
        it('returns all getters', () => {
          expect(Object.keys(injectionMappingGetters)).toMatchSnapshot()
        })

        describe('getInjectionMappings', () => {
          const getInjectionMappings = injectionMappingGetters.getInjectionMappings
          let state
          beforeEach(() => {
            state = {
              injectionMappings: [{
                id: '1',
                processID: '1',
                extensionAreaID: 'EA_1'
              }, {
                id: '2',
                processID: '1',
                extensionAreaID: 'EA_2'
              }, {
                id: '3',
                processID: '2',
                extensionAreaID: 'EA_1'
              }, {
                id: '4',
                processID: '3',
                extensionAreaID: 'EA_2'
              }, {
                id: '5',
                processID: '2',
                extensionAreaID: 'EA_3'
              }, {
                id: '6',
                processID: '1',
                extensionAreaID: 'EA_1'
              }]
            }
          })

          it('returns a function', () => {
            expect(getInjectionMappings(state)).toEqual(expect.any(Function))
          })

          it('returns empty for empty state', () => {
            state.injectionMappings = []
            expect(getInjectionMappings(state)('1', 'EA_1')).toEqual([])
          })

          it('returns the matching results', () => {
            expect(getInjectionMappings(state)('99', 'EA_1')).toEqual([])
            expect(getInjectionMappings(state)('1', 'invalid')).toEqual([])
            expect(getInjectionMappings(state)('1', 'EA_3')).toEqual([])
            expect(getInjectionMappings(state)('1', 'EA_1')).toEqual([
              {
                id: '1',
                processID: '1',
                extensionAreaID: 'EA_1'
              }, {
                id: '6',
                processID: '1',
                extensionAreaID: 'EA_1'
              }
            ])
            expect(getInjectionMappings(state)('2', 'EA_3')).toEqual([
              {
                id: '5',
                processID: '2',
                extensionAreaID: 'EA_3'
              }
            ])
          })
        })
      })
    })
  })
})
