domify = require "../../components/domify"
InvadeComponent = require "./components/invade_component"

class PlanetMenuInvade

    planet: null
    dom: null

    invadeComponent: null

    constructor: ( @planet, domData ) ->
        @dom = domify domData
        @invadeComponent = new InvadeComponent @dom, @planet, [ 3, 300, 150 ]

    enable: ->
        @invadeComponent.enable()

module.exports = PlanetMenuInvade
