import * as mongoose from 'mongoose';

export const ItemSchema = new mongoose.Schema({
  title: String,
  estimate: Number,
  status: String,
  description: String,
  personas: [String],
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', index: true },
});
