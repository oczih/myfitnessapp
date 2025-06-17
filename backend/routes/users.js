import express from 'express'
import * as userservice from '../services/userservice.js'
const router = express.Router()



router.get('/', async (req,res) => {
    try {
        const users = await userservice.getEntries()
        res.json(users)
    }catch(error) {
        console.error('Failed to fetch users',error)
        res.status(500).send({error: 'Failed to fetch users'})
    }
}) 

export default router