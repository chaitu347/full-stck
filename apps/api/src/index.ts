import express, { type Request, type Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars — walk up from cwd to find the root .env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });

import { prisma } from '@repo/database';

const app = express();
const port = Number(process.env.PORT) || 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.json({
        message: 'Welcome to the API 🚀',
        version: '1.0.0',
        endpoints: {
            health: 'GET /health',
            getUsers: 'GET /users',
            createUser: 'POST /users',
        },
    });
});

app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok' });
});

app.get('/users', async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

app.post('/users', async (req: Request, res: Response) => {
    try {
        const { email, name } = req.body;
        const user = await prisma.user.create({
            data: { email, name },
        });
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create user' });
    }
});

const server = app.listen(port, () => {
    console.log(`API running on http://localhost:${port}`);
});

// Gracefully handle port-in-use errors instead of crashing
server.on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${port} is already in use. Kill the existing process and try again.`);
        process.exit(1);
    } else {
        throw err;
    }
});
