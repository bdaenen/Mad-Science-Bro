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
     * @class Intro
     * @extends PhaserState
     */
    var Intro = function(options) {
        this.callParent(PhaserState, 'constructor', [options]);

        this.cloneMachine = null;
        this.scientist = null;
        this.clone = null;

        // Layer groups
        this.backgroundLayer = null;
        this.objectLayer = null;
        this.foregroundLayer = null;

        this.textBox = null;
        this.textBoxLabel = null;
        this.textBoxConfirm = null;
        this.textBoxForm = null;
        this.container = null;
        this.textBoxLabel = null;
    };

    /**
     * Extend the BaseClass from the BaseClass
     */
    helper.extendClass(Intro, PhaserState);

    /**
     * Preload required assets
     */
    Intro.prototype.preload = function() {
        this.callParent(PhaserState, 'preload');
        this.load.image('cloneMachine', 'assets/sprites/clone_machine.png');
        this.load.spritesheet('sciencebro', 'assets/sprites/science-bro.png', 180, 180);
        this.load.image('baseRoomIntro', 'assets/sprites/baseRoomIntro.png');
        this.load.image('door', 'assets/sprites/door.png');
    };

    /**
     * @returns {*}
     */
    Intro.prototype.getDefaultOptions = function() {
        return _.merge(this.callParent(PhaserState, 'getDefaultOptions'), {
        });
    };

    /**
     * Set up the game
     */
    Intro.prototype.create = function() {
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

        this.createHtmlElements();
    };

    Intro.prototype.createCloneMachine = function() {
        var cloneMachine = new Entity(this.game, {
            spriteKey: 'cloneMachine'
        });
        cloneMachine.init();
        cloneMachine.sprite.anchor.setTo(0.5, 0.5);
        cloneMachine.position.x = 640;
        cloneMachine.position.y = 300;

        return cloneMachine;
    };

    Intro.prototype.createScientist = function() {
        var scientist = new Entity(this.game, {
            spriteKey: 'sciencebro'
        });
        scientist.init();
        scientist.sprite.animations.add('walk', [2, 3, 4, 5], 12, true);
        scientist.sprite.animations.add('idle', [1], true);
        scientist.sprite.animations.add('drink', [0], true);
        scientist.sprite.animations.add('death', [6], true);

        scientist.playAnimation('idle');
        scientist.sprite.anchor.setTo(0.5, 0.5);
        scientist.position.x = 320;
        scientist.position.y = 295;

        return scientist;
    };

    Intro.prototype.createClone = function() {
        var clone = new Entity(this.game, {
            spriteKey: 'sciencebro'
        });
        clone.init();
        clone.sprite.animations.add('walk', [2, 3, 4, 5], 12, true);
        clone.sprite.animations.add('idle', [1], true);
        clone.sprite.animations.add('drink', [0], true);
        clone.sprite.animations.add('death', [6], true);
        clone.sprite.anchor.setTo(0.5, 0.5);
        clone.playAnimation('walk');

        clone.position.x = 640;
        clone.position.y = 295;

        var cloneTween = this.add.tween(clone.sprite);
        cloneTween.to({
            x: clone.position.x + 300
        }, 2500, Phaser.Easing.Sinusoidal.InOut, true, 2000);

        cloneTween.onComplete.add(function(sprite, tween) {
            this.textBoxForm.className = 'active';
            clone.playAnimation('idle');
        }, this);

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

    Intro.prototype.initDoors = function() {
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

    Intro.prototype.createHtmlElements = function() {
        var intro = this;
        this.container = document.getElementById('container');
        /** @type {HTMLInputElement}*/
        this.textBoxForm = document.createElement('form');
        this.textBoxForm.id = 'cloneNameForm';

        this.textBox = document.createElement('input');
        this.textBox.id = 'cloneName';
        this.textBoxLabel = document.createElement('label');
        this.textBoxLabel.id = 'cloneNameLabel';
        this.textBoxLabel.for = this.textBox.id;
        this.textBoxLabel.innerHTML = 'Name your clone...';
        this.textBoxConfirm = document.createElement('input');
        this.textBoxConfirm.type = 'submit';
        this.textBoxConfirm.id = 'confirmName';
        this.textBoxConfirm.value = 'OK';

        this.textBoxForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (intro.textBox.value.length) {
                window.localStorage.setItem('cloneName', intro.textBox.value);
                if (!window.localStorage.getItem('cloneCount' + intro.textBox.value)) {
                    window.localStorage.setItem('cloneCount' + intro.textBox.value, 0);
                }
                intro.textBoxConfirm.disabled = true;
                intro.startGame();
            }
            else {
                alert('Please fill in a name.');
            }
        }, false);

        this.container.appendChild(this.textBoxForm);
        this.textBoxForm.appendChild(this.textBoxLabel);
        this.textBoxForm.appendChild(this.textBox);
        this.textBoxForm.appendChild(this.textBoxConfirm);

        // Set positioning of textbox and label
        setTimeout(function() {
            var scaleFactor = intro.game.scale.scaleFactorInversed;
            intro.textBoxForm.style.left = 1280/2 * scaleFactor.x + 'px';
            intro.textBoxForm.style.top = 500 * scaleFactor.y + 'px';
        }, 500)
    };

    Intro.prototype.startGame = function() {
        var cloneTween = this.add.tween(this.clone.sprite);

        var name = window.localStorage.getItem('cloneName');
        var text = "Hey " + name + "-Bro, I can't do any of this \nMAD science without my lab coat!\nFetch it for me!\nDrink the matching potions to survive";
        var style = { font: "24px arial black", fill: "#b2fc5f", align: "left" };
        var textObj = this.make.text(100, 100, text, style);

        var textProgress = "Room 1/5";
        var textProgressObj = this.make.text(1000, 100, textProgress, style);
        textObj.fixedToCamera = true;
        textProgressObj.fixedToCamera = true;

        this.foregroundLayer.add(textObj);

        cloneTween.to({
            x: this.clone.position.x + 300
        }, 2500, Phaser.Easing.Sinusoidal.InOut, true, 3000);
        var me = this;
        setTimeout(function() {
            me.clone.playAnimation('walk');
        }, 3000);
        cloneTween.onComplete.add(function(sprite, tween) {
            this.textBoxForm.className = 'active';
            this.game.state.start('game');
        }, this);
    };

    /**
     *
     */
    Intro.prototype.shutdown = function() {
        this.callParent(PhaserState, 'shutdown');
        this.container.removeChild(this.textBoxForm);
    };

    /**
     *
     */
    Intro.prototype.loadIntroState = function() {
        this.state.start('intro');
    };

    /**
     * Update
     */
    Intro.prototype.update = function() {
        this.callParent(PhaserState, 'update');
      //  this.clone.update();
    };

    /**
     * Render
     */
    Intro.prototype.render = function() {
        this.callParent(PhaserState, 'render');

    };

    /**
     * Export for Browserify
     * @type {Function}
     */
    module.exports = Intro;

}());
