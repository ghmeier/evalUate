/**
* Review.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
    schema:true,
    attributes: {
        message:{
            type:"string",
            required:true
        },
        class_id:{
            type:"int",
            required:true
        },
        workload:{
            type:"string"
        },
        helpfulness:{
            type:"int",
            defaultsTo:0,
            required:true
        }
    }
};

