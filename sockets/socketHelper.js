const { Server } = require("socket.io");
const cors = require("cors");
const initSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: [process.env.FRONT_URL],
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
