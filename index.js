const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const bodyParser = require('body-parser');
const Project = require('./models/Project');
const path = require('path');
const app = express();
const port = 5000;
const sharp = require('sharp');

const storage = multer.memoryStorage();
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`;
//     cb(null, uniqueName);
//   }
// });

// const upload = multer({ storage});
const upload = multer({ storage: storage });

main().then(res => {
  console.log("Succesfully Connected.");
}).catch(err => {
  console.log(err);
})

async function main() {
  await mongoose.connect("mongodb+srv://2004dikshityadav:pRmbupBnazgNPyrt@cluster0.nyw7aq0.mongodb.net/portfolioDB?retryWrites=true&w=majority&appName=Cluster0");
}

//ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use( express.static('uploads'));


//home 
app.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ _id: -1 }).limit(3);
    res.render('index', { title: "My Portfolio", projects });
  } catch (err) {
    console.error("Error fetching projects:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.get('/about', (req, res) => {
  res.render('about', { title: "About Me" })
});

app.get('/contact', (req, res) => {
  res.render('contact', { title: "Contact",successMessage: "successMessage",
    errorMessage: "errorMessage" }
  )
});

app.get('/projects', async (req, res) => {
  const projects = await Project.find();
  res.render('projects', { title: "Projects", projects });
});

//new project
app.get('/projects/new', (req, res) => {
  res.render('new', { title: "Add New Project" });
});

//new route
// app.post('/projects', upload.single('image'), async (req, res) => {
//   const { name, description, liveDemo, githubLink, technologies } = req.body;

//    // Convert uploaded image to Base64
//   let imageBase64 = "";
//   if (req.file) {
//     try {
//       // Compress image using sharp
//       const compressedBuffer = await sharp(req.file.buffer)
//         .resize({ width: 800 })  // Resize image width to 800px (you can change this)
//         .jpeg({ quality: 70 })   // Compress quality (0-100)
//         .toBuffer();

//       // Convert compressed buffer to Base64
//       const base64Data = compressedBuffer.toString('base64');
//       imageBase64 = `data:image/jpeg;base64,${base64Data}`;
//     } catch (err) {
//       console.error("Error processing image:", err);
//       return res.status(500).send("Image processing error");
//     }
//   }

//   const project = new Project({
//     name,
//     description,
//     liveDemo,
//     githubLink,
//     image: imageBase64,
//     technologies: technologies.split(',').map(t => t.trim())
//   });
//   await project.save();
//   res.redirect('/projects');
// });
app.post('/projects', upload.single('image'), async (req, res) => {
  const { name, description, liveDemo, githubLink, technologies } = req.body;

  let imageBase64 = "";
  if (req.file) {
    try {
      const compressedBuffer = await sharp(req.file.buffer)
        .resize({ width: 800 })
        .jpeg({ quality: 70 })
        .toBuffer();

      imageBase64 = `data:image/jpeg;base64,${compressedBuffer.toString('base64')}`;
    } catch (err) {
      console.error("Error processing image:", err);
      return res.status(500).send("Image processing error");
    }
  }

  const project = new Project({
    name,
    description,
    liveDemo,
    githubLink,
    image: imageBase64,
    technologies: technologies.split(',').map(t => t.trim())
  });
  await project.save();
  res.redirect('/projects');
});


//delete
app.post('/projects/:id/delete', async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.redirect('/projects');
  } catch (err) {
    console.error("Error deleting project:", err);
    res.status(500).send("Internal Server Error");
  }
});

//edit file
app.get('/projects/:id/edit', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    res.render('edit', { title: "Edit Project", project });
  } catch (err) {
    console.error("Error fetching project:", err);
    res.status(500).send("Internal Server Error");
  }
});

//edit route
app.post('/projects/:id/edit', upload.single('image'), async (req, res) => {
  const { name, description, githubLink, liveDemo, technologies } = req.body;

  try {
    const project = await Project.findById(req.params.id);
    let imageBase64 = project.image; // default to old image

    if (req.file) {
      const compressedBuffer = await sharp(req.file.buffer)
        .resize({ width: 800 })
        .jpeg({ quality: 70 })
        .toBuffer();

      imageBase64 = `data:image/jpeg;base64,${compressedBuffer.toString('base64')}`;
    }

    const updatedData = {
      name,
      description,
      githubLink,
      liveDemo,
      technologies: technologies ? technologies.split(',').map(t => t.trim()) : [],
      image: imageBase64
    };

    // if (req.file) {
    //   updatedData.image = req.file.filename;
    // } else {
    //   updatedData.image = project.image;
    // }

    await Project.findByIdAndUpdate(req.params.id, updatedData);
    res.redirect('/projects');
  } catch (err) {
    console.error('Error updating project:', err);
    res.status(500).send('Error updating project');
  }
});

//contact
const nodemailer = require('nodemailer');

app.post('/contact', (req, res) => {
  const { name, email, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: '2004dikshityadav@gmail.com',
      pass: 'hfbp bxux iecx nlxj'  
    }
  });

  const mailOptions = {
    from: email,
    to: 'aakashbalhara005@gmail.com',  
    subject: `New message from ${name}`,
    text: `You received a message from ${name} (${email}):\n\n${message}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.render('contact', {
        title: "Contact",
        successMessage: null,
        errorMessage: 'There was an error sending your message. Please try again.'
      });
    } else {
      res.render('contact', {
        title: "Contact",
        successMessage: 'Your message was sent successfully!',
        errorMessage: null
      });
    }
  });
});

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));