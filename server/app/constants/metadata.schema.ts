// @ts-ignore
// tslint:disable-next-line:no-require-imports
import mongoose = require('mongoose');
export class Metadata extends mongoose.Document {
    name: string;
    labels: string[];
};
const metadataSchema = new mongoose.Schema({
    name: { type: String, required: true },
    labels: { type: [String], required: false },
});
// tslint:disable-next-line:variable-name
export const MetadataModel = mongoose.model<Metadata>('Metadata', metadataSchema);
