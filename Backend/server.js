const http = require("http");
const app = require("./app");
const port = process.env.PORT || 3000;
const ChatMessage = require("./Models/ChatMessage");
const User = require("./Models/UserModel"); // Make sure to import your User model

const server = http.createServer(app);

// Socket.IO setup
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Store online users with their details
const onlineUsers = new Map(); // Format: { userId: { socketId, userId, name, email } }

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // User joins a chat room
  socket.on("joinSession", async ({ roomId, userId }) => {
    try {
      console.log("User joined room:", roomId, userId);
      socket.join(roomId);
      socket.userId = userId;
      socket.roomId = roomId;

      // Get user details from database
      const user = await User.findById(userId).select("name email").lean();
      
      if (!user) {
        throw new Error("User not found");
      }

      // Add user to onlineUsers map
      onlineUsers.set(userId, {
        socketId: socket.id,
        userId,
        name: user.name,
        email: user.email
      });

      // Get all users in this room with their details
      const roomSockets = await io.in(roomId).fetchSockets();
      const usersInRoom = roomSockets.map(s => {
        const userData = onlineUsers.get(s.userId);
        return userData ? userData : null;
      }).filter(Boolean);

      io.to(roomId).emit("onlineUsers", usersInRoom);
      console.log(`User ${userId} (${user.name}) joined room ${roomId}`);

    } catch (err) {
      console.error("Error handling joinSession:", err);
      
      // Fallback behavior if user lookup fails
      onlineUsers.set(userId, {
        socketId: socket.id,
        userId,
        name: `User-${userId.slice(0, 4)}`,
        email: ''
      });

      if (socket.roomId) {
        const roomSockets = await io.in(socket.roomId).fetchSockets();
        const usersInRoom = roomSockets.map(s => onlineUsers.get(s.userId)).filter(Boolean);
        io.to(socket.roomId).emit("onlineUsers", usersInRoom);
      }
    }
  });

  // Handle sending a chat message
  socket.on("sendMessage", async ({ message }) => {
    const roomId = socket.roomId;
    const userId = socket.userId;

    if (!roomId || !userId) {
      console.error("Missing roomId or userId for socket:", socket.id);
      return;
    }

    console.log("Sending message to roomId:", roomId);
    console.log("From userId:", userId);
    console.log("Message content:", message);

    try {
      const chatMsg = new ChatMessage({
        room: roomId,
        sender: userId,
        message,
      });

      const response = await chatMsg.save();
      console.log("Message saved:", response);

      const populatedMsg = await ChatMessage.findById(chatMsg._id)
        .populate("sender", "name email")
        .lean();

      io.to(roomId).emit("receiveMessage", {
        _id: populatedMsg._id,
        room: populatedMsg.room,
        message: populatedMsg.message,
        sentAt: populatedMsg.sentAt,
        sender: {
          _id: populatedMsg.sender._id,
          name: populatedMsg.sender.name,
          email: populatedMsg.sender.email,
        },
      });
    } catch (err) {
      console.error("Error saving message:", err);
    }
  });

  // WebRTC Audio Call - Offer
  socket.on("audio-offer", ({ roomId, offer, senderId }) => {
    console.log(`Audio Offer from ${senderId} to room ${roomId}`);
    socket.to(roomId).emit("audio-offer", { offer, senderId });
  });

  // WebRTC Audio Call - Answer
  socket.on("audio-answer", ({ roomId, answer, senderId }) => {
    console.log(`Audio Answer from ${senderId} to room ${roomId}`);
    socket.to(roomId).emit("audio-answer", { answer, senderId });
  });

  // WebRTC ICE Candidate
  socket.on("audio-ice-candidate", ({ roomId, candidate, senderId }) => {
    console.log(`ICE Candidate from ${senderId} in room ${roomId}`);
    socket.to(roomId).emit("audio-ice-candidate", { candidate, senderId });
  });

  // Handle disconnect
  socket.on("disconnect", async () => {
    const userId = socket.userId;
    const roomId = socket.roomId;

    if (userId) {
      onlineUsers.delete(userId);
      console.log("User disconnected:", userId, socket.id);

      if (roomId) {
        try {
          const roomSockets = await io.in(roomId).fetchSockets();
          const usersInRoom = roomSockets.map(s => {
            const userData = onlineUsers.get(s.userId);
            return userData ? userData : null;
          }).filter(Boolean);

          io.to(roomId).emit("onlineUsers", usersInRoom);
        } catch (err) {
          console.error("Error handling disconnect:", err);
        }
      }
    }
  });
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});