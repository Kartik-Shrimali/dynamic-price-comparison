const express = require("express");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("./JWT_SECRET")

function authMiddleware(req, res, next) {
    const Header = req.headers.authorization;

    if (!Header || !Header.startsWith("Bearer ")) {
        return res.status(401).json({
            msg: "Unauthorized access"
        })
    }

    let token = Header.split(" ");
    try {
        let response = jwt.verify(token[1], JWT_SECRET);
        req.user = response;

    } catch (err) {
        return res.status(401).json({
            msg: "Invalid token ",
            error: err.message
        })
    }
    next();
}

module.exports =  {authMiddleware} ;