(function() {
    'use strict';

    var BaseClass = require('Core/BaseClass');
    var helper = require('Core/helper');

    /**
     * Game with all the necessary methods
     * @param options
     * @constructor
     * @class BaseComponent
     * @extends BaseClass
     *
     */
    var BaseComponent = function(options) {
        this.callParent(BaseClass, 'constructor', [options]);
    };

    /**
     * Extend the BaseClass from the BaseClass
     */
    helper.extendClass(BaseComponent, BaseClass);

    /**
     *
     */
    BaseComponent.prototype.init = function() {
    };

    /**
     * Handle input and update speed
     */
    BaseComponent.prototype.update = function() {
    };

    /**
     * Export for Browserify
     * @type {Function}
     */
    module.exports = BaseComponent;

}());
