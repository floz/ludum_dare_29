resources = require "./resources"
amelio = require "./amelio"

updateResources = ->
    menuMineralsValue.innerHTML = resources.minerals.value >> 0
    menuGazValue.innerHTML = resources.gaz.value >> 0

updateShips = ->
    if resources.ships.value >= 1
        menuShips.style.display = "block"
    menuShipsValue.innerHTML = resources.ships.value >> 0
    if resources.bigShips.value >= 1
        menuBigShips.style.display = "block"
    menuBigShipsValue.innerHTML = resources.bigShips.value >> 0

menuResources = document.getElementById "menu__resources"
menuMineralsValue = menuResources.querySelector ".minerals .value"
menuGazValue = menuResources.querySelector ".gaz .value"

updateResources()

menuStats = document.getElementById "menu__stats"
menuArmy = document.getElementById "menu__stats__army"
menuShips = menuArmy.querySelector ".ships"
menuShipsValue = menuArmy.querySelector ".ships .value"
menuBigShips = menuArmy.querySelector ".big-ships"
menuBigShipsValue = menuArmy.querySelector ".big-ships .value"
menuAmelio = document.getElementById "menu__amelio"

module.exports = ->
    resources.minerals.on "update", updateResources    
    resources.gaz.on "update", updateResources

    resources.ships.on "update", updateShips
    resources.bigShips.on "update", updateShips

    amelio.resources.on "update", ->
        menuAmelio.style.visibility = "visible"


