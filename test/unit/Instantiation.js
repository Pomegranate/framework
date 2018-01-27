/**
 * @file Instantiation
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
const tap = require('tap')
const DI = require('magnum-di')
const Pomegranate = require('../../lib/Pomegranate')
/**
 *
 * @module Instantiation
 */


tap.test('Framework class instantiation', (t) => {
  t.doesNotThrow(() => {
    new Pomegranate()
  }, 'Instantiation Does not throw')

  let Pom = new Pomegranate()
  t.type(Pom.getInjector('Framework'), DI)
  t.type(Pom.getInjector('Plugin'), DI)

  t.ok(true)
  t.end()
})
