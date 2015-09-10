import {EventEmitter} from 'events'
import setTimer from './utils/set-timeout'

const events = [
  'click',
  'mousemove',
  'mouseenter',
  'keyup',
  'keydown'
]

class Loop extends EventEmitter {

  constructor(el, {activity, inactivity, timeout = 1500} = {}) {
    super()

    if (!el) {
      throw new TypeError('activity-loop: Missing element')
    }

    this.start = this.start.bind(this)
    this.stop = this.stop.bind(this)
    this.activity = this.activity.bind(this)
    this.inactivity = this.inactivity.bind(this)
    this.el = el
    this.timeout = timeout

    this.addListeners()

    this.mousePos = []

    if (typeof activity === 'function') {
      this.on('activity', activity.bind(this))
    }
    if (typeof inactivity === 'function') {
      this.on('inactivity', inactivity.bind(this))
    }
  }

  pause(value, options = {}) {
    this.paused = (typeof value === 'undefined') ?
      true :
      Boolean(value)

    if (this.paused) {
      this.stop()
    }
    if (!this.paused && options.activity) {
      this.activity()
    }
  }
  restart() {
    if (this.timer) {
      this.stop()
    }
    this.start()
  }
  start() {
    this.timer = setTimer(this.inactivity, this.timeout)
  }
  stop() {
    clearTimeout(this.timer)
  }

  activity(e) {
    if (e && e.type === 'mousemove' &&
      e.clientX === this.mousePos[0] &&
      e.clientY === this.mousePos[1]) {
      return
    }

    if (this.paused) {
      return
    }
    this.emit('activity')

    // weird but I had to put this operation to the next tick
    // otherwise it causes an extra `mousemove` event sometimes.
    setTimer(() => {
      this.restart()
    })

    if (e) {
      this.mousePos = [e.clientX, e.clientY]
    }
  }

  inactivity() {
    this.emit('inactivity')
  }

  destroy() {
    this.stop()
    this.removeAllListeners('activity')
    this.removeAllListeners('inactivity')
    this.removeListeners()
  }

  addListeners() {
    events.forEach(e => {
      this.el.addEventListener(e, this.activity)
    })
  }

  removeListeners() {
    events.forEach(e => {
      this.el.removeEventListener(e, this.activity)
    })
  }
}

loop.Loop = Loop

export default function loop(el, options) {
  return new Loop(el, options)
}
