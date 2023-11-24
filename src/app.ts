import express from 'express';
import mongoose from 'mongoose';
import { UserRoutes } from './user/user.router';
import cors from 'cors';
const dotenv =require("dotenv")

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

//parsers
app.use(express.json());
app.use(cors());

// application routes
app.use('/api/users', UserRoutes);

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/test');

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
