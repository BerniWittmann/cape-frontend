import { shallowMount, mount, RouterLinkStub } from '@vue/test-utils'
import { i18n } from '../setupPlugins'
import moment from 'moment'
import ProcessRepository from '@/pages/ProcessRepository.vue'
import Tag from '@/components/Tag.vue'
import EmptySlotComponent from '../EmptySlotComponent.vue'

describe('Pages', () => {
  describe('ProcessRepository.vue', () => {
    let store
    let router
    let cmp

    const date = moment(moment().utc())

    beforeEach(() => {
      router = {
        push: jest.fn()
      }
      store = {
        state: {
          process: {
            processes: [{
              id: '1',
              name: 'First Process',
              createdAt: date.clone().subtract(14, 'days'),
              lastEditedAt: date.clone().subtract(2, 'days'),
              tags: [{
                id: '42',
                name: 'First Tag',
                color: '#FF0000'
              }, {
                id: '43',
                name: 'Second Tag',
                color: '#FFFF00'
              }]
            }, {
              id: '2',
              name: 'Second Process',
              createdAt: date.clone().subtract(8, 'days'),
              lastEditedAt: date.clone().subtract(6, 'days'),
              tags: [{
                id: '42',
                name: 'First Tag',
                color: '#FF0000'
              }]
            }, {
              id: '3',
              name: 'Third Process',
              createdAt: date.clone().subtract(2, 'days'),
              lastEditedAt: date.clone().subtract(1, 'days'),
              tags: []
            }]
          }
        }
      }
      render()
    })

    function render() {
      cmp = shallowMount(ProcessRepository, {
        i18n,
        mocks: {
          $store: store,
          $router: router
        },
        stubs: {
          'v-layout': EmptySlotComponent,
          'el-tooltip': EmptySlotComponent,
          RouterLink: RouterLinkStub
        }
      })
    }

    it('renders', () => {
      expect(cmp.html()).toMatchSnapshot()
    })

    it('renders the table correctly', (done) => {
      // Hide error resulting from el-table warning
      console.error = jest.fn()

      cmp = mount(ProcessRepository, {
        i18n,
        mocks: {
          $store: store,
          $router: router
        },
        stubs: {
          'v-layout': EmptySlotComponent
        },
        sync: false
      })
      cmp.vm.$nextTick(() => {
        expect(cmp.html()).toMatchSnapshot()
        done()
      })
    })

    it('renders the table', () => {
      expect(cmp.contains('eltable-stub')).toBeTruthy()
    })

    it('renders all processes', () => {
      const table = cmp.find('eltable-stub')

      expect(table.props('data')).toEqual(store.state.process.processes)
    })

    it('can search for a process', () => {
      const searchInput = cmp.find('elinput-stub')

      expect(searchInput.exists()).toBeTruthy()

      cmp.vm.search = 'sec'

      const table = cmp.find('eltable-stub')

      expect(table.props('data')).toEqual([store.state.process.processes[1]])
    })

    it('can filter for process tags', () => {
      const tagColumn = cmp.findAll('eltablecolumn-stub').at(3)
      expect(tagColumn.exists()).toBeTruthy()

      expect(tagColumn.props('filters')).toEqual([{
        value: '42',
        text: 'First Tag'
      }, {
        value: '43',
        text: 'Second Tag'
      }])
    })

    it('can filter for a tag', () => {
      expect(cmp.vm.filterTag('42', store.state.process.processes[0])).toEqual({
        color: '#FF0000',
        id: '42',
        name: 'First Tag'
      })
    })

    it('can sort properly case insensitive', () => {
      store = {
        state: {
          process: {
            processes: [
              {
                id: '0',
                name: 'A Process',
                createdAt: date.clone().subtract(2, 'days'),
                lastEditedAt: date.clone().subtract(1, 'days'),
                tags: []
              }, {
                id: '1',
                name: 'b Process',
                createdAt: date.clone().subtract(2, 'days'),
                lastEditedAt: date.clone().subtract(1, 'days'),
                tags: []
              }, {
                id: '2',
                name: 'B Process',
                createdAt: date.clone().subtract(2, 'days'),
                lastEditedAt: date.clone().subtract(1, 'days'),
                tags: []
              }
            ]
          }
        }
      }
      expect(cmp.vm.nameCompare(store.state.process.processes[0], store.state.process.processes[1])).toBe(-1)
      expect(cmp.vm.nameCompare(store.state.process.processes[1], store.state.process.processes[0])).toBe(1)
      expect(cmp.vm.nameCompare(store.state.process.processes[0], store.state.process.processes[2])).toBe(-1)
      expect(cmp.vm.nameCompare(store.state.process.processes[2], store.state.process.processes[0])).toBe(1)
      expect(cmp.vm.nameCompare(store.state.process.processes[1], store.state.process.processes[2])).toBe(0)
    })

    it('renders the tag components', (done) => {
      cmp = mount(ProcessRepository, {
        i18n,
        mocks: {
          $store: store,
          $router: router
        },
        stubs: {
          'v-layout': EmptySlotComponent
        },
        sync: false
      })
      cmp.vm.$nextTick(() => {
        expect(cmp.contains(Tag)).toBeTruthy()
        done()
      })
    })

    it('a process can be edited', (done) => {
      cmp = mount(ProcessRepository, {
        i18n,
        mocks: {
          $store: store,
          $router: router
        },
        stubs: {
          'v-layout': EmptySlotComponent
        },
        sync: false
      })
      cmp.vm.$nextTick(() => {
        const link = cmp.find('.el-table_3_column_15  .el-button')
        expect(link.exists()).toBeTruthy()
        link.trigger('click')

        expect(router.push).toHaveBeenCalledWith({
          name: 'process.edit',
          params: {
            processID: '3'
          }
        })

        done()
      })
    })

    it('a process can be previewed', (done) => {
      cmp = mount(ProcessRepository, {
        i18n,
        mocks: {
          $store: store,
          $router: router
        },
        stubs: {
          'v-layout': EmptySlotComponent
        },
        sync: false
      })
      cmp.vm.$nextTick(() => {
        const link = cmp.find('.el-table__row')
        expect(link.exists()).toBeTruthy()
        link.trigger('click')

        expect(router.push).toHaveBeenCalledWith({
          name: 'process.preview',
          params: {
            processID: '3'
          }
        })

        done()
      })
    })

    it('has a button to create a new process', () => {
      const link = cmp.find(RouterLinkStub)
      expect(link.exists()).toBeTruthy()
      expect(link.props('to')).toEqual({
        name: 'process.new'
      })
    })
  })
})
