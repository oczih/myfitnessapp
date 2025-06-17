import express from 'express'
import * as entryservice from '../services/entryservice.js'
import Entry from '../models/entrymodel.js'
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

router.post('/', async (req,res) => {
    const entry = new Entry(req.body)
    try{
        const savedEntry = await entry.save()
        console.log('Entry saved: ', savedEntry)
        res.status(201).send(savedEntry)
    }catch(error){
        console.error('Failed to save entry:', error);
        res.status(500).send({ error: 'Failed to save entry' });
    }
})

export default router