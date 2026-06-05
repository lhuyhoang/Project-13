require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");
const commentRoutes = require("./routes/comments");
const communityRoutes = require("./routes/community");

const app = express();

connectDB();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/community", communityRoutes);

app.get("/api/health", (req, res) => res.json({ status: "OK" }));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const http = require("http");
const server = http.createServer(app);

// initialize socket.io
const { init } = require("./socket");
init(server);

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
