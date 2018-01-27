/**
 * @file Events
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
const tap = require('tap')
const DI = require('magnum-di')
const utils = require('@pomegranate/test-utils')
const Pomegranate = require('../../lib/Pomegranate')
const buildFrameworkOptions = require('@pomegranate/test-utils').buildFrameworkOptions
const path = require('path')
const mockApp = path.join(__dirname, '../mocks/simple/Application')

/**
 *
 * @module Events
 */

tap.test('Framework Event handling', (t) => {
  t.plan(10)
  let Pom = new Pomegranate()
  let O = buildFrameworkOptions(mockApp)

  Pom.on('initializing', () => {
    t.ok(1, 'initializing emitted')
  })
  Pom.on('initialized', () => {
    t.ok(1, 'initialized emitted')
    Pom.configure()
  })

  Pom.on('configuring', () => {
    t.ok(1, 'configuring emitted')
  })
  Pom.on('configured', () => {
    t.ok(1, 'configured emitted')
  })

  Pom.on('ready', () => {
    Pom.load()
  })

  Pom.on('loading', () => {
    t.ok(1, 'loading emitted')
  })
  Pom.on('loaded', () => {
    t.ok(1, 'loaded emitted')
    Pom.start()
  })

  Pom.on('starting', () => {
    t.ok(1, 'starting emitted')
  })
  Pom.on('started', () => {
    t.ok(1, 'started emitted')
    Pom.stop()
  })

  Pom.on('stopping', () => {
    t.ok(1, 'stopping emitted')
  })
  Pom.on('stopped', () => {
    t.ok(1, 'stopped emitted')
  })


  Pom.initialize({packageJSON: {}, frameworkOptions: O})
})

tap.test('Typical Startup', (t) => {
  t.plan(3)
  let Pom = new Pomegranate()
  let O = buildFrameworkOptions(mockApp)

  Pom.on('ready', () => {
    Pom.load()
  })

  Pom.on('loaded', () => {
    t.ok(1, 'loaded emitted')
    Pom.start()
  })

  Pom.on('started', () => {
    t.ok(1, 'started emitted')
    Pom.stop()
  })

  Pom.on('stopped', () => {
    t.ok(1, 'stopped emitted')
  })


  Pom.initialize({packageJSON: {}, frameworkOptions: O})
    .then(() => {
      return Pom.configure()
    })
})