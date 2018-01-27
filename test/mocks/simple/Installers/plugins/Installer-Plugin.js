/**
 * @file Test-Plugin
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project pom-plugin-builder
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

"use strict";

exports.metadata = {
  name: 'installFiles',
  type: 'installer',
  depends: ['magnum-test-a']
}

exports.installer = function(dirs, done){
  var install = [
    {to: 'InstallTarget', src: this.join(__dirname, '../files/installDir'), dest: './test'},
    {to: 'InstallTarget', src: this.join(__dirname, '../files/installFiles/justOne.js'), dest: './justOne.js'}
  ]
  done && done(null, install)
}