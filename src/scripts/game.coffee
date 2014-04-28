resources = require "./resources"
amelio = require "./amelio"

menu = ( require "./menu" )()

universe = require "./universe"
universe.create()

update = ->
    for planet in universe.planets
        continue if planet.locked
        resources.minerals.add planet.drillingLevel.minerals * ( .8 + 5 * amelio.resources.value ) #* .25
        resources.gaz.add planet.drillingLevel.gaz * ( .65 + 5 * amelio.resources.value ) #* .05
    requestAnimationFrame update
update()

module.exports = 
    resize: ( hh ) ->
        universe.dom.style.top = hh * .5 - 75 - 54 + "px"
