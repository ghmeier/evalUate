define([
    'jquery',
    'underscore',
    'backbone',
    'views/classListing'
    ],
    function($,_,Backbone,ClassListingView){
        var departmentListingView = Backbone.View.extend(
        {
            events:{
                "click .department_listing":"getCourses",
                'keyup #search':"searchDepartments"
            },
            el: "#departments-sidebar",
            template: _.template(document.getElementById("department-sidebar-template").textContent),
            initialize: function(options)
            {

                this.depts = options.depts;
                this.render();
            },
            render: function()
            {
                this.$el.html(this.template({query:"",departments: this.depts}));
                return this;
            },
            getCourses: function(e){
                var department = $(e.target).closest(".department_listing").data("dept");
                this.department = department;
                var self = this;

                $.get(app+"/get_all_classes?deptCode="+department,function(data){
                    if (!self.classView){
                        self.classView = new ClassListingView({deptTitle:department,courses: data});
                    }else{
                        self.classView.initialize({deptTitle:department,courses:data});
                    }

                    $(".department-sidebar").sideNav("hide");
                });
            },
            searchDepartments:function(e){
                var query = $(e.target).val();

                var filtered = _.filter(this.depts,function(x){
                    return x.indexOf(query.toUpperCase()) == 0 || x.replace(" ","").indexOf(query.toUpperCase()) == 0;
                });

                this.$el.html(this.template({query:query,departments: filtered}));

                $("#search").focus(function(){
                  this.selectionStart = this.selectionEnd = this.value.length;
                });
                $("#search").focus();
            },
            cleanup: function() {
              this.$el.empty();
              this.unbind();
              this.classView.cleanup();
            }
        });

        return departmentListingView;

});