<template>
  <div id="graph">
    <svg>
      <g></g>
    </svg>
  </div>
</template>

<script>
import * as d3 from 'd3'
import dagreD3 from 'dagre-d3'
import { mapGetters } from 'vuex'

/*
 * @vuese
 * @group Components
 *
 * A Component which visualizes the connection between Processes, Context Situations and Context Factors
 */
export default {
  name: 'GraphVisualization',
  computed: {
    ...mapGetters({
      'processes': 'process/processGraphNodes',
      'contextSituations': 'contextSituation/contextSituationGraphNodes',
      'contextFactors': 'contextFactor/contextFactorGraphNodes',
      'edges': 'graphEdges'
    }),

    nodes() {
      return [...this.processes, ...this.contextSituations, ...this.contextFactors]
    }
  },

  methods: {
    setNode(entity) {
      this.g.setNode(entity.id, { label: entity.name, class: entity.type, id: entity.id, route: entity.route })
      this.g.setParent(entity.id, `group_${entity.type}`)
    },
    setEdge(edge) {
      this.g.setEdge(edge.start, edge.end, { arrowhead: 'undirected', curve: d3.curveMonotoneX, class: edge.type })
    },
    centerGraph() {
      const xCenterOffset = (this.$el.clientWidth - this.g.graph().width) / 2
      this.svgGroup.attr('transform', 'translate(' + xCenterOffset + ', 20)')
      this.svg.attr('height', this.g.graph().height + 40)
    },
    resizeHandler() {
      this.centerGraph()
    }
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.resizeHandler)
  },

  mounted() {
    window.addEventListener('resize', this.resizeHandler)
    this.g = new dagreD3.graphlib.Graph({ compound: true })
    this.g.setGraph({
      nodesep: 30,
      ranksep: 100,
      rankdir: 'LR',
      align: 'UL',
      marginx: 20,
      marginy: 20
    })
    this.g.setDefaultEdgeLabel(() => ({}))

    this.g.setNode('group_process', { label: 'Processes', clusterLabelPos: 'top' })
    this.g.setNode('group_situation', { label: 'Situations', clusterLabelPos: 'top' })
    this.g.setNode('group_factor', { label: 'Factors', clusterLabelPos: 'top' })

    this.nodes.forEach((entity) => {
      this.setNode(entity)
    })
    this.g.nodes().forEach((v) => {
      const node = this.g.node(v)
      // Round the corners of the nodes
      node.rx = node.ry = 5
    })

    this.edges.forEach((edge) => {
      this.setEdge(edge)
    })

    // eslint-disable-next-line new-cap
    const render = new dagreD3.render()

    this.svg = d3.select('#graph svg')
    this.svgGroup = this.svg.select('g')

    render(this.svgGroup, this.g)

    this.centerGraph()

    this.labels = this.svg.selectAll('g.nodes > *')
    this.labels.on('mouseover', (id) => {
      const node = this.g.node(id)
      node.elem.classList.add('active')

      const paths = this.g.nodeEdges(id)
      paths.forEach((p) => {
        const edge = this.g.edge(p)
        edge.elem.classList.add('active')
      })

      const edges = this.g.edges()
      edges.forEach((e) => {
        const edge = this.g.edge(e)
        if (!edge.elem.classList.contains('active')) {
          edge.elem.classList.add('inactive')
        }
      })
    })
    this.labels.on('mouseout', (id) => {
      const node = this.g.node(id)
      node.elem.classList.remove('active')

      const edges = this.g.edges()
      edges.forEach((e) => {
        const edge = this.g.edge(e)
        edge.elem.classList.remove('active')
        edge.elem.classList.remove('inactive')
      })
    })
    this.labels.on('click', (id) => {
      this.$router.push(this.g.node(id).route)
    })
    this.svg.selectAll('.edgePath path').attr('marker-end', '').attr('stroke-linecap', 'round')
  }
}

</script>

<style lang="scss">
$colors: (situation: #03A6FF, process: #1EC0FF, factor: #0080FF);

#graph {
  svg {
    width: 100%;

    .node {
      @each $name, $color in $colors {
        &.#{$name} {
          rect {
            fill: rgba($color, 0.1);
            stroke: rgba($color, 0.2);
          }

          text {
            fill: rgba($color, 1);
          }
        }
      }
    }
  }

  text {
    font-weight: 300;
    font-size: 14px;
  }

  .node {
    cursor: pointer;

    &.active {
      rect {
        transform: scale(1.1);
      }
    }

    rect {
      transition: all 200ms ease-in-out;
      fill: #fff;
    }
  }

  .edgePath {
    path {
      stroke: #8e8e8e;
      stroke-width: 5px;
      transition: all 200ms ease-in-out;
    }

    &.active {
      path {
        opacity: 1;
      }
    }

    &.inactive {
      path {
        opacity: 0.1;
      }
    }

    &.process_situation {

    }

    &.situation_factor {

    }
  }

  .clusters rect {
    fill: none;
    stroke: none;
  }

}

</style>
