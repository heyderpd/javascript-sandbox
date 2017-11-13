import Peer from 'peerjs'
import randomstring from 'randomstring'

export const list = () => {
  const state = {
    peer: null,
    connection: null,
    onData: null,
    opened: false,
    host: false,
    join: false
  }

  const _onOpen = () => {
    state.opened = true
  }

  const _onClose = () => {
    state.opened = false
  }

  const _setHost = () => {
    state.host = true
    state.join = false
  }

  const _setJoin = () => {
    state.host = false
    state.join = true
  }

  const _initialize = () => {
    state.peer = new Peer(randomstring.generate(5), { key: 'shkdal024cp7gb9' })
  }

  const _safeOnData = conn => {
    if (typeof(state.onData) === 'function') {
      state.onData(data)
    }
  }

  const _onConnection = conn => {
    state.connection = conn
    conn.on('data', state._safeOnData)
  }

  const object = {}

  object.host = () => {
    _setHost()
    state.peer.on('connection', _onConnection)
    return object
  }

  object.join = id => {
    _setJoin()
    const conn = state.peer.connect(id)
    state.peer.on('open', _onOpen)
    state.peer.on('close', _onClose)
    state.peer.on('error', err => (_onClose(), console.log('-*-error', err)))
    _onConnection(conn)
    return object
  }

  object.getId = () => state.peer.id

  object.setOnData = onData => {
    state.onData = onData
    return object
  }

  object.send = action => {
    state.connection.send(data)
    return object
  }

  _initialize()

  return object
}