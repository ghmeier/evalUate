define([
    'backbone'
    ],
    function(Backbone){
        var classModel = Backbone.Model.extend({
            initialize: function(data){
                this.set(data);
            }
        });

        return classModel;

    });