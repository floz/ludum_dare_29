PlanetMenuEntry = require "../planet_menu_entry"
Emitter = require "../../../components/emitter"
resources = require "../../../resources"

class AmelioComponent extends Emitter

    dom: null
    amelio: null
    callBack: null

    constructor: ( @dom ) ->

    enable: =>
        entry = new PlanetMenuEntry @dom.querySelector( ".end" ), [ { r: resources.minerals, v: 2000}, { r: resources.gaz, v: 2000} ], .25
        entry.enable()
        entry.on "complete", =>
            divEnd = document.getElementById "ui-end"
            divEnd.style.display = "block"

        

module.exports = AmelioComponent
