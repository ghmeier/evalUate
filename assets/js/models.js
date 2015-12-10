var Review = Backbone.Model.extend({
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

var Class = Backbone.Model.extend({
	initialize: function(data){
		this.set(data);
	}
});

var ReviewsCollection = Backbone.Collection.extend({
	model: Review
});

var ClassCollection = Backbone.Collection.extend({
	model: Class
});