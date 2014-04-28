domify = require "../../components/domify"
AmelioComponent = require "./components/amelio_component"

class PlanetMenuAmelio
    dom: null

    amelioComponent: null

    constructor: ( domData, amelio ) ->
        @dom = domify domData
        @amelioComponent = new AmelioComponent @dom, amelio

    enable: ->
        @amelioComponent.enable()

module.exports = PlanetMenuAmelio
