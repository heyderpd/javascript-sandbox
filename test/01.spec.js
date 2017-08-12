import assert from 'assert'

import { list } from '../src/scoped-objects'

const items = [
  { a: 1 },
  { b: 2 },
  { c: 3 },
]

describe('test', function() {
  it('list', () => {
    const L = list()
    L.push(items[0])
    // console.log(L)
    L.push(items[1])
    // console.log(L)
    const arr = L.map(x=>x, true)
    console.log(arr)
    // assert.deepEqual(result,
    //   [ 'bla.com', 'ble.com.br' ])
  })
})
