define([
    'jquery',
    'underscore',
    'backbone',
    'models/review',
    'views/createReview'
    ],
    function($,_,Backbone,Review,CreateReviewView){

        var reviewsView = Backbone.View.extend({
            events:{
                "click .modal-trigger":"renderCreateReview",
                'click .downvote':"downVote",
                'click .upvote':"upVote"
            },
            el: "#reviews",
            template: _.template(document.getElementById("review-template").textContent),
            initialize: function(options)
            {
                this.class_id = options.class_id;
                this.title = options.title;
                this.reviews = options.reviews;
            },
            render: function(){
                this.$el.html(this.template({title:this.title,reviews: this.reviews}));
                if (!this.createView){
                    this.createView = new CreateReviewView({class_id:this.class_id,title:this.title},function(view){
                        view.setElement("#create-review").render();
                    });
                    this.createView.on("addedReview",this.addReview,this);
                }else{
                    this.createView.initialize({class_id:this.class_id,title:this.title},function(view){
                        view.setElement("#create-review").render();
                    });
                }
                return this;
            },
            renderCreateReview:function(){
                $('#create-review').openModal();
            },
            addReview: function(data){
                var view = new Review(data);
                this.reviews.add(view);
                this.$el.html(this.template({title:this.title,reviews:this.reviews}));
            },
            cleanup: function() {
                this.stopListening()
                this.$el.empty();
                this.unbind();
                this.reviews.reset();
                $(this.el).off('click', '.modal-trigger');
                $(this.el).off('click', '.downvote');
                $(this.el).off('click', '.upvote');
                if (this.createView){
                    this.createView.off('addReview');
                    this.createView.cleanup();
                }
            },
            upVote:function(e){
                var value = parseInt($(e.target).closest(".card-action").find(".badge").text().replace(" helpfulness",""));
                var id = $(e.target).closest(".card-action").data("review");

                value++;
                $.get(app+"/Review/update/"+id+"?helpfulness="+value,function(data){
                    $(e.target).closest(".card-action").find(".badge").text(data.helpfulness+" helpfulness");
                });
            },
            downVote:function(e){
                var value = parseInt($(e.target).closest('.card-action').find(".badge").text().replace(" helpfulness",""));
                var id = $(e.target).closest(".card-action").data("review");

                value--;
                $.get(app+"/Review/update/"+id+"?helpfulness="+value,function(data){
                    $(e.target).closest(".card-action").find(".badge").text(data.helpfulness+" helpfulness");
                });
            }
        });

        return reviewsView;
    });