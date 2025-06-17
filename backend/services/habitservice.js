import Habit from '../models/habitmodel.js'
import mongoose from 'mongoose';
export const getHabits = async () => {
    const habits = await Habit.find().lean();
    return habits
}

export const getHabitsById = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return null;
    }

    const habit = await Habit.findById(id).lean();
    return habit || null;
}