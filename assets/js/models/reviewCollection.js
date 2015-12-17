define([
    'backbone',
    'models/review'
    ],
    function(Backbone,Review){
        var reviewsCollection = Backbone.Collection.extend({
            model: Review
        });

        return reviewsCollection;

    });