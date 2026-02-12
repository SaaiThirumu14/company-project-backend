const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const setupMiddleware = (app) => {
    app.use(cors({
        origin: [process.env.FRONT_URL],
        credentials: true,
    }));

    app.use(cookieParser());
    app.use(express.json());

    app.use(
        session({
            name: "otp_session",
            secret: process.env.SESSION_SECRET || 'secret',
            resave: false,
            saveUninitialized: false,
            cookie: {
                httpOnly: true,
                secure: false, // Set to true in production with HTTPS
                sameSite: "lax",
                maxAge: 30 * 1000 // 30 seconds
            }
        })
    );
};

module.exports = setupMiddleware;
