import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import loginrouter from './routes/login.js'
import entriesrouter from './routes/entries.js'
dotenv.config();
import cors from 'cors';
const app = express();
const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI;

app.use(express.json());
app.use(cors())
app.use('/api/entries', entriesrouter)
app.use('/api/login', loginrouter)
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})


console.log('Connecting to MongoDB...');
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error.message);
    })

