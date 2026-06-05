let io = null;
const init = (server, opts = {}) => {
  const { Server } = require("socket.io");
  io = new Server(server, {
    cors: { origin: process.env.CLIENT_URL || "http://localhost:5173" },
    ...opts,
  });

  const User = require("./models/User");
  const Post = require("./models/Post");
  const Comment = require("./models/Comment");

  const emitCurrentCounts = async (socket) => {
    try {
      const users = await User.countDocuments();
      const posts = await Post.countDocuments();
      const comments = await Comment.countDocuments();
      const payload = { users, posts, comments };
      if (socket) socket.emit("community:update", payload);
      else io.emit("community:update", payload);
    } catch (err) {
      // ignore
    }
  };

  io.on("connection", (socket) => {
    // send initial counts to the connected client
    emitCurrentCounts(socket);

    socket.on("disconnect", () => {});
  });

  return {
    getIO: () => io,
    emitCurrentCounts,
  };
};

const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};

module.exports = { init, getIO };
