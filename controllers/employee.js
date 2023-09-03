const Employee = require("../models/employee");
const Ticket = require("../models/ticket");

function handleEmployeeSendLoginPage(req,res){
    if(req.session.employeeIsLoggedIn){
        return res.redirect("/employee/dashboard");
    }
    res.render("employeeLogin");
}

function handleEmployeeSendHomePage(req,res){
    if(req.session.employeeIsLoggedIn){
        return res.redirect("/employee/dashboard");
    }
    res.render("/");
}

async function handleEmployeeLogin(req,res){
    try {
        const employee = await Employee.findOne({
            email : req.body.trim().toLowerCase(),
            password : req.bosy.password,
        });
        console.log("employee : ",employee);
        if(!employee){
            return res.render("employeeLogin",{
                message : "Incorrect usernname or password...",
            });

            req.session.employeeIsLoggedIn = true;
            req.session.email = employee.email;
            req.session.name = employee.name;
            req.session.department = employee.department;

            res.redirect("/employee/dashboard");

        }
    } catch (error) {
        console.log("Error in login Employee : ",error );
    }
}

async function handleEmployeeDashboard(req,res){
    try {
        if(!req.session.employeeIsLoggedIn){
            return res.redirect("/employee/login");
        }
        const tickets = await Ticket.find({ assignedTo: req.session.department });
        res.render("employeeDashboard", {tickets,employeeName: req.session.name,
                        departments: ["Customer", "IT", "Sales", "HR", "Finance", "Marketing"],
        });
    } catch (error) {
        console.log("Error in Employee dashboard : ",error );
    }
}

async function handleEmployeeLogout(req,res){
    if (!req.session.employeeIsLoggedIn) {
        return res.redirect("/employee/login");
    }
    req.session.employeeIsLoggedIn = false;
    req.session.email = "";
    req.session.name = "";
    req.session.department = "";
    res.redirect("/");
}

module.exports = {
    handleEmployeeLogout,
    handleEmployeeDashboard,
    handleEmployeeLogin,
    handleEmployeeSendHomePage,
    handleEmployeeSendLoginPage,
    
}