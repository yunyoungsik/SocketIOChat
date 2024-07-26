import { Server } from 'socket.io';
import express from 'express';
import ViteExpress from 'vite-express';
import * as http from 'http';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (client) => {
  const username = client.handshake.query.username;
  console.log(`connection`);
  client.broadcast.emit('chat', {username: '관리자', message: `${username}님이 접속했습니다.`})
 
  
  client.on('chat', (msg) => {
    console.log('chat', {msg})
    io.emit('chat', {username: msg.username, message: msg.message})
  });

  client.on('disconnect', () => {
    console.log(`disconnect`);
    io.emit('chat', {username: '관리자', message: `${username}님이 접속을 종료했습니다.`})
  });
});

server.listen(3000, () => {
  console.log('Server is listening...');
});

ViteExpress.bind(app, server);
