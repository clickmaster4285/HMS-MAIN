const { Server } = require("socket.io");

function initSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: [
        "http://192.168.10.253:5173",
        "http://localhost:3000"
      ],
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    console.log("✅ Socket connected:", socket.id);

    socket.on("ping", () => {
      socket.emit("pong", {
        message: "Socket connected successfully",
        socketId: socket.id,
        time: Date.now()
      });
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", socket.id, "| Reason:", reason);
    });
  });

  global.io = io;

  return io;
}

module.exports = { initSocket };
