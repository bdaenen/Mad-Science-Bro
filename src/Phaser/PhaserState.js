(function() {
    'use strict';

    var BaseClass = require('Core/BaseClass');
    var helper = require('Core/helper');
    var _ = require('lodash');

    /**
     * Game with all the necessary methods
     * @param options
     * @constructor
     * @class PhaserState
     * @extends Phaser.State
     * @extends BaseClass
     *
     */
    var PhaserState = function(options) {
        this.callParent(BaseClass, 'constructor', [options]);
    };

    /**
     * Extend the BaseClass from the BaseClass
     */
    helper.extendClass(PhaserState, Phaser.State, BaseClass);

    /**
     * @returns {null}
     */
    PhaserState.prototype.getDefaultOptions = function() {
        return _.merge(this.callParent(BaseClass, 'getDefaultOptions'), {
            physics: Phaser.Physics.ARCADE,
            transparent: false,
            backgroundColor: '#0072bc',
            scaleMode: Phaser.ScaleManager.SHOW_ALL,
            maxWidth: 1280,
            maxHeight: 720
        });
    };

    /**
     * Preload required assets
     */
    PhaserState.prototype.preload = function() {
    };

    /**
     * Set up the game
     */
    PhaserState.prototype.create = function() {
        this.game.physics.startSystem(this.options.physics);
        this.game.stage.backgroundColor = this.options.backgroundColor;
        this.game.scale.scaleMode = this.options.scaleMode;
        this.game.scale.maxWidth = this.options.maxWidth;
        this.game.scale.maxHeight = this.options.maxHeight;
        this.game.scale.refresh();
    };

    /**
     * Update
     */
    PhaserState.prototype.update = function() {

    };

    /**
     * Render
     */
    PhaserState.prototype.render = function() {

    };

    /**
     *
     */
    PhaserState.prototype.shutdown = function() {
        //document.getElementById('container').className = 'inactive';
    };

    /**
     *
     */
    PhaserState.prototype.init = function() {
        var game = this.game;

        //setTimeout(function() {
        //    document.getElementById('container').className = '';
        //}, 500);
        //
        //setTimeout(function() {
        //    game.paused = false;
        //}, 1000)
    };

    /**
     * Export for Browserify
     * @type {Function}
     */
    module.exports = PhaserState;

}());
