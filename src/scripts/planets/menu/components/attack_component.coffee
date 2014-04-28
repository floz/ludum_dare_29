PlanetMenuEntry = require "../planet_menu_entry"
Emitter = require "../../../components/emitter"
resources = require "../../../resources"

class AttackComponent extends Emitter

    callback: null

    constructor: ( @dom, @planet ) ->

    enable: =>
        entry = new PlanetMenuEntry @dom.querySelector( ".attack" ), null, 1
        entry.enable()
        entry.on "complete", =>
            n = resources.ships.value
            for i in [0...n]
                @planet.lifebar.attack 1
                resources.ships.substract 3
                if @planet.lifebar.isDead()
                    break

            if not @planet.lifebar.isDead()
                n = resources.bigShips.value
                for i in [0...n]
                    @planet.lifebar.attack 20
                    resources.bigShips.substract 1
                    if @planet.lifebar.isDead()
                        break

            entry.progress = 0
            entry.updateProgress()

            if @planet.lifebar.isDead()
                @planet.unlock()
                entry.progress = 0
                entry.updateProgress()


module.exports = AttackComponent
