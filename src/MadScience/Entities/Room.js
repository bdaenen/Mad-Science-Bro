(function(){
  'use strict';

  var helper = require('Core/helper');
  var Entity = require('Phaser/Entity');
  var Socket = require('Phaser/Socket');
  var _ = require('lodash');

  var Hazard = require('MadScience/Entities/Hazard');

  /**
   * Game with all the necessary methods
   * @param game
   * @param options
   * @constructor
   * @class LeftRightGame
   * @extends Entity
   */
  var Room = function(game, options) {
    this.callParent(Entity, 'constructor', [game, options]);
    this.active = false;
    this.center = null;
    this.entrance = null;
    this.exit = null;
    this.hazards = [];
    this.state = null;
    this.runningState = false;
  };

  /**
   * Extend the MadScienceGame from the PhaserGame
   */
  helper.extendClass(Room, Entity);

  Room.destinations = {
    center: 'center',
    nextRoom: 'nextRoom'
  };

  /**
   * @returns {*}
   */
  Room.prototype.getDefaultOptions = function() {
    return _.merge(this.callParent(Entity, 'getDefaultOptions'), {
    });
  };

  Room.prototype.init = function(addToGame) {
    this.callParent(Entity, 'init', [addToGame]);

    this.initSockets();

    // React to player position changing
    window.reachedDestinationSignal.add(this.updateFlow, this);

    // React to hazards
    window.hazardDeactivated.add(this.hazardDone, this);
  };

  /**
   *
   */
  Room.prototype.initSockets = function() {
    // Top table
    //--------------
    var socket = new Socket(this.game, {
      offset: new Phaser.Point(555, 260),
      spriteKey: 'pedestal'
    });
    this.addSocket('topTable', socket);
    socket.init(this.sprite);
    socket.socketSprite.anchor.setTo(0.5, 0);

    // Right table
    //--------------
    socket = new Socket(this.game, {
      offset: new Phaser.Point(730, 260),
      spriteKey: 'pedestal'
    });
    this.addSocket('rightTable', socket);
    socket.init(this.sprite);
    socket.socketSprite.anchor.setTo(0.5, 0);

    // Bottom table
    //--------------
    socket = new Socket(this.game, {
      offset: new Phaser.Point(730, 372),
      spriteKey: 'pedestal'
    });
    this.addSocket('bottomTable', socket);
    socket.init(this.sprite);
    socket.socketSprite.anchor.setTo(0.5, 0);

    // Left table
    //--------------
    socket = new Socket(this.game, {
      offset: new Phaser.Point(553, 372),
      spriteKey: 'pedestal'
    });
    this.addSocket('leftTable', socket);
    socket.init(this.sprite);
    socket.socketSprite.anchor.setTo(0.5, 0);

  };

  /**
   * @param roomIndex
   */
  Room.prototype.initPosition = function(roomIndex) {
    this.sprite.position.x = roomIndex * 1280;

    this.entrance = new Phaser.Point(this.sprite.position.x, this.sprite.height / 2);
    this.center = new Phaser.Point(this.sprite.position.x + (this.sprite.width / 2), this.sprite.height / 2);
    this.exit = new Phaser.Point(this.sprite.position.x + this.sprite.width, this.sprite.height / 2);
  };

  /**
   *
   */
  Room.prototype.setHazards = function(hazards) {
    this.hazards = hazards;
  };

  /**
   * Activates the room
   */
  Room.prototype.activate = function() {
    this.active = true;
    window.roomActivatedSignal.dispatch(this);
  };

  /**
   * Deactivates the room
   */
  Room.prototype.deactivate = function() {
    this.active = false;
  };

  /**
   * This room was completed. We should move to the next one
   */
  Room.prototype.completeRoom = function() {
    window.roomCompletedSignal.dispatch(this);
  };

  /**
   *
   */
  Room.prototype.updateFlow = function(destinationName, destination, player) {
    this.player = player;

    if (!this.active) {
      return;
    }

    if (!this.runningState) {
      if (helper.almostEqual(destination.x, this.entrance.x, 5)) {
        // Player just entered the room, set up if necessary
      }
      if (destinationName === 'center') {
        // Player got to the middle, do hazard stuff
        this.doHazard();
      }

      if (helper.almostEqual(destination.x, this.exit.x, 5)) {
        // Player is going to the next room, deactivate this one.
        window.roomExitedSignal.dispatch(this);
      }
    }
  };

  /**
   *
   */
  Room.prototype.doHazard = function() {
    this.runningState = true;
    this.hazards[0].activate(this.player);
  };

  /**
   * @param hazard
   */
  Room.prototype.hazardDone = function(hazard) {
    if (this.active) {
      var index = this.hazards.indexOf(hazard);
      if (index !== -1) {
        this.hazards.splice(index, 1);
      }
      else {
        return;
      }

      if (this.hazards.length) {
        this.doHazard();
      }
      else {
        this.runningState = false;
        this.completeRoom();
      }
    }
  };

  /**
   *
   */
  Room.prototype.update = function() {
    this.callParent(Entity, 'update');
  };

  module.exports = Room;

}());
