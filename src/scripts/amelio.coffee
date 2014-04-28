Emitter = require "./components/Emitter"

class Amelio extends Emitter

    value: 0

    constructor: ->

    upgrade: ->
        @value++
        @emit "update"

exports.resources = new Amelio()
exports.power = new Amelio()
