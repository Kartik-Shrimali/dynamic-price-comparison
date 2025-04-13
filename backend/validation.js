const express = require("express");
const zod = require("zod");

const signupSchema = zod.object({
    email: zod.string().email().transform(str => str.trim()),
    firstname: zod.string(),
    password: zod.string().min(5, { message: "The password must be atleast 5 characters or longer!" })
})

const signinSchema = zod.object({
    email: zod.string().email().transform(str => str.trim()),
    password: zod.string().min(5, { message: "The password must be atleast 5 characters or longer!" })
})

module.exports = {
    signupSchema, signinSchema
}