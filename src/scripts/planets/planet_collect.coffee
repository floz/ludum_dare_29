PlanetMenuCollect = require "./menu/planet_menu_collect"
PlanetMenuInvade = require "./menu/planet_menu_invade"
Planet = require "./planet"

class PlanetCollect extends Planet

    constructor: ( cnt ) ->
        super cnt
        @updateMenu()

    createMenu: ->
        if not @menu
            new PlanetMenuInvade @, require "../templates/planet_menu_invade.html"
        else
            new PlanetMenuCollect @, require "../templates/planet_menu_collect.html"

module.exports = PlanetCollect
