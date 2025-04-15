const express = require("express");
const router = express.Router();
const { shopkeeperSignupSchema, shopkeeperSigninSchema } = require("../validation")
const pool = require("../db");
const { JWT_SECRET } = require("../JWT_SECRET");
const jwt = require("jsonwebtoken");

router.post("/signup", async (req, res) => {
    const result = shopkeeperSignupSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            msg: "There is something wrong with the inputs.Please try again",
            errors: result.error.issues
        })
    }

    try {
        const shopname = req.body.shopname.trim();;
        const password = req.body.password;
        const rating = req.body.rating;
        const delivery_time_days = req.body.delivery_time_days;

        const [shopexists] = await pool.query("SELECT id FROM stores WHERE LOWER(name) = LOWER(?)", [shopname]);

        if (shopexists.length > 0) {
            return res.status(400).json({
                msg: "store already exists"
            })
        }

        const [stores] = await pool.query("INSERT INTO stores(name  , password , rating , delivery_time_days) VALUES(?,?,?,?)", [shopname, password, rating, delivery_time_days]);

        if (stores.affectedRows === 0) {
            return res.status(400).json({
                msg: "There was some error in server"
            })
        }

        const storeId = stores.insertId;

        const token = jwt.sign({ id: storeId, name: shopname.trim() }, JWT_SECRET);

        return res.status(200).json({
            msg: "Signup successful",
            token: token
        })

    } catch (err) {
        return res.status(500).json({
            msg: "There was some problem.Please try again",
            error: err.message
        })
    }


})


router.post("/signin", async (req, res) => {
    const result = shopkeeperSigninSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            msg: "There is something wrong with the inputs.Please try again",
            errors: result.error.issues
        })
    }

    try {
        const shopname = req.body.shopname.trim();;
        const password = req.body.password;

        const [existingStore] = await pool.query("SELECT * FROM stores WHERE LOWER(name) = LOWER(?) AND password = ?", [shopname, password]);

        if (existingStore.length === 0) {
            return res.status(400).json({
                msg: "store does not exist"
            })
        }

        const store = existingStore[0];
        const token = jwt.sign({ id: store.id, name: store.name.trim() }, JWT_SECRET);

        return res.status(200).json({
            msg: "Signin successful",
            token: token,
            store: store
        })
    }catch(err){
        return res.status(500).json({
            msg: "There was some problem.Please try again",
            error: err.message
        })
    }
})

module.exports = router;