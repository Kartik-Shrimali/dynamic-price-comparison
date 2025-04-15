const express = require("express");
const router = express.Router();
const { userSignupSchema, userSigninSchema } = require("../validation")
const pool = require("../db")
const { JWT_SECRET } = require("../JWT_SECRET")
const jwt = require("jsonwebtoken");


router.post("/signup", async (req, res) => {

    const result = userSignupSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            msg: "There is something wrong with the inputs.Please try again"
        })
    }

    const firstname = req.body.firstname;
    const email = req.body.email;
    const password = req.body.password;

    try {
        const [userExists] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);

        if (userExists.length > 0) {
            return res.status(400).json({
                msg: "User already exists"
            })
        }

        const [user] = await pool.query("INSERT INTO users(name , email , password) values(?,?,?)", [firstname, email, password]);

        const userId = user.insertId;
        const token = jwt.sign({ id: userId, email: email }, JWT_SECRET);


        return res.status(200).json({
            msg: "Signup successful",
            token: token
        })
    } catch (err) {
        return res.status(400).json({
            msg: "There was some problem.Please try again",
            error: err.message
        })
    }
})

router.post("/signin", async (req, res) => {
    const email = req.body.email.trim();
    const password = req.body.password;
    const result = userSigninSchema.safeParse({email , password});

    if (!result.success) {
        console.log(result.error)
        return res.status(400).json({
            msg: "You have put wrong inputs.Try again or signup"
        })
    }

    try {
        const [existingUser] = await pool.query("SELECT * FROM users WHERE email = ? AND password = ?", [email, password]); 

        if (existingUser.length == 0) {
            return res.status(400).json({
                msg: "user does not exist"
            })
        }

        const user = existingUser[0];
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);

        return res.status(200).json({
            msg: "Signin successful",
            token: token
        })
    } catch (err) {
        return res.json({
            msg: "There was some internal error",
            error: err.message
        })
    }
})

module.exports = router