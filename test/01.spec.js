import assert from 'assert'

import { list } from '../src/scoped-objects'

const items = [
  { a: 1 },
  { b: 2 },
  { c: 3 },
]

describe('list', function() {
  it('push', () => {
    const L = list()
    L.push(items[0])
    L.push(items[1])
    L.push(items[2])
    
    const arr = L.map()

    assert.deepEqual(
      arr,
      items)
  })

  it('circular', () => {
    const L = list()
    L.push(items[0])
    L.push(items[1])
    L.makeCircular(true)
    
    const iterator = L.map(
      x=> x,
      true)

    assert.deepEqual(
      iterator.next().value,
      {a: 1})
    assert.deepEqual(
      iterator.next().value,
      {b: 2})
    assert.deepEqual(
      iterator.next().value,
      {a: 1})
  })
})
