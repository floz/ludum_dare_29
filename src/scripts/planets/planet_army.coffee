PlanetMenuArmy = require "./menu/planet_menu_army"
PlanetMenuInvade = require "./menu/planet_menu_invade"
Planet = require "./planet"

class PlanetArmy extends Planet

    constructor: ( cnt ) ->
        super cnt
        @updateMenu()

    createMenu: ->
        if not @menu
            new PlanetMenuInvade @, require "../templates/planet_menu_invade.html"
        else
            new PlanetMenuArmy require "../templates/planet_menu_army.html"

module.exports = PlanetArmy
