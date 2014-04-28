PlanetMenuEntry = require "../planet_menu_entry"
Emitter = require "../../../components/emitter"
resources = require "../../../resources"

class MineralComponent extends Emitter

    dom: null
    planet: null
    callBack: null

    constructor: ( @dom, @planet ) ->

    enable: =>
        @enableDrillingMinerals()

    enableDrillingMinerals: ->
        entry = new PlanetMenuEntry @dom.querySelector( ".drilling-minerals" ), [ { r: resources.minerals, v: 100 } ], .64
        entry.enable()
        entry.on "complete", =>
            @planet.drillingLevel.minerals = 1
            entry.disable()
            @enableUpgradeMinerals()
            @callBack.call( @, null ) if @callBack

    enableUpgradeMinerals: ->
        entry = new PlanetMenuEntry @dom.querySelector( ".upgrade-minerals" ), [ { r: resources.minerals, v: 250 } ], .5
        entry.enable()
        entry.on "complete", =>
            @planet.drillingLevel.minerals += 1
            if @planet.drillingLevel.minerals == 5
                entry.disable()
            else
                switch @planet.drillingLevel.minerals
                    when 2 then entry.prices = [ { r: resources.minerals, v: 500 } ]
                    when 3 then entry.prices = [ { r: resources.minerals, v: 1500 } ]
                    when 3 then entry.prices = [ { r: resources.minerals, v: 4000 } ]
                    when 4 then entry.prices = [ { r: resources.minerals, v: 6750 } ]
                entry.progress = 0
                entry.updateProgress()
                entry.updatePrice()

module.exports = MineralComponent
