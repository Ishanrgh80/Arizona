require('dotenv').config();
const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  }));
app.use(bodyParser.json());

// SMTP Configuration
const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    // port: 465,
    // secure: true,
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD
    }
});

// Handle Form Submission
app.post("/send-email", async (req, res) => {
    const { name, phone } = req.body;

    const mailOptions = {
        from: process.env.SMTP_EMAIL,
        to: process.env.RECEIVING_EMAIL,
        subject: "Hola!, There is an enquiry from Vichar Station",
        html: `
         <div style="font-family: Arial, sans-serif; padding: 20px; background: #f4f4f4;">
            <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 8px; text-align: center;">
                <!-- LOGO -->
                <img src="https://44a9-223-190-80-46.ngrok-free.app/img/w-logo.svg" alt="Company Logo"
                     style="max-width: 150px; margin: 20px auto; display: block;">

                <h2 style="color: #333;">New Contact Request</h2>
                <p><strong>Name:</strong> ${req.body.name}</p>
                <p><strong>Phone:</strong> ${req.body.phone}</p>
                <p> ${req.body.name} requested a callback. Please contact them soon!.</p>
                
                <a href="tel:${req.body.phone}" 
                   style="display: inline-block; background: #007bff; color: #fff; padding: 10px 15px; text-decoration: none; border-radius: 5px; margin-top: 10px;">
                   Call Now
                </a>

                <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #777;">
                    <p>© 2024 vich<b>Ar</b> Station. All rights reserved.</p>
                </div>
            </div>
        </div>
    `
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ message: `${req.body.name}, you will be contacted soon!!` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error sending email" });
    }
});

// Start Server
app.listen(3000, () => console.log("Server running on port 3000"));
