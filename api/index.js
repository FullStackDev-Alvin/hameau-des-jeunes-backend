require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authMiddleware = require('../middleware/authMiddleware');
const imageRoutes = require('../routes/imageRoutes');
const blogRoutes = require('../routes/blogRoutes');
const authRoutes = require("../routes/authRoutes");

const app = express();

app.use(cors({
  origin: ["http://localhost:5174/","https://hameau-des-jeunes-frontend-dsjv.vercel.app/"], // add your actual frontend here
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// MongoDB connection
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

app.use('/auth', authRoutes);
app.use('/images', imageRoutes);
app.use('/blogs',  blogRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
