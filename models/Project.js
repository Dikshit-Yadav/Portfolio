const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: String, 
  liveDemo: String, 
  githubLink: String, 
  technologies: [String], 
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
