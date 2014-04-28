PlanetMenuAttack = require "./menu/planet_menu_attack"
PlanetMenuEnd = require "./menu/planet_menu_end"
Planet = require "./planet"

class PlanetEnd extends Planet

    constructor: ( cnt, life ) ->
        super cnt
        @updateMenu()
        @addLifebar life

    createMenu: ->
        if not @menu
            new PlanetMenuAttack @, require "../templates/planet_menu_attack.html"
        else
            new PlanetMenuEnd @, require "../templates/planet_menu_end.html"

module.exports = PlanetEnd
