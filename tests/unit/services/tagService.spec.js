import tagService from '@/services/tag'
import moxios from 'moxios'
import axios from 'axios'
import Vue from 'vue'
import store from '@/vuex/store'
import Tag from '@/models/tag'

store.dispatch = jest.fn()

const tagData = {
  _id: '42',
  name: 'My Tag',
  color: '#FF0000'
}

describe('Services', () => {
  describe('Tag', () => {
    console.error = jest.fn()
    const notification = {
      error: jest.fn()
    }

    beforeEach(() => {
      moxios.install()
      notification.error = jest.fn()
      Vue.$notify = notification
      Vue.$http = axios
      Vue.i18n = {
        t: key => key
      }
    })

    afterEach(() => {
      moxios.uninstall()
    })

    it('exports all functions', () => {
      expect(tagService.getAll).toEqual(expect.any(Function))
      expect(tagService.create).toEqual(expect.any(Function))
      expect(tagService.remove).toEqual(expect.any(Function))
    })

    describe('getAll', () => {
      it('should load all Tags', (done) => {
        moxios.stubRequest('/tags', {
          status: 200,
          response: [tagData]
        })

        const onFulfilled = jest.fn()
        tagService.getAll().then(onFulfilled)

        moxios.wait(() => {
          expect(onFulfilled).toHaveBeenCalled()
          expect(store.dispatch).toHaveBeenCalledWith('tag/store', [new Tag(tagData)])
          done()
        })
      })

      it('should handle fail', (done) => {
        moxios.stubRequest('/tags', {
          status: 400
        })

        const onFulfilled = jest.fn()
        tagService.getAll().then(onFulfilled)

        moxios.wait(() => {
          expect(onFulfilled).toHaveBeenCalled()
          done()
        })
      })

      it('should show notification on fail', (done) => {
        moxios.stubRequest('/tags', {
          status: 400
        })

        const onFulfilled = jest.fn()
        tagService.getAll().then(onFulfilled)

        moxios.wait(() => {
          expect(onFulfilled).toHaveBeenCalled()
          expect(notification.error).toHaveBeenCalledWith({
            title: 'notifications.tags.get.failed.title',
            message: 'notifications.tags.get.failed.message'
          })
          done()
        })
      })
    })

    describe('create', () => {
      it('should create a tag', (done) => {
        moxios.stubRequest('/tags', {
          status: 200,
          response: tagData
        })

        const onFulfilled = jest.fn()
        tagService.create({ name: 'Test', color: '#FF0000' }).then(onFulfilled)

        moxios.wait(() => {
          expect(onFulfilled).toHaveBeenCalled()
          expect(store.dispatch).toHaveBeenCalledWith('tag/add', new Tag(tagData))
          done()
        })
      })

      it('should handle fail', (done) => {
        moxios.stubRequest('/tags', {
          status: 400
        })

        const onFulfilled = jest.fn()
        tagService.create({}).then(onFulfilled)

        moxios.wait(() => {
          expect(onFulfilled).toHaveBeenCalled()
          done()
        })
      })

      it('should show notification on fail', (done) => {
        moxios.stubRequest('/tags', {
          status: 400
        })

        const onFulfilled = jest.fn()
        tagService.create({}).then(onFulfilled)

        moxios.wait(() => {
          expect(onFulfilled).toHaveBeenCalled()
          expect(notification.error).toHaveBeenCalledWith({
            title: 'notifications.tag.post.failed.title',
            message: 'notifications.tag.post.failed.message'
          })
          done()
        })
      })
    })

    describe('remove', () => {
      it('should remove a tag', (done) => {
        moxios.stubRequest('/tags/42', {
          status: 200,
          response: undefined
        })

        const onFulfilled = jest.fn()
        tagService.remove({ id: '42', name: 'Test', color: '#FF0000' }).then(onFulfilled)

        moxios.wait(() => {
          expect(onFulfilled).toHaveBeenCalled()
          expect(store.dispatch).toHaveBeenCalledWith('tag/remove', { id: '42', name: 'Test', color: '#FF0000' })
          done()
        })
      })

      it('should handle fail', (done) => {
        moxios.stubRequest('/tags/42', {
          status: 400
        })

        const onFulfilled = jest.fn()
        tagService.remove({ id: '42' }).then(onFulfilled)

        moxios.wait(() => {
          expect(onFulfilled).toHaveBeenCalled()
          done()
        })
      })

      it('should show notification on fail', (done) => {
        moxios.stubRequest('/tags/42', {
          status: 400
        })

        const onFulfilled = jest.fn()
        tagService.remove({ id: '42' }).then(onFulfilled)

        moxios.wait(() => {
          expect(onFulfilled).toHaveBeenCalled()
          expect(notification.error).toHaveBeenCalledWith({
            title: 'notifications.tag.delete.failed.title',
            message: 'notifications.tag.delete.failed.message'
          })
          done()
        })
      })
    })
  })
})
