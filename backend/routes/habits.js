import express from 'express'
import * as habitservice from '../services/habitservice.js'
import Habit from '../models/habitmodel.js'
const router = express.Router()

router.get('/', async (req,res) => {
    try {
        const habits = await habitservice.getHabits()
        res.json(habits)
    }catch(error) {
        console.error('Failed to fetch habits',error)
        res.status(500).send({error: 'Failed to fetch habits'})
    }
}) 
router.get('/:id', async (req, res) => {
  try {
    const habits = await habitservice.getHabitsByUserId(req.params.id);
    res.json(habits);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch habits for user' });
  }
});

router.post('/', async (req, res) => {
    const { text, userId, emoji } = req.body;
  
    if (!text || !userId) {
      return res.status(400).json({ error: 'Missing title or user ID' });
    }
  
    try {
      const newHabit = new Habit({
        text,
        user: userId,
        emoji: emoji || '✨'
      });
  
      const savedHabit = await newHabit.save();
      res.status(201).json(savedHabit);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create habit' });
    }
  });
export default router