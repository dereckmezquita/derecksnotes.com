import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectToDB } from './utils/mongoConnect';
import authRoutes from './routes/authRoutes';

dotenv.config({ path: '../.env' });

const app = express();

if (process.env.NODE_ENV === 'development') app.use(cors());

app.use(express.json());

// ------------------
const PORT = 3001;



connectToDB();

// ------------------
app.use('/api/auth', authRoutes);
app.get('/api/hello', (req, res) => {
    res.send('Hello World!');
});

// ------------------
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
