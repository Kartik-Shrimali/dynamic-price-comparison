const express = require("express");
const zod = require("zod");

const userSignupSchema = zod.object({
    email: zod.string().email().transform(str => str.trim()),
    firstname: zod.string(),
    password: zod.string().min(5, { message: "The password must be atleast 5 characters or longer!" })
})

const userSigninSchema = zod.object({
    email: zod.string().email().transform(str => str.trim()),
    password: zod.string().min(5, { message: "The password must be atleast 5 characters or longer!" })
})

const shopkeeperSignupSchema = zod.object({
    shopname: zod.string(),
    password: zod.string().min(5, { message: "The password must be atleast 5 characters or longer!" }),
    rating: zod.number().min(0, { message: "Rating must be greater than 0" }),
    delivery_time_days: zod.number().min(0, { message: "Delivery time must be greater than 0" })
})

const shopkeeperSigninSchema = zod.object({
    shopname: zod.string(),
    password: zod.string().min(5, { message: "The password must be atleast 5 characters or longer!" })
})


module.exports = {
    userSignupSchema, userSigninSchema, shopkeeperSignupSchema, shopkeeperSigninSchema
}