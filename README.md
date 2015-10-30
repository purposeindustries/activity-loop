activity-loop
===============
[![Build Status](https://circleci.com/gh/purposeindustries/activity-loop.svg?&style=shield)](https://circleci.com/gh/purposeindustries/activity-loop)

[![Coverage Status](https://coveralls.io/repos/purposeindustries/activity-loop/badge.svg?branch=master&service=github)](https://coveralls.io/github/purposeindustries/activity-loop?branch=master) [![Build Status](https://travis-ci.org/purposeindustries/activity-loop.svg)](https://travis-ci.org/purposeindustries/activity-loop)

Checks whether a user interaction happened on the given element.

It's useful when you want to change an element's state when the user makes some interactions on the given element like clicking on it, moving the mouse cursor on the surface, etc. Or the other way round, you want to change the state when the user does nothing since the latest activity happened.

## Install

```sh
$ npm i activity-loop --save
```

## Usage

```js
import loop from 'activity-loop'

loop(document.getElementById('video-player'), {
  activity: () => showControls(),
  inactivity: () => hideControls()
})

```

## API

`loop(el, [options])`

### el

Type: `HTMLElement`
**required**

### options

Type: `Object`
Default: `{}`

## Options

### activity

Callback function which is invoked when the user does some interactions on the given element's surface.

Type: `Function`

### inactivity

Type: `Function`

Callback function which is invoked when the user does nothing since the latest activity

### timeout

Type: `Number`
Default: `1500`

Timeout value in milliseconds. For example if it's 3000, it means that `inactivity` will occur if the user doesn't have any interactions within 3 seconds.

Note: the timer restarts every time when `activity` happens.

## Methods

### .destroy()

If you don't need the loop instance, it's recommended to call `destroy()` method to avoid memory leaks.

### .pause([paused], [options])

#### paused

Whether the loop has to be paused

Type: `Boolean`
Default: `true`

#### options

Type: `Object`
Default: `{}`

##### options.activity

You can enforce an immediate `activity` event to be fired after coming back from paused mode

Type: `Boolean`
Default: `false`

The loop instance is an [event emitter](https://nodejs.org/api/events.html) so you can do the following:

```js
const l = loop(el)

l.on('activity', () => {
  // do something
})
l.on('inactivity', () => {
  // do something
})
```

For further information, read the [docs](https://nodejs.org/api/events.html).

## Tests

```sh
$ npm test
```

## Build

```sh
$ npm run build
```

## Build the example

```sh
$ npm run build-example
```

## Contributing

Pull requests are welcome! ;)

## License

[MIT](LICENSE)
