/**
 * ReviewController
 *
 * @description :: Server-side logic for managing reviews
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    get_reviews:function(req,res){
        var class_id = req.params.class_id;

        Review.find({"class_id":class_id}).sort("helpfulness DESC").sort("createdAt DESC").exec(function(err,found){
            res.json({data:found});
        });
    }
};

