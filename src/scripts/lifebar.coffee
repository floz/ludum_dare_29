domify = require "./components/domify"

class Lifebar

    dom: null
    domBar: null
    domValue: null

    lifeMax: 0
    life: 0

    constructor: ( @lifeMax ) ->
        @dom = domify require "./templates/planet_lifebar.html"
        @domBar = @dom.querySelector ".bar"
        @domValue = @dom.querySelector ".value"

        @life = @lifeMax

        @update()

    attack: ( value ) ->
        @life -= value
        @life = 0 if @life < 0
        @update()

    update: ->
        @domBar.style.width = ( @life / @lifeMax ) * 100 + "px"
        @domValue.innerHTML = "(" + @life + "/" + @lifeMax + ")"

    isDead: -> @life <= 0

module.exports = Lifebar
