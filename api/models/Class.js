/**
* Class.js
*
*/

module.exports = {
    schema:true,
    connection:"mongo",
    attributes: {
        catalogUrl:{
            type:"string"
        },
        classComments:{
            type:"string"
        },
        classNumber:{
            type:"string"
        },
        classPreReqs:{
            type:"string"
        },
        classTitle:{
            type:"string"
        },
        codeLink:{
            type:"string"
        },
        countSectionsSelected:{
            type:"int"
        },
        creditHigh:{
            type:"int"
        },
        creditLow:{
            type:"int"
        },
        creditType:{
            type:"string"
        },
        departmentTitle:{
            type:"string"
        },
        deptCode:{
            type:"string"
        },
        dvstyIntlDisplay:{
            type:"string"
        },
        edition:{
            type:"string"
        },
        gradeType:{
            type:"string"
        },
        class_id:{
            type:"int",
            required:true,
            unique:true
        },
        sections:{
            type:"array"
        },
        semesterCode:{
            type:"string"
        },
        semesterId:{
            type:"int"
        },
        semesterYear:{
            type:"string"
        }
    }
};

