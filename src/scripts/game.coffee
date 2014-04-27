menu = ( require "./menu" )()

universe = require "./universe"
universe.create()

module.exports = 
    resize: ( hh ) ->
        universe.dom.style.top = hh * .5 - 75 + "px"
