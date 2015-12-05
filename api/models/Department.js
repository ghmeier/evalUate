/**
* Department.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
    schema:true,
    connection:"mongo",
  attributes: {
    dep_id:{
        type:"int",
        required:true,
        unique:true
    },
    title:{
        type:"string",
        required:true
    },
    abbreviation:{
        type:"string",
        required:true
    }
  }
};

