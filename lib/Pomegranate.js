/**
 * @file Pomegranate
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project framework
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
const Promise = require('bluebird')
const _fp = require('lodash/fp')
const DI = require('magnum-di')
const Announce = require('@pomegranate/framework-utils').frameworkMessages
// const PluginFacade = require('@pomegranate/plugin-facade')
// const PluginFinder = require('@pomegranate/plugin-finder')
// const PluginIterator = require('@pomegranate/plugin-iterator')
const populateFWInjector = require('./startup/InjectorBuilder')
const EventEmitter = require('events').EventEmitter
const PostFrameworkAction = require('./FailureHandling/PostFrameworkAction')

/**
 *
 * @module Pomegranate
 */

class Pomegranate {
  constructor(PomModules) {
    this.PomModules = PomModules
    this.FrameworkDI = new DI()

    this.FrameworkDI.service('PomModules', PomModules)

    this.PluginDI = new DI()
    this.FrameworkEvents = new EventEmitter()
    this.inFailureState = false
    this.commandMode = false
    this.stateStep = 'uninitialized'
  }

  shutdown(){
    this.SystemLogger.log('Shutting Down.', 1)
    let errors = []
    if(this.PluginIterator){
      errors = this.PluginIterator.getErrors(true)
    }

    if(errors.length){
      console.log(errors);
    } else {
      this.SystemLogger.log('No Errors.', 1)
    }
    this.SystemLogger.log('Finished.', 1)
  }

  cleanUpExit(){
    if(this.stateStep === 'start'){
      this.inFailureState = false
      return this.stop()
    }
    return this
  }

  skipOnFailure(action) {
    return Promise.try(() => {
      if(this.inFailureState) {
        let output = Announce.titleAnnounce(`Skipping ${action} due to previous errors`)
        let log = this.SystemLogger ? this.SystemLogger : console
        log.log(output)
        return true
      }
      return false
    })
  }

  crashOnFailure(action,error) {
    let output = `${action} failed, cleaning up.`

    let log = this.SystemLogger ? this.SystemLogger : console
    /**
     * TODO - Lets parameterize this. It currently can return an error or an object.
     * @author - Jim Bulkowski
     * @date - 4/30/18
     * @time - 4:11 PM
     */
    log.error(output)
    if(error && error.message){
      log.error(error.message)
    }
    if(error && error.stack){
      log.error(error.stack)
    }
    // This needs a unified structure.
    // log.log(output)

    this.inFailureState = true
    return this.cleanUpExit()
  }

  on(event, fn) {
    this.FrameworkEvents.on(event, fn)
  }

  logMessage(message, method) {

    method = method || 'log'

    if(this.SystemLogger) {
      this.SystemLogger[method](message)
    }
    else {
      console[method](message)
    }
  }

  getInjector(i) {
    return this[`${i}DI`]
  }

  runCommand(command, args) {
    return this.PluginIterator.configure()
      .then((result) => {
        return this.PluginIterator.order()
      })
      .then((result) => {
        return this.PluginIterator.runCommand(command, args)
      })

  }

  initialize({packageJSON = {}, frameworkOptions}) {
    return Promise.try(() => {

      let PluginFinder = this.FrameworkDI.get('PomModules').PluginFinder.module
      let PluginIterator = this.FrameworkDI.get('PomModules').PluginIterator.module

      this.FrameworkEvents.emit('initializing')
      populateFWInjector({
        FrameworkEvents: this.FrameworkEvents,
        FrameworkDI: this.FrameworkDI,
        PluginDI: this.PluginDI,
        frameworkOptions
      })
      this.commandMode = this.FrameworkDI.get('Options').commandMode
      this.FrameworkLogger = this.FrameworkDI.get('FrameworkLogger')
      this.SystemLogger = this.FrameworkDI.get('SystemLogger')

      let IV = this.FrameworkDI.get('InternalVersions')
      _fp.each((o) => {
        IV.log(o.name, o.version)
      }, this.PomModules)

      return PluginFinder(packageJSON, this.FrameworkDI)
        .then((PluginList) => {
          return PluginIterator({Plugins: PluginList, FrameworkDI: this.FrameworkDI, PluginDI: this.PluginDI})
        })
        .then((pluginIterator) => {
          this.PluginIterator = pluginIterator
        })
        .then(() => {
          this.SystemLogger.log(Announce.titleAnnounce(`Initializing ${this.PluginIterator.getMeta().count} plugins`))
          return this.PluginIterator.initialize()

        })
        .then((result) => {
          this.stateStep = 'initialize'
          if(result.failure) {
            return this.crashOnFailure('Initialize',result)
          }
          this.FrameworkEvents.emit('initialized')
          return this
        })
        .catch((err) => {
          // console.log(err);
          return this.crashOnFailure('Initialize', err)
        })
    })

  }


  configure() {
    return this.skipOnFailure('Configure')
      .then((inError) => {
        if(inError) {
          return this
        }
        return Promise.try(() => {
          this.FrameworkEvents.emit('configuring')
          this.SystemLogger.log(Announce.titleAnnounce('Configuring plugins'))
          return this.PluginIterator.configure()
            .then((result) => {
              return this.PluginIterator.order()
            })
            .then((result) => {
              return this.PluginIterator.override(Announce.titleAnnounce('Overriding Plugins'))
            })
            .then((result) => {
              this.stateStep = 'configure'
              if(result.failure) {
                return this.crashOnFailure('Configure',result)
              }
              this.FrameworkEvents.emit('configured')
              this.FrameworkEvents.emit('ready')
              return this
            })
        })
      })

  }

  load() {
    return this.skipOnFailure('Load')
      .then((inError) => {
        if(inError) {
          return this
        }

        return Promise.try(() => {
          this.FrameworkEvents.emit('loading')
          this.SystemLogger.log(Announce.titleAnnounce('Loading plugins'))
          return this.PluginIterator.load()
            .then((result) => {
              this.stateStep = 'load'
              if(result.failure) {
                return this.crashOnFailure('Load',result)
              }
              this.FrameworkEvents.emit('loaded')
              this.FrameworkEvents.emit('load')
              return this
            })
        })
      })

  }

  start() {

    return this.skipOnFailure('Start')
      .then((inError) => {
        if(inError) {
          return this
        }

        return Promise.try(() => {
          this.FrameworkEvents.emit('starting')
          this.SystemLogger.log(Announce.titleAnnounce('Starting plugins'))
          return this.PluginIterator.start()
            .then((result) => {
              this.stateStep = 'start'
              if(result.failure) {
                return this.crashOnFailure('Start',result)
              }
              this.FrameworkEvents.emit('started')
              this.FrameworkEvents.emit('start')
              return this
            })
        })
      })



  }

  stop() {
    if(this.inFailureState) {
      return Promise.resolve(this)
    }
    return Promise.try(() => {
      this.FrameworkEvents.emit('stopping')
      this.SystemLogger.log(Announce.titleAnnounce('Stopping plugins'))
      return this.PluginIterator.stop()
        .then((result) => {
          this.stateStep = 'stop'
          this.FrameworkEvents.emit('stopped')
          this.FrameworkEvents.emit('stop')
          return this
        })
    })

  }
}

module.exports = Pomegranate