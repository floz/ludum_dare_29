domify = require "../../components/domify"
AttackComponent = require "./components/attack_component"

class PlanetMenuAttack

    planet: null
    dom: null

    attackComponent: null

    constructor: ( @planet, domData ) ->
        @dom = domify domData
        @attackComponent = new AttackComponent @dom, @planet, null, 2

    enable: ->
        @attackComponent.enable()

module.exports = PlanetMenuAttack
