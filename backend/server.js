require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const indexRouter = require('./routes/index.route');
const cors = require('cors');
const path = require('path');
const initializeAdmin = require('./utils/initilization/initializeAdmin');
const http = require('http');

const { initSocket } = require("./socket/index");

const app = express();

app.use(
  cors({
    origin: [process.env.Frontend_URL, 'http://192.168.88.7:5173', 'http://192.168.88.28:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Connect to MongoDB
connectDB()
  .then(() => {
    initializeAdmin();
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err);
    process.exit(1);
  });

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/', indexRouter);



const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';
const MODE = process.env.NODE_ENV || 'development';

const server = http.createServer(app);

const io = initSocket(server);
app.set("io", io); 

server.listen(PORT, HOST, (err) => {
  if (err) {
    console.error('❌ Server failed to start:', err);
    process.exit(1);
  }
  const shownHost = HOST === '0.0.0.0' ? 'localhost' : HOST;
  console.log(`Server running in ${MODE} mode on http://${shownHost}:${PORT}`);
});