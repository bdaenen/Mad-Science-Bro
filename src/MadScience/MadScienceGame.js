(function() {
    'use strict';

    var PhaserGame = require('Phaser/PhaserGame');
    var helper = require('Core/helper');
    var _ = require('lodash');

    /**
     * Game with all the necessary methods
     * @param options
     * @constructor
     * @class LeftRightGame
     * @extends PhaserGame
     */
    var MadScienceGame = function(options) {
        this.callParent(PhaserGame, 'constructor', [options]);
    };

    /**
     * Extend the MadScienceGame from the PhaserGame
     */
    helper.extendClass(MadScienceGame, PhaserGame);

    /**
     *
     */
    MadScienceGame.prototype.createStates = function() {
        var IntroState = require('MadScience/States/Intro');
        var GameState = require('MadScience/States/Game');
        var EndingState = require('MadScience/States/Ending');

        return {
            intro: new IntroState(),
            game: new GameState(),
            ending: new EndingState()
        };
    };

    /**
     * Export for Browserify
     * @type {Function}
     */
    module.exports = MadScienceGame;
}());
