import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name: { type: String },
    username: { type: String },
    password: { type: String },
    email: { type: String, required: true, unique: true },
    entries: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Entry'
      }
    ],
    experience: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    lastHabitCompletionDate: { type: Date, default: null },
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
    calorieseaten: {type: Number, default: 0, min: 0},
    foodsEaten: [
      {
        nutrients: { type: [String], required: true },
        foodName: { type: String, required: true },
        calories: { type: Number, required: true, min: 0 },
        date: { type: Date, default: Date.now },
        portions: { type: Number, default: 1, min: 1 }
      }
    ],
    lastDiamondAwardDate: { type: Date, default: null }
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