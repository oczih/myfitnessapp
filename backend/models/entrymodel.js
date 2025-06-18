import mongoose from 'mongoose'


const schema = new mongoose.Schema({
    title: String,
    date: [Date],
    weekdays: [{ type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] }],
    doneBy: { type: mongoose.Schema.Types.ObjectId, ref: 'FitnessUser' },
    done: {type: Boolean, default: false},
    emoji: String
})

schema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Entry = mongoose.model('Entry', schema)
export default Entry