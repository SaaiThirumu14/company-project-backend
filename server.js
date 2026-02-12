const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
const connectDB = require("./config/data");
const setupMiddleware = require("./config/middleware");
const initSocket = require("./sockets/socketHelper");
const apiRoutes = require("./api");


// Initialize Environment
dotenv.config();

// Connect to Database
connectDB();
// Initialize App & Server
const app = express();
const server = http.createServer(app);

// Setup Sockets
const io = initSocket(server);
app.set("socketio", io);

// Start Jobs
// Start Jobs
const startLabCron = require("./services/lab/cron");
startLabCron();


// Setup Middleware (CORS, Sessions, etc.)
setupMiddleware(app);

// API Routes
app.use("/api", apiRoutes);

// General Health Check
app.get("/", (req, res) => {
  res.send("MediCare API is running...");
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
