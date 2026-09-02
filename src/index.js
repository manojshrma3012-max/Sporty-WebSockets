import express from 'express';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });
const app = express();
app.use(express.json());

const port = 7002;

app.get('/', (request, response) => {
  console.log(request.url);
  response.send('Hello from Express');
});

app.listen(port, () => {
  console.log(`Express server started at http://localhost:${port}/`);
});

export { prisma };
