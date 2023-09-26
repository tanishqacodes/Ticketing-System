const { User } = require("../models/user");

function handleSendUserSignupPage(req, res) {
    if (req.session.isLoggedIn) {
        return res.redirect("/user/dashboard");
    }
    res.render("signup");
}

function handleSendUserDashboardPage(req, res) {
    if (!req.session.isLoggedIn) {
        return res.redirect("/user/login");
    }

    try {
        res.render("dashboard", {
            username: req.session.name,
        });
    }
    catch (error) {
        console.log("error in fetching tickets : ", error.message);
        res.status(500).send("Internal server Error");
    }
}

async function handleSendUserLoginPage(req, res) {
    if (req.session.isLoggedIn) {
        return res.redirect("/user/dashboard");
    }
    res.render("login");
}

async function handleUserSignup(req, res) {
    console.log("sign up : ",req.body.email , req.body.password , req.body.fullName);
    try {
        if (await User.findOne({ email: req.body.email.trim().toLowerCase() })) {
            return res.render("signup", { message: "User Already Exists" });
        }
        if (req.body.password.includes(" ")) {
            return res.render("signup", { message: "Enter a valid Password" });
        }

        const newUser = {
            name: req.body.fullName.trim(),
            email: req.body.email,
            password: req.body.password,
        }

        console.log("New User : ", newUser);

        const user = new User(newUser);
        const savedUser = await user.save();
        if (savedUser) {
            res.status(201).redirect("/user/login");
        }
    } catch (error) {
        console.log("error in hanldling user signup : ", error.message);
    }
}

async function handleUserLogin(req, res) {
    // console.log("login : ",req.body.email , req.body.password);
    const user = await User.findOne({
        email: req.body.email,
        password: req.body.password,
    });
    // console.log("login user : ",user);
    if (user) {
        req.session.isLoggedIn = true;
        req.session.email = user.email;
        req.session.fullName = user.fullName;
        res.status(200).redirect("/user/dashboard");
    }
    else {
        res.render("login", { message: "wrong email id or password" });
    }
}

function handleUserLogout(req, res) {
    req.session.isLoggedIn = false;
    req.session.email = "";
    req.session.fullName = "";
    res.status(200).redirect("/");
}

module.exports = {
    handleSendUserDashboardPage,
    handleSendUserLoginPage,
    handleSendUserSignupPage,
    handleUserLogin,
    handleUserLogout,
    handleUserSignup
}