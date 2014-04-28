PlanetMenuAttack = require "./menu/planet_menu_attack"
PlanetMenuCollect = require "./menu/planet_menu_collect"
Planet = require "./planet"

class PlanetWar extends Planet

    constructor: ( cnt, life ) ->
        super cnt
        @updateMenu()
        @addLifebar life

    createMenu: ->
        if not @menu
            new PlanetMenuAttack @, require "../templates/planet_menu_attack.html"
        else
            new PlanetMenuCollect @, require "../templates/planet_menu_collect.html"

module.exports = PlanetWar
