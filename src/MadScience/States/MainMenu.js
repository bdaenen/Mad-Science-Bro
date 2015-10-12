(function() {
    'use strict';

    var PhaserState = require('Phaser/PhaserState');
    var helper = require('Core/helper');
    var _ = require('lodash');

    /**
     * Game with all the necessary methods
     * @param options
     * @constructor
     * @class MainMenu
     * @extends PhaserState
     */
    var MainMenu = function(options) {
        this.callParent(PhaserState, 'constructor', [options]);
    };

    /**
     * Extend the BaseClass from the BaseClass
     */
    helper.extendClass(MainMenu, PhaserState);

    /**
     * Preload required assets
     */
    MainMenu.prototype.preload = function() {
        this.callParent(PhaserState, 'preload');
        this.load.image('lever', 'assets/sprites/lever.png');
    };

    MainMenu.prototype.getDefaultOptions = function() {
        return _.merge(this.callParent(PhaserState, 'getDefaultOptions'), {
        });
    };

    /**
     * Set up the game
     */
    MainMenu.prototype.create = function() {
        this.callParent(PhaserState, 'create');
        var xCoord = this.world.centerX;
        var yCoord = (this.world.centerY * 2);
        yCoord -= (yCoord * 0.2);

        var start = this.add.button(xCoord, yCoord , 'lever', this.loadIntroState, this);

        start.anchor.setTo(0.5);
    };

    /**
     *
     */
    MainMenu.prototype.loadIntroState = function() {
        this.state.start('intro');
    };

    /**
     * Update
     */
    MainMenu.prototype.update = function() {
        this.callParent(PhaserState, 'update');
    };

    /**
     * Render
     */
    MainMenu.prototype.render = function() {
        this.callParent(PhaserState, 'render');

    };

    /**
     * Export for Browserify
     * @type {Function}
     */
    module.exports = MainMenu;

}());
