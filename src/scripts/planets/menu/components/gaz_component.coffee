PlanetMenuEntry = require "../planet_menu_entry"
Emitter = require "../../../components/emitter"
resources = require "../../../resources"

class GazComponent extends Emitter

    dom: null
    planet: null
    callBack: null

    constructor: ( @dom, @planet ) ->

    enable: =>
        @enableDrillingGaz()

    enableDrillingGaz: ->
        entry = new PlanetMenuEntry @dom.querySelector( ".drilling-gaz" ), [ { r: resources.minerals, v: 50 }, { r: resources.gaz, v: 100 } ], .64
        entry.enable()
        entry.on "complete", =>
            @planet.drillingLevel.gaz = 1
            entry.disable()
            @enableUpgradeGaz()
            @callBack.call( @, null ) if @callBack

    enableUpgradeGaz: ->
        entry = new PlanetMenuEntry @dom.querySelector( ".upgrade-gaz" ), [ { r: resources.minerals, v: 100 }, { r: resources.gaz, v: 200 } ], .5
        entry.enable() 
        entry.on "complete", =>
            @planet.drillingLevel.gaz += 1
            if @planet.drillingLevel.gaz == 5
                entry.disable()
            else
                switch @planet.drillingLevel.gaz
                    when 2 then entry.prices = [ { r: resources.minerals, v: 200 }, { r: resources.gaz, v: 400 } ]
                    when 3 then entry.prices = [ { r: resources.minerals, v: 300 }, { r: resources.gaz, v: 900 } ]
                    when 3 then entry.prices = [ { r: resources.minerals, v: 500 }, { r: resources.gaz, v: 2000 } ]
                    when 4 then entry.prices = [ { r: resources.minerals, v: 1000 }, { r: resources.gaz, v: 5000 } ]
                entry.progress = 0
                entry.updateProgress()
                entry.updatePrice() 

module.exports = GazComponent
