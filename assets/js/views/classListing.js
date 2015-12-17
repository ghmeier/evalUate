define([
    'jquery',
    'underscore',
    'backbone',
    'models/classCollection',
    'models/class',
    'views/reviews',
    'models/review',
    'models/reviewCollection'
    ],function($,_,Backbone,ClassCollection,Class,ReviewsView,Review,ReviewsCollection){
        var classListingView = Backbone.View.extend({
            events:{
                "click .class-item":"getReviews",
                'keyup #search-class':"searchClassListing"
            },
            el: "#courses",
            template: _.template(document.getElementById("class-listing").textContent),
            initialize: function(options){
                var courses = new ClassCollection();
                _.chain(options.courses)
                .sortBy(function(course){
                    return parseInt(course.classNumber.replace(/[A-Za-z]/g,""));
                })
                .each(function(course){
                    courses.add(new Class(course));
                });

                this.courses = courses;
                this.title = options.deptTitle;
                this.render();
            },
            render: function() {
                this.$el.html(this.template({query:"",title:this.title,courses:this.courses.models}));
                return this;
            },
            getReviews:function(e) {
                var element = $(e.target).closest('.collection-item');

                var class_id = $(element).data("course");
                var name = $(element).find(".course-name").text();
                var self = this;

                $.get(app+"/get_reviews/"+class_id,function(data){
                    self.reviews = new ReviewsCollection();

                    for (i=0;i<data.data.length;i++){
                        var review = new Review(data.data[i]);
                        self.reviews.add(review);
                    }

                    if (!self.reviewsView){
                        self.reviewsView = new ReviewsView({class_id:class_id,title:name,reviews:self.reviews});
                    }else{
                        self.reviewsView.initialize({class_id:class_id,title:name,reviews:self.reviews});
                    }
                    self.reviewsView.setElement("#reviews").render();
                });
            },
            searchClassListing:function(e){
                var query = $(e.target).val().toString();

                var filtered = _.filter(this.courses.models,function(model){
                    var x = model.get("deptCode")+" "+model.get("classNumber");
                    return x.indexOf(query.toUpperCase()) >= 0 || x.replace(" ","").indexOf(query.toUpperCase()) >= 0;
                });

                this.$el.html(this.template({query:query,title:this.title,courses: filtered}));

                $("#search-class").focus(function(){
                  this.selectionStart = this.selectionEnd = this.value.length;
                });
                $("#search-class").focus();
            },
            cleanup: function() {
                this.stopListening();
                this.$el.empty();
                this.unbind();
                this.courses.reset();
                if (this.reviewsView){
                    this.reviewsView.cleanup();
                }
            }
        });

        return classListingView;
    });