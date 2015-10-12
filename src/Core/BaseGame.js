(function() {
    'use strict';

    var BaseClass = require('Core/BaseClass');
    var helper = require('Core/helper');

    /**
     * Game with all the necessary methods
     * @constructor
     * @class BaseGame
     * @extends BaseClass
     */
    var BaseGame = function(options) {
        this.callParent(BaseClass, 'constructor', [options]);
    };

    /**
     * Extend the BaseGame from the BaseClass
     */
    helper.extendClass(BaseGame, BaseClass);

    /**
     * @returns {null}
     */
    BaseGame.prototype.getDefaultOptions = function() {
        return this.callParent(BaseClass, 'getDefaultOptions');
    };

    /**
     * Is the game over?
     */
    BaseGame.prototype.isGameOver = function() {};

    /**
     * Process game over
     */
    BaseGame.prototype.gameOver = function() {};

    /**
     * Post the score
     */
    BaseGame.prototype.postScore = function() {};

    /**
     * Boot the game
     */
    BaseGame.prototype.start = function() {};

    /**
     * Export for Browserify
     * @type {Function}
     */
    module.exports = BaseGame;

}());