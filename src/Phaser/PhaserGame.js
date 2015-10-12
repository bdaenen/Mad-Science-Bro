(function() {
    'use strict';

    var BaseGame = require('Core/BaseGame');
    var helper = require('Core/helper');
    var PhaserState = require('Phaser/PhaserState');
    var _ = require('lodash');

    /**
     * Game with all the necessary methods
     * @param options
     * @constructor
     * @class PhaserGame
     * @extends BaseGame
     *
     */
    var PhaserGame = function(options) {
        this.callParent(BaseGame, 'constructor', [options]);

        /**
         * @type {Phaser.Game | null}
         */
        this.game = null;
    };

    /**
     * Extend the BaseGame from the BaseClass
     */
    helper.extendClass(PhaserGame, BaseGame);

    /**
     * @returns {*}
     */
    PhaserGame.prototype.getDefaultOptions = function() {
        return _.merge(this.callParent(BaseGame, 'getDefaultOptions'), {
            width: 1280,
            height: 720
        });
    };

    /**
     * Starts the game
     */
    PhaserGame.prototype.start = function() {
        var states = this.createStates();

        this.game = new Phaser.Game(
            // Width
            this.options.width,
            // Height
            this.options.height,
            // Renderer
            this.getOptimalRenderer(),
            // Dom node or ID
            'container',
            // State object
            {},
            // Transparent canvas
            this.options.transparent,
            // Anti-alias
            true,
            // Extra physics config
            null
        );

        this.game.__gameWrapper = this;

        var stateNames = Object.keys(states);
        for (var i = 0; i < stateNames.length; i++) {
            var stateName = stateNames[i];
            this.game.state.add(stateName, states[stateName]);
        }

        this.game.state.start(stateNames[0]);
    };

    /**
     * Unix has horrible WebGL performance, fallback to canvas.
     */
    PhaserGame.prototype.getOptimalRenderer = function() {
        var matches = window.navigator.userAgent.toLowerCase().match(/\(linux|\(macintosh|\(mac/);
        if(matches && matches.length) {
            return Phaser.CANVAS;
        }
        return Phaser.AUTO;
    };

    /**
     * Create the states this game has. The 0th one is the first one started.
     */
    PhaserGame.prototype.createStates = function() {
        return {
            example: new PhaserState()
        }
    };

    /**
     * Export for Browserify
     * @type {Function}
     */
    module.exports = PhaserGame;

}());
