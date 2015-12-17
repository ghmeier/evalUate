define([
    "backbone"
    ],
    function(Backbone){

        var review = Backbone.Model.extend({
            defaults:
            {
                message: "",
                class_id: "",
                workload: "",
                helpfulness: 0,
                createdAt:""
            },
            initialize: function(data)
            {
                this.createdAt = (new Date(data.createdAt)).toDateString();
            }
        });

        return review;

    });