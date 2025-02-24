const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const createError = require('http-errors');
const database = require('./database');

require('dotenv').config();
// Connect MongoDB
mongoose.Promise = global.Promise;
mongoose.connect(database.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Database connected successfully');
}).catch(error => {
    console.log('Cannot connect to database: ' + error);
});


const repairAPI = require('./routes/repair.route');
const userAPI = require('./routes/user.route');

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json()); // ✅ แก้ไขให้ใช้งานได้ถูกต้อง
app.use(cors({
    credentials: true, // อนุญาตส่ง Cookie และ Header
}));

// API Routes
app.use('/api-repair', repairAPI);
app.use('/api-user', userAPI);

// CREATE PORT
const port = process.env.PORT || 3000;
const server = app.listen(port,'0.0.0.0', () => {
    console.log('Connected to port ' + port);
});

// 404 Handler
app.use((req, res, next) => {
    next(createError(404)); // ✅ ต้อง require('http-errors') ก่อน
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.message);
    if (!err.statusCode) err.statusCode = 500;
    res.status(err.statusCode).send(err.message);
});
