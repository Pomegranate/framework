/**
 * @file Test-Plugin
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project pom-plugin-builder
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

"use strict";

exports.options = {
  workDir: '/internalWorkdir'
}

exports.metadata = {
  name: 'internalPlugin',
  type: 'service',
  param: 'internal',
  depends: []
}

exports.plugin = {
  load: function(inject, loaded){
    loaded(null, {name: 'internalPlugin'})
  },
  start: function(done){done()},
  stop: function(done){done()}
}

exports.errors = {}

exports.commands = {}