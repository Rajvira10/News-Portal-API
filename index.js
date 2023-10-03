import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
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



