import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session'
import passport from './config/passport.js'
import dotenv from 'dotenv';
import cors from 'cors';

import usersrouter from './routes/users.js'
import entriesrouter from './routes/entries.js'
import habitsrouter from './routes/habits.js'
import FitnessUser from './models/usermodel.js'; // Your mongoose user model
import authroutes from './routes/auth-routes.js'
import { fileURLToPath } from 'url';
import path from 'path';
import fatSecretRoutes from './routes/foods.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));



app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // set to true if using HTTPS
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

// Now initialize Passport
app.use(passport.initialize());
app.use(passport.session());

console.log('Registering route:', '/auth');
app.use('/auth', authroutes);
console.log('Registering route:', '/api/users');
app.use('/api/users', usersrouter);
console.log('Registering route:', '/api/entries');
app.use('/api/entries', entriesrouter);
console.log('Registering route:', '/api/habits');
app.use('/api/habits', habitsrouter);
console.log('Registering route:', '/api/fatsecret');
app.use('/api/fatsecret', fatSecretRoutes);
console.log('Registering route:', '/auth/session');
app.get('/auth/session', (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

app.use(express.static(path.join(__dirname, 'dist')));
app.get('/{*any}', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});


mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
  });