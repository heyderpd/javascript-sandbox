const maybe = function (data) {
  const state = { data }
  const props = {}

  const get = key => key
    ? props[key]
    : state.data
  const set = (key, value) => key
    ? props[key] = value
    : state.data = value

  return {
    state,
    get,
    set
  }
}

const listItem = function (data) {
  const item = new maybe(data)

  const state = {
    next: null,
    before: null
  }

  const next = () => state.next
  const setNext = next => state.next = next
  const before = () => state.before
  const setBefore = before => state.before = before

  item.set('next', next)
  item.set('setNext', setNext)
  item.set('before', before)
  item.set('setBefore', setBefore)

  return item
}

const list = function () {
  const state = {
    length: 0,
    first: null,
    last: null
  }

  const setFirst = item => state.first = item
  const setLast = item => state.last = item
  const ifFirstSet = item => {
    if (length === 0) {
      setFirst(item)
    }
  }
  const joinItem = (itemA, itemB) => {
    itemB.setBefore(itemA)
    itemA.setNext(itemB)
  }
  const push = item => {
    const _item = new listItem(item)
    ifFirstSet(_item)
    const first = state.first
    joinItem(first, item)
    setLast(item)
    state.length += 1
  }

  return {
    push,
    remove
  }
}