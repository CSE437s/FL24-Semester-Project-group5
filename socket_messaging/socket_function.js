//authorizing an existing user to their previous chats. 
onUsernameSelection(username) {
    this.usernameAlreadySelected = true;
    socket.auth = { username };
    socket.connect();
  }
  
  // New function to handle joining a room and sending a message
sendMessage(roomName, message) {
    if (!this.usernameAlreadySelected) {
      console.error("User must select a username first.");
      return;
    }
      // Join the room
  socket.emit('joinRoom', roomName);

  // Send the message to the room
  socket.emit('sendMessage', { room: roomName, message });
}

function userConnected() {
    io.on('connection', (socket) => {
        console.log('a user connected');
        
        // You can add more event handlers for the socket here
        socket.on('disconnect', () => {
            console.log('a user disconnected');
        });
    });
}

// private messages

// client side 
onMessage(content) {
    if (this.selectedUser) {
      socket.emit("private message", {
        content,
        to: this.selectedUser.userID,
      });
      this.selectedUser.messages.push({
        content,
        fromSelf: true,
      });
    }
  }

// server sode
socket.on("private message", ({ content, to }) => {
    socket.to(to).emit("private message", {
      content,
      from: socket.id,
    });
  });


// connection status

socket.on("connect", () => {
    this.users.forEach((user) => {
      if (user.self) {
        user.connected = true;
      }
    });
  });
  
  socket.on("disconnect", () => {
    this.users.forEach((user) => {
      if (user.self) {
        user.connected = false;
      }
    });
  });