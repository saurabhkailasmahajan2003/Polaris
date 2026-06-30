import { io } from 'socket.io-client';

const URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
let socket = null;

export function getSocket() {
  if (!socket) {
    socket = io(URL, { transports: ['websocket', 'polling'] });
  }
  return socket;
}
