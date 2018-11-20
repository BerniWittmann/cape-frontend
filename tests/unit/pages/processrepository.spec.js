import { shallowMount, mount } from '@vue/test-utils'
import { i18n } from '../setupPlugins'
import moment from 'moment'
import ProcessRepository from '@/pages/ProcessRepository.vue'
import Tag from '@/components/Tag.vue'
import EmptySlotComponent from '../EmptySlotComponent.vue'

describe('Pages', () => {
  describe('ProcessRepository.vue', () => {
    let store
    let cmp

    const date = moment(moment().utc())

    beforeEach(() => {
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
          $store: store
        },
        stubs: {
          'v-layout': EmptySlotComponent
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
          $store: store
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

    it('renders the tag components', (done) => {
      cmp = mount(ProcessRepository, {
        i18n,
        mocks: {
          $store: store
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
  })
})
