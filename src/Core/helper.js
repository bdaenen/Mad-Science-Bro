(function() {
    'use strict';
    var _ = require('lodash');

    module.exports = {
        // I'm a wizard
        extendClass: function (childConstructor, parentConstructor) {
            var mergedProto = arguments[1].prototype;
            for (var i = 2; i < arguments.length; i++) {
                mergedProto = _.merge(mergedProto, arguments[i].prototype);
            }
            childConstructor.prototype = Object.create(mergedProto);
            childConstructor.prototype.constructor = childConstructor;
        },
        almostEqual: function (a, b, maxDiff) {
            return Math.abs(a - b) <= maxDiff;
        },
        randBetween: function(min, max) {
            return Math.floor(Math.random() * max) + min;
        }
    };
}());
