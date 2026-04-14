// lib/socket.ts
import { io } from "socket.io-client";

export const socket = io("https://idu-group-backend.onrender.com", {
  autoConnect: false,
});
