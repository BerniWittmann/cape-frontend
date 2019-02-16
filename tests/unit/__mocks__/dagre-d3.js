export class ClassList {
  constructor() {
    this._classes = []
  }

  add(str) {
    this._classes.push(str)
  }

  contains(str) {
    return this._classes.includes(str)
  }

  remove(str) {
    this._classes = this._classes.filter(c => c !== str)
  }
}

export class Graph {
  constructor(options) {
    this.isGraph = true
    this.options = options
    this._nodes = {}
    this._edges = {}
    return this
  }

  setGraph(options) {
    this.graphOptions = options
    return this
  }

  setDefaultEdgeLabel(fn) {
    this.defaultEdgeLabel = fn
    return this
  }

  setNode(id, data) {
    this._nodes[id] = {
      ...data,
      elem: {
        classList: new ClassList()
      }
    }
    return this
  }

  setEdge(start, end, data) {
    this._edges[start + '_' + end] = {
      ...data,
      elem: {
        classList: new ClassList()
      }
    }
    return this
  }

  setParent(id, parent) {
    if (!this._nodes[id]) throw new Error('Node not found')
    this._nodes[id].parent = parent
    return this
  }

  nodes() {
    return Object.keys(this._nodes)
  }

  edges() {
    return Object.keys(this._edges)
  }

  nodeEdges(id) {
    return Object.keys(this._edges).filter((s) => s.includes(id))
  }

  edge(id) {
    return this._edges[id]
  }

  node(id) {
    return this._nodes[id]
  }

  graph() {
    return {
      width: 1024,
      height: 900
    }
  }
}

export class Render {
  constructor() {
    return renderFunction
  }
}

const renderFunction = jest.fn()

export default {
  graphlib: {
    Graph
  },
  render: Render,
  renderFunction
}
