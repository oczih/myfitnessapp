import mongoose from 'mongoose'


const schema = new mongoose.Schema({
    title: String,
    date: Date,
    doneBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    done: {Type: Boolean, default: false}
})

schema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Entry = mongoose.Model('Entry', schema)
export default Entry