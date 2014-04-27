Planet = require "./planet"

class Universe

    dom: null
    planets: null

    constructor: ->
        @dom = document.getElementById "universe"
        @planets = []

    create: ->
        @createOrigin()
        @createPlanets()

    createOrigin: ->
        planet = new Planet document.getElementById "origin"
        planet.setTexture "origin"
        planet.unlock()

    createPlanets: ->

module.exports = new Universe()

