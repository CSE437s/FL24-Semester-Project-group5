const { io } = require("socket.io-client");
// import { io } from "socket.io-client";

const URL = "http://localhost:5001";
const socket = io(URL, { autoConnect: false });
//users who have logged in, should be able to connect

export default socket;