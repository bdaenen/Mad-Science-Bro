(function() {
    'use strict';

    var PhaserState = require('Phaser/PhaserState');
    var Player = require('MadScience/Entities/Player');
    var Character = require('MadScience/Entities/Character');
    var helper = require('Core/helper');
    var _ = require('lodash');
    var Room = require('MadScience/Entities/Room');
    var Hazard = require('MadScience/Entities/Hazard');
    var Protection = require('MadScience/Entities/Protection');
    var Entity = require('Phaser/Entity');
        /**
     * Game with all the necessary methods
     * @param options
     * @constructor
     * @class Game
     * @extends PhaserState
     */
    var Game = function(options) {
        this.callParent(PhaserState, 'constructor', [options]);

        // TODO: Refactor this to a proper "dependency container"-like object or scope it within prototypes
        // Hackity hackity hack, messing with globals is back
        window.playerDeadSignal = new Phaser.Signal();

        window.roomActivatedSignal = new Phaser.Signal();
        window.roomCompletedSignal = new Phaser.Signal();
        window.roomExitedSignal = new Phaser.Signal();
        window.reachedDestinationSignal = new Phaser.Signal();

        window.hazardActivated = new Phaser.Signal();
        window.hazardAnimationStart = new Phaser.Signal();
        window.hazardAnimationDamage = new Phaser.Signal();
        window.hazardAnimationOver = new Phaser.Signal();
        window.hazardDeactivated = new Phaser.Signal();

        window.protectionActivated = new Phaser.Signal();

        // Player
        this.player = null;

        // Layer groups
        this.backgroundLayer = null;
        this.objectLayer = null;
        this.foregroundLayer = null;

        // Camera
        this.cameraTween = null;

        // Rooms
        this.rooms = null;
        //this.roomCount = 5;
        this.roomCount = null;
        this.activeRoom = null;
        this.activeRoomIndex = null;

        // Hazards
        this.fireHazardAnim = null;
        this.lightningHazardAnim = null;
        this.metalHazardAnim = null;
        this.poisonHazardAnim = null;

        this.textProgressObj = null;
        this.doors = null;
    };

    /**
     * Extend the BaseClass from the BaseClass
     */
    helper.extendClass(Game, PhaserState);

    /**
     * @returns {*}
     */
    Game.prototype.getDefaultOptions = function() {
        return _.merge(this.callParent(PhaserState, 'getDefaultOptions'), {

        });
    };

    /**
     * Preload required assets
     */
    Game.prototype.preload = function() {
        this.callParent(PhaserState, 'preload');

        // Player
        this.load.image('scientist', 'assets/sprites/scientist.png');
        this.load.spritesheet('sciencebro', 'assets/sprites/science-bro.png', 180, 180);

        // Rooms
        this.load.image('baseRoom', 'assets/sprites/baseRoom.png');
        this.load.image('pedestal', 'assets/sprites/pedestal.png');

        // Hazards
        this.load.spritesheet('poisonHazard', 'assets/sprites/poisonHazard.png', 720, 720);
        this.load.spritesheet('fireHazard', 'assets/sprites/fireHazard.png', 720, 720);
        this.load.spritesheet('lightningHazard', 'assets/sprites/lightningHazard.png', 720, 720);
        this.load.spritesheet('metalHazard', 'assets/sprites/metalHazard.png', 720, 720);

        // Protection
        this.load.image('vial_fire', 'assets/sprites/vials_fire.png', 720, 720);
        this.load.image('vial_lightning', 'assets/sprites/vials_lightning.png', 720, 720);
        this.load.image('vial_poison', 'assets/sprites/vials_poison.png', 720, 720);
        this.load.image('vial_metal', 'assets/sprites/vials_steel.png', 720, 720);

        // Gui
        this.load.image('restartButton', 'assets/sprites/restart.png');
        this.load.image('door', 'assets/sprites/door.png');
        this.load.image('coat', 'assets/sprites/coat.png');
    };

    /**
     * Set up the game
     */
    Game.prototype.create = function() {
        this.callParent(PhaserState, 'create');

        // Rooms
        this.rooms = [];
        this.roomCount = 5;
        this.activeRoomIndex = 0;

        this.cameraTween = this.add.tween(this.camera);
        this.backgroundLayer = this.game.add.group();
        this.objectLayer = this.game.add.group();
        this.foregroundLayer = this.game.add.group();

        this.doors = [];
        this.initPlayer();
        window.playerDeadSignal.add(this.handleDeath, this);
        this.initRooms();
        window.reachedDestinationSignal.add(this.slideDoorsClosed, this);
        this.initHazardAnimations();

        window.roomCompletedSignal.add(this.startEnding, this);
        window.roomCompletedSignal.add(this.slideDoorsOpen, this);

        this.activateRoom(0);
        window.roomExitedSignal.add(this.activateNextRoom, this);

        var name = window.localStorage.getItem('cloneName');
        var text = "Clone: " + name + '_' + window.localStorage.getItem('cloneCount' + name);
        var style = { font: "40px arial black", fill: "#b2fc5f", align: "left" };
        var textObj = this.make.text(100, 100, text, style);

        var textProgress = "Room 1/5";
        var textProgressObj = this.make.text(1000, 100, textProgress, style);
        textObj.fixedToCamera = true;
        textProgressObj.fixedToCamera = true;

        this.foregroundLayer.add(textObj);
        this.foregroundLayer.add(textProgressObj);

        this.textProgressObj = textProgressObj;

        this.player.sprite.bringToTop();
    };

    /**
     *
     */
    Game.prototype.initHazardAnimations = function() {
        this.poisonHazardAnim = new Entity(this.game, {
            spriteKey: 'poisonHazard'
        });
        this.poisonHazardAnim.init();
        this.poisonHazardAnim.sprite.animations.add('start', [0, 1, 1, 1, 2, 2, 2, 3, 3, 4, 4], 3, false);
        this.poisonHazardAnim.sprite.animations.add('damage', [5, 5, 6, 7, 8, 8, 8, 8, 8], 6, false);
        this.poisonHazardAnim.sprite.animations.add('stop', [8, 7, 6, 5, 4, 3, 2, 1, 0], 8, false);

        this.objectLayer.add(this.poisonHazardAnim.sprite);
        this.poisonHazardAnim.sprite.anchor.setTo(0.5, 0.5);
        this.poisonHazardAnim.position.x = 639;
        this.poisonHazardAnim.position.y = 344;

        this.fireHazardAnim = new Entity(this.game, {
            spriteKey: 'fireHazard'
        });
        this.fireHazardAnim.init();
        this.fireHazardAnim.sprite.animations.add('start', [0, 1, 1, 1, 2, 2, 2, 3], 3, false);
        this.fireHazardAnim.sprite.animations.add('damage', [4, 4, 5, 5, 6], 6, false);
        this.fireHazardAnim.sprite.animations.add('stop', [6, 5, 4, 3, 2, 1, 0], 8, false);

        this.objectLayer.add(this.fireHazardAnim.sprite);
        this.fireHazardAnim.sprite.anchor.setTo(0.5, 0.5);
        this.fireHazardAnim.position.x = 639;
        this.fireHazardAnim.position.y = 344;

        this.lightningHazardAnim = new Entity(this.game, {
            spriteKey: 'lightningHazard'
        });
        this.lightningHazardAnim.init();
        this.lightningHazardAnim.sprite.animations.add('start', [0, 1, 1, 1, 2, 2, 2, 3], 3, false);
        this.lightningHazardAnim.sprite.animations.add('damage', [4, 4, 5, 5, 6], 6, false);
        this.lightningHazardAnim.sprite.animations.add('stop', [6, 5, 4, 3, 2, 1, 0], 8, false);

        this.objectLayer.add(this.lightningHazardAnim.sprite);
        this.lightningHazardAnim.sprite.anchor.setTo(0.5, 0.5);
        this.lightningHazardAnim.position.x = 639;
        this.lightningHazardAnim.position.y = 344;

        this.metalHazardAnim = new Entity(this.game, {
            spriteKey: 'metalHazard'
        });
        this.metalHazardAnim.init();

        this.metalHazardAnim.sprite.animations.add('start', [0, 1, 1, 1, 2, 2, 2, 3], 3, false);
        this.metalHazardAnim.sprite.animations.add('damage', [4, 4, 5, 5, 6, 7], 6, false);
        this.metalHazardAnim.sprite.animations.add('stop', [7, 6, 5, 4, 3, 2, 1, 0], 8, false);

        this.backgroundLayer.add(this.metalHazardAnim.sprite);
        this.metalHazardAnim.sprite.anchor.setTo(0.5, 0.5);
        this.metalHazardAnim.position.x = 639;
        this.metalHazardAnim.position.y = 344;


        window.hazardActivated.add(this.playHazardAnimation, this);
    };

    Game.prototype.playHazardAnimation = function(hazard) {
        var hazardAnim = null;
        switch (hazard.type) {
            case Hazard.type.FIRE:
                hazardAnim = this.fireHazardAnim;
                break;
            case Hazard.type.POISON:
                hazardAnim = this.poisonHazardAnim;
                break;
            case Hazard.type.ICE:
                hazardAnim = this.lightningHazardAnim;
                break;
            case Hazard.type.METAL:
                hazardAnim = this.metalHazardAnim;
                break;
        }

        window.hazardAnimationStart.dispatch(hazardAnim, hazard);
        hazardAnim.sprite.bringToTop();
        hazardAnim.playAnimation('start').onComplete.addOnce(function(sprite, realAnim, hazard, hazardAnim) {
            // Dispatch that damage will be done
            window.hazardAnimationDamage.dispatch(hazardAnim, hazard);
            // Play damage anim
            hazardAnim.playAnimation('damage').onComplete.addOnce(function(sprite, realAnim, hazard, hazardAnim) {
                // After damage anim, play stop anim
                hazardAnim.playAnimation('stop').onComplete.addOnce(function(sprite, realAnim, hazard, hazardAnim) {
                    window.hazardAnimationOver.dispatch(hazardAnim, hazard);
                }, this, 0, hazard, hazardAnim);
            }, this, 0, hazard, hazardAnim);
        }, this, 0, hazard, hazardAnim);
    };

    /**
     *
     */
    Game.prototype.initPlayer = function() {
        var player = new Player(this.game, {
            spriteKey: 'sciencebro'
        });
        player.init();
        player.sprite.animations.add('walk', [2, 3, 4, 5], 12, true);
        player.sprite.animations.add('idle', [1], true);
        player.sprite.animations.add('drink', [0], true);
        player.sprite.animations.add('death', [6], true);

        this.player = player;
        this.player.name = window.localStorage.getItem('cloneName');
        this.objectLayer.add(this.player.sprite);
        this.player.sprite.y = 295;
    };

    /**
     *
     */
    Game.prototype.initRooms = function() {
        for (var i = 0; i < this.roomCount; i++) {
            this.rooms.push(new Room(this.game, {
                spriteKey: 'baseRoom'
            }));
        }

        this.rooms.forEach(function(room, index, rooms) {
            room.init();
            this.backgroundLayer.add(room.sprite);
            room.initPosition(index);

            var hazs = this.getHazards(index);
            room.setHazards(hazs);
            for (var i = 0; i < hazs.length; i++) {
                hazs[i].room = room;
                hazs[i].roomNumber = index;
            }
            this.initProtection(room);
            this.initDoors(index);
            if (index === this.roomCount - 1) {
                var coat = new Entity(this.game, {
                    spriteKey: 'coat'
                });

                coat.init();

                coat.position.x = room.center.x - 40;
                coat.position.y = room.center.y - 40;
                this.backgroundLayer.add(coat.sprite);
            }
        }, this);

        this.world.setBounds(0, 0, 1280 * this.roomCount, 720);
    };

    /**
     * @param index
     */
    Game.prototype.initDoors = function(index) {
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

        door.position.x = index * 1280;
        door.position.y = 190;

        door2.position.x = index * 1280;
        door2.position.y = 525;

        door3.position.x = index * 1280 + 1280;
        door3.position.y = 190;

        door4.position.x = index * 1280 + 1280;
        door4.position.y = 525;

        this.objectLayer.add(door.sprite);
        this.objectLayer.add(door2.sprite);
        this.objectLayer.add(door3.sprite);
        this.objectLayer.add(door4.sprite);

        this.doors.push(door);
        this.doors.push(door2);
        this.doors.push(door3);
        this.doors.push(door4);
    };

    /**
     *
     */
    Game.prototype.slideDoorsOpen = function() {
        this.doors.forEach(function(door) {
            var tween = this.add.tween(door.sprite);

            if (door.sprite.scale.y === -1) {
                tween.to({
                    y: door.sprite.y + 50
                }, 1000, Phaser.Easing.Sinusoidal.InOut, true);
            }
            else {
                tween.to({
                    y: door.sprite.y - 50
                }, 1000, Phaser.Easing.Sinusoidal.InOut, true);
            }
        }, this);
    };

    Game.prototype.slideDoorsClosed = function(destinationName) {
        if (destinationName !== 'center') {
            return;
        }

        this.doors.forEach(function(door) {
            var tween = this.add.tween(door.sprite);

            if (door.sprite.scale.y === -1) {
                tween.to({
                    y: door.sprite.y - 50
                }, 1000, Phaser.Easing.Sinusoidal.InOut, true);
            }
            else {
                tween.to({
                    y: door.sprite.y + 50
                }, 1000, Phaser.Easing.Sinusoidal.InOut, true);
            }
        }, this);
    };

    Game.prototype.initProtection = function(room) {
        var roomSockets = [
            'topTable',
            'rightTable',
            'bottomTable',
            'leftTable'
        ];

        roomSockets = _.shuffle(roomSockets);

        var fireProtection = new Protection(this.game, {
           // spriteKey: 'fireProtection',
            spriteKey: 'vial_fire',
            type: Hazard.type.FIRE
        });
        fireProtection.init();

        var iceProtection = new Protection(this.game, {
           // spriteKey: 'iceProtection',
            spriteKey: 'vial_lightning',
            type: Hazard.type.ICE
        });
        iceProtection.init();

        var metalProtection = new Protection(this.game, {
           // spriteKey: 'metalProtection',
            spriteKey: 'vial_metal',
            type: Hazard.type.METAL
        });
        metalProtection.init();

        var poisonProtection = new Protection(this.game, {
           // spriteKey: 'poisonProtection',
            spriteKey: 'vial_poison',
            type: Hazard.type.POISON
        });
        poisonProtection.init();

        room.addToSocket(roomSockets[0], fireProtection, new Phaser.Point(0, -28));
        room.addToSocket(roomSockets[1], iceProtection,new Phaser.Point(0, -28));
        room.addToSocket(roomSockets[2], metalProtection, new Phaser.Point(0, -28));
        room.addToSocket(roomSockets[3], poisonProtection, new Phaser.Point(0, -28));
    };

    /**
     * Higher index makes it harder
     */
    Game.prototype.getHazards = function(index) {
        var hazards = [];
        var hazardTypes = [
            Hazard.type.FIRE,
            Hazard.type.ICE,
            Hazard.type.POISON,
            Hazard.type.METAL
        ];

        for (var i = 0; i <= index; i++) {
            var rand = helper.randBetween(0, hazardTypes.length);
            var hazard = new Hazard(this.game, {
                type: hazardTypes[rand]
            });
            hazard.init();
            hazards.push(hazard);
        }

        return hazards;
    };

    /**
     * Update
     */
    Game.prototype.update = function() {
        this.callParent(PhaserState, 'update');
        this.player.update();
        this.updateCollisions();
        this.updateCamera();
        for (var i =0; i < this.rooms.length; i++) {
            this.rooms[i].update();
        }
    };

    /**
     *
     */
    Game.prototype.updateCollisions = function() {

    };

    /**
     * Check if the camera needs to be updated, and do so when required.
     */
    Game.prototype.updateCamera = function() {
        var maxBound = this.camera.view.width + this.camera.view.x;
        var minBound = this.camera.view.x;

        if (this.cameraTween.isRunning) {
            return;
        }

        if (this.player.position.x >= maxBound && this.player.position.x < this.camera.bounds.width) {
            this.tweens.remove(this.cameraTween);
            this.cameraTween = this.add.tween(this.camera);
            this.cameraTween.to({
                x: maxBound
            }, 1000, Phaser.Easing.Sinusoidal.InOut, true);
        }
        else if (this.player.position.x <= minBound && this.player.position.x > 0){
            this.tweens.remove(this.cameraTween);
            this.cameraTween = this.add.tween(this.camera);
            this.cameraTween.to({
                x: minBound - this.game.camera.view.width
            }, 1000, Phaser.Easing.Sinusoidal.InOut, true);
        }
    };

    /**
     * Activate room by index
     * @param index
     */
    Game.prototype.activateRoom = function(index) {
        if (this.activeRoom) {
            this.activeRoom.deactivate();
        }
        this.activeRoom = this.rooms[index];
        this.activeRoomIndex = index;
        this.activeRoom.activate();
        this.poisonHazardAnim.position.x = (this.activeRoomIndex + 0.5) * (this.camera.view.width);
        this.fireHazardAnim.position.x = (this.activeRoomIndex + 0.5) * (this.camera.view.width);
        this.lightningHazardAnim.position.x = (this.activeRoomIndex + 0.5) * (this.camera.view.width);
        this.metalHazardAnim.position.x = (this.activeRoomIndex + 0.5) * (this.camera.view.width);

        if (this.textProgressObj) {
            this.textProgressObj.text = "Room " + (index + 1) + "/5";
        }
    };

    /**
     *
     */
    Game.prototype.activateNextRoom = function(room) {
        this.activateRoom(this.activeRoomIndex + 1);
    };

    /**
     * Render
     */
    Game.prototype.render = function() {
        this.callParent(PhaserState, 'render');

        //this.game.debug.cameraInfo(this.game.camera, 32, 32);
        //this.game.debug.body(this.player.sprite);

    };

    Game.prototype.startEnding = function(destinationName, destination, player) {
        if (this.activeRoomIndex === this.roomCount - 1) {

            var text = "Wait a minute...";
            var style = { font: "30px arial black", fill: "#b2fc5f", align: "left" };
            var textObj = this.make.text(520, 540, text, style);

            textObj.fixedToCamera = true;

            this.foregroundLayer.add(textObj);

            var me = this;

            setTimeout(function(){
                me.player.setDestination(new Phaser.Point(0, me.activeRoom.sprite.height / 2));
                window.reachedDestinationSignal.add(function() {
                    me.state.start('ending');
                }, me);
            }, 1000);
        }
    };

    Game.prototype.handleDeath = function() {
        var button = this.game.make.button(0, 0, 'restartButton', this.restart, this);
        button.x = 640 - button.width/2;
        button.y = 550;
        button.fixedToCamera = true;
        this.foregroundLayer.add(button);
        this.resetEvents();
    };

    Game.prototype.restart = function() {
        this.game.state.restart();
    };

    Game.prototype.shutdown = function() {
        this.callParent(PhaserState, 'shutdown');
        this.resetEvents();

        // Player
        this.player = null;

        // Layer groups
        this.backgroundLayer = null;
        this.objectLayer = null;
        this.foregroundLayer = null;

        // Camera
        this.cameraTween = null;

        // Rooms
        this.rooms = null;
        //this.roomCount = 5;
        this.roomCount = null;
        this.activeRoom = null;
        this.activeRoomIndex = null;

        // Hazards
        this.fireHazardAnim = null;
        this.lightningHazardAnim = null;
        this.metalHazardAnim = null;
        this.poisonHazardAnim = null;

        this.textProgressObj = null;

        this.doors = null;
    };

    Game.prototype.resetEvents = function() {
        window.playerDeadSignal.removeAll();
        window.roomActivatedSignal.removeAll();
        window.roomCompletedSignal.removeAll();
        window.roomExitedSignal.removeAll();
        window.reachedDestinationSignal.removeAll();
        window.hazardActivated.removeAll();
        window.hazardAnimationStart.removeAll();
        window.hazardAnimationDamage.removeAll();
        window.hazardAnimationOver.removeAll();
        window.hazardDeactivated.removeAll();
        window.protectionActivated.removeAll();
    };
    /**
     * Export for Browserify
     * @type {Function}
     */
    module.exports = Game;

}());
