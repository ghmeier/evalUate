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
    }
};

