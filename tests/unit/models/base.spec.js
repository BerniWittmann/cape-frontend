import Base, { toSnakeCase, convertObjectToSnakeCaseKeys } from '@/models/base'

describe('Models', () => {
  describe('Base', () => {
    it('has a create Method', () => {
      expect(Base.create).toEqual(expect.any(Function))
    })

    it('the create method calls the constructor with converted Object', () => {
      expect(Base.create({
        testValue: 42,
        foo: 'bar'
      })).toEqual({})
    })

    describe('convertObjectToSnakeCaseKeys method', () => {
      it('returns argument back for invalid values', () => {
        expect(convertObjectToSnakeCaseKeys(undefined)).toEqual(undefined)
        expect(convertObjectToSnakeCaseKeys(null)).toEqual(null)
        expect(convertObjectToSnakeCaseKeys('test')).toEqual('test')
        expect(convertObjectToSnakeCaseKeys(42)).toEqual(42)
        expect(convertObjectToSnakeCaseKeys({})).toEqual({})
      })

      it('converts keys of object correctly to snake case', () => {
        expect(convertObjectToSnakeCaseKeys({
          foo: 'bar',
          testValue: 'snakeCase',
          id: 'test'
        })).toEqual({
          foo: 'bar',
          test_value: 'snakeCase',
          _id: 'test'
        })
      })

      it('converts nested objects to snake case', () => {
        expect(convertObjectToSnakeCaseKeys({
          foo: 'bar',
          testValue: 'snakeCase',
          nestedObject: {
            otherValue: 'test',
            foo: 42,
            testyTest: {
              aB: 'b'
            }
          }
        })).toEqual({
          foo: 'bar',
          test_value: 'snakeCase',
          nested_object: {
            other_value: 'test',
            foo: 42,
            testy_test: {
              a_b: 'b'
            }
          }
        })
      })

      it('converts nested arrays to snake case', () => {
        expect(convertObjectToSnakeCaseKeys({
          foo: 'bar',
          testValue: 'snakeCase',
          nestedArray: [{
            otherValue: 'test',
            foo: 42
          }, {
            otherValue: 'test2',
            foo: 42
          }]
        })).toEqual({
          foo: 'bar',
          test_value: 'snakeCase',
          nested_array: [{
            other_value: 'test',
            foo: 42
          }, {
            other_value: 'test2',
            foo: 42
          }]
        })
      })
    })

    describe('toSnakeCase', () => {
      it('converts a string to snake case', () => {
        expect(toSnakeCase('helloWorld')).toEqual('hello_world')
        expect(toSnakeCase('helloWorldWithMultiple')).toEqual('hello_world_with_multiple')
        expect(toSnakeCase('hello')).toEqual('hello')
        expect(toSnakeCase('helloWithATrick')).toEqual('hello_with_a_trick')
      })

      it('empty string returns an empty string', () => {
        expect(toSnakeCase(undefined)).toEqual('')
        expect(toSnakeCase(null)).toEqual('')
        expect(toSnakeCase(23)).toEqual('')
        expect(toSnakeCase({})).toEqual('')
      })

      it('converts a string containing ID correctly to snake case', () => {
        expect(toSnakeCase('helloWorldID')).toEqual('hello_world_id')
      })

      it('converts a string containing URL correctly to snake case', () => {
        expect(toSnakeCase('helloWorldURL')).toEqual('hello_world_url')
      })

      it('converts a string with capital first letter correctly to snake case', () => {
        expect(toSnakeCase('HelloWorld')).toEqual('hello_world')
        expect(toSnakeCase('Hello')).toEqual('hello')
      })
    })
  })
})
