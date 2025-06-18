import jwt from 'jsonwebtoken'
import FitnessUser from '../models/usermodel.js'
import dotenv from 'dotenv';
dotenv.config();

const tokenExtractor = async (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      const token = authorization.substring(7)
      const decodedToken = jwt.verify(token, process.env.SECRET)

      if (!decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' })
      }

      request.decodedToken = decodedToken
      request.user = await User.findById(decodedToken.id)
    } catch (error) {
      return response.status(401).json({ error: 'token invalid' })
    }
  } else {
    return response.status(401).json({ error: 'token missing' })
  }
  next()
}


export default tokenExtractor