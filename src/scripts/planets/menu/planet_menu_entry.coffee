updateManager = require "../../core/updateManager"
resources = require "../../resources"
Emitter = require "../../components/emitter"

class PlanetMenuEntry extends Emitter

    dom: null
    progress: 0
    prices: 0
    speed: 0

    domPrice: null
    domProgress: null

    constructor: ( @dom, @prices, @speed = 0 ) ->
        @domPrice = @dom.querySelector ".price"
        @domProgress = @dom.querySelector ".progress"

        @dom.addEventListener "click", ( e ) =>
            e.preventDefault()
            if @prices
                if @isResourcesAvailable()
                    for price in @prices
                        price.r.substract price.v
                    @start()
            else
                console.log "start", @speed
                @start()

        @updatePrice()

    isResourcesAvailable: ->
        isAvailable = true
        for price in @prices
            if not price.r.isMoreThan price.v
                isAvailable = false
        isAvailable

    updatePrice: ->
        return if not @prices
        
        s = "(cost: "
        for price, i in @prices
            s += ", " if i > 0 
            s += price.v + price.r.name
        s += ")"
        @domPrice.innerHTML = s

    updateProgress: ->
        if @progress == 0
            if @domProgress.innerHTML != ""
                @domProgress.innerHTML = ""
            return
        s = ( @progress >> 0 ).toString()
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

module.exports = PlanetMenuEntry
