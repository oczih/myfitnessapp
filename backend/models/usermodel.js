import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name: { type: String, unique: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: {type: String, required: true },
    entries: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Entry'
        }
    ],
});


userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.password
    }
})

const User = mongoose.model('User', userSchema)

export default User