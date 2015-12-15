var request = require("request");
var fs = require("fs");

var departments_raw = fs.readFileSync("departments.json");
var departments = JSON.parse(departments_raw).departments;

for (i=0;i<departments.length;i++){
    var current = departments[i];
    current["dep_id"] = current.id;
    current.id = null;
    console.log("Department "+i);
    request.get("https://evaluate-app.herokuapp.com/department?dep_id="+current["dep_id"],function(err,res,body){
        if (err){
            console.log(err);
            return;
        }

        var department = JSON.parse(body)[0];
        request.post({
            headers:{
                'Content-Type':'application/json',
                'Cookie':'__unam=8d177e0-14f95c0bda6-35b4b964-2; __utma=208037386.107618261.1436561173.1442556151.1445873627.7; __utmz=208037386.1445873627.7.4.utmcsr=provost.iastate.edu|utmccn=(referral)|utmcmd=referral|utmcct=/resources/model-docs; javascript=on; JSESSIONID=5BD6005320C826306CAAF0C09BE20358; _ga=GA1.2.107618261.1436561173; _gat=1'
            },
            url: "http://classes.iastate.edu/app/rest/courses/preferences",
            json: {
                "defSem":2,
                "selectedTerm":"1",
                "selectedDepartment":department.abbreviation,
                "startTime":"",
                "stopTime":""
            }
        },function(error,response,bdy){
            if(error){
                return;
            }
            if (!bdy){
                return;
            }

            var courses = bdy.response;

            for (k=0;k<courses.length;k++){
                var course = courses[k];
                course['class_id'] = course.id;
                delete course.id;

                        request.post({
                            headers:{"Content-Type":"application/json"},
                            url:"http://evaluate-app.herokuapp.com/class",
                            json:course
                        },function(c_err,c_res,c_body){
                            if (c_err){
                                console.log(c_err);
                                return;
                            }

                            var raw = c_body;
                            if (raw){
                                console.log(raw.deptCode + " "+raw.classNumber);
                            }
                        });
            }
        });
    });
}