define([
    'jquery',
    'underscore',
    'backbone',
    'router',
    'views/departmentListing'
    ],
    function($,_,Backbone,Router,DepartmentListingView){

        var Application = {
        initialize: function () {
            var self = this;

            //start the backbone history opbject
            Backbone.history.start();

            //initialize foundation JS
            $(document).ready(function() {

                    $.get(app + "/department", function(data)
                    {
                        var depts = [];
                        for(var id in data)
                        {
                            depts.push(data[id].abbreviation);
                        }

                        var deptsView = new DepartmentListingView({depts: depts});
                    });
            });
        }

        }

        return Application;
    });