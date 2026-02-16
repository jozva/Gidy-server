const mongoose = require("mongoose");

const educationSchema = new mongoose.Schema({
  college: String,
  degree: String,
  field: String,
  location: String,
  startDate: String,
  endDate: String,
  current: Boolean,
});

const experienceSchema = new mongoose.Schema({
  company: String,
  role: String,
  location: String,
  startDate: String,
  endDate: String,
  current: Boolean,
});

const certificationSchema = new mongoose.Schema({
  name: String,
  provider: String,
  url: String,
  id: String,
  issueDate: String,
  expiryDate: String,
  description: String,
});

const userSchema = new mongoose.Schema({
  
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  location: String,
  bio: String,
  resume: String,

  skills: [String],
  education: [educationSchema],
  experience: [experienceSchema],
  certifications: [certificationSchema],
});

module.exports = mongoose.model("User", userSchema);
