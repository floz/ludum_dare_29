domify = require "../components/domify"
textures = require "../textures"
Lifebar = require "../lifebar"

class Planet
    
    cnt: null
    menu: null
    lifebar: null

    locked: true

    drillingLevel: null        

    canConstructShips: false

    constructor: ( @cnt ) ->
        @drillingLevel = 
            minerals: 0
            gaz: 0

    setTexture: ( name ) ->
        dom = domify textures.planets[ name ]
        @cnt.appendChild dom

    unlock: ->
        if @lifebar
            @cnt.removeChild @lifebar.dom
        @updateMenu()
        @locked = false

    updateMenu: ->
        if @menu
            @cnt.removeChild @menu.dom
        @menu = @createMenu()
        @menu.enable()
        @cnt.appendChild @menu.dom

    createMenu: ->

    addLifebar: ( life ) ->
        @lifebar = new Lifebar life
        @cnt.appendChild @lifebar.dom


module.exports = Planet
