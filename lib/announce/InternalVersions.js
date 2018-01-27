/**
 * @file InternalVersions
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
const _fp = require('lodash/fp')
const versions = [
  {
    module: '@pomegranate/framework',
    version: require('../../package.json').version
  },
  {
    module: '@pomegranate/framework-utils',
    version: require('@pomegranate/framework-utils/package.json').version
  },
  {
    module: 'Magnum-DI',
    version: require('magnum-di/package.json').version
  }
]

/**
 * Manages output for all of the Pomegranate Module versions.
 * @module InternalVersions
 */

class InternalVersions{
  constructor(Logger){
    this.Logger = Logger
    _fp.each((m) => {
      this.log(m.module, m.version)
    }, versions)
  }

  log(name, version){
    this.Logger.log(`Using ${name} version:`, version)
  }


}


module.exports = InternalVersions