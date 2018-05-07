/**
 * @file index
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
const Pomegranate = require('./lib/Pomegranate')
const DI = require('magnum-di')

let Framework = null
/**
 *
 * @module index
 */

module.exports = function(PomegranateDependencies){
  if(Framework instanceof Pomegranate) return Framework
  Framework = new Pomegranate(PomegranateDependencies)
  return Framework
}
