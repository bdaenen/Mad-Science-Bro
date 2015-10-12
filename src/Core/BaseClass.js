(function() {
    'use strict';

    /**
     * Basic class prototype
     * @constructor
     * @class BaseClass
     */
    var BaseClass = function(options) {
        var _ = require('lodash');
        options = options || {};
        this.options = _.merge(this.getDefaultOptions(), options);
    };

    /**
     * Get the default options. Overwrite for any subclass. Don't forget to callParent.
     * @returns {Object}
     */
    BaseClass.prototype.getDefaultOptions = function() {
        return {
        }
    };

    /**
     * Calls a parent function
     * @param {BaseClass} parent
     * @param {string} functionName
     * @param {Array} [args]
     * @param {BaseClass} [thisArg = this]
     * @returns {null}
     */
    BaseClass.prototype.callParent = function (parent, functionName, args, thisArg) {
        thisArg = thisArg || this;
        if (!parent.prototype[functionName]) {
            console.debug(parent.prototype);
            console.warn('bad parent call:', functionName);
            return null;
        }

        return parent.prototype[functionName].apply(thisArg, args);
    };

    /**
     * Export for Browserify
     * @type {Function}
     */
    module.exports = BaseClass;
}());