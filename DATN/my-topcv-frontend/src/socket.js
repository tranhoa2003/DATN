// src/socket.js
import { io } from 'socket.io-client';

const URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const socket = io(URL, {
  transports: ['websocket'], // ưu tiên websocket
});
