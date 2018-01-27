/**
 * @file Announcer
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';

/**
 *
 * @module Announcer
 */

class Announcer {
  constructor(FwDI){
    this.SystemLogger = FwDI.get('SystemLogger')
    this.FrameworkLogger = FwDI.get('FrameworkLogger')
    this.Output = FwDI.get('Output')
  }

  initialize(FwOptions){
    this.FrameworkLogger.log('Hello')
    this.SystemLogger.log('Hello')
  }

}

module.exports = Announcer