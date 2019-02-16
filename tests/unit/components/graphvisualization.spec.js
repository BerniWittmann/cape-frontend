import { shallowMount } from '@vue/test-utils'
import { i18n } from '../setupPlugins'
import * as d3 from 'd3'
import dagreD3 from 'dagre-d3'

import GraphVisualization from '@/components/GraphVisualization.vue'

describe('Components', () => {
  describe('GraphVisualization', () => {
    let store
    let cmp
    let graph
    let router

    beforeEach(() => {
      store = {
        getters: {
          'process/processGraphNodes': [{
            id: 'p1',
            name: 'Process 1',
            type: 'process',
            route: {
              name: 'process.preview',
              params: {
                processID: 'p1'
              }
            }
          }, {
            id: 'p2',
            name: 'Process 2',
            type: 'process',
            route: {
              name: 'process.preview',
              params: {
                processID: 'p2'
              }
            }
          }, {
            id: 'p3',
            name: 'Process 3',
            type: 'process',
            route: {
              name: 'process.preview',
              params: {
                processID: 'p3'
              }
            }
          }],
          'contextFactor/contextFactorGraphNodes': [{
            id: 'cF1',
            name: 'Factor 1',
            type: 'factor',
            route: {
              name: 'context_factor.edit',
              params: {
                processID: 'cF1'
              }
            }
          }, {
            id: 'cF2',
            name: 'Factor 2',
            type: 'factor',
            route: {
              name: 'context_factor.edit',
              params: {
                processID: 'cF1'
              }
            }
          }, {
            id: 'cF3',
            name: 'Factor 3',
            type: 'factor',
            route: {
              name: 'context_factor.edit',
              params: {
                processID: 'cF3'
              }
            }
          }, {
            id: 'cF4',
            name: 'Factor 4',
            type: 'factor',
            route: {
              name: 'context_factor.edit',
              params: {
                processID: 'cF4'
              }
            }
          }],
          'contextSituation/contextSituationGraphNodes': [{
            id: 'cS1',
            name: 'Situation 1',
            type: 'situation',
            route: {
              name: 'context_situation.single',
              params: {
                processID: 'cS1'
              }
            }
          }, {
            id: 'cS2',
            name: 'Situation 2',
            type: 'situation',
            route: {
              name: 'context_situation.single',
              params: {
                processID: 'cS2'
              }
            }
          }],
          graphEdges: [{
            start: 'p1',
            end: 'cS1',
            type: 'process_situation'
          }, {
            start: 'p1',
            end: 'cS2',
            type: 'process_situation'
          }, {
            start: 'p3',
            end: 'cS2',
            type: 'process_situation'
          }, {
            start: 'cS1',
            end: 'cF1',
            type: 'situation_factor'
          }, {
            start: 'cS2',
            end: 'cF3',
            type: 'situation_factor'
          }, {
            start: 'cS1',
            end: 'cF3',
            type: 'situation_factor'
          }, {
            start: 'cS2',
            end: 'cF2',
            type: 'situation_factor'
          }]
        }
      }
      router = {
        push: jest.fn()
      }
      window.addEventListener = jest.fn()
      window.removeEventListener = jest.fn()
      jest.clearAllMocks()
      render()
    })

    function render() {
      cmp = shallowMount(GraphVisualization, {
        i18n,
        mocks: {
          $store: store,
          $router: router
        }
      })
      graph = cmp.vm.g
    }

    it('renders', () => {
      expect(cmp.html()).toMatchSnapshot()
    })

    it('renders an svg', () => {
      const graph = cmp.find('#graph')
      expect(graph.exists()).toBeTruthy()
      const svg = graph.find('svg')
      expect(svg.exists()).toBeTruthy()
    })

    it('setups the graph', () => {
      expect(graph.options).toEqual({ compound: true })
      expect(graph.graphOptions).toEqual(expect.any(Object))

      expect(graph.defaultEdgeLabel).toEqual(expect.any(Function))
      expect(graph.defaultEdgeLabel()).toEqual({})
    })

    it('renders', () => {
      expect(dagreD3.renderFunction.mock.calls[0][0].isD3).toBeTruthy()
      expect(dagreD3.renderFunction.mock.calls[0][1].isGraph).toBeTruthy()
    })

    it('renders all nodes', () => {
      expect(Object.keys(graph._nodes).length).toEqual(12)
    })

    describe('renders the processes', () => {
      it('renders a process group', () => {
        const group = graph._nodes['group_process']
        expect(group).toEqual({
          'clusterLabelPos': 'top',
          'label': 'Processes',
          'rx': 5,
          'ry': 5,
          elem: expect.any(Object)
        })
      })

      it('renders all processes', () => {
        store.getters['process/processGraphNodes'].forEach(p => {
          const process = graph._nodes[p.id]
          expect(process).toEqual({
            id: p.id,
            label: p.name,
            class: 'process',
            route: p.route,
            rx: 5,
            ry: 5,
            parent: 'group_process',
            elem: expect.any(Object)
          })
        })
      })
    })

    describe('renders the factors', () => {
      it('renders a factors group', () => {
        const group = graph._nodes['group_factor']
        expect(group).toEqual({
          'clusterLabelPos': 'top',
          'label': 'Factors',
          'rx': 5,
          'ry': 5,
          elem: expect.any(Object)
        })
      })

      it('renders all factors', () => {
        store.getters['contextFactor/contextFactorGraphNodes'].forEach(f => {
          const factor = graph._nodes[f.id]
          expect(factor).toEqual({
            id: f.id,
            label: f.name,
            class: 'factor',
            route: f.route,
            rx: 5,
            ry: 5,
            parent: 'group_factor',
            elem: expect.any(Object)
          })
        })
      })
    })

    describe('renders the situations', () => {
      it('renders a situations group', () => {
        const group = graph._nodes['group_situation']
        expect(group).toEqual({
          'clusterLabelPos': 'top',
          'label': 'Situations',
          'rx': 5,
          'ry': 5,
          elem: expect.any(Object)
        })
      })

      it('renders all situations', () => {
        store.getters['contextSituation/contextSituationGraphNodes'].forEach(s => {
          const situation = graph._nodes[s.id]
          expect(situation).toEqual({
            id: s.id,
            label: s.name,
            class: 'situation',
            route: s.route,
            rx: 5,
            ry: 5,
            parent: 'group_situation',
            elem: expect.any(Object)
          })
        })
      })
    })

    describe('renders the edges', () => {
      it('renders all edges', () => {
        expect(Object.keys(graph._edges).length).toEqual(7)
      })
    })

    describe('listens to node mouse over', () => {
      let handler
      beforeEach(() => {
        handler = cmp.vm.labels._listeners['mouseover']
      })

      it('listens for the mouseover event', () => {
        expect(handler).toEqual(expect.any(Function))
      })
      it('adds the active class to the current node', () => {
        handler('p1')

        expect(graph.node('p1').elem.classList.contains('active')).toBeTruthy()
      })

      it('adds the active classes to all adjoining edges', () => {
        handler('p1')

        graph.nodeEdges().forEach(e => {
          e = graph.edge(e)
          expect(e.elem.classList.contains('active')).toBeTruthy()
          expect(e.elem.classList.contains('inactive')).toBeFalsy()
        })
      })

      it('adds the inactive classes to all non adjoining edges', () => {
        handler('p1')

        const nodeEdges = graph.nodeEdges('p1')
        graph.edges().forEach(e => {
          const ed = graph.edge(e)
          if (!nodeEdges.includes(e)) {
            expect(ed.elem.classList.contains('inactive')).toBeTruthy()
            expect(ed.elem.classList.contains('active')).toBeFalsy()
          }
        })
      })
    })

    describe('unsets highlights on mouse leave', () => {
      let handler
      beforeEach(() => {
        handler = cmp.vm.labels._listeners['mouseout']
        graph.node('p2').elem.classList.add('active')
        graph.edges().forEach(e => {
          e = graph.edge(e)
          const state = Math.random() > 0.5 ? 'active' : 'inactive'
          e.elem.classList.add(state)
        })
      })
      it('listens for the mouseout event', () => {
        expect(handler).toEqual(expect.any(Function))
      })
      it('removes the active class from the active node', () => {
        handler('p2')

        expect(graph.node('p2').elem.classList.contains('active')).toBeFalsy()
      })

      it('removes the active and inactive classes from all edges', () => {
        handler('p2')

        graph.edges().forEach(e => {
          e = graph.edge(e)
          expect(e.elem.classList.contains('active')).toBeFalsy()
          expect(e.elem.classList.contains('inactive')).toBeFalsy()
        })
      })
    })

    it('navigates to route on node click', () => {
      const clickHandler = cmp.vm.labels._listeners['click']
      expect(clickHandler).toEqual(expect.any(Function))

      const nodes = [
        ...store.getters['process/processGraphNodes'],
        ...store.getters['contextFactor/contextFactorGraphNodes'],
        ...store.getters['contextSituation/contextSituationGraphNodes']
      ]
      nodes.forEach(node => {
        clickHandler(node.id)
        expect(router.push).toHaveBeenCalledWith(node.route)
      })
    })

    describe('it centers the graph on resize', () => {
      let handler
      beforeEach(() => {
        handler = window.addEventListener.mock.calls[0][1]
      })
      it('centers the graph on render', () => {
        expect(d3.default._attrs).toEqual({
          height: 940,
          transform: 'translate(-512, 20)',
          'marker-end': '',
          'stroke-linecap': 'round'
        })
      })

      it('has a lister on the resize event', () => {
        expect(handler).toEqual(expect.any(Function))
        expect(window.addEventListener.mock.calls[0]).toEqual(['resize', cmp.vm.resizeHandler])
      })

      it('centers the graph on resize', () => {
        d3.default._attrs = {}

        expect(d3.default._attrs).toEqual({})

        handler()

        expect(d3.default._attrs).toEqual({
          height: 940,
          transform: 'translate(-512, 20)'
        })
      })

      it('removes the resize listener on destroy', () => {
        expect(window.removeEventListener).not.toHaveBeenCalled()

        cmp.destroy()

        expect(window.removeEventListener).toHaveBeenCalledWith('resize', cmp.vm.resizeHandler)
      })
    })
  })
})
