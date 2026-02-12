const { Server } = require("socket.io");
const cors = require("cors");
const initSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    io.on("connection", (socket) => {
        
        socket.on("disconnect", () => {
                    });
    });

    return io;
};

module.exports = initSocket;
