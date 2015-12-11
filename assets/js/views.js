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

var DepartmentListingView = Backbone.View.extend(
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

		$.get(app+"/class?deptCode="+department,function(data){
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

var CreateReviewView = Backbone.View.extend({
	events:{
		"click #review-submit":"submitReview"
	},
	el: "#create-review",
	template: _.template(document.getElementById("create-review-template").textContent),
	initialize: function(options,callback){
		this.departments = [];
		this.class_id = options.class_id;
		this.title = options.title;
		this.professors = options.professors;
		var self = this;

		$.get(app+"/get_professors/"+this.class_id,function(data){
			var profs = data.data;
			self.professors = [];
			for (i=0;i<profs.length;i++){
				if (profs[i] && profs[i] !== "" && _.intersection(self.professors,[profs[i]]).length == 0){

				    var lowered =  profs[i].replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
				    var split = lowered.split(" ");
				    var lastName = split[0];
				    lowered = split.splice(0,1,).join(" ")+lastName.
					self.professors.push(lowered);
				}
			}
			//self.render();
			callback(self);
		});
	},
	render:function(){
		this.$el.empty().append(this.template({title:this.title,professors:this.professors}));
		$('select').material_select();
		return this;
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