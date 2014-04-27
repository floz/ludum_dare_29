resources = require "./resources"

updateResources = ->
    menuMineralsValue.innerHTML = resources.minerals.value
    menuGazValue.innerHTML = resources.gaz.value

menuResources = document.getElementById "menu__resources"
menuMineralsValue = menuResources.querySelector ".minerals .value"
menuGazValue = menuResources.querySelector ".gaz .value"

updateResources()

module.exports = ->
    resources.minerals.on "update", updateResources    
    resources.gaz.on "update", updateResources


