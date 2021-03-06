// @ts-ignore
import mongoose from 'mongoose';
const metadataSchema = new mongoose.Schema({ id: String, name: String, label: [String] });
export const METADATA = mongoose.model('MetaData', metadataSchema);
