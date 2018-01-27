/**
 * @file InjectorPopulation
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
 * @module InjectorPopulation
 */

tap.test('Framework Injector population', (t) => {
  let Pom = new Pomegranate()
  let O = buildFrameworkOptions(mockApp)
  let FwI = Pom.getInjector('Framework')
  Pom.initialize({packageJSON: {}, frameworkOptions: O})
  t.ok(FwI.get('Prefixes'), 'Framework DI Has Prefixes available')
  t.ok(FwI.get('PrefixSelector'), 'Framework DI Has PrefixSelector available')
  t.ok(FwI.get('Options'), 'Framework DI Has Options available')
  t.ok(FwI.get('NameGenerator'), 'Framework DI Has NameGenerator available')
  t.ok(FwI.get('FrameworkErrors'), 'Framework DI Has FrameworkErrors available')
  t.ok(FwI.get('FrameworkEvents'), 'Framework DI Has FrameworkEvents available')
  t.ok(FwI.get('Output'), 'Framework DI Has Output available')
  t.ok(FwI.get('LoggerBuilder'), 'Framework DI Has LoggerBuilder available')
  t.ok(FwI.get('SystemLogger'), 'Framework DI Has SystemLogger available')
  t.ok(FwI.get('FrameworkLogger'), 'Framework DI Has FrameworkLogger available')
  t.end()
})

tap.test('Framework Plugin discovery', (t) => {
  let mockDir = utils.findMockDir(__dirname, '../mocks/simple/Application')
  let mockedDependencies = require(path.join(mockDir, 'package.json'))
  let mockedApplication = utils.registerMocks(mockDir, mockedDependencies)
  let Pom = new Pomegranate()
  let FwI = Pom.getInjector('Framework')
  let O = buildFrameworkOptions(mockApp)
  // O.logLevel = 2
  // O.logger = console
  Pom.initialize({packageJSON: mockedDependencies, frameworkOptions: O})
    .then((pom) => {
      return pom.configure()
    })
    .then((pom) => {
      return pom.load()
    })
    .then((pom) => {
      return pom.start()
    })
    .then((pom) => {
      return pom.stop()
    })
    .then((pom) => {
      t.end()
    })
})

tap.test('Blank PackageJson', (t) => {
  let mockDir = utils.findMockDir(__dirname, '../mocks/simple/Application')
  let mockedDependencies = require(path.join(mockDir, 'package.json'))
  let mockedApplication = utils.registerMocks(mockDir, mockedDependencies)
  let Pom = new Pomegranate()
  let FwI = Pom.getInjector('Framework')
  let O = buildFrameworkOptions(mockApp)
  // O.logLevel = 2
  // O.logger = console
  Pom.initialize({frameworkOptions: O})
    .then((pom) => {
      return pom.configure()
    })
    .then((pom) => {
      return pom.load()
    })
    .then((pom) => {
      return pom.start()
    })
    .then((pom) => {
      return pom.stop()
    })
    .then((pom) => {
      t.end()
    })
})