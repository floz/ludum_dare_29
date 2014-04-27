domify = require "./components/domify"
Emitter = require "./components/emitter"
resources = require "./resources"
updateManager = require "./core/updateManager"

class PlanetMenuEntry extends Emitter

    dom: null
    resource: null
    progress: 0
    price: 0
    speed: 0

    domPrice: null
    domProgress: null

    constructor: ( @dom, @resource, @price = 0, @speed = 0 ) ->
        @domPrice = @dom.querySelector ".price"
        @domProgress = @dom.querySelector ".progress"

        @dom.addEventListener "click", ( e ) =>
            e.preventDefault()
            if @resource.isMoreThan @price
                @resource.substract @price
                @start()

        @updatePrice()

    updatePrice: ->
        @domPrice.innerHTML = "(cost: " + @price + @resource.name + ")"

    updateProgress: ->
        return if @progress == 0
        s = format @progress.toString()
        @domProgress.innerHTML = s + "%"
        
    
    enable: ->
        @dom.style.display = "block"

    disable: ->
        @dom.style.display = "none"

    start: ->
        updateManager.register @

    update: ->
        @progress += @speed
        if @progress >= 100
            @progress = 100
            updateManager.unregister @
            @onComplete()
        @updateProgress()

    onComplete: ->
        @emit "complete"

format = ( s ) ->
    idx = s.indexOf "."
    if idx < 0
        s += ".00"
    else
        # l = s.substr
        i = s.length - idx - 1
        for j in [ 0..i ]
            s += "0"
        # while i < 2
        #     s += "0"
        #     idx--
        console.log s
    s

class PlanetMenu extends Emitter

    planet: null
    dom: null

    constructor: ( @planet ) ->
        @dom = domify require "./templates/planet_menu.html"

    enableDrillingMinerals: ->
        entry = new PlanetMenuEntry @dom.querySelector( ".drilling-minerals" ), resources.minerals, 100, .25
        entry.enable()
        entry.on "complete", =>
            @planet.drillingLevel.minerals = 1
            entry.disable()
            @enableDrillingGaz()

    enableDrillingGaz: ->
        entry = new PlanetMenuEntry @dom.querySelector( ".drilling-gaz" ), resources.gaz, 100, 2
        entry.enable()
        

module.exports = PlanetMenu
