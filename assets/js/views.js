var app = "https://evaluate-app.herokuapp.com";

var ReviewsView = Backbone.View.extend(
{
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
		this.render();
	},
	render: function()
	{
		this.$el.html(this.template({title:this.title,reviews: this.reviews}));
		$('.modal-trigger').leanModal();
		return this;
	},
	renderCreateReview: function(){
		this.createView = new CreateReviewView({class_id:this.class_id,title:this.title});
		this.createView.on("addedReview",this.addReview,this);
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

		value--;
		$.get(app+"/Review/update/"+id+"?helpfulness="+value,function(data){
			$(e.target).closest(".card-action").find(".badge").text(data.helpfulness+" helpfulness");
		});
	}
});

var ClassListingView = Backbone.View.extend({
	events:{
		"click .collection-item":"getReviews"
	},
	el: "#courses",
	template: _.template(document.getElementById("class-listing").textContent),
	initialize: function(options){
		var courses = new ClassCollection();

		_.each(options.courses,function(course){
			courses.add(new Class(course));
		});
		this.courses = courses;
		this.title = options.deptTitle;
		this.render();
	},
	render: function() {
		this.$el.html(this.template({title:this.title,courses:this.courses}));
		return this;
	},
	getReviews:function(e) {
		var element = $(e.target).closest('.collection-item');

		var class_id = $(element).data("course");
		var name = $(element).find(".course-name").text();
		var self = this;

		if (self.reviewsView){
			self.reviewsView.cleanup();
		}

		$.get(app+"/get_reviews/"+class_id,function(data){
			self.reviews = new ReviewsCollection();

			for (i=0;i<data.data.length;i++){
				var review = new Review(data.data[i]);
				self.reviews.add(review);
			}
			self.reviewsView = new ReviewsView({class_id:class_id,title:name,reviews:self.reviews});
		});
	},
	cleanup: function() {
		console.log("clearing-course");
		this.stopListening();
		this.$el.empty();
	    this.unbind();
	    this.courses.reset();
	    if (this.reviewsView){
	    	this.reviewsView.cleanup();
	    }
	}
});

var DepartmentListingView = Backbone.View.extend(
{
	events:{
		"click .department_listing":"getCourses"
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
		this.$el.html(this.template({departments: this.depts}));
		return this;
	},
	getCourses: function(e){
		var department = $(e.target).closest(".department_listing").data("dept");
		this.department = department;
		var self = this;

		if (this.classView){
			this.classView.cleanup();
		}


		$.get(app+"/class?deptCode="+department,function(data){
			var classView = new ClassListingView({deptTitle:department,courses: data});
			self.classView = classView;
			$(".department-sidebar").sideNav("hide");
		});
	},
	cleanup: function() {
	  this.$el.empty();
	  this.unbind();
	  this.classView.cleanup();
	}
});

var CreateReviewView = Backbone.View.extend({
	events:{
		"click #review-submit":"submitReview"
	},
	el: "#create-review",
	template: _.template(document.getElementById("create-review-template").textContent),
	initialize: function(options){

		this.departments = [];
		this.class_id = options.class_id;
		this.title = options.title;
		this.professors = options.professors;
		var self = this;

		$.get(app+"/get_professors/"+this.class_id,function(data){
			self.professors= data.data;
			self.render();
		});
	},
	render:function(){

		this.$el.html(this.template({title:this.title,professors:this.professors}));
		$('select').material_select();
	},
	submitReview:function(e){
		var prof = $("#prof").val();
		var review = $("#review").val();
		var workload = $("#workload").val();
		var self = this;
		$('#create-review').closeModal();
		$.post(app+"/review",{professor:prof,message:review,workload:workload,class_id:this.class_id,helpfulness:1},function(data){
			self.trigger("addedReview",data);

			self.cleanup();
		});

	},
	cleanup: function() {
		$(this.el).off('click', "#review-submit");
		this.$el.empty();
		this.unbind();
	}
});