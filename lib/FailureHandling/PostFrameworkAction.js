/**
 * @file PostFrameworkAction
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
const _fp = require('lodash/fp')

/**
 *
 * @module PostFrameworkAction
 */

function printErrors(logger, plugin){
  logger.error(`${plugin.ModuleName} has errors.`)
}

module.exports = function(action,plugins){
  let pluginResults = _fp.map((p) => {
    return p.getErrors()
  }, plugins)

  if(_fp.some('hasErrors')(pluginResults) ){
    _fp.each((p) => {
      if(p.hasErrors){
      printErrors(this.FrameworkLogger, p)
      }
    }, pluginResults)
  }


  return plugins
}