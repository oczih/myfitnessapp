import Entry from '../models/entrymodel.js'

export const getEntries = async () => {
    const entries = await Entry.find().lean();
    return entries
}

export const getEntriesById = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return null;
    }

    const entry = await Entry.findById(id).lean();
    return entry || null;
}