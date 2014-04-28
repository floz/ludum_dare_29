PlanetOrigin = require "./planet_origin"
PlanetCollect = require "./planet_collect"
PlanetArmy = require "./planet_army"
PlanetWar = require "./planet_war"
PlanetAmelio = require "./planet_amelio"
PlanetEnd = require "./planet_end"

module.exports = ( name, params ) ->
    cnt = document.getElementById name
    switch name
        when "origin" then planet = new PlanetOrigin cnt, params
        when "collect_0" then planet = new PlanetCollect cnt, params
        when "army_0" then planet = new PlanetArmy cnt, params
        when "war_0" then planet = new PlanetWar cnt, params
        when "amelio_0" then planet = new PlanetAmelio cnt, params
        when "end" then planet = new PlanetEnd cnt, params

    planet
