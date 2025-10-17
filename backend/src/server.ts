import express from 'express';
import { db } from './db';

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

let server;

if (process.env.NODE_ENV !== 'test') {
    const port = 3000;
    server = app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}

export { app, db, server };
