Emitter = require "./components/emitter"

class Resource extends Emitter

    name: ""
    value: 0

    constructor: ( @name, @dom, @value = 0 ) ->

    add: ( value ) ->
        @value += value
        update()

    substract: ( value ) ->
        @value -= value
        @value = 0 if @value < 0
        @update()

    isMoreThan: ( value ) ->
        return false if value > @value
        true

    update: ->
        @dom.innerHtml = @value
        @emit "update"

domMenuResources = document.getElementById "menu__resources"
domMinerals = domMenuResources.querySelector ".minerals .value"
domGaz = domMenuResources.querySelector ".gaz .value"

minerals = exports.minerals = new Resource "M", domMinerals, 100
gaz = exports.gaz = new Resource "G", domGaz
