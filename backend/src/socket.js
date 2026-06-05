const socketIO = require("socket.io");

let io = null;

const init = (httpServer) => {
  io = socketIO(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
    },
  });
  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io chưa được khởi tạo");
  }
  return io;
};

module.exports = { init, getIO };
