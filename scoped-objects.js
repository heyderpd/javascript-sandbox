const objMap = (obj, fx) => Object
  .keys(obj).reduce(
    (acc, value, key) => ({
      ...acc,
      [key]: obj(value)
    }))

const maybe = function (state = {}, fxs = {}) {
  const state = { ...state }

  const getState = () => state.obj

  state.fxs = objMap(fxs, getState)

  return { ...state }
}

const listItem = function (state = {}, fxs = {}) {
  const state = {
    ...state,
    next: null,
    before: null
  }

  const next = state => () => state().next
  const before = state => () => state().before
  const setNext = state => next => state().next = next
  const setBefore = state => before => state().before = before

  const item = new maybe(
    state,
    {...fxs, next, before, setNext, setBefore})

  return item
}

const list = function () {
  const state = {
    lastKeys: 0,
    length: 0,
    first: listItem(),
    last: listItem(),
    links: {},
    position: 0
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

  const removeFromList = key => {
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
  const remove = state => () => removeFromList(state().key)

  const push = obj => {
    const item = listItem({
        obj,
        key: state.lastKeys
      },
      { remove })

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
    state
  }
}