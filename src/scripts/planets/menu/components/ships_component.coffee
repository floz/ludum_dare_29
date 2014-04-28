PlanetMenuEntry = require "../planet_menu_entry"
Emitter = require "../../../components/emitter"
resources = require "../../../resources"

class ShipsComponent extends Emitter

    dom: null
    callBack: null

    constructor: ( @dom, @count = 1 ) ->

    enable: =>
        @enableCreateShip()

    enableCreateShip: ->
        entry = new PlanetMenuEntry @dom.querySelector( ".create-ship-" + @count ), [ { r: resources.minerals, v: 100 * @count }, { r: resources.gaz, v: 50 * @count } ], 1
        entry.enable()
        entry.on "complete", =>
            resources.ships.add @count
            entry.progress = 0
            entry.updateProgress()
        

module.exports = ShipsComponent
