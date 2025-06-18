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
router.get('/:id', async (req,res) => {
    try {
        const habit = await habitservice.getHabitsByUserId(req.params.id)
        if(!habit) {
            return res.status(404).send({ error: 'Habit not found' });
            
        }
        res.json(habit)
    }
    catch(error){
        console.log(error)
        res.status(500).json({ error: 'Failed to fetch habit' });
    }
})

router.post('/', async (req, res) => {
    const { title, userId } = req.body;
  
    if (!title || !userId) {
      return res.status(400).json({ error: 'Missing title or user ID' });
    }
  
    try {
      const newHabit = new Habit({
        title,
        user: userId,
      });
  
      const savedHabit = await newHabit.save();
      res.status(201).json(savedHabit);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create habit' });
    }
  });
export default router