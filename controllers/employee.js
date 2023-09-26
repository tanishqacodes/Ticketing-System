const { Employee } = require("../models/employee");
const { Ticket }  = require("../models/ticket");

function handleEmployeeSendLoginPage(req, res) {
    if (req.session.employeeIsLoggedIn) {
        return res.redirect("/employee/dashboard");
    }
    res.render("employeeLogin");
}
function handleEmployeeSendSignupPage(req, res) {
    if (req.session.isLoggedIn) {
        return res.redirect("/employee/dashboard");
    }
    res.render("employeeSignup");
}

function handleEmployeeSendHomePage(req, res) {
    if (req.session.employeeIsLoggedIn) {
        return res.redirect("/employee/dashboard");
    }
    res.render("/");
}

async function handleEmployeeLogin(req, res) {
    try {
        const employee = await Employee.findOne({
            email: req.body.email.trim().toLowerCase(),
            password: req.body.password,
        });

        console.log("employee : ", employee);

        if (!employee) {
            return res.render("employeeLogin", {
                message: "Incorrect usernname or password...",
            });
        }
        req.session.employeeIsLoggedIn = true;
        req.session.email = employee.email;
        req.session.name = employee.fullName;
        req.session.department = employee.department;

        res.redirect("/employee/dashboard");

    } catch (error) {
        console.log("Error in login Employee : ", error);
    }
}

async function handleEmployeeSignup(req, res) {
    console.log("sign up : ",req.body.email , req.body.password , req.body.fullName , req.body.department);
    try {
        if (await Employee.findOne({ email: req.body.email.trim().toLowerCase() })) {
            return res.render("signup", { message: "Employee Already Exists" });
        }
        if (req.body.password.includes(" ")) {
            return res.render("signup", { message: "Enter a valid Password" });
        }

        const newEmployee = {
            fullName: req.body.fullName.trim(),
            email: req.body.email,
            password: req.body.password,
            department: req.body.department
        }

        console.log("New Employee : ", newEmployee);

        const user = new Employee(newEmployee);
        const savedUser = await user.save();
        if (savedUser) {
            res.status(201).redirect("/user/login");
        }
    } catch (error) {
        console.log("error in hanldling user signup : ", error.message);
    }
}

async function handleEmployeeDashboard(req, res) {
    try {
        if (!req.session.employeeIsLoggedIn) {
            return res.redirect("/employee/login");
        }
        const tickets = await Ticket.find({ assignedTo: req.session.department });
        res.render("employeeDashboard", {
            tickets, employeeName: req.session.name,
            departments: ["Customer", "IT", "Sales", "HR", "Finance", "Marketing"],
        });
    } catch (error) {
        console.log("Error in Employee dashboard : ", error);
    }
}

async function handleEmployeeLogout(req, res) {
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
    handleEmployeeSignup,
    handleEmployeeSendSignupPage,
}