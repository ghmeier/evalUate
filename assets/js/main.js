/***************************************************************************************
 *
 * main.js
 * This file sets up require.js paths and initializes our application
 *
 ****************************************************************************************/

'use strict';

//Temporary...to make console.log work in IE.
window.log = function () {
    log.history = log.history || [];
    log.history.push(arguments);
    if (this.console) {
        console.log(Array.prototype.slice.call(arguments));
    }
};
if(typeof console === "undefined") {
    console = { log: function() { } };
}


require.config({
    waitSeconds:20,
    shim: {
        backbone: {
            exports:"backbone"
        },
        jquery: {
            exports:"jquery"
        }
    },
    paths: {
        jquery: '//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min',
        //templates: '../templates',
        backbone: '//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.2.3/backbone-min',
        underscore: '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min',
        hammerjs:'./dependencies/hammerjs'
    }
});

require([
    'app'
], function (App) {
    App.initialize();
});