/**
* Semester.js
*
*/

module.exports = {
    schema:true,
    connection:"mongo",
    attributes: {
        code:{
            type:"int",
            required:true
        },
        current:{
            type:"string"
        },
        id:{
            type:"int",
            required:true
        },
        semNum:{
            type:"int",
            required:true
        },
        semesterName:{
            type:"string",
            required:true
        },
        semesterTitle:{
            type:"string",
            required:true
        },
        shortYear:{
            type:"string"
        },
        year:{
            type:"string"
        }
    }
};

