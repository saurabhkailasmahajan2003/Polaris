import { Server } from 'socket.io';
import { setIO } from './events.js';

export function initSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('join:case', (caseId) => {
      socket.join(`case:${caseId}`);
    });

    socket.on('leave:case', (caseId) => {
      socket.leave(`case:${caseId}`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  setIO(io);
  return io;
}
