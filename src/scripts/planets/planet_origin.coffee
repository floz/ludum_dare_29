Planet = require "./planet"
PlanetMenuOrigin = require "./menu/planet_menu_origin"

class PlanetOrigin extends Planet

    constructor: ( cnt ) ->
        super cnt
        @setTexture "origin"
        @canConstructShips = true

    createMenu: ->
        new PlanetMenuOrigin @, require "../templates/planet_menu_origin.html"

module.exports = PlanetOrigin
