planetFactory = require "./planets/planet_factory"
resources = require "./resources"
amelio = require "./amelio"
stars = require "./stars"

class Universe

    dom: null
    planets: null

    constructor: ->
        stars.create()

        @dom = document.getElementById "universe"
        @planets = []
        resources.ships.once "update", =>
            @dom.classList.add "expand"
            @createPlanets()

    create: ->
        @createOrigin()

    createOrigin: ->
        planet = planetFactory "origin"
        planet.unlock()
        @planets.push planet

    createPlanets: =>
        planet = planetFactory "collect_0"
        planet.setTexture "collect_0"
        @planets.push planet

        planet = planetFactory "army_0"
        planet.setTexture "army_0"
        @planets.push planet

        planet = planetFactory "war_0", 200
        planet.setTexture "war_0"
        @planets.push planet

        planet = planetFactory "amelio_0", 400
        planet.setTexture "amelio_0"
        planet.amelio = amelio.resources
        @planets.push planet

        planet = planetFactory "end", 1500
        planet.setTexture "end"
        @planets.push planet


module.exports = new Universe()

