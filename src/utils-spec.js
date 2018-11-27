'use strict'

const la = require('lazy-ass')
const is = require('check-more-types')
const { mergeWith, or } = require('ramda')

/* eslint-env mocha */
describe('utils', () => {
  describe('getFields', () => {
    const { getFields } = require('./utils')

    it('returns list of fields', () => {
      const fields = getFields()
      la(is.strings(fields), fields)
    })
  })

  describe('Object.assign', () => {
    it('replaces empty strings with non-empty', () => {
      const o = Object.assign({}, { foo: '' }, { foo: 'foo' })
      la(o.foo === 'foo', o)
    })

    it('overwrites first string', () => {
      const o = Object.assign({}, { foo: 'foo' }, { foo: '' })
      la(o.foo === '', o)
    })
  })

  describe('R.mergeWith', () => {
    it('keeps non-empty string', () => {
      const o = mergeWith(or, { foo: 'foo' }, { foo: '' })
      la(o.foo === 'foo', o)
    })
  })

  describe('firstFoundValue', () => {
    const { firstFoundValue } = require('./utils')

    const env = {
      a: 1,
      b: 2,
      c: 3
    }

    it('finds first value', () => {
      const found = firstFoundValue(['a', 'b'], env)
      la(found === 1, found)
    })

    it('finds second value', () => {
      const found = firstFoundValue(['z', 'a', 'b'], env)
      la(found === 1, found)
    })

    it('finds nothing', () => {
      const found = firstFoundValue(['z', 'x'], env)
      la(found === null, found)
    })
  })
})
