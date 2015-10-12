(function() {
  'use strict';

  /**
   * @returns {*}
   */
  Phaser.Sprite.prototype.getEntity = function() {
    return this.__custom_entity;
  };
}());
