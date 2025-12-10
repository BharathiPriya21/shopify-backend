// backend/src/server.js
const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();


const reviewsRouter = require('./src/router/router');
const authRoutes=require('./src/router/auth')

const app = express();
const PORT = process.env.PORT || 4000;


//app.use(cors());
app.use(cors({
  origin: "*", // allow all origins
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// serve uploads
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));


// widget static
//app.use('/widget', express.static(path.join(__dirname, '..', '..', 'frontend', 'widget')));


// api
app.use('/api/reviews', reviewsRouter);
app.use("/", authRoutes);



app.get('/health', (req, res) => res.json({ ok: true, time: new Date().toISOString() }));



app.listen(PORT, () => console.log(`Backend listening on ${PORT}`));