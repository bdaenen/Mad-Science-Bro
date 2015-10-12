(function() {
    'use strict';

    var Entity = require('Phaser/Entity');
    var helper = require('Core/helper');
    var Sprite = require('MadScience/Entities/PhaserSprite');
    var Hazard = require('MadScience/Entities/Hazard');
    var _ = require('lodash');

    /**
     * Game with all the necessary methods
     * @param {Phaser.Game} game
     * @param options
     * @constructor
     * @class Protection
     * @extends Entity
     */
    var Protection = function(game, options) {
        this.callParent(Entity, 'constructor', [game, options]);
        this.game = game;
        this.type = this.options.type;
        this.subject = null;
        this.active = false;
        this.tween = null;
    };

    /**
     * Extend the Protection with Entity
     */
    helper.extendClass(Protection, Entity);

    Protection.prototype.getDefaultOptions = function() {
        return _.merge(this.callParent(Entity, 'getDefaultOptions'), {
            type: null
        });
    };

    /**
     *
     */
    Protection.prototype.init = function(addToGame, subject) {
        this.callParent(Entity, 'init', [addToGame]);

        this.subject = subject;
        this.sprite.inputEnabled = true;
        this.sprite.events.onInputDown.add(this.applyProtection, this);
        window.hazardActivated.add(this.activate, this);
        window.roomCompletedSignal.add(this.deactivate, this);

        this.deactivate();
    };

    /**
     *
     */
    Protection.prototype.applyProtection = function() {
        if (this.active) {
            window.protectionActivated.dispatch(this);
            if (this.type === this.currentHazard.type) {
                // Eww that's dirty...
                this.currentHazard.options.damage = 0;
            }
        }
    };

    /**
     *
     */
    Protection.prototype.activate = function(hazard) {
        this.active = true;
        this.currentHazard = hazard;
        this.tween = this.game.add.tween(this.sprite);
        this.tween.to({
            alpha: 1
        }, 250, Phaser.Easing.Sinusoidal.InOut, true);
    };

    /**
     *
     */
    Protection.prototype.deactivate = function() {
        this.active = false;
        this.currentHazard = null;
        this.tween = this.game.add.tween(this.sprite);
        this.tween.to({
            alpha: 0.5
        }, 250, Phaser.Easing.Sinusoidal.InOut, true);
    };

    /**
     * Export for Browserify
     * @type {Function}
     */
    module.exports = Protection;

}());
