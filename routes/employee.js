const express = require("express");
const employeeRouter = express.Router();

const {
    handleEmployeeLogin,
    handleEmployeeDashboard,
    handleEmployeeLogout,
    handleEmployeeSendLoginPage,
    handleEmployeeSendHomePage,
    handleEmployeeSignup,
    handleEmployeeSendSignupPage
} = require("../controllers/employee");

employeeRouter.get("/home",handleEmployeeSendHomePage);
employeeRouter.get("/login",handleEmployeeSendLoginPage);
employeeRouter.get("/signup",handleEmployeeSendSignupPage);

employeeRouter.post("/login",handleEmployeeLogin);
employeeRouter.post("/signup",handleEmployeeSignup);

employeeRouter.get('/dashboard', handleEmployeeDashboard);
employeeRouter.get("/logout",handleEmployeeLogout);

module.exports = { employeeRouter };