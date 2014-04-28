elts = []

update = ->
    for elt in elts
        continue if not elt
        elt.update()

    requestAnimationFrame update

update()

exports.register = ( elt ) ->
    elts.push elt

exports.unregister = ( elt ) ->
    idx = elts.indexOf elt
    return if idx < 0
    elts.splice idx, 1
