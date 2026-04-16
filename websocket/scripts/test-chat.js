// eslint-disable-next-line @typescript-eslint/no-require-imports
const { io } = require('socket.io-client');

const socket = io('http://localhost:4100');

socket.on('connect', () => {
  console.log('connected:', socket.id);

  socket.emit('getMessages');

  setTimeout(() => {
    socket.emit('sendMessage', { text: 'hello from terminal' });
  }, 1000);
});

socket.on('messages', (data) => {
  console.log('messages event:', JSON.stringify(data, null, 2));
});

socket.on('disconnect', () => {
  console.log('disconnected');
});

socket.on('connect_error', (err) => {
  console.error('connect_error:', err.message);
});
