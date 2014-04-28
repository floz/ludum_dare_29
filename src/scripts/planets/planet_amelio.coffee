PlanetMenuAttack = require "./menu/planet_menu_attack"
PlanetMenuAmelio = require "./menu/planet_menu_amelio"
Planet = require "./planet"

class PlanetAmelio extends Planet

    amelio: null

    constructor: ( cnt, life ) ->
        super cnt
        @updateMenu()
        @addLifebar life

    createMenu: ->
        if not @menu
            new PlanetMenuAttack @, require "../templates/planet_menu_attack.html"
        else
            new PlanetMenuAmelio require( "../templates/planet_menu_amelio.html" ), @amelio

module.exports = PlanetAmelio
