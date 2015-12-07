var request = require("request");
var fs = require("fs");

var departments_raw = fs.readFileSync("departments.json");
var departments = JSON.parse(departments_raw).departments;

for (i=0;i<departments.length;i++){
    var current = departments[i];
    current["dep_id"] = current.id;
    current.id = null;
    request.post({
        headers:{"Content-Type":"application/json"},
        url:"http://evaluate-app.herokuapp.com/department",
        json:current
    },function(err,res,body){
        if (err){
            console.log(err);
            return;
        }

        var department = body;
        request.post({
            headers:{
                'Content-Type':'application/json',
                'Cookie':'__unam=8d177e0-14f95c0bda6-35b4b964-2; __utma=208037386.107618261.1436561173.1442556151.1445873627.7; __utmz=208037386.1445873627.7.4.utmcsr=provost.iastate.edu|utmccn=(referral)|utmcmd=referral|utmcct=/resources/model-docs; javascript=on; JSESSIONID=5BD6005320C826306CAAF0C09BE20358; _ga=GA1.2.107618261.1436561173; _gat=1'
            },
            url: "http://classes.iastate.edu/app/rest/courses/preferences",
            json: {
                "defSem":3,
                "selectedTerm":3,
                "selectedDepartment":department.abbreviation,
                "startTime":"",
                "stopTime":""
            }
        },function(error,response,bdy){
            if(error){
                        //console.log("ERROR: "+ error);
                return;
            }
            if (!bdy){
                return;
            }

            var courses = bdy.response;
            for (k=0;k<courses.length;k++){
                var course = courses[k];
                course['class_id'] = course.id;
                course.id = null;

                request.post({
                    headers:{"Content-Type":"application/json"},
                    url:"http://localhost:1337/class",
                    json:course
                },function(err,res,body){
                    var raw = body;

                    console.log("Added course "+raw.class_id);
                });
            }
        });
    });
}
/*
    for (i=0;i<sem_data.length;i++){
        var cur_sem = sem_data[i];

        departments.once("value",function(dep_raw){
            var dep_data = dep_raw.val();
            for (j=0;j<dep_data.length;j++){
                var cur_dep = dep_data[j];
                var id = this.id;

                });
            }
            return;
        },{id:cur_sem.id});
    }
});
*/