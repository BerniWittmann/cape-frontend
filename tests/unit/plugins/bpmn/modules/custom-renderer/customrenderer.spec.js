import CustomRenderer from '@/plugins/bpmn/modules/custom-renderer/customRenderer'
import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer'

jest.mock('inherits', () => {
  return jest.fn()
})

jest.mock('diagram-js/lib/draw/BaseRenderer', () => {
  return {
    call: jest.fn()
  }
})

jest.mock('min-dash', () => {
  return {
    assign: jest.fn()
  }
})

jest.mock('tiny-svg', () => {
  return {
    append: jest.fn().mockImplementation((parent, s) => {
      parent.child = s
      return parent
    }),
    attr: jest.fn().mockImplementation((p, a) => {
      p.attributes = a
      return p
    }),
    create: jest.fn().mockReturnValue({ svg: true }),
    classes: jest.fn().mockReturnValue({ add: jest.fn() })
  }
})

jest.mock('bpmn-js/lib/draw/BpmnRenderUtil', () => {
  return {
    getSemantic: jest.fn().mockReturnValue('Semantic Name')
  }
})

describe('Plugins', () => {
  describe('BPMN', () => {
    describe('Modules', () => {
      describe('Custom Renderer', () => {
        const eventBus = jest.fn()
        const styles = {
          computeStyle: (a, b) => b
        }
        const textRenderer = {
          createText: jest.fn()
        }

        it('can be instantiated', () => {
          expect(CustomRenderer).toEqual(expect.any(Function))
          CustomRenderer.call({}, eventBus, styles, textRenderer)
          expect(BaseRenderer.call).toHaveBeenCalledWith({
            drawExtensionArea: expect.any(Function),
            computeStyle: expect.any(Function),
            textRenderer: expect.any(Object)
          }, eventBus, 2000)
        })

        it('has the correct modules injected', () => {
          expect(CustomRenderer.$inject).toMatchSnapshot()
        })

        describe('it exposes the canRender function', () => {
          it('has the function', () => {
            expect(CustomRenderer.prototype.canRender).toEqual(expect.any(Function))
          })

          it('returns true for custom elements', () => {
            expect(CustomRenderer.prototype.canRender({ type: 'cape:ExtensionArea' })).toBeTruthy()
            expect(CustomRenderer.prototype.canRender({ type: 'cape:Process' })).toBeTruthy()
          })

          it('returns false for non custom elements', () => {
            expect(CustomRenderer.prototype.canRender({ type: 'ExtensionArea' })).toBeFalsy()
            expect(CustomRenderer.prototype.canRender({ type: 'bpmn:Process' })).toBeFalsy()
          })
        })

        describe('it exposes the drawShape function', () => {
          let drawExtensionArea = jest.fn()
          let drawShape
          beforeEach(() => {
            drawShape = CustomRenderer.prototype.drawShape.bind({
              drawExtensionArea
            })
            drawExtensionArea.mockClear()
          })

          it('has the function', () => {
            expect(drawShape).toEqual(expect.any(Function))
          })

          it('draws the extension Area for the correct type', () => {
            drawShape({ parent: true }, { type: 'cape:ExtensionArea' })

            expect(drawExtensionArea).toHaveBeenCalledWith({ parent: true }, { type: 'cape:ExtensionArea' })
          })
          it('does nothing for an incorrect type', () => {
            drawShape({ parent: true }, { type: 'bpmn:Process' })

            expect(drawExtensionArea).not.toHaveBeenCalled()
          })
        })

        describe('it draws the extension Area', () => {
          let drawExtensionArea
          beforeEach(() => {
            CustomRenderer.call({}, eventBus, styles, textRenderer)
            drawExtensionArea = BaseRenderer.call.mock.calls[0][0].drawExtensionArea
          })

          it('renders the svg', () => {
            const result = drawExtensionArea({ parent: true }, { type: 'cape:ExtensionArea' })
            expect(result).toMatchSnapshot()
          })
        })
      })
    })
  })
})
