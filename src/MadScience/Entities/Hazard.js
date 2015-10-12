(function(){
    'use strict';

    var helper = require('Core/helper');
    var Entity = require('Phaser/Entity');
    var _ = require('lodash');

    // Kind of horrible, should probably be refactored into a single class with anim and hazard itself.

    /**
     * Game with all the necessary methods
     * @param game
     * @param options
     * @constructor
     * @class LeftRightGame
     * @extends Entity
     */
    var Hazard = function(game, options) {
        this.callParent(Entity, 'constructor', [game, options]);
        this.active = false;
        this.subject = null;
        this.type = this.options.type;
    };

    Hazard.type = {
        FIRE: 0,
        ICE: 1,
        METAL: 2,
        POISON: 3
    };

    /**
     * Extend the MadScienceGame from the PhaserGame
     */
    helper.extendClass(Hazard, Entity);

    Hazard.prototype.getDefaultOptions = function() {
        return _.merge(this.callParent(Entity, 'getDefaultOptions'), {
            damage: 10,
            delayMs: 2000,
            type: null
        });
    };

    /**
     * @param addToGame
     */
    Hazard.prototype.init = function(addToGame) {
        this.callParent(Entity, 'init', [addToGame]);
        window.hazardAnimationStart.add(this.startHazard, this);
    };

    /**
     *
     */
    Hazard.prototype.activate = function(subject) {
        if (this.active) {
            return;
        }
        this.active = true;
        this.subject = subject;
        window.hazardActivated.dispatch(this);
    };

    /**
     *
     */
    Hazard.prototype.startHazard = function() {
        if (this.active) {
            window.hazardAnimationDamage.addOnce(this.dealDamage, this);
            window.hazardAnimationOver.addOnce(this.deactivate, this);
        }
    };

    Hazard.prototype.deactivate = function() {
        if (this.active) {
            this.active = false;
            window.hazardDeactivated.dispatch(this);
        }
    };

    Hazard.prototype.update = function() {
        this.callParent(Entity, 'update');

        if (this.active) {
            // Play any effects here. After this.options.delayMs damage will be done.
        }
    };

    /**
     * Check how much damage we need to do
     */
    Hazard.prototype.dealDamage = function() {
        if (this.active) {
            this.subject.dealDamage(this.options.damage);
        }
    };

    module.exports = Hazard;

}());
