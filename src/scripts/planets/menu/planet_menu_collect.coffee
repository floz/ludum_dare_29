domify = require "../../components/domify"
MineralComponent = require "./components/mineral_component"
GazComponent = require "./components/gaz_component"

class PlanetMenuCollect

    planet: null
    dom: null

    mineralComponent: null
    gazComponent: null

    constructor: ( @planet, domData ) ->
        @dom = domify domData
        @mineralComponent = new MineralComponent @dom, @planet
        @gazComponent = new GazComponent @dom, @planet

        @mineralComponent.callBack = @gazComponent.enable

    enable: ->
        @mineralComponent.enable()      
        

module.exports = PlanetMenuCollect
