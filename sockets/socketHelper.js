const { Server } = require("socket.io");
const initSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: [
                "http://localhost:5173",
                "http://localhost:8081",
                process.env.FRONT_URL
            ].filter(Boolean),
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
