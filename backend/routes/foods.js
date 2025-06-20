import express from 'express'
const router = express.Router()
import dotenv from 'dotenv'
dotenv.config()
const baseURl = `https://oauth.fatsecret.com/connect/${process.env.FATSECRETOKEN}`