import  { Schema, Model } from '../mongoose.js';

const courseDetailsSchema = new Schema({
  courseName: { type: String, required: true },
  startedDate: { type: Date }
});

const addressSchema = new Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true }
});

const userSchema = new Schema({
  userName: { type: String, required: true },
  age: { type: Number, required: true },
  phoneNumber: { type: Number, required: true },
  address: addressSchema, 
  skills: { type: Array, required: true },
  isStudent: { type: Boolean },
  joinedAt: { type: Date },
  notes: { type: null },
  courseDetails: [courseDetailsSchema]
});

export const User = new Model('users', userSchema);
