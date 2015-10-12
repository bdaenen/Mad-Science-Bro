(function(Phaser) {

  var BaseClass = require('Core/BaseClass');
  var helper = require('Core/helper');

  /**
   * Wrapper around addChild behaviour with offsets
   * @param {Phaser.Game} game
   * @param options
   * @constructor
   * @class Socket
   * @extends BaseClass
   */
  var Socket = function(game, options) {
    this.callParent(BaseClass, 'constructor', [options]);
    this.game = game;
    this.socketSprite = this.options.sprite || null;
    this.entity = null;
    this.parentSprite = null;
  };

  helper.extendClass(Socket, BaseClass);

  /**
   * @returns {Object}
   */
  Socket.prototype.getDefaultOptions = function() {
    return {
      offset: new Phaser.Point(10, 10),
      spriteKey: null,
      spriteFrame: null
    };
  };

  /**
   *
   */
  Socket.prototype.init = function(rootSprite) {
    this.parentSprite = rootSprite;
    if (!this.socketSprite) {
      this.socketSprite = this.game.make.sprite(this.options.offset.x, this.options.offset.y, this.options.spriteKey, this.options.spriteFrame);
    }

    this.parentSprite.addChild(this.socketSprite);
    this.socketSprite.anchor.setTo(0.5, 0.5);
    this.socketSprite.x = this.options.offset.x;
    this.socketSprite.y = this.options.offset.y;
  };

  /**
   * Add an entity into a socket
   * @param {Entity} entity
   * @param {Phaser.Point} [offset]
   */
  Socket.prototype.setEntity = function(entity, offset) {
    this.entity = entity;
    this.socketSprite.addChild(entity.sprite);
    entity.sprite.anchor.setTo(0.5, 0.5);
    if (offset) {
      entity.sprite.x = offset.x;
      entity.sprite.y = offset.y;
    }
  };

  /**
   * Remove an entity from a socket
   */
  Socket.prototype.empty = function() {
    this.entity = null;
    this.socketSprite.removeChild(entity.sprite);
  };

  Socket.prototype.update = function() {
  };

  module.exports = Socket;

}(window.Phaser));
