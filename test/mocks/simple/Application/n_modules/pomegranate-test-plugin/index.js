/**
 * @file index
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project pom-plugin-builder
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

"use strict";

exports.options = {
  workDir: '/testWorkdir'
}

exports.metadata = {
  name: 'testPlugin',
  type: 'service',
  param: 'service',
  depends: []
}

exports.plugin = {
  load: function(inject, loaded){
    loaded(null, {name: 'testPlugin'})
  },
  start: function(done){done()},
  stop: function(done){done()}
}

exports.errors = {}

exports.commands = {}