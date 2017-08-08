const maybe = function (obj, state = {}, fxs = []) {
  const state = {
    obj,
    ...state
  }

  state.fxs = fxs.map(f => f(() => state.obj))

  return { ...state }
}

const listItem = function (data, key, remove) {
  const state = {
    next: null,
    before: null,
    key,
    remove
  }

  const next = state => () => state().next
  const before = state => () => state().before
  const setNext = state => next => state().next = next
  const setBefore = state => before => state().before = before

  const item = new maybe(
    data,
    state,
    [next, before, setNext, setBefore, remove])

  return item
}

const list = function () {
  const state = {
    lastKeys: 0,
    length: 0,
    first: listItem(null),
    last: listItem(null),
    links: {}
  }

  const chainItem = (itemA, itemB) => {
    itemB.setBefore(itemA)
    itemA.setNext(itemB)
  }
  const setFirst = item => chainItem(state.first, item)
  const setLast = item => chainItem(item, state.last)
  const ifFirstSet = item => {
    if (state.length === 0) {
      setFirst(item)
      setLast(item)
      return true
    }
  }
  const _remove = key => {
    const item = state.links[key]
    if (item) {
      chainItem(
        item.before,
        item.next)

      item.setBefore(null)
      item.setNext(null)
      delete state.links[key]
    }
  }

  const remove = state => () => {
    const { key, remove } = state()
    remove(key)
  }

  const push = obj => {
    const item = listItem(
      obj,
      state.lastKeys,
      remove)

    if (!ifFirstSet(item)) {
      const last = state.last.before()
      chainItem(item, last)
      setLast(item)
    }

    state.lastKeys += 1
    state.length += 1
  }

  return {
    push,
    remove,
    state
  }
}