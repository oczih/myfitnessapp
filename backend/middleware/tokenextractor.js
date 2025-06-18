import jwt from 'jsonwebtoken'
import FitnessUser from '../models/usermodel.js'
import dotenv from 'dotenv';
dotenv.config();

export const tokenExtractor = async (request, response, next) => {
  const authorization = request.get('authorization')
  console.log('Authorization header:', authorization)
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      const token = authorization.substring(7)
      console.log('Token extracted:', token)
      const decodedToken = jwt.verify(token, process.env.SECRET)
      console.log('Decoded token:', decodedToken)
      if (!decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' })
      }
      request.decodedToken = decodedToken
      request.user = await FitnessUser.findById(decodedToken.id)
    } catch (error) {
      console.error('JWT verification failed:', error)
      return response.status(401).json({ error: 'token invalid' })
    }
  } else {
    console.log('Authorization header missing or malformed')
    return response.status(401).json({ error: 'token missing' })
  }
  next()
}



