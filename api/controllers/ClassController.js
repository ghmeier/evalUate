/**
 * ClassController
 *
 * @description :: Server-side logic for managing classes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	get_classes:function(req,res){
        var deptCode = req.params.deptCode;
        Class.find({"deptCode":deptCode}).exec(function (err, found){
            var courseNames = [];

            for (i=0;i<found.length;i++){
                courseNames.push(found[i].classNumber);
            }

            res.json({data:courseNames});
        });
    },

    get_professor:function(req,res){
        var class_id = req.params.class_id;

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

