(function() {
    'use strict';

    var Character = require('MadScience/Entities/Character');
    var helper = require('Core/helper');
    var MoveComponent = require('MadScience/Entities/Components/TopDownMove');
    var Socket = require('Phaser/Socket');
    var Entity = require('Phaser/Entity');
    var _ = require('lodash');
    var Room = require('MadScience/Entities/Room');

    /**
     * Game with all the necessary methods
     * @param {Phaser.Game} game
     * @param options
     * @constructor
     * @class Player
     * @extends Character
     *
     */
    var Player = function(game, options) {
        this.callParent(Character, 'constructor', [game, options]);
        this.game = game;

        this.moveComponent = null;
        this.destination = null;
        this.destinationName = '';
        this.maxHealth = this.options.maxHealth;
        this.health = this.options.health ? this.options.health : this.options.maxHealth;
        this.moving = false;
    };

    /**
     * Extend the Player with Character
     */
    helper.extendClass(Player, Character);

    Player.prototype.getDefaultOptions = function() {
        return _.merge(this.callParent(Character, 'getDefaultOptions'), {
            maxHealth: 10,
            health: 10
        });
    };

    /**
     * Create all the components this Entity needs
     */
    Player.prototype.createComponents = function() {
        this.enablePhysics();
        this.moveComponent = new MoveComponent(this, this.game.input.keyboard, {
            controllable: false
        });
        this.moveComponent.init();
        this.createSockets();
    };

    /**
     * Create the sockets for this Entity
     */
    Player.prototype.createSockets = function() {
        var rightHandSocket = new Socket(this.game);
        rightHandSocket.init(this.sprite);

        //this.addSocket('right-hand', rightHandSocket);
        //var sword = new Entity(this.game, {
        //    spriteKey: 'sword'
        //});
        //sword.init();
        ////sword.sprite.tint = 0xFF0000;
        //this.addToSocket('right-hand', sword, new Phaser.Point(10, 10));
    };

    /**
     * @param addToGame
     */
    Player.prototype.init = function(addToGame) {
        this.callParent(Entity, 'init', [addToGame]);

        this.sprite.anchor.setTo(0.5, 0.5);
        window.roomActivatedSignal.add(this.moveToRoomCenter, this);
        window.roomCompletedSignal.add(this.moveToNextRoom, this);
        window.protectionActivated.add(this.drinkProtection, this);
    };

    Player.prototype.drinkProtection = function(protection) {
        var timer = this.game.time.create();
        this.playAnimation('drink');
        timer.add(1000, function() {
            if (this.sprite.animations.currentAnim.name === 'drink')
            this.playAnimation('idle');
        }, this);
        timer.start();
    };

   /**
    * @param room
    */
    Player.prototype.moveToRoomCenter = function(room) {
        var destination = new Phaser.Point(room.center.x, room.center.y);
        destination.x -= this.sprite.width / 2;
        //destination.y -= this.sprite.height / 2;

        this.destinationName = Room.destinations.center;
        this.setDestination(destination);
    };

   /**
    *
    * @param room
    */
    Player.prototype.moveToNextRoom = function(room) {
        this.destinationName = Room.destinations.nextRoom;
        this.setDestination(room.exit);
    };

    /**
     * Update
     */
    Player.prototype.update = function() {
        this.callParent(Character, 'update');

        // Only used when controllable
        //this.moveComponent.update();

        // Travel to current destination
        if (this.destination && this.moving) {
            if (!helper.almostEqual(this.position.x, this.destination.x, 5)) {
                if (this.position.x < this.destination.x) {
                    this.moveComponent.moveRight();
                }
                else if (this.position.x > this.destination.x) {
                    this.moveComponent.moveLeft();
                }
            }
            //else if (Math.abs(this.position.y - this.destination.y) > 5) {
            //    if (this.position.y < this.destination.y) {
            //        this.moveComponent.moveDown();
            //    }
            //    else if (this.position.y > this.destination.y) {
            //        this.moveComponent.moveUp();
            //    }
            //}
            else {
                this.moving = false;
                this.playAnimation('idle');
                window.reachedDestinationSignal.dispatch(this.destinationName, this.destination, this);
            }
        }
    };

    /**
     * @param destination
     */
    Player.prototype.setDestination = function(destination) {
        this.moving = true;
        this.destination = destination;
        if (this.destination.x < this.position.x) {
            this.sprite.scale.x = -1;
        }
        else {
            this.sprite.scale.x = 1;
        }
        this.playAnimation('walk');
    };

    /**
     * @param damage
     */
    Player.prototype.dealDamage = function(damage) {
        this.health -= damage;
        if (this.health <= 0) {
            this.kill();
        }
    };

    /**
     * Play death anim, switch states and do all the necessary stuff on player death.
     */
    Player.prototype.kill = function() {
        this.playAnimation('death');
        window.playerDeadSignal.dispatch(this);
        var name = window.localStorage.getItem('cloneName');
        var count = window.localStorage.getItem('cloneCount' + name);
        if (!count) {
            window.localStorage.setItem('cloneCount' + name, 1);
        }
        else {
            window.localStorage.setItem('cloneCount' + name, parseInt(count, 10) + 1);
        }
    };

    /**
     * Export for Browserify
     * @type {Function}
     */
    module.exports = Player;

}());
