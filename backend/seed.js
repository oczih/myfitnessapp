// seed.js
import mongoose from 'mongoose';
import dotenv from 'dotenv'
dotenv.config();

import Habit from './models/habitmodel.js' // Adjust the path to your Habit model

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
    seedHabits();
  })
  .catch(err => console.error('MongoDB connection error:', err));

const predefinedHabits = [
  { text: 'Drink Water', emoji: '💧' },
  { text: 'Exercise', emoji: '🏋️' },
  { text: 'Read Book', emoji: '📚' },
  { text: 'Meditate', emoji: '🧘' },
  { text: 'Sleep Early', emoji: '🌙' },
  { text: 'Eat Healthy', emoji: '🥗' },
  { text: 'Journal', emoji: '📓' }
];

async function seedHabits() {
  try {
    await Habit.deleteMany({ isDefault: true }); // Optional: Clear old predefined habits
    const habitsWithFlag = predefinedHabits.map(habit => ({
      ...habit,
      isDefault: true // So you can easily identify them
    }));
    await Habit.insertMany(habitsWithFlag);
    console.log('Predefined habits seeded successfully!');
    mongoose.connection.close();
  } catch (err) {
    console.error('Error seeding habits:', err);
    mongoose.connection.close();
  }
}
