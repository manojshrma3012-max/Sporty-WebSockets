import express from 'express';
import dotenv from 'dotenv';
import http from 'http';
import {startWebSocketServer} from './ws/server.js';
dotenv.config();

import { matchRouter } from './routes/matches.js';

const app = express();
const server = http.createServer(app)
app.use(express.json());

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

app.get('/', (request, response) => {
  console.log(request.url);
  response.send('Hello from Express');
});
app.use('/matches', matchRouter);
const {broadcast} = startWebSocketServer(server);
app.locals.broadcast = broadcast;

server.listen(PORT, HOST, () => {
  const BaseUrl = HOST === '0.0.0.0' ? `http://localhost:${PORT}` : `http://${HOST}:${PORT}`;
  console.log(`Express server started at ${BaseUrl.replace('http','ws')}/ws`);
});

