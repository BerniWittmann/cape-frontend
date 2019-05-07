import { shallowMount } from '@vue/test-utils'
import { i18n } from '../../setupPlugins'

import AttributeRules from '@/components/context-factor/AttributeRules.vue'

describe('Components', () => {
  describe('AttributeRules', () => {
    let cmp
    let props
    beforeEach(() => {
      props = {
        contextFactor: {
          id: 'cF1',
          name: 'My COntext Factor',
          contextRules: [{
            id: 'cr1',
            state: 'First State',
            rule: 'ca1==OK&&ca2=19&&ca3==TRUE'
          }, {
            id: 'cr2',
            state: 'Second State',
            rule: 'ca3==FALSE'
          }],
          attributes: [{
            id: 'ca1',
            key: 'Attr 1',
            type: 'String',
            value: 'OK'
          }, {
            id: 'ca2',
            key: 'Attr 2',
            type: 'Number',
            value: '12'
          }, {
            id: 'ca3',
            key: 'Attr 3',
            type: 'Boolean',
            value: 'TRUE'
          }]
        }
      }
      jest.clearAllMocks()
      render()
    })

    function render() {
      cmp = shallowMount(AttributeRules, {
        i18n,
        propsData: props
      })
    }

    it('renders', () => {
      expect(cmp.html()).toMatchSnapshot()
    })

    it('renders a table', () => {
      const table = cmp.find('eltable-stub')
      expect(table.exists()).toBeTruthy()
      const columns = cmp.findAll('eltablecolumn-stub')
      expect(columns.length).toEqual(4)
      expect(columns.at(0).props('prop')).toEqual('ca1')
      expect(columns.at(1).props('prop')).toEqual('ca2')
      expect(columns.at(2).props('prop')).toEqual('ca3')
      expect(columns.at(3).props('label')).toEqual('context_factor.edit.state')
    })

    it('does not render a table if no attributes exist', () => {
      props.contextFactor = { ...props.contextFactor, attributes: [] }
      cmp.setProps(props)
      expect(cmp.html()).toMatchSnapshot()
    })

    it('can add a new rule', () => {
      cmp.vm.$refs.newStateForm.validate = jest.fn().mockImplementation((arg) => arg(true))
      const input = cmp.find('elinput-stub')
      expect(input.exists()).toBeTruthy()
      cmp.vm.newState.stateName = 'New State'
      const btn = cmp.find('elbutton-stub')
      expect(btn.exists()).toBeTruthy()
      btn.vm.$emit('click')

      expect(cmp.vm.$refs.newStateForm.validate).toHaveBeenCalled()
      expect(cmp.html()).toMatchSnapshot()
      expect(cmp.vm.tableData.length).toEqual(3)
      expect(cmp.vm.tableData[2]).toEqual({ ca1: undefined, ca2: undefined, ca3: undefined, state: 'New State' })
    })

    it('can add a new rule', () => {
      cmp.vm.newState.stateName = 'New &|=.State'
      cmp.vm.checkStateName()
      expect(cmp.vm.newState.stateName).toEqual('New State')
    })

    it('does not add new rule on invalid input', () => {
      cmp.vm.$refs.newStateForm.validate = jest.fn().mockImplementation((arg) => arg(false))
      const btn = cmp.find('elbutton-stub')
      expect(btn.exists()).toBeTruthy()
      btn.vm.$emit('click')

      expect(cmp.html()).toMatchSnapshot()
      expect(cmp.vm.tableData.length).toEqual(2)
    })

    describe('can delete a state', () => {
      it('can delete a state after confirmation', () => {
        cmp.vm.$message = jest.fn()
        cmp.vm.convertFromTableData = jest.fn()
        cmp.vm.$confirm = jest.fn().mockReturnValue(({ then: (arg) => { arg(); return { catch: () => {} } } }))
        cmp.vm.deleteState(0)
        expect(cmp.vm.$confirm).toHaveBeenCalledWith('context_factor.edit.states.delete.message', 'context_factor.edit.states.delete.warning', expect.any(Object))
        expect(cmp.vm.convertFromTableData).toHaveBeenCalled()
        expect(cmp.vm.tableData.length).toEqual(1)
        expect(cmp.vm.$message).toHaveBeenCalledWith({ message: 'context_factor.edit.states.delete.confirmation', type: 'success' })
      })
      it('can abort the state deletion', () => {
        cmp.vm.$confirm = jest.fn().mockReturnValue(({ then: () => { return { catch: (arg) => { arg() } } } }))
        cmp.vm.$message = jest.fn()
        cmp.vm.convertFromTableData = jest.fn()
        cmp.vm.deleteState(0)
        expect(cmp.vm.$confirm).toHaveBeenCalledWith('context_factor.edit.states.delete.message', 'context_factor.edit.states.delete.warning', expect.any(Object))
        expect(cmp.vm.convertFromTableData).not.toHaveBeenCalled()
        expect(cmp.vm.tableData.length).toEqual(2)
        expect(cmp.vm.$message).toHaveBeenCalledWith({ message: 'context_factor.edit.states.delete.cancellation', type: 'info' })
      })
    })

    describe('it exposes methods', () => {
      it('reRender', () => {
        const before = cmp.html()
        cmp.vm.reRender()
        expect(cmp.html()).toEqual(before)
      })

      it('nameCompare', () => {
        expect(cmp.vm.nameCompare(undefined, undefined)).toEqual(0)
        expect(cmp.vm.nameCompare({}, {})).toEqual(0)
        expect(cmp.vm.nameCompare({ state: 'a' }, {})).toEqual(0)
        expect(cmp.vm.nameCompare({}, { state: 'b' })).toEqual(0)
        expect(cmp.vm.nameCompare({}, { state: 'b' })).toEqual(0)
        expect(cmp.vm.nameCompare({ state: 'A' }, { state: 'b' })).toEqual(-1)
        expect(cmp.vm.nameCompare({ state: 'z' }, { state: 'T' })).toEqual(1)
      })

      describe('convertFromTableData', () => {
        function convert(rules) {
          cmp.vm.tableData = rules
          cmp.vm.convertFromTableData()
        }
        it('can handle empty Table Data', () => {
          convert([])
          expect(cmp.vm.contextFactor.contextRules).toEqual([])
        })

        describe('can handle Strings', () => {
          it('parses Strings', () => {
            convert([{ state: 'My State', ca1: 'OK' }])
            expect(cmp.vm.contextFactor.contextRules).toEqual([{ state: 'My State', rule: 'ca1==OK' }])
          })
        })

        describe('can handle Booleans', () => {
          it('parses Booleans', () => {
            convert([{ state: 'My State', ca3: 'TRUE' }])
            expect(cmp.vm.contextFactor.contextRules).toEqual([{ state: 'My State', rule: 'ca3==TRUE' }])
          })
        })

        describe('can handle Numbers', () => {
          it('handles equality', () => {
            convert([{ state: 'My State', ca2: '12' }])
            expect(cmp.vm.contextFactor.contextRules).toEqual([{ state: 'My State', rule: 'ca2==12' }])

            convert([{ state: 'My State', ca2: 'undefined' }])
            expect(cmp.vm.contextFactor.contextRules).toEqual([{ state: 'My State', rule: '' }])

            convert([{ state: 'My State', ca2: '12_12' }])
            expect(cmp.vm.contextFactor.contextRules).toEqual([{ state: 'My State', rule: 'ca2==12' }])
          })

          it('handles greater or equal comparison', () => {
            convert([{ state: 'My State', ca2: '12_' }])
            expect(cmp.vm.contextFactor.contextRules).toEqual([{ state: 'My State', rule: 'ca2>=12' }])
          })
          it('handles lesser or equal comparison', () => {
            convert([{ state: 'My State', ca2: '_12' }])
            expect(cmp.vm.contextFactor.contextRules).toEqual([{ state: 'My State', rule: 'ca2<=12' }])
          })
          describe('handles intervals', () => {
            it('handles correct intervals', () => {
              convert([{ state: 'My State', ca2: '12_14' }])
              expect(cmp.vm.contextFactor.contextRules).toEqual([{ state: 'My State', rule: 'ca2>=12&&ca2<=14' }])
            })
            it('handles undefined values', () => {
              convert([{ state: 'My State', ca2: 'undefined_undefined' }])
              expect(cmp.vm.contextFactor.contextRules).toEqual([{ state: 'My State', rule: '' }])

              convert([{ state: 'My State', ca2: 'undefined_12' }])
              expect(cmp.vm.contextFactor.contextRules).toEqual([{ state: 'My State', rule: '&&ca2<=12' }])

              convert([{ state: 'My State', ca2: '41_undefined' }])
              expect(cmp.vm.contextFactor.contextRules).toEqual([{ state: 'My State', rule: 'ca2>=41&&' }])
            })
          })
        })

        it('parses connections', () => {
          convert([{ state: 'My State', ca1: 'OK', ca3: 'TRUE' }])
          expect(cmp.vm.contextFactor.contextRules).toEqual([{ state: 'My State', rule: 'ca1==OK&&ca3==TRUE' }])
        })
      })

      describe('convertToTableData', () => {
        function setRules(rules) {
          props.contextFactor = { ...props.contextFactor, contextRules: rules }
          cmp.setProps(props)
        }
        it('if no rules are present return nothing', () => {
          const before = cmp.vm.tableData
          setRules(undefined)
          cmp.vm.convertToTableData()
          expect(cmp.vm.tableData).toEqual(before)
        })

        it('if empty rules are present return nothing', () => {
          setRules([])
          cmp.vm.convertToTableData()
          expect(cmp.vm.tableData).toEqual([])
        })

        it('handle equality', () => {
          setRules([{ state: 'First', rule: 'a1==12' }])
          cmp.vm.convertToTableData()
          expect(cmp.vm.tableData).toEqual([{ state: 'First', a1: '12' }])

          setRules([{ state: 'First', rule: 's5==STRING' }])
          cmp.vm.convertToTableData()
          expect(cmp.vm.tableData).toEqual([{ state: 'First', s5: 'STRING' }])
        })

        it('handle greater or equal comparison', () => {
          setRules([{ state: 'First', rule: 'a1>=12' }])
          cmp.vm.convertToTableData()
          expect(cmp.vm.tableData).toEqual([{ state: 'First', a1: '12_' }])
        })

        it('handle lesser or equal comparison', () => {
          setRules([{ state: 'First', rule: 'a1<=12' }])
          cmp.vm.convertToTableData()
          expect(cmp.vm.tableData).toEqual([{ state: 'First', a1: '_12' }])

          setRules([{ state: 'First', rule: 'a1==10&&a1<=12' }])
          cmp.vm.convertToTableData()
          expect(cmp.vm.tableData).toEqual([{ state: 'First', a1: '1012' }])
        })

        it('handle interval', () => {
          setRules([{ state: 'First', rule: 'a1<=10&&a1>=12' }])
          cmp.vm.convertToTableData()
          expect(cmp.vm.tableData).toEqual([{ state: 'First', a1: '12_10' }])

          setRules([{ state: 'First', rule: 'a1>=10&&a1<=12' }])
          cmp.vm.convertToTableData()
          expect(cmp.vm.tableData).toEqual([{ state: 'First', a1: '10_12' }])
        })

        it('handle connection', () => {
          setRules([{ state: 'First', rule: 'a1<=10&&a1>=12&&b1==TRUE&&c1==19' }])
          cmp.vm.convertToTableData()
          expect(cmp.vm.tableData).toEqual([{ state: 'First', a1: '12_10', b1: 'TRUE', c1: '19' }])
        })

        it('handle multiple rules', () => {
          setRules([{ state: 'First', rule: 'a1<=10&&a1>=12' }, { state: 'Second', rule: 'c1==TRUE&&b1>=19' }])
          cmp.vm.convertToTableData()
          expect(cmp.vm.tableData).toEqual([{ state: 'First', a1: '12_10' }, { state: 'Second', c1: 'TRUE', b1: '19_' }])
        })
      })
    })
  })
})
