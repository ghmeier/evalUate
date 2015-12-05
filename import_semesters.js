var request = require("request");
var fs = require("fs");

var departments_raw = fs.readFileSync("departments.json");
var departments = JSON.parse(departments_raw).departments;

request.post({
    headers:{"Content-Type":"application/json"},
    url:"http://evaluate-app.herokuapp.com/departments"
})

    for (i=0;i<sem_data.length;i++){
        var cur_sem = sem_data[i];

        departments.once("value",function(dep_raw){
            var dep_data = dep_raw.val();
            for (j=0;j<dep_data.length;j++){
                var cur_dep = dep_data[j];
                var id = this.id;

                request.post({
                    headers:{
                        'Content-Type':'application/json',
                        'Cookie':'__unam=8d177e0-14f95c0bda6-35b4b964-2; __utma=208037386.107618261.1436561173.1442556151.1445873627.7; __utmz=208037386.1445873627.7.4.utmcsr=provost.iastate.edu|utmccn=(referral)|utmcmd=referral|utmcct=/resources/model-docs; javascript=on; JSESSIONID=5BD6005320C826306CAAF0C09BE20358; _ga=GA1.2.107618261.1436561173; _gat=1'
                    },
                    url: "http://classes.iastate.edu/app/rest/courses/preferences",
                    json: {
                        "defSem":id,
                        "selectedTerm":id,
                        "selectedDepartment":cur_dep.abbreviation,
                        "startTime":"",
                        "stopTime":""
                    }
                },function(error,res,body){
                    if(error){
                        //console.log("ERROR: "+ error);
                        return;
                    }
                    var course_ref = fb_root.child(id);
                    var courses = body.response;

                    for (k=0;k<courses.length;k++){
                        course_ref.child(courses[k].id).set(courses[k]);
                        fb_root.child(courses[k].deptCode).child("3").child(courses[k].id).set(courses[k].id);
                    }
                });
            }
            return;
        },{id:cur_sem.id});
    }
});
