import CustomBPMNFactory from '@/plugins/bpmn/modules/custom-bpmn-factory/CustomBPMNFactory'
import BPMNFactory from 'bpmn-js/lib/features/modeling/BpmnFactory'

jest.mock('inherits', () => {
  return jest.fn()
})

jest.mock('bpmn-js/lib/features/modeling/BpmnFactory', () => {
  return {
    call: jest.fn(),
    prototype: {
      _needsId: jest.fn()
    }
  }
})

describe('Plugins', () => {
  describe('BPMN', () => {
    describe('Modules', () => {
      describe('Custom BPMN Factory', () => {
        const moddle = jest.fn()
        it('can be instantiated', () => {
          expect(CustomBPMNFactory).toEqual(expect.any(Function))
          CustomBPMNFactory.call({}, moddle)
          expect(BPMNFactory.call).toHaveBeenCalledWith({
            _model: moddle
          }, moddle)
        })

        it('has the correct modules injected', () => {
          expect(CustomBPMNFactory.$inject).toMatchSnapshot()
        })

        describe('checks wether an element needs an id', () => {
          const element = {
            $type: 'cape:ExtensionArea'
          }
          it('returns true when its a custom element', () => {
            expect(CustomBPMNFactory.prototype._needsId(element)).toBeTruthy()
            expect(BPMNFactory.prototype._needsId).not.toHaveBeenCalled()
          })
          describe('it relies the check logic back to BPMNFactory for non custom elements', () => {
            beforeEach(() => {
              element.$type = 'bpmn:Task'
            })
            it('can return true', () => {
              BPMNFactory.prototype._needsId = jest.fn().mockReturnValue(true)

              expect(CustomBPMNFactory.prototype._needsId(element)).toBeTruthy()
              expect(BPMNFactory.prototype._needsId).toHaveBeenCalled()
            })
            it('can return false', () => {
              BPMNFactory.prototype._needsId = jest.fn().mockReturnValue(false)

              expect(CustomBPMNFactory.prototype._needsId(element)).toBeFalsy()
              expect(BPMNFactory.prototype._needsId).toHaveBeenCalled()
            })
          })
        })
      })
    })
  })
})
