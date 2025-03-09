const express = require("express");
const router = express.Router();
const {signupSchema , signinSchema} = require("../validation")



router.post("/signup" , (req , res)=>{
    const result = signupSchema.safeParse(req.body);

    if(!result.success){
        return res.status(400).json({
            msg : "There is something wrong with the inputs.Please try again"
        })
    }

    res.json({
        msg : "signup successful"
    })
})

router.post("/signin"  , (req ,res)=>{
    const result = signinSchema.safeParse(req.body);

    if(!result.success){
        return res.status(400).json({
            msg : "There is something wrong with the inputs.Please try again"
        })
    }

    res.json({
        msg : "signin successful"
    })
})

module.exports = router