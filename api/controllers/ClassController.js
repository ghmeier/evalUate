/**
 * ClassController
 *
 * @description :: Server-side logic for managing classes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	get_classes:function(req,res){
        if (!req.params.deptCode){
            res.json({data:[]});
            return;
        }

        var deptCode = req.params.deptCode;
        Class.find({"deptCode":deptCode}).exec(function (err, found){
            var courseNames = [];

            for (i=0;i<found.length;i++){
                courseNames.push(found[i].classNumber);
            }

            res.json({data:courseNames});
        });
    },

    get_all_classes:function(req,res){
        if (!req.params.deptCode){
            res.json({data:[]});
            return;
        }

        var deptCode = req.query.deptCode;
        Class.find({deptCode:deptCode }).exec(function(err,found){

            res.json(found);
        });
    },

    get_professor:function(req,res){
        if (!req.params.class_id){
            res.json({data:[]});
            return;
        }

        var class_id = req.params.class_id || "";

        Class.find({class_id:class_id}).exec(function (err,found){
            var course = found[0];
            var instructors = [];

            for (i=0;i<course.sections.length;i++){
                var section = course.sections[i];
                for(j=0;j<section.sectionTimes.length;j++){
                    instructors.push(section.sectionTimes[j].instrName);
                }
            }

            res.json({data:instructors});
        });
    }
};

