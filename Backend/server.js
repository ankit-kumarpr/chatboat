const http = require("http");
const express=require('express');
const app = require("./app");
const port = process.env.PORT || 3000;
const ChatMessage = require("./Models/ChatMessage");
const User = require("./Models/UserModel");
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit per file
});

// Add file upload route
app.post('/api/upload', upload.array('files'), (req, res) => {
  try {
    const files = req.files.map(file => ({
      filename: file.filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: file.path,
      url: `/uploads/${file.filename}`
    }));
    res.json({ success: true, files });
  } catch (error) {
    console.error('Error uploading files:', error);
    res.status(500).json({ success: false, error: 'File upload failed' });
  }
});

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const server = http.createServer(app);

// Socket.IO setup remains the same until the sendMessage handler
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
 socket.on("sendMessage", async ({ message, files = [] }) => {
  const roomId = socket.roomId;
  const userId = socket.userId;

  if (!roomId || !userId) {
    console.error("Missing roomId or userId for socket:", socket.id);
    return;
  }

  try {
    const chatMsg = new ChatMessage({
      room: roomId,
      sender: userId,
      message,
      files
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
      files: populatedMsg.files,
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
