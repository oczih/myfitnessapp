import mongoose from 'mongoose';

const habitSchema = new mongoose.Schema({
  text: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'FitnessUser' }, // optional, null = ready-made
  createdAt: { type: Date, default: Date.now },
  emoji: {type: String},
  isDefault: { type: Boolean, default: false } 
});

habitSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Habit = mongoose.model('Habit', habitSchema);
export default Habit;