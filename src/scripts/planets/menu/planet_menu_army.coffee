domify = require "../../components/domify"
ShipsComponent = require "./components/ships_component"
BigShipsComponent = require "./components/big_ships_component"

class PlanetMenuArmy

    dom: null

    constructor: ( domData ) ->
        @dom = domify domData
        @shipsComponent10 = new ShipsComponent @dom, 10
        @bigShipsComponent1 = new BigShipsComponent @dom
        @bigShipsComponent5 = new BigShipsComponent @dom, 5

    enable: ->
        @shipsComponent10.enable()
        @bigShipsComponent1.enable()
        @bigShipsComponent5.enable()

module.exports = PlanetMenuArmy
