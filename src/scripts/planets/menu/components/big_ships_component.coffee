PlanetMenuEntry = require "../planet_menu_entry"
Emitter = require "../../../components/emitter"
resources = require "../../../resources"

class BigShipsComponent extends Emitter

    dom: null
    count: 0
    callBack: null

    constructor: ( @dom, @count = 1 ) ->

    enable: =>
        @enableCreateShip()

    enableCreateShip: ->
        entry = new PlanetMenuEntry @dom.querySelector( ".create-big-ship-" + @count ), [ { r: resources.minerals, v: 1000 * @count }, { r: resources.gaz, v: 500 * @count } ], 1
        entry.enable()
        entry.on "complete", =>
            resources.bigShips.add @count
            entry.progress = 0
            entry.updateProgress()
        

module.exports = BigShipsComponent
