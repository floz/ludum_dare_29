PlanetMenuEntry = require "../planet_menu_entry"
Emitter = require "../../../components/emitter"
resources = require "../../../resources"

class AmelioComponent extends Emitter

    dom: null
    amelio: null
    callBack: null

    constructor: ( @dom, @amelio ) ->

    enable: =>
        entry = new PlanetMenuEntry @dom.querySelector( ".amelio" ), [ { r: resources.minerals, v: 1000}, { r: resources.gaz, v: 4000} ], 2#.42
        entry.enable()
        entry.on "complete", =>
            @amelio.upgrade()
            entry.progress = 0
            entry.updateProgress()
            entry.disable()

        

module.exports = AmelioComponent
