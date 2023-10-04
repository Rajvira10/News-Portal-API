import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import nodemailer from 'nodemailer';
import mongoose from 'mongoose';

import userRoutes from './routes/userRoutes.js';
// import articleRoutes from './routes/articleRoutes.js';
// import categoryRoutes from './routes/categoryRoutes.js';
// import bookmarkRoutes from './routes/bookmarkRoutes.js';
// import commentRoutes from './routes/commentRoutes.js';
// import roleRoutes from './routes/roleRoutes.js';

const app = express();
dotenv.config();

app.use(cors());

app.use(express.json());

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.PASSWORD,
  },
});

app.post('/send-email', (req, res) => {
  const { to, subject, text } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to,
    subject,
    text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: 'Email not sent', error });
    } else {
      console.log('Email sent: ' + info.response);
      res.json({ message: 'Email sent successfully', info });
    }
  });
});


app.use('/api/users', userRoutes);
// app.use('/api/articles', articleRoutes);
// app.use('/api/categories', categoryRoutes);
// app.use('/api/bookmarks', bookmarkRoutes);
// app.use('/api/comments', commentRoutes);
// app.use('/api/roles', roleRoutes);


mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => {
        console.log('MongoDB connected');
        app.listen(process.env.PORT, () => {
            console.log(`Server running on port ${process.env.PORT}`);
        })
    })
    .catch(error => console.error(error.message));



