import Habit from '../models/habitmodel.js'
import mongoose from 'mongoose';

export const getHabits = async () => {
    return await Habit.find({});
};

// Get habits for a specific user, including default habits
export const getHabitsByUserId = async (userId) => {
  return await Habit.find({
    $or: [
      { user: userId },
      { isDefault: true }
    ]
  }).sort({ isDefault: -1 }); // default habits first (optional)
};