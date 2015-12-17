define([
    'jquery',
    'underscore',
    'backbone',
    'https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.1/js/materialize.min.js'
    ],
    function($,_,Backbone,Materialize){

        var createReviewView = Backbone.View.extend({
            events:{
                "click #review-submit":"submitReview",
                "change #prof":"checkProf"
            },
            el: "#create-review",
            template: _.template(document.getElementById("create-review-template").textContent),
            initialize: function(options,callback){
                this.departments = [];
                this.class_id = options.class_id;
                this.title = options.title;
                this.professors = options.professors;
                var self = this;

                $.get(app+"/get_professors/"+this.class_id,function(data){
                    var profs = data.data;
                    var profs_raw = [];
                    self.professors = [];
                    for (i=0;i<profs.length;i++){
                        if (profs[i] && profs[i] !== "" && _.intersection(profs_raw,[profs[i]]).length == 0){
                            var lowered =  profs[i].replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
                            var split = lowered.split(" ");
                            var lastName = split[0];

                            lowered = split.splice(1,2).join(" ")+" "+lastName;
                            self.professors.push(lowered);
                            profs_raw.push(profs[i]);
                        }
                    }
                    callback(self);
                });
            },
            render:function(){
                this.$el.empty().append(this.template({title:this.title,professors:this.professors}));
                $('select').material_select();
                return this;
            },
            submitReview:function(e){
                var prof = $("#prof").val();
                if (prof === "custom"){
                    prof = $("#prof-last").val();
                    if ($("#prof-first").val() && $("#prof-first").val()!= ""){
                        prof += ", " +$("#prof-first").val();
                    }
                }

                var review = $("#review").val();
                var workload = $("#workload").val();
                var self = this;
                $('#create-review').closeModal();
                $.post(app+"/review",{professor:prof,message:review,workload:workload,class_id:this.class_id,helpfulness:1},function(data){
                    self.trigger("addedReview",data);

                    self.cleanup();
                });

            },
            checkProf:function(e){
                var prof = $(e.target).val();

                if (prof === "custom"){
                    $(".add-prof").show();
                }else{
                    $(".add-prof").hide();
                }
            },
            cleanup: function() {
                $(this.el).off('click', "#review-submit");
                this.$el.empty();
                this.unbind();
            }
        });

        return createReviewView;

    });