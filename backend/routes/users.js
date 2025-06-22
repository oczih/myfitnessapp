import express from 'express'
import * as userservice from '../services/userservice.js'
const router = express.Router()
import { userExtractor } from '../middleware/userextractor.js'
import FitnessUser from '../models/usermodel.js'

router.get('/', async (req,res) => {
    try {
        const users = await userservice.getEntries()
        res.json(users)
    }catch(error) {
        console.error('Failed to fetch users',error)
        res.status(500).send({error: 'Failed to fetch users'})
    }
}) 

router.get('/:id/foods', userExtractor, async (req, res) => {
  try {
    const userId = req.params.id;

    if (userId !== req.user.id.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const user = await FitnessUser.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user.foodsEaten);
  } catch (error) {
    console.error('Error fetching foodsEaten:', error);
    res.status(500).json({ error: 'Server error' });
  }
});
router.get('/:id', async (req, res) => {
    try {
      const user = await FitnessUser.findById(req.params.id).populate('entries');
      if (!user) return res.status(404).json({ error: 'User not found' });
  
      res.json(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  
router.put('/:id', userExtractor, async (req, res) => {
  try {
    const user = await FitnessUser.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.id.toString() !== req.user.id.toString()) {
      return res.status(403).json({ error: 'User not authorized' });
    }

    const updateData = req.body;

    // Handle foodsEaten increment and calorieseaten increment manually:
    if (updateData.foodsEaten) {
      // Append new foods and increment calorieseaten
      for (const newFood of updateData.foodsEaten) {
        if (!newFood.calories || !newFood.foodName || !newFood.nutrients) {
          return res.status(400).json({ error: 'Invalid food item' });
        }
        user.foodsEaten.push(newFood);
        user.calorieseaten += newFood.calories;
      }
      delete updateData.foodsEaten; // Remove so no conflict later
    }

    // Update other fields normally
    Object.keys(updateData).forEach((field) => {
      user[field] = updateData[field];
    });

    const updatedUser = await user.save();
    res.json(updatedUser.toJSON());
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});


router.post('/:id/foods', userExtractor, async (req, res) => {
  try {
    const userId = req.params.id;
    if (userId !== req.user.id.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const newFood = req.body;

    if (!newFood || !newFood.calories || !newFood.foodName || !newFood.nutrients) {
      return res.status(400).json({ error: 'Invalid food item' });
    }

    const user = await FitnessUser.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.foodsEaten.push(newFood);
    user.calorieseaten += newFood.calories;
    user.diamonds += 2;
    user.experience += 2;

    const updatedUser = await user.save();
    res.json(updatedUser.toJSON());
  } catch (err) {
    console.error('Failed to add food:', err);
    res.status(500).json({ error: 'Server error' });
  }
}
)
router.delete('/:id/foods/delete/:foodId', userExtractor, async (req, res) => {
  try {
    const user = await FitnessUser.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (user.id.toString() !== req.user.id.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const foodId = req.params.foodId;
    const foodIndex = user.foodsEaten.findIndex(f => f._id.toString() === foodId);

    if (foodIndex === -1) return res.status(404).json({ error: 'Food item not found' });

    const food = user.foodsEaten[foodIndex];

    user.calorieseaten = Math.max(0, user.calorieseaten - (food.calories || 0));
    user.foodsEaten.splice(foodIndex, 1);

    const updatedUser = await user.save();
    res.json(updatedUser.toJSON());
  } catch (err) {
    console.error('Failed to remove food:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});
router.put('/:id/diamonds', userExtractor, async (req, res) => {
  try {
    const user = await FitnessUser.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.id.toString() !== req.user.id.toString()) {
      return res.status(403).json({ error: 'User not authorized' });
    }

    const now = new Date();
    const lastDate = user.lastDiamondAwardDate;

    // Check if last award was today
    const isSameDay = lastDate && (
      lastDate.getFullYear() === now.getFullYear() &&
      lastDate.getMonth() === now.getMonth() &&
      lastDate.getDate() === now.getDate()
    );

    if (isSameDay) {
      return res.status(400).json({ error: 'Diamonds already awarded today' });
    }

    const diamondsToAdd = req.body.diamonds || 0;
    user.diamonds += diamondsToAdd;
    user.lastDiamondAwardDate = now;

    await user.save();

    res.json({ diamonds: user.diamonds, message: 'Diamonds awarded!' });
  } catch (error) {
    console.error('Error awarding diamonds:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router