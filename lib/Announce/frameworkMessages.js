/**
 * @file frameworkMessages
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project pom-framework-utils
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
const chalkCtor = require('chalk');
const _ = require('lodash');

/**
 *
 * @module frameworkMessages
 */

exports = module.exports = function(colors, verbose){
  exports.verbose = verbose;
  exports.colors = colors;
  exports.chalk = new chalkCtor.constructor({enabled: colors});
  return exports
}

exports.rightBar = function(message, color, separator) {
  color = color || 'magenta'
  if(!separator) separator = '-';

  let pad = message ? message + ' ' : []
  let count = (pad.length >= 80) ? 0 : 80 - pad.length
  // let bar = _.fill(Array(count), separator)
  let bar = Array(count).fill(separator).join('')
  let result = pad.concat(bar)
  return result //exports.chalk.bold[color](result)
}

exports.titleAnnounce = function(message, color) {
  if(exports.verbose) {
    return exports.rightBar(message, color)
  }
  // if(exports.colors){
  //   color = color || 'magenta'
  //   return exports.chalk.bold[color](message)
  // }
  return message
}

exports.pluginActionComplete = function(results, action, detail) {
  let pluginCount = 0;
  let deps = 0;
  _.each(results, function(p) {
    pluginCount += 1
    if(p.dependenciesAreArray()) {
      return deps += p.dependencies.length
    }
    if(p.dependencies) {
      return deps += 1
    }
  })

  let additionalDetail = detail ? `plugins with ${deps} ${detail}` : 'plugins.';
  return `${action} ${pluginCount} ${additionalDetail}`
}

exports.failedToLoad = function(modulePath, err) {
  var message = [
    'Plugin loading failed.',
    'Could not load ' + modulePath,
    'This could either be an error in the plugin,',
    'Or the plugin was not found.',
    'If this error occurred in an externally loaded plugin from the',
    'node_modules folder contact the developer of the plugin.',
    'If the error occurred in one of your own plugins',
    'make sure it conforms to the specs in this guide.',
    'https://github.com/PaperElectron/Magnum-Loader/wiki/Plugin-Specifications'
  ];
  return message.join('\n');
}

exports.dependencyConflict = function(modules) {
  // maybe?
  //'This error can be corrected by setting the "namespace" option for one of the two plugins.
  return `Plugins \n\t${modules.conflicts.join(',\n\t')}
    are attempting to register dependency name
    \t${modules.depName}`
}

exports.iteratorError = function(err, plugins) {

  let output = ''
  output += _.map(plugins, function(p) {

    let msg = `${p.moduleName}  has  ${p.Errors.length}  error/s \n`
    msg += _.map(p.Errors, function(e) {
      return e.message
    }).join('\n')

    return msg
  }).join('\n')

  return output
};
