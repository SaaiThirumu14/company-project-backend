const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const setupMiddleware = (app) => {
    const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:8081",
        "http://localhost:9100", // Common Flutter Web port
        "http://127.0.0.1:9100",
        process.env.FRONT_URL
    ].filter(Boolean);

    app.use(cors({
        origin: (origin, callback) => {
            // Allow requests with no origin (like mobile apps or curl)
            if (!origin) return callback(null, true);

            // In development, allow any localhost or 127.0.0.1 request
            const isLocal = origin.startsWith('http://localhost:') ||
                origin.startsWith('http://127.0.0.1:');

            if (isLocal || allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes("*")) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
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
                sameSite: "none",
                maxAge: 30 * 1000 // 30 seconds
            }
        })
    );
};

module.exports = setupMiddleware;
