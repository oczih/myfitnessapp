import FitnessUser from "../models/usermodel.js";

export const getEntries = async () => {
    const entries = await FitnessUser.find().lean();
    return entries
}