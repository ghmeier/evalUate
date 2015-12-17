define(["backbone"],
    function(Backbone) {
      return Backbone.Router.extend({
        routes: {
          '/:deptCode': 'openDepartment',
          '/:deptCode/:courseId':'openCourse',
          '/:deptCode/:courseId/:reviewId':'openReview'
        },

        initialize: function() {

        },
        openCourse: function(deptCode) {

        },
        openDepartment: function(deptCode,courseId){

        },

        openReview: function(deptCode,courseId,reviewId){

        }
      });
});