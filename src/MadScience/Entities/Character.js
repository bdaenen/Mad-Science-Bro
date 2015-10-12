(function() {
    'use strict';

    var Entity = require('Phaser/Entity');
    var helper = require('Core/helper');
    var Sprite = require('MadScience/Entities/PhaserSprite');
    var _ = require('lodash');

    /**
     * Game with all the necessary methods
     * @param {Phaser.Game} game
     * @param options
     * @constructor
     * @class Character
     * @extends Entity
     *
     */
    var Character = function(game, options) {
        this.callParent(Entity, 'constructor', [game, options]);
        this.game = game;
    };

    /**
     * Extend the Character with Entity
     */
    helper.extendClass(Character, Entity);

    /**
     *
     */
    Character.prototype.init = function(addToGame) {
        if (!this.sprite) {
            this.initSprite(addToGame);
        }

        // Bind a reference to our entity on the sprite.
        this.sprite.__custom_entity = this;

        this.enablePhysics();
        this.createComponents();
    };

    /**
     * Export for Browserify
     * @type {Function}
     */
    module.exports = Character;

}());
