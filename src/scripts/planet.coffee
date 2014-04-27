domify = require "./components/domify"
textures = require "./textures"
PlanetMenu = require "./planet_menu"

class Planet
    
    cnt: null
    menu: null

    locked: true

    drillingLevel:
        minerals: 0
        gaz: 0

    constructor: ( @cnt ) ->

    setTexture: ( name ) ->
        dom = domify textures.planets[ name ]
        @cnt.appendChild dom

    unlock: ->
        @menu = new PlanetMenu @
        @menu.enableDrillingMinerals()
        @cnt.appendChild @menu.dom
        @locked = false


module.exports = Planet
