const express = require("express");
const zod = require("zod");

const signupSchema = zod.object({
    email : zod.string().email(),
    firstname : zod.string(),
    password : zod.string().min(5 , {message :"The password must be atleast 5 characters or longer!"})
})

const signinSchema = zod.object({
    email : zod.string().email(),
    password : zod.string().min(5 , {message :"The password must be atleast 5 characters or longer!"})
})

module.exports = {
    signupSchema , signinSchema
}