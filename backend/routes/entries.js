import express from 'express'
import * as entryservice from '../services/entryservice.js'
import Entry from '../models/entrymodel.js'
import { tokenExtractor } from '../middleware/tokenextractor.js'
import { userExtractor } from '../middleware/userextractor.js';
import FitnessUser from '../models/usermodel.js';
const router = express.Router()

router.get('/', async (req,res) => {
    try {
        const entries = await entryservice.getEntries()
        res.json(entries)
    }catch(error) {
        console.error('Failed to fetch entries',error)
        res.status(500).send({error: 'Failed to fetch entries'})
    }
}) 
router.get('/:id', async (req,res) => {
    try {
        const entry = await entryservice.getEntriesById(req.params.id)
        if(!entry) {
            return res.status(404).send({ error: 'Entry not found' });
            
        }
        res.json(entry)
    }
    catch(error){
        console.log(error)
        res.status(500).json({ error: 'Failed to fetch entry' });
    }
})

router.post('/', tokenExtractor, async (req,res) => {
    const entry = new Entry(req.body)
    const userId = req.decodedToken.id;
    console.log(userId)
    entry.doneBy = userId
    try{
        const savedEntry = await entry.save()
        const user = await FitnessUser.findById(userId)
            if (!user) {
            return res.status(404).json({ error: 'User not found' })
            }
            user.entries.push(savedEntry._id)
            await user.save()

        console.log('Entry saved: ', savedEntry)
        res.status(201).send(savedEntry)
    }catch(error){
        console.error('Failed to save entry:', error);
        res.status(500).send({ error: 'Failed to save entry' });
    }
})
router.delete('/:id', userExtractor, async (request, response) => {
  const user = request.user

  const entry = await Entry.findById(request.params.id)
  if (!entry) {
    return response.status(204).end()
  }
  console.log(entry)
  if (user.id.toString() !== entry.doneBy.toString()) {
    return response.status(403).json({ error: 'user not authorized' });
  }

  await entry.deleteOne()

  user.entries = user.entries.filter(b => b._id.toString() !== entry._id.toString())

  await user.save()

  response.status(204).end()
})


export default router