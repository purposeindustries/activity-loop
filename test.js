import test from 'ava'
import loop from './lib/index'
import EventEmitter from 'component-emitter'
import sinon from 'sinon'
import proxyquire from 'proxyquire'

test('expose the constructor', t => {
  t.is(typeof loop.Loop === 'function', true)
  t.end()
})

test('default timeout', t => {
  t.is(loop(new EventEmitter()).timeout, 1500)
  t.end()
})

test('throw error in case of missing element', t => {
  try {
    loop()
  } catch (err) {
    t.is(err.message, 'activity-loop: Missing element')
    t.end()
  }
})

test('can add activity callback as parameter', t => {
  const spy = sinon.spy()
  const mock = new EventEmitter()
  loop(mock, {
    activity: spy
  })
  mock.emit('click')
  t.is(spy.calledOnce, true)
  t.end()
})

test('can add inactivity callback as parameter', t => {
  const mock = new EventEmitter()
  const spy = sinon.spy()

  const localLoop = proxyquire('./lib/index', {
    './utils/set-timeout': fn => fn()
  })

  localLoop(mock, {
    inactivity: spy
  })
  mock.emit('click')

  t.is(spy.calledOnce, true)
  t.end()
})

test('activity happens after user interaction', t => {
  const localLoop = proxyquire('./lib/index', {
    './utils/set-timeout': fn => fn()
  })
  const mock = new EventEmitter()
  const l = new localLoop.Loop(mock)
  const spy = sinon.spy()
  l.on('activity', spy)

  mock.emit('click')
  mock.emit('mouseenter')
  mock.emit('mousemove')
  mock.emit('keyup')
  mock.emit('keydown')

  t.is(spy.args.length, 5)
  l.destroy()
  t.end()
})

test('inactivity happens once after activity within the given time', t => {
  t.plan(1)
  const mock = new EventEmitter()
  const l = new loop.Loop(mock, {
    timeout: 150
  })
  l.on('inactivity', () => {
    t.pass()
    l.destroy()
  })
  // emit activity
  mock.emit('click')
  mock.emit('click')
  mock.emit('click')
})

test('destruct', t => {
  const localLoop = proxyquire('./lib/index', {
    './utils/set-timeout': fn => fn()
  })
  const mock = new EventEmitter()
  const spy = sinon.spy()
  const l = localLoop(mock, {
    activity: spy,
    inactivity: spy
  })

  l.on('activity', spy)
  l.on('inactivity', spy)

  mock.emit('click')

  t.is(spy.args.length, 4)

  l.destroy()

  mock.emit('click')

  t.is(spy.args.length, 4)
  t.end()
})

test('can pause and restart the loop', t => {
  const localLoop = proxyquire('./lib/index', {
    './utils/set-timeout': fn => fn()
  })
  const mock = new EventEmitter()
  const spy = sinon.spy()
  const l = localLoop(mock)

  l.on('activity', spy)

  mock.emit('click')
  mock.emit('click')

  t.is(spy.args.length, 2)

  l.pause()

  mock.emit('click')
  // still 2
  t.is(spy.args.length, 2)

  l.pause(false)

  mock.emit('click')
  mock.emit('click')

  t.is(spy.args.length, 4)

  t.end()
})

test('can enforce immediate activity after disabling pause', t => {
  const localLoop = proxyquire('./lib/index', {
    './utils/set-timeout': fn => fn()
  })
  const mock = new EventEmitter()
  const spy = sinon.spy()
  const l = localLoop(mock)

  l.on('activity', spy)

  l.pause()
  l.pause(false, {
    activity: true
  })

  t.is(spy.calledOnce, true)
  t.end()
})

test('prevent mousemove to be fired twice if the position is still the same', t => {
  const mock = new EventEmitter()
  const spy = sinon.spy()

  loop(mock, {
    activity: spy
  })

  mock.emit('mousemove', {
    clientX: 10,
    clientY: 10,
    type: 'mousemove'
  })

  t.is(spy.calledOnce, true)

  mock.emit('mousemove', {
    clientX: 11,
    clientY: 10,
    type: 'mousemove'
  })

  t.is(spy.args.length, 2)

  mock.emit('mousemove', {
    clientX: 11,
    clientY: 10,
    type: 'mousemove'
  })

  t.is(spy.args.length, 2)

  t.end()
})
