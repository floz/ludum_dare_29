domify = require "../../components/domify"
EndComponent = require "./components/end_component"

class PlanetMenuEnd

    planet: null
    dom: null

    endComponent: null

    constructor: ( @planet, domData ) ->
        @dom = domify domData
        @endComponent = new EndComponent @dom

    enable: ->
        @endComponent.enable()

module.exports = PlanetMenuEnd
