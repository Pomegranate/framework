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
  name: 'installTarget',
  type: 'service',
  param: 'service',
  depends: []
}

exports.plugin = {
  load: function(inject, loaded){
    this.fileListNested()
      .then((files) => {
        loaded(null, {name: 'installtarget', files: files})
      })

  },
  start: function(done){done()},
  stop: function(done){done()}
}

exports.errors = {}

exports.commands = {}