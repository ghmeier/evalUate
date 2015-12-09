/**
 * DepartmentController
 *
 * @description :: Server-side logic for managing departments
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	get_departments:function(req,res){
        Department.find({}).exec(function (err, found){
            var deptCodes = [];

            for (i=0;i<found.length;i++){
                deptCodes.push(found[i].abbreviation);
            }

            res.json({data:deptCodes});
        });
    }
};

