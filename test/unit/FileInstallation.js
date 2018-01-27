/**
 * @file FileInstallation
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';

'use strict';
const tap = require('tap')
const DI = require('magnum-di')
const fs = require('fs-extra')
const utils = require('@pomegranate/test-utils')
const Pomegranate = require('../../lib/Pomegranate')
const buildFrameworkOptions = require('@pomegranate/test-utils').buildFrameworkOptions
const path = require('path')
const mockApp = path.join(__dirname, '../mocks/simple/Installers')

/**
 *
 * @module FileInstallation
 */

tap.test('Cleaup install directory', (t) => {
  fs.emptyDir('./test/mocks/simple/Installers/application/testWorkDir')
    .then(() => {
      t.done()
    })
})
tap.test('Plugin file installation.', (t) => {
  let mockDir = utils.findMockDir(__dirname, '../mocks/simple/Installers')
  let mockedDependencies = require(path.join(mockDir, 'package.json'))
  let mockedApplication = utils.registerMocks(mockDir, mockedDependencies)
  let Pom = new Pomegranate()
  let FwI = Pom.getInjector('Framework')
  let O = buildFrameworkOptions(mockApp)
  // O.logLevel = 0
  // O.logger = console
  Pom.initialize({packageJSON: mockedDependencies, frameworkOptions: O})
    .then((pom) => {
      return pom.configure()
    })
    .then((pom) => {
      return pom.load()
    })
    .then((pom) => {
      let PluginDI = Pom.getInjector('Plugin')
      let installedfiles = PluginDI.get('service').files
      t.type(installedfiles.justOne, 'string', 'found file')
      t.type(installedfiles.test, 'object', 'founf directory')

      t.type(installedfiles.test.test, 'string', 'found nested file')
      t.type(installedfiles.test.test2, 'string', 'found nested file')

      return pom.start()
    })
    .then((pom) => {
      return pom.stop()
    })
    .then((pom) => {
      t.end()
    })
})
