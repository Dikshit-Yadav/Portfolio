const mongoose = require('mongoose');
const Project = require('./models/Project');

mongoose.connect('mongodb://localhost:27017/portfolioDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB for seeding'))
  .catch(err => console.error('Could not connect to MongoDB for seeding', err));

const initialProjects = [
  {
    name: 'AddEduction',
    description: 'This project is an **Education Details Form** using **HTML, CSS, and JavaScript**, allowing users to **add, edit, and delete** education records dynamically in a table. The form includes fields for **Degree, Year, Registration No., and University** with validation to ensure all fields are filled before submission. Users can edit existing entries, delete records, and reset the form. The table updates dynamically, maintaining serial numbering. Basic styling is applied for better UI, and improvements like local storage and modals can enhance functionality. 🚀',
    imageUrl: '/img/addeduction.png',
    liveLink: 'http://127.0.0.1:5501/AddEduction.html',
    githubLink: 'https://github.com/Dikshit-Yadav/Projects/tree/main/AddEduction',
    technologies: ['HTML', 'CSS', 'JavaScript']
  },

];
const initDB = async () => {
  try {
    await Project.deleteMany({});
    await Project.insertMany(initialProjects);
    console.log('Database seeded successfully!');
    mongoose.connection.close();
  } catch (err) {
    console.error('Error seeding database:', err);
    mongoose.connection.close();
  }
};

initDB();
