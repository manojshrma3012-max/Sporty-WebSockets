import express from 'express';

import { matchRouter } from './routes/matches.js';

const app = express();
app.use(express.json());

const port = 7002;

app.get('/', (request, response) => {
  console.log(request.url);
  response.send('Hello from Express');
});

app.use('/matches', matchRouter);

app.listen(port, () => {
  console.log(`Express server started at http://localhost:${port}/`);
});

