
import express from 'express';
import { db } from './db';

const app = express();

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.listen(3000, () => console.log('Server running on port 3000'));

export { db };
