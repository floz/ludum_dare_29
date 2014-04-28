PlanetMenuEntry = require "../planet_menu_entry"
Emitter = require "../../../components/emitter"
resources = require "../../../resources"

class InvadeComponent extends Emitter

    dom: null
    planet: null
    costs: null

    constructor: ( @dom, @planet, @costs ) ->

    enable: =>
        entry = new PlanetMenuEntry @dom.querySelector( ".invade" ), [ { r: resources.ships, v: @costs[ 0 ] }, { r: resources.minerals, v: @costs[ 1 ] }, { r: resources.gaz, v: @costs[ 2 ] } ], .5
        entry.enable()
        entry.on "complete", =>
            @planet.unlock()
            entry.progress = 0
            entry.updateProgress()

module.exports = InvadeComponent
