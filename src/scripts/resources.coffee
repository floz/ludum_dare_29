Emitter = require "./components/emitter"

class Resource extends Emitter

    name: ""
    value: 0

    constructor: ( @name, @value = 0 ) ->

    add: ( value ) ->
        @value += value
        @update()

    substract: ( value ) ->
        @value -= value
        @value = 0 if @value < 0
        @update()

    isMoreThan: ( value ) ->
        return false if value > @value
        true

    update: ->
        @emit "update"

minerals = exports.minerals = new Resource "M", 100
gaz = exports.gaz = new Resource "G", 100
ships = exports.ships = new Resource "SS", 0
bigShips = exports.bigShips = new Resource "BS", 0
