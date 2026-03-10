const mongoose = require('mongoose');

const MProjects = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: String, 
  liveDemo: String, 
  githubLink: String, 
  technologies: [String], 
});

module.exports = mongoose.model('MProjects', MProjects);
