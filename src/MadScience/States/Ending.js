(function() {
    'use strict';

    var PhaserState = require('Phaser/PhaserState');
    var helper = require('Core/helper');
    var Entity = require('Phaser/Entity');
    var _ = require('lodash');

    /**
     * Game with all the necessary methods
     * @param options
     * @constructor
     * @class Ending
     * @extends PhaserState
     */
    var Ending = function(options) {
        this.callParent(PhaserState, 'constructor', [options]);

        this.cloneMachine = null;
        this.scientist = null;
        this.player = null;

        // Layer groups
        this.backgroundLayer = null;
        this.objectLayer = null;

        this.cameraTween = null;
        this.backgroundLayer = null;
        this.objectLayer = null;

        this.firePunch = null;
    };

    /**
     * Extend the BaseClass from the BaseClass
     */
    helper.extendClass(Ending, PhaserState);

    /**
     * Preload required assets
     */
    Ending.prototype.preload = function() {
        this.callParent(PhaserState, 'preload');
        this.load.image('cloneMachine', 'assets/sprites/clone_machine.png');
        this.load.spritesheet('sciencebro', 'assets/sprites/science-bro.png', 180, 180);
        this.load.spritesheet('firePunch', 'assets/sprites/fire_punch.png', 720, 720);
        this.load.image('baseRoomIntro', 'assets/sprites/baseRoomIntro.png');
        this.load.image('door', 'assets/sprites/door.png');
    };

    /**
     * @returns {*}
     */
    Ending.prototype.getDefaultOptions = function() {
        return _.merge(this.callParent(PhaserState, 'getDefaultOptions'), {
        });
    };

    /**
     * Set up the game
     */
    Ending.prototype.create = function() {
        this.callParent(PhaserState, 'create');

        this.backgroundLayer = this.game.add.group();
        this.objectLayer = this.game.add.group();
        this.foregroundLayer = this.game.add.group();

        var bg = new Entity(this.game, {
            spriteKey: 'baseRoomIntro'
        });

        bg.init();
        this.backgroundLayer.add(bg.sprite);
        this.initDoors();

        this.scientist = this.createScientist();
        this.objectLayer.add(this.scientist.sprite);
        this.clone = this.createClone();
        this.objectLayer.add(this.clone.sprite);
        this.cloneMachine = this.createCloneMachine();
        this.objectLayer.add(this.cloneMachine.sprite);
    };

    Ending.prototype.createCloneMachine = function() {
        var cloneMachine = new Entity(this.game, {
            spriteKey: 'cloneMachine'
        });
        cloneMachine.init();
        cloneMachine.sprite.anchor.setTo(0.5, 0.5);
        cloneMachine.position.x = 640;
        cloneMachine.position.y = 300;

        return cloneMachine;
    };

    Ending.prototype.createScientist = function() {
        var scientist = new Entity(this.game, {
            spriteKey: 'sciencebro'
        });
        scientist.init();
        scientist.sprite.animations.add('walk', [2, 3, 4, 5], 12, true);
        scientist.sprite.animations.add('idle', [1], true);
        scientist.sprite.animations.add('drink', [0], true);
        scientist.sprite.animations.add('death', [6], true);
        scientist.sprite.animations.add('punch', [7], true);

        scientist.playAnimation('idle');
        scientist.sprite.anchor.setTo(0.5, 0.5);
        scientist.position.x = 250;
        scientist.position.y = 295;

        return scientist;
    };

    Ending.prototype.initDoors = function() {
        var door = new Entity(this.game, {
            spriteKey: 'door'
        });
        var door2 = new Entity(this.game, {
            spriteKey: 'door'
        });
        var door3 = new Entity(this.game, {
            spriteKey: 'door'
        });
        var door4 = new Entity(this.game, {
            spriteKey: 'door'
        });

        door.init();
        door2.init();
        door3.init();
        door4.init();

        door2.sprite.scale.y = -1;
        door4.sprite.scale.y = -1;

        door3.sprite.scale.x = -1;
        door4.sprite.scale.x = -1;

        door.position.x = 0;
        door.position.y = 190;

        door2.position.x = 0;
        door2.position.y = 525;

        door3.position.x = 1280;
        door3.position.y = 190;

        door4.position.x = 1280;
        door4.position.y = 525;

        this.objectLayer.add(door.sprite);
        this.objectLayer.add(door2.sprite);
        this.objectLayer.add(door3.sprite);
        this.objectLayer.add(door4.sprite);

    };

    Ending.prototype.createClone = function() {
        var clone = new Entity(this.game, {
            spriteKey: 'sciencebro'
        });
        clone.init();
        clone.sprite.scale.x = -1;
        clone.sprite.animations.add('walk', [2, 3, 4, 5], 12, true);
        clone.sprite.animations.add('idle', [1], true);
        clone.sprite.animations.add('drink', [0], true);
        clone.sprite.animations.add('death', [6], true);
        clone.sprite.animations.add('punch', [7], true);
        clone.sprite.anchor.setTo(0.5, 0.5);
        clone.playAnimation('walk');

        clone.position.x = 1400;
        clone.position.y = 295;

        var cloneTween = this.add.tween(clone.sprite);
        cloneTween.to({
            x: 430
        }, 3000, Phaser.Easing.Sinusoidal.InOut, true);

        cloneTween.onComplete.add(function(sprite, tween) {
            clone.playAnimation('idle');
            var punchTween = this.add.tween(sprite);
            punchTween.to({
                x: 320
            }, 500, Phaser.Easing.Sinusoidal.InOut, true, 1000);
            setTimeout(function() {
                clone.playAnimation('punch');
            }, 1000);
            punchTween.onComplete.add(function(sprite, tween){
                this.objectLayer.add(this.firePunch.sprite);
                this.firePunch.playAnimation('play').onComplete.addOnce(function(sprite, anim) {
                    var scientistTween = this.add.tween(this.scientist.sprite);
                    this.scientist.playAnimation('death');
                    scientistTween.to({
                       x: -1000
                    }, 500, Phaser.Easing.Sinusoidal.Out, true);
                    this.firePunch.playAnimation('stop').onComplete.addOnce(function(sprite, anim) {
                        this.firePunch.sprite.visible = false;
                        this.clone.playAnimation('idle');
                        this.clone.sprite.scale.x = 1;
                        var temp = this;

                        var text = "I'm the scientist now.";
                        var style = { font: "40px arial black", fill: "#b2fc5f", align: "left" };
                        var textObj = this.make.text(100, 200, text, style);

                        textObj.fixedToCamera = true;

                        this.foregroundLayer.add(textObj);
                        setTimeout(function() {
                            temp.game.state.start('intro');
                        }, 2000);
                    }, this);

                }, this);
            }, this);
            // stab to idle
        }, this);

        this.firePunch = new Entity(this.game, {
           spriteKey: 'firePunch'
        });

        this.firePunch.init();
        this.firePunch.sprite.scale.x = -1;
        this.firePunch.sprite.anchor.setTo(0.5, 0.5);
        this.firePunch.sprite.animations.add('play', [0, 1, 2], 6, false);
        this.firePunch.sprite.animations.add('stop', [2, 1, 0], 6, false);
        this.firePunch.position.x = 50;
        this.firePunch.position.y = 270;

        //var timer = this.game.time.create(false);
        ////  Set a TimerEvent to occur after 2 seconds
        //timer.add(2000, function() {
        //
        //}, this);
        //
        ////  Start the timer running - this is important!
        ////  It won't start automatically, allowing you to hook it to button events and the like.
        //timer.start();
        clone.update = function() {

        };

        return clone;
    };

    /**
     *
     */
    Ending.prototype.shutdown = function() {
        this.callParent(PhaserState, 'shutdown');
    };

    /**
     * Update
     */
    Ending.prototype.update = function() {
        this.callParent(PhaserState, 'update');
    };

    /**
     * Render
     */
    Ending.prototype.render = function() {
        this.callParent(PhaserState, 'render');

    };

    /**
     * Export for Browserify
     * @type {Function}
     */
    module.exports = Ending;

}());
