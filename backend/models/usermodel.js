import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name: { type: String },
    username: { type: String },           // Optional for OAuth users
    password: { type: String },           // Optional for OAuth users
    email: { type: String, required: true, unique: true },
    entries: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Entry'
      }
    ],
    experience: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
  
    googleId: {
      type: String,
      default: null,
    },
    flowers: {
      type: [{ name: String, position: String }],
      default: []
    },
    diamonds: { type: Number, default: 0},
    caloriegoal: {type: Number, default: 2000},
    calorieseaten: {type: Number, default: 0}
  });
  


userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.password
    }
})

const FitnessUser = mongoose.model('FitnessUser', userSchema)

export default FitnessUser