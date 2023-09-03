const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
    Name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    departname:{
        type:String,
        required:true,
    },
});

const Employee = new mongoose.model("Employee",employeeSchema);

module.exports = {
    Employee,
};