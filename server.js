const express = require("express");
const http = require("http");
const path = require("path");
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
const startLabCron = require("./services/lab/cron");
startLabCron();


// Setup Middleware (CORS, Sessions, etc.)
setupMiddleware(app);

// API Routes
app.use("/api", apiRoutes);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "../client/dist")));

// General Health Check (API)
app.get("/health", (req, res) => {
  res.send("MediCare API is running...");
});

// The "catch-all" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.use((req, res) => {
  const indexFile = path.join(__dirname, "../client/dist", "index.html");
  res.sendFile(indexFile, (err) => {
    if (err) {
      res.status(404).json({ message: "Frontend build missing. Run npm run build in /client" });
    }
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
