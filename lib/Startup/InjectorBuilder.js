/**
 * @file populateFWInjector
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
// const util = require('@pomegranate/framework-utils')
const InternalVersions = require('../Announce/InternalVersions')
// const FrameworkErrors = util.frameworkErrors
// const LoggerFactory = util.loggerFactory
// const LogManager = util.logManager
const DefaultLogOutput = require('./DefaultLogOutput')
const chalk = require('chalk')
/**
 *
 * @module populateFWInjector
 */

module.exports = function({FrameworkEvents,FrameworkDI, PluginDI, frameworkOptions}){
  let PomModules = FrameworkDI.get('PomModules')
  let util = PomModules.Utils.module
  let FrameworkErrors = util.frameworkErrors

  let FwkLogger = PomModules.FrameworkLogger.module
  let LoggerFactory = FwkLogger.LoggerFactory

  let LogManager = FwkLogger.LogManager
  let ParsedOptions = util.frameworkOptionParser(frameworkOptions, FrameworkErrors)

  let currentPrefixes = util.prefixGenerator(ParsedOptions.prefix, ParsedOptions.additionalPrefix)
  let logger = ParsedOptions.logger

  let logManager = new LogManager()

  if(ParsedOptions.commandMode){
    logger = {
      log: ()=>{},
      warn: ()=>{},
      info: ()=>{},
      error: ()=>{}
    }
  }

  let loggerFactory = LoggerFactory({
    Logger: logger,
    verbocity: ParsedOptions.logLevel,
    logColor: 'green',
    chalk: chalk
  })

  FrameworkDI.service('Prefixes', currentPrefixes)
  FrameworkDI.service('PrefixSelector', util.prefixSelector(currentPrefixes))
  FrameworkDI.service('Options', ParsedOptions)
  FrameworkDI.service('NameGenerator', util.nameGenerator)
  FrameworkDI.service('FrameworkErrors', FrameworkErrors)
  FrameworkDI.service('FrameworkEvents', FrameworkEvents)

  let Output = util.frameworkMessages(ParsedOptions.colors, ParsedOptions.verbose)
  FrameworkDI.service('Output', Output);

  FrameworkDI.service('LogManager', logManager)

  FrameworkDI.service('LoggerBuilder', LoggerFactory);
  FrameworkDI.service('LoggerFactory', loggerFactory);
  FrameworkDI.service('Logger', ParsedOptions.logger)

  let defaultLogHandler = FrameworkDI.inject(DefaultLogOutput)
  logManager.addHandler(defaultLogHandler)
  // let SystemLogger = LoggerFactory(ParsedOptions.logger, ParsedOptions.prefix, Output, ParsedOptions.verbose, 'magenta')
  // let FrameworkLogger = LoggerFactory(ParsedOptions.logger, ParsedOptions.prefix, Output, true, 'magenta')

  let SystemLogger = logManager.createLogger('system')
  let FrameworkLogger = logManager.createLogger('pomegranate')
  // let SystemLogger = loggerFactory(ParsedOptions.prefix, {overrideColor: 'magenta'})
  // let FrameworkLogger = loggerFactory(ParsedOptions.prefix,{overrideColor: 'magenta'})
  FrameworkDI.service('FrameworkLogger', FrameworkLogger)
  FrameworkDI.service('SystemLogger', SystemLogger)

  FrameworkDI.service('InternalVersions', new InternalVersions(FrameworkLogger))

  PluginDI.service('Errors', FrameworkErrors);
  PluginDI.service('Logger', ParsedOptions.logger);
  PluginDI.service('Env', process.env);

  return ParsedOptions
}