const express = require("express");
const router = express.Router();
const pool = require("../db");
const authMiddleware = require("../middleware");

router.post("/add", authMiddleware, async (req, res) => {
    const user_id = req.user.id;
    const product_id = req.body.product_id;
    const max_payable_amount = parseFloat(req.body.max_payable_amount);
    try {
        if (!product_id) {
            return res.status(400).json({
                msg: "Please provide product id "
            })
        }
        if (!max_payable_amount) {
            return res.status(400).json({
                msg: "Please provide max price you can pay "
            })
        }

        else if(max_payable_amount < 0){
            return res.status(400).json({
                msg : "Enter a valid amount"
            })
        }

        let [ProductExists] = await pool.query("SELECT id FROM products WHERE id = ?" , [product_id]);

        if(ProductExists.length === 0){
            return res.status(404).json({
                msg : "Product not found"
            })
        }
        let [AlertExists] = await pool.query("SELECT id FROM user_alerts WHERE user_id = ? AND product_id = ?" , [user_id , product_id]);

        if(AlertExists.length > 0){
            let [result] = await pool.query("UPDATE user_alerts SET max_payable_amount = ? WHERE user_id = ? AND product_id = ?" , [max_payable_amount , user_id , product_id]);

            return res.status(200).json({
                msg : "Alert updated successfully",
                result : result.affectedRows
            })
        }
        else{
            let [result] = await pool.query("INSERT INTO user_alerts (user_id , product_id , max_payable_amount) VALUES( ? , ? , ? )",[user_id , product_id , max_payable_amount]);

            return res.status(200).json({
                msg : "New user alert created successfully",
                alert_id : result.insertId
            })
        }


    } catch (err) {
        return res.status(500).json({
            msg : "There was some internal server error",
            error : err.message
        })
    }


})

router.get("/" , authMiddleware , async(req ,res)=>{
    const user_id = req.user.id

    try{
        const [Alerts] = await pool.query("SELECT id , product_id , max_payable_amount from user_alerts WHERE user_id = ?" , [user_id]);
        return res.status(200).json(Alerts);

    }catch(err){
        return res.status(500).json({
            msg : "There was some internal server error",
            error : err.message
        })
    }
})

router.delete("/delete" , authMiddleware , async(req , res)=>{
    const user_id = req.user.id;
    const alert_id = req.body.id;

    try{
        const[AlertExists] = await pool.query("SELECT * FROM user_alerts WHERE user_id = ? AND id = ?" , [user_id , alert_id]);

        if(AlertExists.length === 0){
            return res.status(404).json({
                msg : "Alert does not exist"
            })
        }

        let [result] = await pool.query("DELETE FROM user_alerts WHERE user_id = ? AND id = ?" , [user_id , alert_id]);

        return res.status(200).json({
            msg : "Alert deleted successfully",
            userAlert : result.affectedRows
        })

    }catch(err){
        return res.status(500).json({
            msg : "there was some internal server error ",
            error : err.message
        })
    }
})

module.exports = router;