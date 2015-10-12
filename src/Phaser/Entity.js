(function() {

  var BaseClass = require('Core/BaseClass');
  var Socket = require('Phaser/Socket');
  var helper = require('Core/helper');

  /**
   * Entity containing a Phaser sprite
   * @param {Phaser.Game} game
   * @param options
   * @class Entity
   * @constructor
   * @extends BaseClass
   */
  var Entity = function(game, options) {
    this.callParent(BaseClass, 'constructor', [options]);
    this.game = game;
    this.isPhysicsEnabled = false;
    this.name = '';

    if (this.options.sprite) {
      this.sprite = this.options.sprite;
    } else {
      this.sprite = null;
    }

    if (!this.options.sockets) {
      this.sockets = {};
    }
  };

  helper.extendClass(Entity, BaseClass);

  Entity.prototype.getDefaultOptions = function() {
    return {
      sockets: null,
      spriteKey: 'placeholder'
    };
  };

  /**
   *
   */
  Entity.prototype.init = function(addToGame) {
    if (!this.sprite) {
      this.initSprite(addToGame);
    }
    this.createComponents();
    this.sprite.events.onDestroy.addOnce(this.destroy, this);
  };

  /**
   *
   */
  Entity.prototype.destroy = function() {
    this.game = null;
    this.isPhysicsEnabled = null;
    this.name = null;
    this.options = null;
    this.sprite = null;
    this.sockets = null;
  };

  /**
   * @param {boolean} [addToGame]
   */
  Entity.prototype.initSprite = function(addToGame) {
    var sprite;
    addToGame = addToGame === undefined ? false : addToGame;
    if (!addToGame) {
      sprite = this.game.make.sprite(0, 0, this.options.spriteKey);
    }
    else {
      sprite = this.game.add.sprite(0, 0, this.options.spriteKey);
    }

    this.sprite = sprite;
  };

  /**
   * Create all the components this entity needs
   */
  Entity.prototype.createComponents = function() {
  };

  /**
   * Enables physics of the given type on this entity
   */
  Entity.prototype.enablePhysics = function() {
    this.game.physics.arcade.enable(this.sprite);
    this.isPhysicsEnabled = true;
    this.body.collideWorldBounds = true;
  };

  /**
   * Add a socket to the sprite
   * @param {String} name
   * @param {Socket} socket
   */
  Entity.prototype.addSocket = function(name, socket) {
    this.sockets[name] = socket;
  };

  /**
   * Remove a socket from the sprite
   * @param {String} name
   */
  Entity.prototype.removeSocket = function(name) {
    this.sockets[name] = null;
    delete this.sockets[name];
  };

  /**
   * Add an entity into a socket
   * @param {String} name
   * @param {Entity} entity
   * @param {Phaser.Point} [offset]
   */
  Entity.prototype.addToSocket = function(name, entity, offset) {
    this.sockets[name].setEntity(entity, offset);
  };

  /**
   * Remove an entity from a socket
   * @param {String} name
   */
  Entity.prototype.removeFromSocket = function(name) {
    this.sockets[name].empty();
  };

  /**
   * Update
   */
  Entity.prototype.update = function() {
    var socketKeys = Object.keys(this.sockets);
    for (var i = 0, l = socketKeys.length; i < l; i++) {
      this.sockets[socketKeys[i]].update();
    }
  };

  /**
   * @param key
   */
  Entity.prototype.playAnimation = function(key) {
    return this.sprite.animations.play(key);
  };

  /**
   * Abstract the velocity of the sprite's body.
   */
  Object.defineProperty(Entity.prototype, 'velocity', {
    get: function() {
      return this.sprite.body.velocity;
    }
  });

  /**
   * Abstract the velocity of the sprite's body.
   */
  Object.defineProperty(Entity.prototype, 'position', {
    get: function() {
      if (this.sprite.body) {
        return this.sprite.body.position;
      }
      return this.sprite.position;
    }
  });

  /**
   * Make Body and Sprite seem separate.
   */
  Object.defineProperty(Entity.prototype, 'body', {
    get: function() {
      return this.sprite.body;
    }
  });

  /**
   * Abstract the drag of the sprite's body.
   */
  Object.defineProperty(Entity.prototype, 'drag', {
    get: function() {
      return this.sprite.body.drag;
    }
  });

  module.exports = Entity;

}());
