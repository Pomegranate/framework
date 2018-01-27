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
const PluginFinder = require('@pomegranate/plugin-finder')
const PluginIterator = require('@pomegranate/plugin-iterator')
const populateFWInjector = require('./startup/InjectorBuilder')
const EventEmitter = require('events').EventEmitter


/**
 *
 * @module Pomegranate
 */

class Pomegranate {
  constructor() {
    this.FrameworkDI = new DI()
    this.PluginDI = new DI()
    this.FrameworkEvents = new EventEmitter()
    this.commandMode = false
  }

  on(event, fn) {
    this.FrameworkEvents.on(event, fn)
  }

  logMessage(message) {
    if(this.SystemLogger) {
      this.SystemLogger.log(message)
    }
    else {
      console.log(message)
    }
  }

  getInjector(i) {
    return this[`${i}DI`]
  }

  initialize({packageJSON = {}, frameworkOptions}) {
    return Promise.try(() => {
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

      let versionout = this.FrameworkDI.get('InternalVersions')

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
          this.FrameworkEvents.emit('initialized')
          return this
        })
        .catch((err) => {
          console.log(err);
        })
    })

  }

  runCommand(command, args){
    return this.PluginIterator.configure()
      .then((result) => {
        return this.PluginIterator.order()
      })
      .then((result) => {
        return this.PluginIterator.runCommand(command, args)
      })

  }

  configure() {
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
          this.FrameworkEvents.emit('configured')
          this.FrameworkEvents.emit('ready')
          return this
        })
    })
  }

  load() {
    return Promise.try(() => {
      this.FrameworkEvents.emit('loading')
      this.SystemLogger.log(Announce.titleAnnounce('Loading plugins'))
      return this.PluginIterator.load()
        .then((result) => {
          this.FrameworkEvents.emit('loaded')
          this.FrameworkEvents.emit('load')
          return this
        })
    })
  }

  start() {
    return Promise.try(() => {
      this.FrameworkEvents.emit('starting')
      this.SystemLogger.log(Announce.titleAnnounce('Starting plugins'))
      return this.PluginIterator.start()
        .then((result) => {
          this.FrameworkEvents.emit('started')
          this.FrameworkEvents.emit('start')
          return this
        })
    })

  }

  stop() {
    return Promise.try(() => {
      this.FrameworkEvents.emit('stopping')
      this.SystemLogger.log(Announce.titleAnnounce('Stopping plugins'))
      return this.PluginIterator.stop()
        .then((result) => {
          this.FrameworkEvents.emit('stopped')
          this.FrameworkEvents.emit('stop')
          this.SystemLogger.log('Finished')
          return this
        })
    })

  }
}

module.exports = Pomegranate