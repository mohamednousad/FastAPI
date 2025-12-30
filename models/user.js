import { Schema } from '../Schema.js';
import { Model } from '../Model.js';

const courseDetailsSchema = new Schema({
  courseName: { type: String, required: true },
  startedDate: { type: Date }
});

const userSchema = new Schema({
  userName: { type: String, required: true },
  age: { type: Number, required: true },
  phoneNumber: { type: Number, required: true },
  address: { type: Object, required: true },
  skills: { type: Array, required: true },
  isStudent: { type: Boolean },
  joinedAt: { type: Date },
  notes: { type: null },
  courseDetails: [courseDetailsSchema]
});

export const User = new Model('users', userSchema);
