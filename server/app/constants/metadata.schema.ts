// @ts-ignore
// tslint:disable-next-line:no-require-imports
import mongoose = require('mongoose');
const metadataSchema = new mongoose.Schema({
    name: { type: String, required: true },
    label: { type: [String], required: false },
});
export const METADATA = mongoose.model('Metadata', metadataSchema);
