import { io } from 'socket.io-client';

const URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
let socket = null;
let socketWarned = false;

export function getSocket() {
  if (!socket) {
    socket = io(URL, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 3,
      reconnectionDelay: 3000,
      timeout: 5000,
    });
    socket.on('connect_error', () => {
      if (!socketWarned && import.meta.env.DEV) {
        socketWarned = true;
        console.warn('[socket] Cannot connect to backend — live updates disabled until server starts');
      }
    });
    socket.on('connect', () => {
      socketWarned = false;
    });
  }
  return socket;
}
