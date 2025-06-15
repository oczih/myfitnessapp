import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import express, { response } from 'express'
const router = express.Router()
import FitnessUser from '../models/usermodel.js'

router.post('/', async (req,res) => {
    const { email, password} = req.body
    const user = await FitnessUser.findOne({email})
    if(!user){
        return response.status(401).json({error: 'Invalid email and/or password'})
    }
    console.log(user)
    const passwordCorrect = await bcrypt.compare(password, user.password);

    if (!passwordCorrect) {
      return response.status(401).json({ error: 'invalid username or password' });
    }
    const userJSON = user.toJSON();
    console.log(userJSON)
    const userForToken = {
      username: user.username,
      id: userJSON.id,
    };
  
    const token = jwt.sign(userForToken, process.env.SECRET);
  
    response.status(200).send({ token, username: user.username, name: user.name, id: user.id }); 
  });

router.post('/register', async (req,res) => {
    const {username, name, email, password} = req.body
    if (!password || password.length < 3 || !email) {
        return response.status(400).json({ error: 'Wrong user details' });
      }
    const existingUser = await FitnessUser.findOne({ email });
    if (existingUser) {
        return response.status(400).json({ error: 'Email must be unique' });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new FitnessUser({
    username,
    email,
    name,
    password: passwordHash,
    });

    const savedUser = await user.save();
    response.status(201).json(savedUser);
    
})

router.get('/', async (req, res) => {
    const users = await FitnessUser.find({})
    response.json(users)
})

router.get('/:id', async (req,res) => {
    try {
        const user = await FitnessUser.findById(req.params.id)
        console.log(user)
        if(!user){
            return response.status(404).json({error: 'User not found'})
        }
    }catch(error){
        console.error(error)
        res.status(500).json({error: 'Failed to fetch user'})
    }
})

export default router;