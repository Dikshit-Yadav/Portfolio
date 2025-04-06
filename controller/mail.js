const express = require('express');
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",  
    auth: {
        user: "2004dikshityadav@gmail.com", 
        pass: "hfbp bxux iecx nlxj"           
    }
});

const mailOptions = {
    from: "2004dikshityadav@gmail.com",   
    to: "aakashbalhara005@gmail.com",
    subject: "Try send mail",
    text: "This is a test email."
};

const app = express();
const port = 5500;

app.get("/", (req, res) => {
    res.send("Home");
});

app.get("/mail", (req, res) => {
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Error occurred:", error);
            return res.send("Error sending email.");
        }
        console.log("Email sent successfully:", info.response);
        res.send("Email sent successfully!");
    });
});

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
