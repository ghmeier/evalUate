var app = "http://evaluate-app.herokuapp.com";

$(document).ready(function()
{
	//Get the department listings
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