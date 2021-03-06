// @ts-ignore
import mongoose from 'mongoose';
const metadataSchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    label: { type: [String], required: false },
});
export const METADATA = mongoose.model('MetaData', metadataSchema);
