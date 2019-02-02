import inherits from 'inherits'

import {
  assign
} from 'min-dash'

import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer'

import {
  getSemantic
} from 'bpmn-js/lib/draw/BpmnRenderUtil'

import {
  append as svgAppend,
  attr as svgAttr,
  create as svgCreate,
  classes as svgClasses
} from 'tiny-svg'

import extensionArea from '@/assets/extensionArea'

/**
 * A renderer that knows how to render custom elements.
 */
export default function CustomRenderer(eventBus, styles, textRenderer) {
  BaseRenderer.call(this, eventBus, 2000)

  const computeStyle = styles.computeStyle

  function renderLabel(parentGfx, label, options) {
    options = assign({
      size: {
        width: 100
      }
    }, options)

    const text = textRenderer.createText(label || '', options)

    svgClasses(text).add('djs-label')

    svgAppend(parentGfx, text)

    return text
  }

  function renderEmbeddedLabel(parentGfx, element, align) {
    const semantic = getSemantic(element)

    return renderLabel(parentGfx, semantic.name, {
      box: element,
      align: align,
      padding: 5,
      style: {
        fill: 'black'
      }
    })
  }

  this.drawExtensionArea = function (p, element) {
    let attrs

    attrs = computeStyle(attrs, {
      stroke: 'black',
      strokeWidth: 5,
      fill: '#3CAA82'
    })

    const polygon = svgCreate(extensionArea)

    svgAttr(polygon, attrs)

    svgAppend(p, polygon)

    renderEmbeddedLabel(p, element, 'center-middle')

    return polygon
  }
}

inherits(CustomRenderer, BaseRenderer)

CustomRenderer.$inject = ['eventBus', 'styles', 'textRenderer']

CustomRenderer.prototype.canRender = function (element) {
  return /^cape:/.test(element.type)
}

CustomRenderer.prototype.drawShape = function (p, element) {
  const type = element.type

  if (type === 'cape:ExtensionArea') {
    return this.drawExtensionArea(p, element)
  }
}
