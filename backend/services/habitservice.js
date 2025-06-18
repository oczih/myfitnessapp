import Habit from '../models/habitmodel.js'
import mongoose from 'mongoose';
export const getHabits = async () => {
    const habits = await Habit.find().lean();
    return habits
}

export const getHabitsByUserId = async (userId) => {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return [];
    }
  
    const habits = await Habit.find({ user: userId }).lean();
    return habits;
  };
