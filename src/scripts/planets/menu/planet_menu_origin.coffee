PlanetMenuCollect = require "./planet_menu_collect"
ShipsComponent = require "./components/ships_component"

class PlanetMenuOrigin extends PlanetMenuCollect

    shipsComponent: null

    constructor: ( @planet, domData ) ->
        super @planet, domData

        @shipsComponent = new ShipsComponent @dom

        @gazComponent.callBack = @shipsComponent.enable
            
        

module.exports = PlanetMenuOrigin
