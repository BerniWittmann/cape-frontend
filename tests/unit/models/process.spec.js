import moment from 'moment'
import Process from '@/models/process'

describe('Models', () => {
  describe('Process', () => {
    it('has a create Method', () => {
      expect(Process.create).toEqual(expect.any(Function))
    })

    it('can create the Process Object from the constructor', () => {
      const date = moment()

      const p = new Process({
        _id: '42',
        name: 'My Process',
        created_at: date.clone().subtract(2, 'days').toISOString(),
        last_edited_at: date.clone().subtract(1, 'days').toISOString(),
        tags: [{
          _id: '3',
          name: 'First Tag',
          color: '#FF0000'
        }, {
          _id: '4',
          name: 'Second Tag',
          color: '#FFFF00'
        }]
      })
      expect(p.id).toEqual('42')
      expect(p.name).toEqual('My Process')
      expect(p.createdAt.toISOString()).toEqual(date.clone().subtract(2, 'days').toISOString())
      expect(p.lastEditedAt.toISOString()).toEqual(date.clone().subtract(1, 'days').toISOString())
      expect(p.tags).toEqual([{
        id: '3',
        name: 'First Tag',
        color: '#FF0000'
      }, {
        id: '4',
        name: 'Second Tag',
        color: '#FFFF00'
      }])
    })

    it('can create the Process Object from the create Method', () => {
      const date = moment()
      const p = Process.create({
        _id: '42',
        name: 'My Process',
        createdAt: date.clone().subtract(2, 'days').toISOString(),
        lastEditedAt: date.clone().subtract(1, 'days').toISOString(),
        tags: [{
          _id: '3',
          name: 'First Tag',
          color: '#FF0000'
        }, {
          _id: '4',
          name: 'Second Tag',
          color: '#FFFF00'
        }]
      })
      expect(p.id).toEqual('42')
      expect(p.name).toEqual('My Process')
      expect(p.createdAt.toISOString()).toEqual(date.clone().subtract(2, 'days').toISOString())
      expect(p.lastEditedAt.toISOString()).toEqual(date.clone().subtract(1, 'days').toISOString())
      expect(p.tags).toEqual([{
        id: '3',
        name: 'First Tag',
        color: '#FF0000'
      }, {
        id: '4',
        name: 'Second Tag',
        color: '#FFFF00'
      }])
    })

    it('defaults the tags to an empty array', () => {
      const date = moment()

      const p = new Process({
        _id: '42',
        name: 'My Process',
        created_at: date.clone().subtract(2, 'days').toISOString(),
        last_edited_at: date.clone().subtract(1, 'days').toISOString()
      })
      expect(p.id).toEqual('42')
      expect(p.name).toEqual('My Process')
      expect(p.createdAt.toISOString()).toEqual(date.clone().subtract(2, 'days').toISOString())
      expect(p.lastEditedAt.toISOString()).toEqual(date.clone().subtract(1, 'days').toISOString())
      expect(p.tags).toEqual([])
    })

    it('has a toJSON Method', () => {
      const p = new Process({
        _id: '42',
        name: 'My Process',
        tags: [{
          _id: '52',
          color: '#FF0000',
          name: 'Tag'
        }]
      })
      expect(p.toJSON).toEqual(expect.any(Function))
      expect(p.toJSON()).toEqual({
        _id: '42',
        name: 'My Process',
        tags: [{
          _id: '52',
          color: '#FF0000',
          name: 'Tag'
        }]
      })
    })
  })
})
