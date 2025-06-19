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
router.get('/:id', userExtractor, async (req, res) => {
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
    const user = await FitnessUser.findById(req.params.id).populate('entries')
    if (!user) return res.status(404).json({ error: 'User not found' });
    if( user.id.toString() !== req.user.id.toString()) {
      return res.status(403).json({ error: 'user not authorized' });
    }
    try {
      const updatedUser = await FitnessUser.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    )
    res.json(updatedUser)
    }catch(error){
      console.error('Error updating user:', error)
      res.status(500).json({ error: 'Failed to update user' })
    }
})
export default router