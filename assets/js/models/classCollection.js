define([
    'backbone',
    'models/class'
    ],
    function(Backbone,Class){

        var classCollection = Backbone.Collection.extend({
            model: Class
        });
        return classCollection;

    })