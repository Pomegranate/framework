/**
 * @file DefaultLogOutput
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
const _fp = require('lodash/fp')
const chalk = require('chalk')

/**
 *
 * @module DefaultLogOutput
 */

const logColors = {
  info: message => chalk.cyan(message),
  warn: message => chalk.yellow(message),
  error: message => chalk.red(message),
  log: (message, color) => {
    return color(message)
  }
}

function logPlain(messageArray, severity){
  console.log.apply(console, messageArray)
}

function makeLogger(useColor, ...colors){

  function logColor(messageArray, severity){
    let ch = _fp.get(colors, chalk)
    let toLogger = _fp.map((item) => {
      if(_fp.isString(item)){
        return logColors[severity](item, ch)
      }
      return item
    }, messageArray)

    console.log.apply(console, toLogger)
  }



  return useColor ? logColor : logPlain
}



module.exports = function(Options) {
  let useColor = Options.colors
  // let log = Options.colors ? logColor : logPlain
  let verbocity = Options.logLevel
  let systemLog = makeLogger(useColor, 'magenta', 'bold')
  let pomegranateLog = makeLogger(useColor, 'magenta')
  let pluginLog = makeLogger(useColor, 'green')

  function doLog(logger, level){

  }

  return function(source, severity, level, messageArray) {

    if(level > verbocity) {
      return
    }

    if(source === 'system') {
      systemLog(messageArray, severity)
      return
    }

    messageArray.unshift(`${source}:`)

    if(source === 'pomegranate') {
      pomegranateLog(messageArray, severity)
      return
    }
    pluginLog(messageArray, severity)

  }
}