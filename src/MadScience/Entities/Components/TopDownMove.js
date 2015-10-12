(function() {
    'use strict';

    var BaseComponent = require('MadScience/Entities/Components/BaseComponent');
    var helper = require('Core/helper');
    var Entity = require('Phaser/Entity');
    var _ = require('lodash');

    /**
     * Game with all the necessary methods
     * @param {Entity} entity
     * @param {Phaser.Keyboard} keyboard
     * @param options
     * @constructor
     * @class TopDownMove
     * @extends BaseComponent
     *
     */
    var TopDownMove = function(entity, keyboard, options) {
        this.callParent(BaseComponent, 'constructor', [options]);
        this.keyboard = keyboard;
        this.movementState = {
            left: false,
            right: false,
            up: false,
            down: false
        };

        this.entity = entity;
        this.diagonalMaxVelocity = new Phaser.Point(0, 0);
        this.inited = false;
    };

    /**
     * Extend the TopDownMove with BaseComponent
     */
    helper.extendClass(TopDownMove, BaseComponent);

    /**
     * @returns {null}
     */
    TopDownMove.prototype.getDefaultOptions = function() {
        return _.merge(this.callParent(BaseComponent, 'getDefaultOptions'), {
            diagonal: true,
            acceleration: new Phaser.Point(400, 400),
            maxVelocity: new Phaser.Point(400, 400),
            drag: new Phaser.Point(5000, 5000),
            up: true,
            down: true,
            left: true,
            right: true,
            controllable: true
        });
    };

    /**
     *
     */
    TopDownMove.prototype.init = function() {
        this.updateMaxDiagonalVelocity();
        this.updateDrag();
        this.inited = true;
    };

    /**
     *
     */
    TopDownMove.prototype.updateMaxDiagonalVelocity = function() {
        var sqrt2 = Math.sqrt(2);
        this.diagonalMaxVelocity.x = this.options.maxVelocity.x / sqrt2;
        this.diagonalMaxVelocity.y = this.options.maxVelocity.y / sqrt2;
    };

    /**
     *
     */
    TopDownMove.prototype.updateDrag = function() {
        this.entity.drag.x = this.options.drag.x;
        this.entity.drag.y = this.options.drag.y;
    };

    /**
     * Update the movement state
     */
    TopDownMove.prototype.updateMovement = function() {
        var movement = new Phaser.Point(0, 0);
        if (this.movementState.up) {
            movement.y -= this.options.acceleration.y;
        }

        if (this.movementState.down) {
            movement.y += this.options.acceleration.y;
        }

        if (this.movementState.left) {
            movement.x -= this.options.acceleration.x;
        }

        if (this.movementState.right) {
            movement.x += this.options.acceleration.x;
        }

        this.entity.velocity.x += movement.x;
        this.entity.velocity.y += movement.y;
    };

    /**
     * Normalises diagonal movement
     */
    TopDownMove.prototype.normaliseSpeed = function() {
        if (this.entity.body.velocity.x && this.entity.body.velocity.y) {
            this.entity.body.maxVelocity.x = this.diagonalMaxVelocity.x;
            this.entity.body.maxVelocity.y = this.diagonalMaxVelocity.y;
        }
        else {
            this.entity.body.maxVelocity.x = this.options.maxVelocity.x;
            this.entity.body.maxVelocity.y = this.options.maxVelocity.y;
        }
    };

    /**
     * Handle input and update speed
     */
    TopDownMove.prototype.update = function() {
        if (!this.inited || !this.options.controllable) {
            return;
        }

        this.movementState.up = this.keyboard.isDown(Phaser.Keyboard.UP);
        this.movementState.down = this.keyboard.isDown(Phaser.Keyboard.DOWN);
        this.movementState.left = this.keyboard.isDown(Phaser.Keyboard.LEFT);
        this.movementState.right = this.keyboard.isDown(Phaser.Keyboard.RIGHT);

        this.updateMovement();
        this.normaliseSpeed();
    };

    /**
     * Ensure max diagonal speed is always set through this method
     */
    Object.defineProperty(TopDownMove.prototype, 'maxVelocity', {
        get: function() {
            return this.options.maxVelocity;
        },
        set: function(velocity){
            this.options.maxVelocity.x = velocity.x;
            this.options.maxVelocity.y = velocity.y;

            this.entity.body.maxVelocity.x = this.options.maxVelocity.x;
            this.entity.body.maxVelocity.y = this.options.maxVelocity.y;

            this.updateMaxDiagonalVelocity();
        }
    });

    /**
     * Set the drag after init
     */
    Object.defineProperty(TopDownMove.prototype, 'drag', {
        get: function() {
            return this.options.drag;
        },
        set: function(drag) {
            this.options.drag.x = drag.x;
            this.options.drag.y = drag.y;

            this.updateDrag();
        }
    });

    // Methods used if not controllable
    // ================================
    TopDownMove.prototype.moveLeft = function() {
        this.movementState.left = true;
        this.updateMovement();
        this.normaliseSpeed();
        this.movementState.left = false;
    };

    TopDownMove.prototype.moveRight = function() {
        this.movementState.right = true;
        this.updateMovement();
        this.normaliseSpeed();
        this.movementState.right = false;
    };

    TopDownMove.prototype.moveUp = function() {
        this.movementState.up = true;
        this.updateMovement();
        this.normaliseSpeed();
        this.movementState.up = false;
    };

    TopDownMove.prototype.moveDown = function() {
        this.movementState.down = true;
        this.updateMovement();
        this.normaliseSpeed();
        this.movementState.down = false;
    };

    /**
     * Export for Browserify
     * @type {Function}
     */
    module.exports = TopDownMove;

}());
